import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherSmart } from '../services/weatherService';
import { useFarmer } from './FarmerContext';

const DEFAULT_WEATHER = {
  temperature: '--°C',
  tempRaw: null,
  condition: 'Loading...',
  humidity: '--%',
  wind: '-- km/h',
  rainChance: '--%',
  city: '',
};

const WeatherContext = createContext();
export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const { profile } = useFarmer();
  // Use farmer's village/district as city fallback for weather name (still uses geolocation for coords)
  const cityFallback = profile?.village || profile?.district || 'Chennai';

  const { data: weatherData = DEFAULT_WEATHER, isLoading, error } = useQuery({
    queryKey: ['weather-geo', cityFallback],
    queryFn: () => fetchWeatherSmart(cityFallback),
    staleTime: 1000 * 60 * 10,   // cache 10 min
    retry: 1,
  });

  return (
    <WeatherContext.Provider value={{ weatherData, isLoading, error }}>
      {children}
    </WeatherContext.Provider>
  );
};
