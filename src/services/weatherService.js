/**
 * Weather Service
 * Fetches real-time weather via the Supabase `weather-proxy` Edge Function,
 * which calls OpenWeatherMap server-side using WEATHER_API_KEY. The browser
 * never sees the key.
 * 1. Geolocation (lat/lon) — most accurate
 * 2. City name fallback
 */
import { supabase } from '../lib/supabase';

const invokeWeatherProxy = async (body) => {
  const { data, error } = await supabase.functions.invoke('weather-proxy', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

/**
 * Fetch weather using the browser's Geolocation API.
 * Falls back to `location` (city name) if geolocation fails or is denied.
 */
export const fetchWeatherByCoords = async (lat, lon) => invokeWeatherProxy({ lat, lon });

export const fetchWeather = async (location) => invokeWeatherProxy({ location });

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
