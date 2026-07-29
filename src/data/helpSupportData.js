import { 
  User, BookOpen, Leaf, CreditCard, Wrench, HelpCircle, 
  Camera, Droplet, LineChart, 
   Phone, MessageCircle, Mail, CloudRain
} from 'lucide-react';

export const QUICK_CATEGORIES = [
  { id: 'cat1', icon: User, label: 'Account & Profile', desc: 'Manage your account and profile settings', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'cat2', icon: BookOpen, label: 'Using AgriHeal', desc: 'Learn how to use features easily', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'cat3', icon: Leaf, label: 'Crop & Disease Help', desc: 'Identify & manage crop problems', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'cat4', icon: CreditCard, label: 'Payments & Orders', desc: 'Payment issues, refunds, invoices', color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'cat5', icon: Wrench, label: 'Technical Support', desc: 'App issues, errors and troubleshooting', color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'cat6', icon: HelpCircle, label: 'Other Support', desc: "Anything else? We're here for you", color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

export const POPULAR_ARTICLES = [
  {
    id: 'art1',
    icon: Camera,
    title: 'How to take a good photo for disease detection?',
    type: 'Step-by-step guide',
    readTime: '2 min read'
  },
  {
    id: 'art2',
    icon: Leaf,
    title: 'How to get accurate AI recommendations?',
    type: 'Best practices',
    readTime: '3 min read'
  },
  {
    id: 'art3',
    icon: CloudRain, // Will fix import
    title: 'How weather forecast helps in farming?',
    type: 'Understand weather insights',
    readTime: '4 min read'
  },
  {
    id: 'art4',
    icon: Droplet, // Leaf/Droplet
    title: 'Fertilizer recommendation – How it works?',
    type: 'Complete guide',
    readTime: '3 min read'
  },
  {
    id: 'art5',
    icon: LineChart,
    title: 'How to check market prices in my area?',
    type: 'Step-by-step',
    readTime: '2 min read'
  },
  {
    id: 'art6',
    icon: BookOpen,
    title: 'How to apply for government schemes?',
    type: 'Easy application process',
    readTime: '3 min read'
  }
];

export const VIDEO_TUTORIALS = [
  {
    id: 'vid1',
    title: 'Getting Started with AgriHeal',
    desc: 'Basic app overview',
    duration: '04:35',
    thumbnail: 'https://images.unsplash.com/photo-1592843997672-97217db8311a?auto=format&fit=crop&q=80'
  },
  {
    id: 'vid2',
    title: 'Disease Detection using Image Analysis',
    desc: 'Complete tutorial',
    duration: '05:12',
    thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e481?auto=format&fit=crop&q=80'
  },
  {
    id: 'vid3',
    title: 'Smart Irrigation Planning using AgriHeal',
    desc: 'Step by step',
    duration: '03:46',
    thumbnail: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80'
  },
  {
    id: 'vid4',
    title: 'Check Market Prices & Sell Smart',
    desc: 'Market guide',
    duration: '04:20',
    thumbnail: 'https://images.unsplash.com/photo-1506869640319-fea1a2752075?auto=format&fit=crop&q=80'
  },
  {
    id: 'vid5',
    title: 'Apply Government Schemes Easily',
    desc: 'Full process',
    duration: '03:15',
    thumbnail: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80'
  }
];

export const SYSTEM_STATUS = [
  { id: 'sys1', name: 'AI Services', status: 'Operational', isUp: true },
  { id: 'sys2', name: 'Weather Service', status: 'Operational', isUp: true },
  { id: 'sys3', name: 'Payment Gateway', status: 'Operational', isUp: true },
  { id: 'sys4', name: 'Notifications', status: 'Operational', isUp: true },
];

export const CONTACT_OPTIONS = [
  {
    id: 'contact1',
    icon: MessageCircle,
    title: 'Live Chat with Vani',
    desc: 'Chat instantly with our AI assistant',
    actionText: 'Chat Now'
  },
  {
    id: 'contact2',
    icon: Phone,
    title: 'Call Support',
    desc: '1800-123-AGRI (247)\n9:00 AM – 8:00 PM',
    actionText: 'Call'
  },
  {
    id: 'contact3',
    icon: MessageCircle, // Will replace with whatsapp icon if needed
    title: 'WhatsApp Support',
    desc: '+91 98765 43210\n9:00 AM – 8:00 PM',
    actionText: 'Message'
  },
  {
    id: 'contact4',
    icon: Mail,
    title: 'Email Us',
    desc: 'support@agriheal.com\nWe reply within 24 hours',
    actionText: 'Email'
  }
];
