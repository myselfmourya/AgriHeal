import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, Download, Bookmark, Award, Menu, X, Play, Search } from 'lucide-react';
import { MOCK_VIDEOS } from './aiLearningData';

export default function LearningMode() {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Crop Cultivation', 'Pest Management', 'Organic Farming', 'Water Management'];

  const filteredVideos = MOCK_VIDEOS.filter(v => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.language.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderVideoFeed = () => (
    <div className="space-y-8">
      {/* Featured Video (Only show in 'All' and no search) */}
      {activeCategory === 'All' && !searchQuery && MOCK_VIDEOS.length > 0 && (
        <div 
          className="relative h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
          onClick={() => setActiveVideo(MOCK_VIDEOS[0])}
        >
          <img src={MOCK_VIDEOS[0].thumbnail} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Featured Course</span>
              <span className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">{MOCK_VIDEOS[0].duration}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{MOCK_VIDEOS[0].title}</h2>
            <p className="text-gray-300 text-sm mb-4 line-clamp-1 max-w-lg">Learn the complete guide to managing pests in your farm without using harmful chemicals.</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> {MOCK_VIDEOS[0].views} views</span>
              <span className="flex items-center gap-1">Difficulty: {MOCK_VIDEOS[0].difficulty}</span>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-black text-gray-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory === 'All' ? 'Recommended for You' : `${activeCategory} Courses`}
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search videos, languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full sm:w-64 transition-all"
            />
          </div>
        </div>
        
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(video => (
              <div 
                key={video.id} 
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex flex-col"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative aspect-video overflow-hidden shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div className="h-full bg-green-600" style={{ width: `${video.progress}%` }}></div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-green-700 transition-colors">{video.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{video.category} • {video.language}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-medium mt-auto">
                    <span>{video.views} views</span>
                    <span>{video.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
            No courses found for this category yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );

  const renderVideoPlayer = () => (
    <div className="space-y-6 pb-20">
      <button 
        onClick={() => setActiveVideo(null)}
        className="text-sm font-bold text-gray-500 hover:text-green-600 flex items-center gap-1 mb-2"
      >
        ← Back to Learning Home
      </button>

      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
        <iframe 
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`} 
          title={activeVideo.title}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      <div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">{activeVideo.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium border-b border-gray-100 pb-4">
          <span>{activeVideo.views} views</span>
          <span>•</span>
          <span>{activeVideo.category}</span>
          <span>•</span>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{activeVideo.language}</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{activeVideo.difficulty}</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-slate-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
          <span className="text-green-600">✨</span> AI Summary
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          This video covers the fundamentals of identifying and treating {activeVideo.title.toLowerCase()}. 
          You will learn about the early warning signs, organic prevention methods, and chemical interventions if necessary. 
          The instructor emphasizes the importance of weekly monitoring.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full relative bg-white">
      
      {/* Mobile Drawer Overlay for Left Panel */}
      {isLeftOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setIsLeftOpen(false)} />
      )}

      {/* LEFT PANEL - Navigation */}
      <div className={`
        absolute md:relative z-40 md:z-auto h-full w-[280px] bg-slate-50 border-r border-gray-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isLeftOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-black text-gray-800 text-lg">Library</h2>
          <button className="md:hidden ml-2 p-2 text-gray-500" onClick={() => setIsLeftOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-hide">
          <button 
            onClick={() => { setActiveCategory('All'); setActiveVideo(null); setIsLeftOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${activeCategory === 'All' ? 'bg-green-50 text-green-700' : 'hover:bg-white text-gray-600'}`}
          >
            <PlayCircle className="w-5 h-5" /> Continue Learning
          </button>
          
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white text-gray-600 font-medium flex items-center gap-3 transition-colors">
            <Download className="w-5 h-5" /> Downloaded
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white text-gray-600 font-medium flex items-center gap-3 transition-colors">
            <Bookmark className="w-5 h-5" /> Bookmarks
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white text-gray-600 font-medium flex items-center gap-3 transition-colors">
            <Clock className="w-5 h-5" /> History
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white text-gray-600 font-medium flex items-center gap-3 transition-colors">
            <Award className="w-5 h-5" /> Certificates
          </button>

          <div className="pt-6 pb-2 px-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</h3>
          </div>
          {categories.slice(1).map(cat => (
            <button 
              key={cat} 
              onClick={() => { setActiveCategory(cat); setActiveVideo(null); setIsLeftOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium flex items-center gap-3 transition-colors text-sm ${activeCategory === cat ? 'bg-green-50 text-green-700' : 'hover:bg-white text-gray-600'}`}
            >
              <BookOpen className="w-4 h-4 text-gray-400" /> {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER PANEL - Main Content */}
      <div className="flex-1 flex flex-col bg-white relative min-w-0">
        {/* Mobile Header for Toggles */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm z-20 shrink-0">
          <button onClick={() => setIsLeftOpen(true)} className="p-2 -ml-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-800">Learning Center</span>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeVideo ? renderVideoPlayer() : renderVideoFeed()}
          </div>
        </div>
      </div>

    </div>
  );
}
