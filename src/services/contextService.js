/**
 * contextService.js
 * Gathers current application state (crops, location, language) to provide
 * contextual awareness to the AI models.
 */

export const getGlobalContext = () => {
  const context = {
    crops: [],
    settings: {},
    location: null,
    recentRecords: []
  };

  try {
    // 1. Get Crops
    const cropsData = localStorage.getItem('agriheal-crops');
    if (cropsData) {
      context.crops = JSON.parse(cropsData);
    }

    // 2. Get Settings (Language, Units)
    const settingsData = localStorage.getItem('agriheal-settings');
    if (settingsData) {
      context.settings = JSON.parse(settingsData);
    }

    // 3. Get Location
    const locData = localStorage.getItem('ah-location');
    if (locData) {
      context.location = JSON.parse(locData);
    }

    // 4. Get Records
    const recordsData = localStorage.getItem('agriheal_documents');
    if (recordsData) {
      const records = JSON.parse(recordsData);
      context.recentRecords = records.slice(0, 3).map(r => r.title);
    }

  } catch (err) {
    console.warn("Failed to parse local storage for context", err);
  }

  return context;
};

export const buildSystemInstruction = (baseInstruction = "") => {
  const ctx = getGlobalContext();
  
  let dynamicContext = `\n\n--- USER CONTEXT ---\n`;
  if (ctx.crops && ctx.crops.length > 0) {
    dynamicContext += `Active Crops Planted: ${ctx.crops.map(c => c.name).join(', ')}.\n`;
  }
  if (ctx.location) {
    dynamicContext += `User Location: ${ctx.location.city || 'Unknown'}.\n`;
  }
  const vLang = ctx.settings?.voiceAssistant?.vaniLanguage;
  if (vLang && vLang !== 'auto') {
    const langMap = { en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil' };
    dynamicContext += `STRICT VANI SPOKEN LANGUAGE RULE: You MUST speak/reply strictly in ${langMap[vLang] || 'English'}.\n`;
  } else if (ctx.settings?.general?.language) {
    dynamicContext += `Preferred Language: ${ctx.settings.general.language}. If the user speaks in Hindi, Telugu, or Tamil, you MUST respond in that same language.\n`;
  }
  
  return (baseInstruction ? baseInstruction : "You are Vani, a highly intelligent and helpful agricultural assistant for farmers in India.") + dynamicContext + "\nRespond concisely and provide practical, actionable advice.";
};
