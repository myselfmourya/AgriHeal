export const RECENT_CHATS = [
  { id: 1, title: 'Tomato leaf curling', date: 'Today, 08:45 AM', type: 'diagnosis' },
  { id: 2, title: 'Fertilizer for paddy', date: 'Today, 07:10 AM', type: 'chat' },
  { id: 3, title: 'Market price today', date: 'Today, 06:30 AM', type: 'market' },
  { id: 4, title: 'Irrigation schedule', date: 'Yesterday, 09:20 PM', type: 'chat' },
  { id: 5, title: 'Pest in cotton crop', date: 'Yesterday, 06:15 PM', type: 'diagnosis' },
  { id: 6, title: 'Soil health report', date: '2 Days Ago', type: 'document' },
  { id: 7, title: 'Rain forecast', date: '3 Days Ago', type: 'weather' }
];

export const MOCK_VIDEOS = [
  {
    id: 'v1',
    youtubeId: 'v9C63G-9c3o',
    title: 'Integrated Pest Management',
    thumbnail: 'https://img.youtube.com/vi/v9C63G-9c3o/hqdefault.jpg',
    duration: '12:45',
    difficulty: 'Beginner',
    language: 'English',
    views: '1.2M',
    category: 'Pest Management',
    progress: 60
  },
  {
    id: 'v2',
    youtubeId: 'zM3L8Qz_aKA',
    title: 'Organic Farming in Telugu',
    thumbnail: 'https://img.youtube.com/vi/zM3L8Qz_aKA/hqdefault.jpg',
    duration: '15:20',
    difficulty: 'Beginner',
    language: 'Telugu',
    views: '856K',
    category: 'Organic Farming',
    progress: 0
  },
  {
    id: 'v3',
    youtubeId: 'U_56E_aV8B8',
    title: 'Drip Irrigation Techniques',
    thumbnail: 'https://img.youtube.com/vi/U_56E_aV8B8/hqdefault.jpg',
    duration: '08:15',
    difficulty: 'Intermediate',
    language: 'English',
    views: '540K',
    category: 'Water Management',
    progress: 100
  },
  {
    id: 'v4',
    youtubeId: '1w02r7l91n8',
    title: 'Modern Farming Tips Hindi',
    thumbnail: 'https://img.youtube.com/vi/1w02r7l91n8/hqdefault.jpg',
    duration: '10:05',
    difficulty: 'Advanced',
    language: 'Hindi',
    views: '720K',
    category: 'Crop Cultivation',
    progress: 30
  }
];

export const MOCK_FARM_CONTEXT = {
  weather: { temp: '28°C', condition: 'Partly Cloudy' },
  soilMoisture: { level: '72%', status: 'Good' },
  market: { crop: 'Paddy', price: '₹2,350', trend: '+ 6.1%' },
  alerts: 3
};
