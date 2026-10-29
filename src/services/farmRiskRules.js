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
 * NOAA/NWS heat index (Rothfusz regression), the standard "feels like"
 * formula used by weather services worldwide. Input/output in Celsius;
 * the regression itself works in Fahrenheit internally.
 * Reference: https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
 */
export const computeHeatIndexC = (tempC, humidityPct) => {
  const T = tempC * 9 / 5 + 32;
  const R = humidityPct;
  let hiF = 0.5 * (T + 61 + (T - 68) * 1.2 + R * 0.094);
  // The simple formula above is only used as a quick pre-check; the full
  // regression (more accurate, what NWS actually publishes) applies above ~80°F.
  if ((hiF + T) / 2 >= 80) {
    hiF = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R
      - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R
      + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  }
  return Math.round(((hiF - 32) * 5 / 9) * 10) / 10;
};

/** NWS heat index danger categories, thresholds converted to Celsius. */
export const getHeatIndexCategory = (heatIndexC) => {
  if (heatIndexC >= 51) return { level: 'Extreme Danger', advice: 'Heat stroke highly likely with continued exposure. Stop outdoor work.' };
  if (heatIndexC >= 39) return { level: 'Danger', advice: 'Heat cramps/exhaustion likely, heat stroke possible with prolonged exposure or activity.' };
  if (heatIndexC >= 32) return { level: 'Extreme Caution', advice: 'Heat cramps and heat exhaustion possible with prolonged exposure or activity.' };
  if (heatIndexC >= 27) return { level: 'Caution', advice: 'Fatigue possible with prolonged exposure or activity.' };
  return { level: 'Safe', advice: 'No significant heat risk at this time.' };
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
