import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings = {
  // General
  general: {
    appMode: 'Beginner', // Beginner | Advanced
    units: 'metric', // metric | imperial
    dateFormat: 'DD/MM/YYYY',
    quickAccessShortcuts: ['Irrigation Reminders', 'Market Price Alerts', 'Pest & Disease Alerts', 'Fertilizer Reminders', 'Rain Alerts', 'Offline Mode'],
  },
  
  // Language
  language: {
    appLanguage: 'en-IN',
    voiceLanguage: 'en-IN',
  },

  // Voice Assistant (Vani)
  voiceAssistant: {
    wakeWord: true,
    voiceSpeed: 1.0,
    voiceGender: 'Female',
    voicePitch: 1.0,
    voiceVolume: 80,
    voiceResponseStyle: 'Simple',
    autoListen: true,
    voiceFeedback: true,
  },

  // Display & Theme
  displayTheme: {
    theme: 'system', // light | dark | system
    primaryColor: 'Green',
    textSize: 'Medium',
    cornerStyle: 'Rounded',
    animations: true,
    reduceMotion: false,
  },

  // Weather & Alerts
  weatherAlerts: {
    weatherAlertsEnabled: true,
    alertTypes: {
      rain: true,
      heatWave: true,
      coldWave: false,
      strongWind: true,
      frost: false,
    },
    alertTiming: '2 Hours Before',
    dailyWeatherSummary: true,
    severeWeatherPush: true,
  },

  // Crop & Farm (Mainly pointers to where data is managed, but can hold some preferences)
  cropFarm: {
    customReminders: true,
  },

  // Market & Prices
  marketPrices: {
    marketPriceAlerts: true,
    selectedCrops: ['Wheat', 'Rice', 'Tomato'],
    marketLocation: 'Current Location',
    priceChangeAlertPercent: 5,
    dailyPriceSummary: true,
    weeklyPriceReport: false,
  },

  // Irrigation & Water
  irrigationWater: {
    irrigationReminders: true,
    irrigationMethod: 'Drip Irrigation',
    waterSource: 'Borewell',
    wateringInterval: 'Every 2 Days',
    bestTimeToIrrigate: 'Morning',
    waterSavingTips: true,
  },
  
  // Pest & Disease
  pestDisease: {
    pestAlerts: true,
    diseaseAlerts: true,
    aiSensitivity: 'High',
  },

  // Notifications
  notifications: {
    allNotifications: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    alertCategories: {
      weather: true,
      market: true,
      pestDisease: true,
      reminders: true,
      offersUpdates: false,
    }
  },

  // Privacy & Security
  privacySecurity: {
    appLock: false,
    biometricLogin: true,
    shareData: false,
  },
  
  // Emergency
  emergency: {
    primaryContacts: [],
    shareLiveLocation: true,
    autoRecordAudio: true,
  },
  
  // Offline Mode
  offlineMode: {
    enabled: false,
    aiModel: 'Hybrid',
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('agriheal-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return {
          ...defaultSettings,
          ...parsed,
          emergency: parsed.emergency || defaultSettings.emergency,
        };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('agriheal-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSection = (section, newValues) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newValues
      }
    }));
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSection, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
