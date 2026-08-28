import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import PostCard from './PostCard';
import { MOCK_POSTS } from './communityData';
import { supabase } from '../../lib/supabase';

export default function CommunityFeed() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Crop Care', 'Pest & Disease', 'Farming Tip', 'Success Story', 'Question'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select(`
            *,
            farmers(full_name, village)
          `)
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) {
          const mappedPosts = data.map(post => ({
            id: post.id,
            author: post.farmers?.full_name || 'Anonymous',
            village: post.farmers?.village || 'Unknown',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.farmers?.full_name || 'A'}`,
            time: new Date(post.created_at).toLocaleDateString(),
            type: post.type || 'question',
            category: post.category || 'General',
            crop: post.crop || 'General',
            content: post.content,
            images: post.images || [],
            likes: post.likes || 0,
            comments: [],
            shares: post.shares || 0
          }));
          setPosts(mappedPosts);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.error("Error fetching community posts:", err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'All' || post.category === filter;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.crop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search posts, crops, or farmers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filter === cat ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">No posts found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
