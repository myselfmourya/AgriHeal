import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFarmer } from './FarmerContext';
import { fetchWeather } from '../services/weatherService';

const DEFAULT_WEATHER = {
  temperature: '28°C',
  condition: 'Partly Cloudy',
  humidity: '60%',
  wind: '18 km/h',
  rainChance: '20%'
};

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const { profile } = useFarmer();
  const location = profile?.village || profile?.location || 'Narsampet';

  const { data: weatherData = DEFAULT_WEATHER, isLoading } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeather(location),
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });

  return (
    <WeatherContext.Provider value={{ weatherData, isLoading }}>
      {children}
    </WeatherContext.Provider>
  );
};
