/**
 * Open-Meteo Weather Service
 * Open-Meteo's forecast API is free and keyless, so unlike weatherService.js
 * (which proxies OpenWeatherMap through a Supabase Edge Function to protect
 * WEATHER_API_KEY), this calls the public API directly from the browser —
 * there is no secret to protect and no auth required.
 *
 * Used by FarmCare for real current conditions + a 7-day forecast, since
 * OpenWeatherMap's free tier doesn't include a daily forecast or UV index.
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO weather codes -> a short label + whether it's a "rain" icon day
const WEATHER_CODE_MAP = {
  0: { label: 'Clear Sky', rainy: false },
  1: { label: 'Mainly Clear', rainy: false },
  2: { label: 'Partly Cloudy', rainy: false },
  3: { label: 'Overcast', rainy: false },
  45: { label: 'Fog', rainy: false },
  48: { label: 'Fog', rainy: false },
  51: { label: 'Light Drizzle', rainy: true },
  53: { label: 'Drizzle', rainy: true },
  55: { label: 'Dense Drizzle', rainy: true },
  56: { label: 'Freezing Drizzle', rainy: true },
  57: { label: 'Freezing Drizzle', rainy: true },
  61: { label: 'Light Rain', rainy: true },
  63: { label: 'Rain', rainy: true },
  65: { label: 'Heavy Rain', rainy: true },
  66: { label: 'Freezing Rain', rainy: true },
  67: { label: 'Freezing Rain', rainy: true },
  71: { label: 'Light Snow', rainy: true },
  73: { label: 'Snow', rainy: true },
  75: { label: 'Heavy Snow', rainy: true },
  77: { label: 'Snow Grains', rainy: true },
  80: { label: 'Rain Showers', rainy: true },
  81: { label: 'Rain Showers', rainy: true },
  82: { label: 'Violent Rain Showers', rainy: true },
  85: { label: 'Snow Showers', rainy: true },
  86: { label: 'Snow Showers', rainy: true },
  95: { label: 'Thunderstorm', rainy: true },
  96: { label: 'Thunderstorm w/ Hail', rainy: true },
  99: { label: 'Thunderstorm w/ Hail', rainy: true },
};

const describeWeatherCode = (code) => WEATHER_CODE_MAP[code] ?? { label: 'Unknown', rainy: false };

const formatTime = (iso) => {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const dayLabel = (iso, idx) => {
  if (idx === 0) return 'Today';
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' });
};

/**
 * Fetch real current conditions + a 7-day forecast for a farm location.
 */
export const fetchFarmWeather = async (lat, lon) => {
  const url = new URL(BASE_URL);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,uv_index,weather_code');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
  const data = await res.json();

  const current = data.current;
  const daily = data.daily;
  const todayCondition = describeWeatherCode(current.weather_code);

  return {
    temp: Math.round(current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m),
    wind: Math.round(current.wind_speed_10m),
    pressure: Math.round(current.pressure_msl),
    uv: Math.round(current.uv_index * 10) / 10,
    condition: todayCondition.label,
    rainProb: daily.precipitation_probability_max?.[0] ?? 0,
    sunrise: formatTime(daily.sunrise?.[0]),
    sunset: formatTime(daily.sunset?.[0]),
    forecast: daily.time.map((date, idx) => {
      const code = describeWeatherCode(daily.weather_code[idx]);
      return {
        day: dayLabel(date, idx),
        high: Math.round(daily.temperature_2m_max[idx]),
        low: Math.round(daily.temperature_2m_min[idx]),
        rain: `${Math.round(daily.precipitation_probability_max[idx])}%`,
        rainy: code.rainy,
      };
    }),
  };
};
