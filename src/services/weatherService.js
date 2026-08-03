/**
 * Weather Service
 * Handles fetching weather data from external APIs.
 * Strictly configured for production - no mock fallbacks.
 */

export const fetchWeather = async (location) => {
  try {
    const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!weatherApiKey) {
      throw new Error('Missing VITE_WEATHER_API_KEY in environment variables.');
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Weather API failed with status: ${response.status}`);
    }

    const weatherData = await response.json();
    
    // Transform OpenWeather response to match our app's structure
    return {
      temperature: `${Math.round(weatherData.main.temp)}°C`,
      condition: weatherData.weather[0].main,
      humidity: `${weatherData.main.humidity}%`,
      wind: `${Math.round(weatherData.wind.speed * 3.6)} km/h`, // m/s to km/h
      rainChance: weatherData.clouds.all ? `${weatherData.clouds.all}%` : '0%', // rough estimate
      source: 'api',
      timestamp: new Date().toISOString(),
      freshness: 'live'
    };
  } catch (error) {
    console.error('Weather service failed:', error);
    throw error;
  }
};
