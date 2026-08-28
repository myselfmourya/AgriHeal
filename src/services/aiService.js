import { generateText, generateStructuredResponse, analyzeImage } from './aiProvider';
import { analyticsService } from './analyticsService';

export const buildFarmContext = (farmerContext, weatherContext) => {
  return `
You are Vani, the central AI voice assistant and brain for the AgriHeal app.
There is no fallback—you process EVERYTHING. You effortlessly understand English, Hindi, Telugu, Tamil, and transliterations.

Context:
Farmer: ${farmerContext?.name || 'Unknown'} | Location: ${farmerContext?.location || farmerContext?.village || 'Unknown'}
Weather: ${weatherContext?.temperature || '30'}°C, ${weatherContext?.condition || 'Clear'}
Crops: ${farmerContext?.crops?.length > 0 ? farmerContext.crops.map(c => `${c.name} (Stage: ${c.stage || 'Vegetative'}, Health: ${c.health || 80}/100)`).join(' | ') : 'None listed'}

ROUTING MAP (You must map the user's request to one of these routes if they want to navigate or use a tool):
- "/home" -> Dashboard, Home
- "/crops" -> My Crops, Crop Management
- "/assistant" -> AI Assistant, Chat, Ask Vani, Image Analysis, Disease Scanner, Scan Leaf, AI Analysis, AgriShield
- "/water" -> Irrigation, Water Monitor
- "/fertilisers" -> Fertilizer Guide, Khad, Manure
- "/market" -> Market Prices, Vendors, Mandi
- "/farm-care" -> Farm Care, Satellite Map
- "/livestock" -> Livestock, Cattle, Animals
- "/schemes" -> Government Schemes, Yojana, Subsidy
- "/records" -> Farm Records, Documents
- "/news" -> Agri News, Alerts
- "/community" -> Community, Forum, Social
- "/settings" -> Settings, Preferences
- "/profile" -> Profile, Account

INSTRUCTIONS:
1. Identify the user's true intent, no matter how they phrase it or what language they use.
2. Decide the absolute best action: "NAVIGATE" to open a feature/page, or "CHAT" to converse/answer.
3. Respond with a JSON object.
4. "speech" MUST be in the exact same language/script as the user's voice input. Keep it to 1 sentence.

JSON SCHEMA TO FOLLOW STRICTLY:
{"speech": "Your vocal response", "action": "NAVIGATE" or "CHAT", "target": "/exact-route-from-list-above" or null}
  `;
};

export const generateVaniResponse = async (query, context, lang = 'en-IN') => {
  try {
    const systemPrompt = buildFarmContext(context?.farmer, context?.weather);
    const fullPrompt = `User Query: ${query}`;
    const schema = `{"speech": "response string (in user language)", "action": "NAVIGATE|CHAT", "target": "route string or null"}`;
    
    // Use the structured JSON generator for 100% reliable routing
    const aiResponse = await generateStructuredResponse(fullPrompt, schema, systemPrompt);

    analyticsService.trackEvent('AI_QUERY_RESOLVED', {
      engine: 'mistral-large',
      lang,
      hasAction: aiResponse.action === 'NAVIGATE'
    });

    return {
      text: aiResponse.speech || "I processed your request.",
      action: {
        action: aiResponse.action || 'NONE',
        payload: { target: aiResponse.target || null }
      },
      source: 'AI Brain'
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    analyticsService.trackEvent('AI_QUERY_FAILED', {
      engine: 'mistral-large',
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
