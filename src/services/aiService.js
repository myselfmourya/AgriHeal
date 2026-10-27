import { generateText, generateStructuredResponse, analyzeImage } from './aiProvider';
import { analyticsService } from './analyticsService';

// Single source of truth for the response schema — used both inside the
// system prompt (buildFarmContext) and as the separate `schema` argument
// generateStructuredResponse enforces, so the two can never drift apart.
const RESPONSE_SCHEMA = `{"speech": "Your fully compliant TTS response", "action": "NAVIGATE" | "CHAT" | "ACTION", "target": "/exact-route-from-list-above" or null, "actionId": "exact id from AVAILABLE ACTIONS" or null, "params": {"paramName": "value", ...} or null}`;

const formatAvailableActions = (availableActions) => {
  if (!availableActions || availableActions.length === 0) {
    return 'None right now — the current screen has no voice-operable actions registered. Use NAVIGATE or CHAT instead.';
  }
  return availableActions
    .map((a) => `- id: "${a.id}" | does: ${a.description} | params: ${JSON.stringify(a.params || {})}`)
    .join('\n');
};

export const buildFarmContext = (farmerContext, weatherContext, availableActions = []) => {
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
- "/records" -> Farm Records, Documents, Farm Locker, Locker, Files
- "/news" -> Agri News, Alerts
- "/community" -> Community, Forum, Social
- "/settings" -> Settings, Preferences
- "/profile" -> Profile, Account

AVAILABLE ACTIONS ON THE CURRENT SCREEN (things you can actually DO for the farmer right now, not just navigate to):
${formatAvailableActions(availableActions)}

INSTRUCTIONS:
1. Identify the user's true intent, no matter how they phrase it or what language they use — this is natural conversation, not fixed commands. A farmer might ask the same thing many different ways.
2. Decide the absolute best action:
   - "ACTION" when the farmer wants to actually DO something that matches one of the AVAILABLE ACTIONS above (e.g. add/delete/update something, perform a task). Set "actionId" to its exact id and fill "params" with everything you can extract from their words — ask a clarifying question in "speech" instead if a required param is missing or ambiguous, and leave actionId null until you have it.
   - "NAVIGATE" to open a different page/feature when no available action fits but a route does.
   - "CHAT" to converse, answer, diagnose, or explain when neither applies.
3. Never invent an actionId that isn't in AVAILABLE ACTIONS. If nothing fits, use NAVIGATE or CHAT instead.
4. Apply Vani's Voice-First Rules to the "speech" output: Keep it to 1-3 short sentences. Use verbal anchors. Never use markdown. Output MUST be TTS-ready. Use active listening if details are missing. Speak like a friendly village agronomist.
5. "speech" MUST be in the exact same language/script as the user's voice input. Translate measurements to local field equivalents.

JSON SCHEMA TO FOLLOW STRICTLY:
${RESPONSE_SCHEMA}
  `;
};

export const generateVaniResponse = async (query, context, lang = 'en-IN') => {
  try {
    const availableActions = context?.availableActions || [];
    const systemPrompt = buildFarmContext(context?.farmer, context?.weather, availableActions);
    const fullPrompt = `User Query: ${query}\n\nIMPORTANT: You MUST respond in ${lang}. Translate completely to ${lang}.`;

    // Use the structured JSON generator for 100% reliable routing
    const aiResponse = await generateStructuredResponse(fullPrompt, RESPONSE_SCHEMA, systemPrompt);

    analyticsService.trackEvent('AI_QUERY_RESOLVED', {
      engine: 'mistral-large',
      lang,
      hasAction: aiResponse.action === 'NAVIGATE' || aiResponse.action === 'ACTION'
    });

    return {
      text: aiResponse.speech || "I processed your request.",
      action: {
        action: aiResponse.action || 'NONE',
        payload: {
          target: aiResponse.target || null,
          actionId: aiResponse.actionId || null,
          params: aiResponse.params || {},
        }
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
