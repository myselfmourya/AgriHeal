import { generateText, generateStructuredResponse, analyzeImage } from './aiProvider';
import { analyticsService } from './analyticsService';

export const buildFarmContext = (farmerContext, weatherContext) => {
  return `
You are Vani, an AI Agronomist Assistant for AgriHeal.
Farmer Profile: ${farmerContext?.name || 'Unknown'}, Location: ${farmerContext?.location || 'Unknown'}
Weather: ${weatherContext?.temperature || '30°C'}, ${weatherContext?.condition || 'Clear'}
Current Crops: ${farmerContext?.crops?.map(c => c.name).join(', ') || 'None listed'}

Rules:
1. Always be polite, concise, and helpful.
2. If suggesting an action (e.g., adding irrigation), respond with a JSON block containing {"action": "ACTION_TYPE", "payload": {}} inside your message, or just return natural text.
3. If unsure about a dangerous chemical, state that you cannot advise and they must escalate to an expert.
  `;
};

export const generateVaniResponse = async (query, context, lang = 'en-IN') => {
  try {
    const systemPrompt = buildFarmContext(context?.farmer, context?.weather);
    const fullPrompt = `User Query (${lang}): ${query}\n\nRespond in the requested language. If an action is required, output a JSON block at the very end like {"action": "TYPE", "payload": {}}. Provide the source if claiming facts.`;
    
    // Use the unified text generator with system instructions
    const responseText = await generateText(fullPrompt, systemPrompt);
    
    if (!responseText) {
      throw new Error('No response text returned from AI');
    }
    
    // Naive parsing of JSON action from response if it exists
    let action = null;
    let cleanText = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        action = JSON.parse(jsonMatch[0]);
        cleanText = responseText.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.error("Failed to parse action JSON from AI", e);
      }
    }

    analyticsService.trackEvent('AI_QUERY_RESOLVED', {
      engine: localStorage.getItem('ah-ai-engine') || 'gemini',
      lang,
      queryLength: query.length,
      hasAction: !!action
    });

    return {
      text: cleanText,
      action: action,
      source: 'AI Engine (Unified)'
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    analyticsService.trackEvent('AI_QUERY_FAILED', {
      engine: localStorage.getItem('ah-ai-engine') || 'gemini',
      error: error.message
    });
    throw error;
  }
};

export const analyzeCropImage = async (base64Image, cropType, lang = 'en-IN') => {
  try {
    const prompt = `Analyze this image of a ${cropType} crop. Identify any diseases, pests, or nutrient deficiencies. Respond in the ${lang} language, except keep the JSON keys in English.`;
    const schema = `{"disease": "name", "confidence": 0-100, "severity": "Low|Medium|High", "action": "treatment steps", "organicAlternative": "organic treatment", "weatherContext": "how weather affects this"}`;

    // Combine image analysis with structured JSON output expectation
    // Since analyzeImage just returns text, we can append the schema constraint
    const fullPrompt = `${prompt}\n\nIMPORTANT: You must return the output STRICTLY as a valid JSON object matching this description: ${schema}. Do not include markdown \`\`\`json blocks, just the raw JSON.`;
    
    let text = await analyzeImage(base64Image, fullPrompt);
    if (!text) throw new Error('No response from AI');

    // Clean JSON markdown just in case
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    analyticsService.trackEvent('CROP_DIAGNOSIS_COMPLETED', { cropType });
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing crop image:", error);
    analyticsService.trackEvent('CROP_DIAGNOSIS_FAILED', { error: error.message });
    throw error;
  }
};
