import React, { useState } from 'react';
import { Users, LayoutList, HelpCircle, Map, Megaphone } from 'lucide-react';
import CommunityFeed from '../components/community/CommunityFeed';
import DiscussionGroups from '../components/community/DiscussionGroups';
import DiagnosisAndQA from '../components/community/DiagnosisAndQA';
import FarmerDirectory from '../components/community/FarmerDirectory';
import Events from '../components/community/Events';
import CreatePostModal from '../components/community/CreatePostModal';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const tabs = [
    { id: 'feed', label: 'Feed', icon: LayoutList },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'qa', label: 'Diagnosis & Q&A', icon: HelpCircle },
    { id: 'connect', label: 'Nearby Farmers', icon: Map },
    { id: 'events', label: 'Events', icon: Megaphone }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <CommunityFeed />;
      case 'groups':
        return <DiscussionGroups />;
      case 'qa':
        return <DiagnosisAndQA />;
      case 'connect':
        return <FarmerDirectory />;
      case 'events':
        return <Events />;
      default:
        return <CommunityFeed />;
    }
  };

  return (
    <div className="min-h-full bg-[#f4f7f5] pb-24 md:pb-12 relative">
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-sm">
        <span className="text-amber-500">⚠️</span>
        <span><strong>Community features are coming soon.</strong> Posts shown are sample content.</span>
      </div>

      {/* Header */}
      <div className="bg-white px-4 md:px-8 py-6 shadow-sm relative z-10">
        <h1 className="text-2xl font-black text-slate-800">Community & Services</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Connect, Share, and Learn together</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white px-4 md:px-8 border-b border-gray-100 overflow-x-auto scrollbar-hide sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-6 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  isActive ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
        {renderContent()}
      </div>

      {/* Create Post FAB */}
      <button 
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-20 right-6 md:bottom-10 md:right-10 bg-green-600 text-white py-3 px-5 md:px-6 rounded-full shadow-xl hover:bg-green-700 transition-transform hover:scale-105 z-30 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span className="font-bold hidden md:block">Create Post</span>
      </button>

      {/* Modals */}
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
    </div>
  );
}
