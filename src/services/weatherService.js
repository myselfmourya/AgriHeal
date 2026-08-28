/**
 * Weather Service
 * Fetches real-time weather by:
 * 1. Geolocation (lat/lon) — most accurate
 * 2. City name fallback
 */

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5/weather';

const transform = (data) => ({
  temperature: `${Math.round(data.main.temp)}°C`,
  tempRaw: Math.round(data.main.temp),
  feelsLike: `${Math.round(data.main.feels_like)}°C`,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  humidity: `${data.main.humidity}%`,
  humidityRaw: data.main.humidity,
  wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
  rainChance: `${data.clouds?.all ?? 0}%`,
  city: data.name,
  source: 'api',
  timestamp: new Date().toISOString(),
  freshness: 'live',
});

/**
 * Fetch weather using the browser's Geolocation API.
 * Falls back to `location` (city name) if geolocation fails or is denied.
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  if (!WEATHER_API_KEY) throw new Error('Missing VITE_WEATHER_API_KEY');
  const res = await fetch(`${BASE}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return transform(await res.json());
};

export const fetchWeather = async (location) => {
  if (!WEATHER_API_KEY) throw new Error('Missing VITE_WEATHER_API_KEY');
  const res = await fetch(`${BASE}?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return transform(await res.json());
};

/**
 * Best-effort weather: tries geolocation first, falls back to city name.
 */
export const fetchWeatherSmart = (cityFallback = 'Chennai') =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      fetchWeather(cityFallback).then(resolve).catch(reject);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          resolve(await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude));
        } catch (e) {
          // If coords fetch fails try city name
          try { resolve(await fetchWeather(cityFallback)); } catch { reject(e); }
        }
      },
      async () => {
        // Geolocation denied — fall back to city
        try { resolve(await fetchWeather(cityFallback)); } catch (e) { reject(e); }
      },
      { timeout: 6000, maximumAge: 300000, enableHighAccuracy: false }
    );
  });
