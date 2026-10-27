/**
 * Farm Risk Rules
 * Simple, transparent rule-of-thumb logic applied to REAL weather/soil data
 * (from openMeteoService). These are not AI predictions or species-specific
 * pest/disease models — just the same kind of general heuristics agricultural
 * extension guides use (e.g. "high humidity + warm temps raise fungal risk").
 * Always labeled as an estimate in the UI, never presented as a diagnosis.
 */

/**
 * Soil moisture is a 0-100 "wetness" % (see openMeteoService). Below ~30% a
 * loam soil is approaching the wilting point for most field crops; above
 * ~55% it's comfortably wet. Skip irrigation if meaningful rain is already
 * expected in the next 48h.
 */
export const getIrrigationRecommendation = ({ soilMoisturePercent, rainNext48hMm }) => {
  if (soilMoisturePercent == null) {
    return { status: 'Unknown', needed: null, reasoning: 'Soil moisture data unavailable for this location.' };
  }
  const rainComing = rainNext48hMm >= 5;

  if (soilMoisturePercent < 30) {
    return rainComing
      ? { status: 'Hold — Rain Expected', needed: false, reasoning: `Soil moisture is low (${soilMoisturePercent}%), but ${rainNext48hMm}mm of rain is expected in the next 48h — hold off and let it fall naturally.` }
      : { status: 'Irrigation Needed', needed: true, reasoning: `Soil moisture is low (${soilMoisturePercent}%), approaching the wilting point for most crops, with no significant rain expected soon.` };
  }
  if (soilMoisturePercent < 55) {
    return rainComing
      ? { status: 'Hold — Rain Expected', needed: false, reasoning: `Soil moisture is moderate (${soilMoisturePercent}%) and rain is expected — no need to irrigate now.` }
      : { status: 'Monitor', needed: false, reasoning: `Soil moisture is moderate (${soilMoisturePercent}%). Check again in a day or two if no rain falls.` };
  }
  return { status: 'Not Needed', needed: false, reasoning: `Soil moisture is comfortable (${soilMoisturePercent}%).` };
};

/** Real-data thresholds, not a heuristic — just a direct read of the forecast. */
export const getHeatFrostRisk = ({ tempMaxC, tempMinC }) => {
  const heat = tempMaxC >= 38 ? 'High' : tempMaxC >= 33 ? 'Medium' : 'Low';
  const frost = tempMinC <= 2 ? 'High' : tempMinC <= 5 ? 'Medium' : 'Low';
  return {
    heatStress: { level: heat, msg: heat === 'High' ? `Forecast high of ${Math.round(tempMaxC)}°C — significant heat stress risk.` : heat === 'Medium' ? `Forecast high of ${Math.round(tempMaxC)}°C — some heat stress possible.` : `Temperatures are within a safe range (high ${Math.round(tempMaxC)}°C).` },
    frostDamage: { level: frost, msg: frost === 'High' ? `Forecast low of ${Math.round(tempMinC)}°C — frost damage likely.` : frost === 'Medium' ? `Forecast low of ${Math.round(tempMinC)}°C — frost is possible overnight.` : 'No frost risk detected in the forecast.' },
  };
};

/**
 * A general weather-based estimate, NOT species-specific pest/disease
 * detection. High humidity + warm temperatures favor fungal growth and
 * insect activity broadly — the usual agri-extension rule of thumb.
 */
export const getPestDiseaseRisk = ({ humidity, tempC }) => {
  let disease = 'Low';
  if (humidity >= 80 && tempC >= 20 && tempC <= 32) disease = 'High';
  else if (humidity >= 65) disease = 'Medium';

  let pest = 'Low';
  if (humidity >= 70 && tempC >= 25) pest = 'Medium';
  if (humidity >= 85 && tempC >= 28) pest = 'High';

  return {
    diseaseRisk: { level: disease, msg: disease === 'High' ? `High humidity (${humidity}%) and warm temperatures favor fungal disease spread — general estimate, not a diagnosis.` : disease === 'Medium' ? `Humidity (${humidity}%) is elevated — watch for early signs of fungal disease.` : 'Conditions are not especially favorable for fungal disease right now.' },
    pestActivity: { level: pest, msg: pest === 'High' ? `Warm, humid conditions (${tempC}°C, ${humidity}%) typically increase insect activity — general estimate, not species-specific monitoring.` : pest === 'Medium' ? 'Conditions are moderately favorable for pest activity.' : 'Conditions are not especially favorable for elevated pest activity.' },
  };
};
