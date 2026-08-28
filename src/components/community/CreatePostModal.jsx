import React, { useState } from 'react';
import { X, Image as ImageIcon, Video, Mic, Globe2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Question');
  const [language, setLanguage] = useState('English');

  const categories = ['Question', 'Crop Care', 'Pest & Disease', 'Farming Tip', 'Success Story', 'Market Prices'];
  const languages = ['English', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'ಕನ್ನಡ (Kannada)', 'हिंदी (Hindi)'];

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from('community_posts').insert([
        {
          author_name: 'Ravi Kumar', // Fallback or get from context
          author_avatar: 'RK',
          content: content,
          tags: [category]
        }
      ]);
      
      if (error) throw error;
      
      console.log("Post created successfully");
      if (onPostCreated) onPostCreated(); // Call a callback to refresh feed if passed
      onClose();
    } catch (error) {
      console.error("Error creating post:", error.message);
      // In a real app, show a toast notification here
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end md:justify-center items-center md:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full md:w-[600px] md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="font-black text-slate-800 text-lg">Create Post</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
          {/* User Profile row */}
          <div className="flex items-center gap-3 mb-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi" alt="Profile" className="w-12 h-12 rounded-full bg-orange-100" />
            <div>
              <h4 className="font-bold text-slate-800">Ravi Kumar</h4>
              
              {/* Language Selector */}
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 cursor-pointer hover:text-green-600">
                <Globe2 className="w-3.5 h-3.5" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none appearance-none cursor-pointer"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea 
            placeholder="What do you want to ask or share with the community?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 text-lg resize-none focus:outline-none placeholder:text-gray-400 text-slate-800 bg-transparent"
          />

          {/* Category Selector */}
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    category === cat ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition-colors">
              <ImageIcon className="w-4 h-4 text-blue-500" />
              Photo
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition-colors">
              <Video className="w-4 h-4 text-purple-500" />
              Video
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl text-slate-600 hover:bg-gray-50 transition-colors" title="Voice typing">
              <Mic className="w-4 h-4 text-red-500" />
            </button>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="w-full sm:w-32 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
