export const RECENT_ANALYSES = [
  {
    id: 'a1',
    image: 'https://images.unsplash.com/photo-1592843997672-97217db8311a?auto=format&fit=crop&q=80',
    title: 'Tomato Leaf Curl',
    time: '2 mins ago'
  },
  {
    id: 'a2',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80',
    title: 'Powdery Mildew',
    time: '1 day ago'
  },
  {
    id: 'a3',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80',
    title: 'Brown Spot',
    time: '2 days ago'
  },
  {
    id: 'a4',
    image: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?auto=format&fit=crop&q=80',
    title: 'Aphid Infestation',
    time: '3 days ago'
  },
  {
    id: 'a5',
    image: 'https://images.unsplash.com/photo-1506869640319-fea1a2752075?auto=format&fit=crop&q=80',
    title: 'Bacterial Wilt',
    time: '4 days ago'
  },
  {
    id: 'a6',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80',
    title: 'Leaf Miner',
    time: '5 days ago'
  }
];

export const CURRENT_ANALYSIS = {
  title: 'Tomato Leaf Curl Disease',
  confidence: 94,
  severity: 'Medium',
  likelyCause: 'Tomato Leaf Curl Virus (ToLCV)',
  detectedOn: 'Tomato',
  affectedArea: '25-40%',
  description: 'Leaf curling, yellowing, and stunted growth caused by Tomato Leaf Curl Virus. It is transmitted by whiteflies.',
  mainImage: 'https://images.unsplash.com/photo-1592843997672-97217db8311a?auto=format&fit=crop&q=80'
};

export const RECOMMENDED_ACTIONS = [
  {
    id: 'ra1',
    title: 'Remove infected leaves',
    desc: 'Prevent further spread'
  },
  {
    id: 'ra2',
    title: 'Control whiteflies',
    desc: 'Use yellow sticky traps'
  },
  {
    id: 'ra3',
    title: 'Spray recommended pesticide',
    desc: 'Imidacloprid / Thiamethoxam'
  },
  {
    id: 'ra4',
    title: 'Use virus resistant seeds',
    desc: 'For next planting season'
  }
];

export const SUGGESTED_TREATMENTS = {
  chemical: [
    {
      id: 't1',
      name: 'Imidacloprid 17.8 SL',
      dose: '0.3 ml per litre',
      instructions: 'Apply in the morning',
      image: 'https://placehold.co/100x100/e2e8f0/64748b?text=Bottle'
    },
    {
      id: 't2',
      name: 'Thiamethoxam 25 WG',
      dose: '0.25 g per litre',
      instructions: 'Spray after 7-10 days',
      image: 'https://placehold.co/100x100/e2e8f0/64748b?text=Bottle'
    }
  ],
  organic: [
    {
      id: 't3',
      name: 'Neem Oil Extract',
      dose: '5 ml per litre',
      instructions: 'Spray every 7 days',
      image: 'https://placehold.co/100x100/e2e8f0/64748b?text=Bottle'
    }
  ]
};

export const AI_CONTEXT = {
  crop: 'Tomato (Vegetative Stage)',
  location: 'Vijayawada, Andhra Pradesh',
  weather: '28°C, Partly Cloudy',
  lastIrrigation: 'Today, 6:00 AM'
};
