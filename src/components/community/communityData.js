export const MOCK_POSTS = [
  {
    id: 1,
    author: 'Suresh Reddy',
    village: 'Narsampet, Telangana',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
    time: '2 hours ago',
    type: 'question',
    category: 'Crop Care',
    crop: 'Paddy',
    content: 'My paddy is flowering well. Any tips for the next stage? Should I apply any specific nutrients now?',
    images: ['https://placehold.co/800x400/e6f4ea/2f855a?text=Paddy+Field'],
    likes: 12,
    comments: [
      { id: 101, author: 'Ramesh Kumar', text: 'Apply a light dose of Potash, it helps in grain filling.' },
      { id: 102, author: 'Dr. Venkat (Expert)', isExpert: true, text: 'Maintain 2-3 cm of water level during flowering. Avoid spraying pesticides right now as it might affect pollination.' }
    ],
    shares: 2
  },
  {
    id: 2,
    author: 'Kiran Bhai',
    village: 'Amreli, Gujarat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran',
    time: '5 hours ago',
    type: 'success',
    category: 'Success Story',
    crop: 'Cotton',
    content: "Very happy with this year's cotton yield! Using organic compost really made a difference in the boll size. Thanks to AgriHeal community for the advice last month.",
    images: ['https://placehold.co/800x400/fff3cd/975a16?text=Cotton+Harvest'],
    likes: 45,
    comments: [],
    shares: 5
  },
  {
    id: 3,
    author: 'AgriHeal Experts',
    village: 'Official',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
    time: '1 day ago',
    type: 'tip',
    category: 'Farming Tip',
    crop: 'General',
    content: '💧 WATER SAVING TIP: Mulching your vegetable beds can reduce water evaporation by up to 30%. It also suppresses weed growth!',
    images: [],
    likes: 89,
    comments: [
      { id: 103, author: 'Naresh', text: 'Can I use dry paddy straw for mulching?' },
      { id: 104, author: 'AgriHeal Experts', isExpert: true, text: 'Yes Naresh, dry paddy straw is an excellent and cheap mulching material.' }
    ],
    shares: 12
  }
];

export const MOCK_GROUPS = [
  { id: 1, name: 'Paddy Farmers India', members: '12.5k', image: '🌾', description: 'Discuss best practices for paddy cultivation.' },
  { id: 2, name: 'Organic Farming', members: '8.2k', image: '🌱', description: 'Natural and chemical-free farming techniques.' },
  { id: 3, name: 'Dairy & Livestock', members: '5.1k', image: '🐄', description: 'Cattle care, milk yield improvement, and livestock health.' },
  { id: 4, name: 'Vegetable Growers', members: '6.4k', image: '🍅', description: 'Seasonal vegetable tips and market prices.' },
  { id: 5, name: 'Local: Warangal Farmers', members: '2.1k', image: '📍', description: 'Connect with farmers in and around Warangal district.' },
];

export const MOCK_FARMERS = [
  { id: 1, name: 'Naresh Kumar', village: 'Hanamkonda', crops: ['Cotton', 'Maize'], experience: '15 years', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naresh', isExpert: false },
  { id: 2, name: 'Lakshmi Devi', village: 'Narsampet', crops: ['Tomato', 'Chilli'], experience: '8 years', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi', isExpert: false },
  { id: 3, name: 'Dr. Srinivas', village: 'Warangal', crops: ['Agricultural Scientist'], experience: '20 years', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrSrinivas', isExpert: true },
  { id: 4, name: 'Venkat Rao', village: 'Gudur', crops: ['Paddy', 'Pulses'], experience: '25 years', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Venkat', isExpert: false },
  { id: 5, name: 'Kavita', village: 'Kazipet', crops: ['Organic Veggies'], experience: '5 years', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita', isExpert: false },
];

export const MOCK_EVENTS = [
  {
    id: 1,
    title: 'PM-Kisan Scheme Virtual Launch',
    date: 'Aug 15, 2026',
    time: '10:00 AM - 11:30 AM',
    location: 'Online Webcast',
    type: 'Scheme',
    description: 'Learn about the new benefits and updates to the PM-Kisan scheme directly from the officials.',
    attendees: 1240
  },
  {
    id: 2,
    title: 'Organic Farming Workshop',
    date: 'Aug 20, 2026',
    time: '09:00 AM - 04:00 PM',
    location: 'KVK Warangal, Telangana',
    type: 'Workshop',
    description: 'A hands-on workshop on preparing natural compost and bio-pesticides using local materials.',
    attendees: 156
  },
  {
    id: 3,
    title: 'Monsoon Preparation Farmer Meet',
    date: 'Sep 02, 2026',
    time: '11:00 AM - 01:00 PM',
    location: 'Gram Panchayat Hall, Narsampet',
    type: 'Meeting',
    description: 'Community meeting to discuss seed varieties, water management, and weather forecasts for the upcoming Kharif season.',
    attendees: 85
  }
];
