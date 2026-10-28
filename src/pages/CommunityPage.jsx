import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart, MessageCircle, Share2, MoreVertical, CheckCircle2,
  Search, Plus, X, Mic, Globe2, Users,
  MapPin, Calendar, Megaphone, HelpCircle,
  TrendingUp, Send, Image as ImageIcon
} from 'lucide-react';
import { useFarmer } from '../contexts/FarmerContext';
import { generateText } from '../services/aiProvider';
import { communityService } from '../services/communityService';
import { useVoiceActions } from '../hooks/useVoiceActions';

// ── Helpers ───────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const diffSec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

const CATEGORY_TYPE = {
  'Question': 'question', 'Crop Care': 'question', 'Pest & Disease': 'question',
  'Farming Tip': 'tip', 'Success Story': 'success', 'Market Prices': 'info',
};

function mapDbEventToUi(row) {
  const d = new Date(row.date);
  return {
    id: row.id,
    title: row.title,
    date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    location: row.location || 'TBA',
    type: row.type || 'Other',
    attendees: 0,
  };
}

function mapDbPostToUi(row) {
  const category = row.tags?.[0] || 'Question';
  return {
    id: row.id,
    isReal: true,
    authorId: row.author_id,
    author: row.author_name || 'Farmer',
    village: 'India',
    avatar: row.author_avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(row.author_name || 'Farmer')}`,
    time: timeAgo(row.created_at),
    category,
    crop: 'General',
    type: CATEGORY_TYPE[category] || 'question',
    content: row.content,
    images: row.image_url ? [row.image_url] : [],
    likes: row.likes || 0,
    comments: [],
    shares: 0,
  };
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SEED_POSTS = [
  {
    id: 1, author: 'Suresh Reddy', village: 'Narsampet, Telangana',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Suresh&backgroundColor=b6e3f4',
    time: '2h ago', category: 'Crop Care', crop: 'Paddy', type: 'question',
    content: 'My paddy is in the flowering stage. Should I apply potash now? Any tips for grain filling stage?',
    images: [], likes: 12, comments: [
      { id: 101, author: 'Ramesh Kumar', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Ramesh&backgroundColor=c0aede', text: 'Yes, apply MOP @ 10 kg/acre. It greatly improves grain weight.', isExpert: false },
      { id: 102, author: 'Dr. Venkat Rao', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=VenkatExpert&backgroundColor=d1f4d1', text: 'Maintain 2-3 cm water during flowering. Avoid any pesticide spray right now — it affects pollination.', isExpert: true }
    ], shares: 4
  },
  {
    id: 2, author: 'Kiran Bhai', village: 'Amreli, Gujarat',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Kiran&backgroundColor=ffdfbf',
    time: '5h ago', category: 'Success Story', crop: 'Cotton', type: 'success',
    content: "🎉 Best cotton yield in 10 years! Used organic compost + drip irrigation. 32 quintals/acre this season. Thanks to this community for the guidance!",
    images: [], likes: 89, comments: [], shares: 14
  },
  {
    id: 3, author: 'AgriHeal Experts', village: 'Official Channel',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=AgriHealOfficial&backgroundColor=b1f4c8',
    time: '1d ago', category: 'Farming Tip', crop: 'General', type: 'tip',
    content: '💧 WATER SAVING TIP: Mulching your vegetable beds reduces evaporation by up to 30% and suppresses weeds. Use dry paddy straw — it\'s free and effective!',
    images: [], likes: 143, comments: [
      { id: 103, author: 'Naresh', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Naresh2&backgroundColor=ffd5c8', text: 'Can we use coconut husks too?', isExpert: false },
      { id: 104, author: 'AgriHeal Experts', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=AgriHealOfficial&backgroundColor=b1f4c8', text: 'Absolutely! Coir pith is excellent mulching material — absorbs and retains moisture very well.', isExpert: true }
    ], shares: 32
  },
  {
    id: 4, author: 'Lakshmi Devi', village: 'Narsampet, Telangana',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Lakshmi&backgroundColor=ffd5e8',
    time: '2d ago', category: 'Pest & Disease', crop: 'Tomato', type: 'question',
    content: 'Yellow curling leaves on my tomatoes. Is this leaf curl virus? How to control it urgently?',
    images: [], likes: 27, comments: [
      { id: 105, author: 'Dr. Srinivas', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=DrSrinivas&backgroundColor=c8e6ff', text: 'Looks like Tomato Yellow Leaf Curl Virus (TYLCV) spread by whiteflies. Spray Imidacloprid 200 SL @ 0.3 ml/L immediately and remove infected plants.', isExpert: true }
    ], shares: 8
  },
  {
    id: 5, author: 'Venkat Rao', village: 'Gudur, AP',
    avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=VenkatFarmer&backgroundColor=ffe5b4',
    time: '3d ago', category: 'Market Prices', crop: 'Paddy', type: 'info',
    content: 'Paddy prices at Gudur APMC today: ₹2,200/quintal for Sona Masoori, ₹2,350 for BPT. Rates slightly up from last week. Good time to sell!',
    images: [], likes: 56, comments: [], shares: 21
  }
];

const GROUPS = [
  { id: 1, emoji: '🌾', name: 'Paddy Farmers India', members: '12.5k', desc: 'Best practices for rice cultivation across India' },
  { id: 2, emoji: '🌱', name: 'Organic Farming Network', members: '8.2k', desc: 'Chemical-free, sustainable farming techniques' },
  { id: 3, emoji: '🐄', name: 'Dairy & Livestock', members: '5.1k', desc: 'Cattle care, milk yield, animal health' },
  { id: 4, emoji: '🍅', name: 'Vegetable Growers', members: '6.4k', desc: 'Seasonal vegetables, pricing, market tips' },
  { id: 5, emoji: '📍', name: 'Telangana Kisan Sabha', members: '3.2k', desc: 'Local farmers network — Warangal & Karimnagar' },
  { id: 6, emoji: '🌿', name: 'Medicinal Plants', members: '1.8k', desc: 'Turmeric, Aloe vera, Ashwagandha cultivation' },
];

const EVENTS = [
  { id: 1, title: 'PM-Kisan Scheme Update Webinar', date: 'Sep 2, 2026', time: '10:00 AM', location: 'Online', type: 'Scheme', attendees: 1240 },
  { id: 2, title: 'Organic Farming Workshop — KVK', date: 'Sep 8, 2026', time: '9:00 AM', location: 'KVK Warangal', type: 'Workshop', attendees: 156 },
  { id: 3, title: 'Kharif Crop Awareness Meet', date: 'Sep 15, 2026', time: '11:00 AM', location: 'Gram Panchayat Hall', type: 'Meeting', attendees: 85 },
  { id: 4, title: 'Drip Irrigation Demo — Telangana', date: 'Sep 20, 2026', time: '2:00 PM', location: 'Field Demo Site', type: 'Demo', attendees: 210 },
];

const TYPE_COLOR = {
  'Crop Care':     'bg-green-100 text-green-700',
  'Pest & Disease':'bg-red-100 text-red-700',
  'Success Story': 'bg-yellow-100 text-yellow-700',
  'Farming Tip':   'bg-blue-100 text-blue-700',
  'Market Prices': 'bg-purple-100 text-purple-700',
  'Question':      'bg-gray-100 text-gray-600',
};

const EVENT_COLOR = {
  Scheme: 'bg-green-500', Workshop: 'bg-blue-500', Meeting: 'bg-purple-500',
  Demo: 'bg-orange-500', Market: 'bg-amber-500', Other: 'bg-gray-400',
};

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, authorName }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(!post.isReal);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [aiAnswering, setAiAnswering] = useState(false);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    if (post.isReal) {
      try {
        await communityService.toggleLike(post.id);
      } catch {
        // revert on failure (e.g. not signed in)
        setLiked(!next);
        setLikeCount(c => next ? c - 1 : c + 1);
      }
    }
  };

  const toggleComments = async () => {
    const opening = !showComments;
    setShowComments(opening);
    if (opening && post.isReal && !commentsLoaded) {
      const dbComments = await communityService.getComments(post.id);
      setComments(dbComments.map(c => ({
        id: c.id, author: c.is_ai ? 'Vani AI' : (c.author_name || 'Farmer'),
        isExpert: c.is_ai,
        avatar: c.is_ai
          ? 'https://api.dicebear.com/7.x/thumbs/svg?seed=VaniAI&backgroundColor=b1f4c8'
          : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(c.author_name || 'Farmer')}`,
        text: c.content,
      })));
      setCommentsLoaded(true);
    }
  };

  const handleAskAI = async () => {
    setAiAnswering(true);
    setShowComments(true);
    const avatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=VaniAI&backgroundColor=b1f4c8';
    try {
      const reply = await generateText(
        `A farmer asks: "${post.content}"\n\nGive a concise, practical answer in 2-3 sentences as an agricultural expert. Focus on actionable advice.`,
        'You are an expert Indian agricultural advisor. Give specific, practical advice for Indian farmers.'
      );
      setComments(prev => [...prev, { id: Date.now(), author: 'Vani AI', isExpert: true, avatar, text: reply }]);
      if (post.isReal) communityService.addComment(post.id, reply, { isAi: true }).catch(() => {});
    } catch {
      setComments(prev => [...prev, { id: Date.now(), author: 'Vani AI', isExpert: true, avatar, text: 'Unable to get AI response at this time. Please try again.' }]);
    }
    setAiAnswering(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setCommentText('');
    setShowComments(true);
    setComments(prev => [...prev, {
      id: Date.now(), author: 'You', isExpert: false,
      avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=You&backgroundColor=ffdfbf',
      text
    }]);
    if (post.isReal) {
      try { await communityService.addComment(post.id, text, { authorName: authorName || 'You' }); } catch { /* insert failed; comment stays local-only */ }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                {post.author}
                {(post.author.includes('Expert') || post.author.includes('Dr.') || post.author === 'AgriHeal Experts') &&
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
              </h4>
              <p className="text-[11px] text-slate-400">{post.village} · {post.time}</p>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-500"><MoreVertical className="w-4 h-4" /></button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${TYPE_COLOR[post.category] || TYPE_COLOR.Question}`}>
            {post.category}
          </span>
          {post.crop && post.crop !== 'General' && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
              🌿 {post.crop}
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-slate-700 leading-relaxed mb-3">{post.content}</p>

        {/* Images */}
        {post.images?.length > 0 && (
          <div className="mb-3 rounded-xl overflow-hidden">
            <img src={post.images[0]} alt="post" className="w-full h-auto max-h-64 object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <button onClick={toggleComments} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-green-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>
            {post.type === 'question' && (
              <button onClick={handleAskAI} disabled={aiAnswering} className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-2.5 py-1 rounded-full transition-colors disabled:opacity-60">
                {aiAnswering ? '...' : '✨ Ask AI'}
              </button>
            )}
          </div>
          <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>{post.shares}</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="bg-gray-50/80 border-t border-gray-100 p-4 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2.5">
              <img src={c.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${c.author}`} alt={c.author}
                className="w-7 h-7 rounded-full bg-gray-100 border border-gray-100 shrink-0" />
              <div className={`flex-1 rounded-2xl p-3 text-sm ${c.isExpert ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'}`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-slate-800 text-xs">{c.author}</span>
                  {c.isExpert && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 items-center mt-2">
            <div className="w-7 h-7 rounded-full bg-green-500 shrink-0 flex items-center justify-center text-white text-[10px] font-black">Y</div>
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full overflow-hidden pr-1">
              <input
                type="text" placeholder="Write a comment..."
                value={commentText} onChange={e => setCommentText(e.target.value)}
                className="flex-1 text-xs py-2 pl-3 focus:outline-none bg-transparent"
              />
              <button type="submit" disabled={!commentText.trim()} className="p-1.5 bg-green-500 text-white rounded-full disabled:opacity-40 hover:bg-green-600 transition-colors">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Create Post Modal ─────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onCreated, authorName }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Question');
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);
  const cats = ['Question', 'Crop Care', 'Pest & Disease', 'Farming Tip', 'Success Story', 'Market Prices'];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5MB.');
      return;
    }
    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await communityService.uploadPostImage(imageFile);
      }
      const row = await communityService.createPost(content.trim(), category, { authorName: authorName || 'Farmer', imageUrl });
      onCreated(mapDbPostToUi(row));
    } catch (err) {
      console.error('Falling back to local-only post:', err);
      onCreated({
        id: Date.now(), isReal: false, author: authorName || 'You', village: 'Your Location',
        avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=You&backgroundColor=ffdfbf`,
        time: 'Just now', category, crop: 'General', type: CATEGORY_TYPE[category] || 'question',
        content: content.trim(), images: imagePreview ? [imagePreview] : [], likes: 0, comments: [], shares: 0
      });
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full md:w-[560px] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col max-h-[88vh]" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="font-black text-slate-800 text-lg">Create Post</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 mb-4">
            <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=You&backgroundColor=ffdfbf`} className="w-11 h-11 rounded-full border border-gray-100" alt="You" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{authorName || 'You'}</h4>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                <Globe2 className="w-3 h-3" /> Public · All farmers
              </div>
            </div>
          </div>
          <textarea
            placeholder="What's on your mind? Ask a question, share a tip, or celebrate a success..."
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-28 text-sm resize-none focus:outline-none placeholder:text-gray-400 text-slate-700 bg-transparent"
            autoFocus
          />
          <div className="mt-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {cats.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${category === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {imagePreview && (
            <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-100 w-fit">
              <img src={imagePreview} alt="Selected" className="max-h-48 object-cover" />
              <button onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {imageError && <p className="text-xs text-red-500 mt-2">{imageError}</p>}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs text-gray-500">
              <ImageIcon className="w-4 h-4 text-blue-400" />
            </button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs text-gray-500" title="Voice input coming soon">
              <Mic className="w-4 h-4 text-red-400" />
            </button>
          </div>
          <button onClick={handlePost} disabled={!content.trim() || submitting}
            className="px-8 py-2.5 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm transition-colors">
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Feed Tab ──────────────────────────────────────────────────────────────────
function FeedTab({ posts, loading, usingSample, onCreatePost, authorName }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const cats = ['All', 'Crop Care', 'Pest & Disease', 'Farming Tip', 'Success Story', 'Market Prices', 'Question'];

  const filtered = posts.filter(p => {
    const matchCat = filter === 'All' || p.category === filter;
    const matchSearch = !search || p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) || p.crop.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {usingSample && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-medium">
          <span>⚠️</span>
          <span>No community posts yet — showing sample content. Be the first to post!</span>
        </div>
      )}
      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search posts, crops, or farmers..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${filter === c ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Write a Post prompt */}
      <button onClick={onCreatePost} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left flex items-center gap-3 hover:border-green-200 transition-colors">
        <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=You&backgroundColor=ffdfbf`} className="w-10 h-10 rounded-full" alt="" />
        <span className="text-sm text-gray-400 flex-1">Share a tip, ask a question, celebrate a win...</span>
        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">Post</span>
      </button>

      {/* Posts */}
      <div className="space-y-3">
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">Loading posts…</div>
        )}
        {!loading && filtered.map(p => (
          <PostCard key={p.id} post={p} authorName={authorName} />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-500">No posts found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different filter or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Groups Tab ────────────────────────────────────────────────────────────────
function GroupsTab() {
  const [groups, setGroups] = useState([]);
  const [joined, setJoined] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [dbGroups, myGroupIds] = await Promise.all([
        communityService.getGroups(),
        communityService.getMyGroupIds(),
      ]);
      if (!active) return;
      if (dbGroups.length > 0) {
        setGroups(dbGroups);
        setUsingSample(false);
      } else {
        setGroups(GROUPS);
        setUsingSample(true);
      }
      setJoined(new Set(myGroupIds));
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const totalMembers = groups.reduce((sum, g) => sum + (typeof g.members === 'number' ? g.members : 0), 0);

  const toggleJoin = async (g) => {
    const isJoined = joined.has(g.id);
    setJoined(prev => { const s = new Set(prev); isJoined ? s.delete(g.id) : s.add(g.id); return s; });
    if (usingSample) return; // sample groups have no real id to persist against
    try {
      if (isJoined) await communityService.leaveGroup(g.id);
      else await communityService.joinGroup(g.id);
    } catch {
      setJoined(prev => { const s = new Set(prev); isJoined ? s.add(g.id) : s.delete(g.id); return s; });
    }
  };

  useVoiceActions([
    {
      id: 'community.joinGroup',
      description: 'Join or leave a discussion group, by its name',
      params: { groupName: 'string, required — e.g. "Paddy Farmers India"' },
      destructive: false,
      handler: async ({ groupName }) => {
        const match = groups.find((g) => g.name.toLowerCase() === String(groupName || '').toLowerCase());
        if (!match) throw new Error(`I couldn't find a group named ${groupName}.`);
        const wasJoined = joined.has(match.id);
        await toggleJoin(match);
        return wasJoined ? `Left ${match.name}.` : `Joined ${match.name}.`;
      },
    },
  ], [groups, joined, usingSample]);

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white">
        <h3 className="font-black text-lg">Discussion Groups</h3>
        <p className="text-green-100 text-sm mt-1">Join groups to connect with farmers who grow the same crops</p>
        <div className="flex gap-4 mt-4 text-center">
          <div><p className="font-black text-2xl">{groups.length}</p><p className="text-green-100 text-xs">Groups</p></div>
          <div><p className="font-black text-2xl">{totalMembers}</p><p className="text-green-100 text-xs">Members</p></div>
          <div><p className="font-black text-2xl">{joined.size}</p><p className="text-green-100 text-xs">Joined</p></div>
        </div>
      </div>
      {usingSample && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-medium">
          <span>⚠️</span><span>Couldn't load real groups — showing sample content.</span>
        </div>
      )}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">Loading groups…</div>
      )}
      {!loading && groups.map(g => (
        <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl shrink-0">{g.emoji}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm">{g.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{g.desc}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Users className="w-3 h-3" />{g.members} {g.members === 1 ? 'member' : 'members'}</p>
          </div>
          <button
            onClick={() => toggleJoin(g)}
            className={`text-xs font-black px-4 py-2 rounded-xl shrink-0 transition-colors ${joined.has(g.id) ? 'bg-gray-100 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}>
            {joined.has(g.id) ? 'Joined ✓' : 'Join'}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Q&A Tab ───────────────────────────────────────────────────────────────────
function QATab() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [asked, setAsked] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    const q = question.trim();
    setQuestion('');
    try {
      const resp = await generateText(
        `A farmer in India asks: "${q}"\n\nGive a practical, detailed answer in 3-5 sentences. Include specific product names, quantities, or timings if applicable.`,
        'You are an expert Indian agricultural scientist and advisor. Give specific, actionable advice suitable for Indian farming conditions.'
      );
      setAnswer(resp);
      setAsked(prev => [{ id: Date.now(), q, a: resp }, ...prev].slice(0, 5));
    } catch {
      setAnswer('Unable to get AI response. Please check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-black text-lg">Vani AI Diagnosis</h3>
        </div>
        <p className="text-blue-100 text-sm">Ask any farming question — get an expert AI answer instantly</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <textarea
          placeholder="Describe your problem... e.g. 'My tomato leaves are turning yellow from the bottom. What should I do?'"
          value={question} onChange={e => setQuestion(e.target.value)}
          className="w-full h-24 text-sm resize-none focus:outline-none placeholder:text-gray-400 text-slate-700 bg-transparent border-b border-gray-100 pb-3 mb-3"
        />
        <button onClick={handleAsk} disabled={!question.trim() || loading}
          className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4" />Get AI Answer</>}
        </button>
      </div>

      {answer && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <div>
              <h4 className="font-black text-blue-900 text-sm">Vani AI Expert Answer</h4>
              <p className="text-blue-400 text-[10px]">Powered by Mistral AI</p>
            </div>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{answer}</p>
        </div>
      )}

      {asked.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Recent Questions</h3>
          <div className="space-y-3">
            {asked.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm font-bold text-slate-800 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />{item.q}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nearby Farmers Tab ────────────────────────────────────────────────────────
function mapDbFarmerToUi(row) {
  return {
    id: row.id,
    name: row.full_name || 'Farmer',
    village: row.village || row.district || row.state || 'India',
    exp: row.experience_years ? `${row.experience_years} yrs` : null,
    phone: row.phone || null,
    avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(row.full_name || row.id)}`,
  };
}

function FarmersTab() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    communityService.getFarmers().then(rows => {
      if (!active) return;
      setFarmers(rows.map(mapDbFarmerToUi));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white">
        <h3 className="font-black text-lg">Farmers Directory</h3>
        <p className="text-purple-100 text-sm mt-1">Other AgriHeal farmers you can reach out to</p>
      </div>
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">Loading farmers…</div>
      )}
      {!loading && farmers.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-bold text-gray-500">No other farmers yet</p>
          <p className="text-xs text-gray-400 mt-1">This directory fills up as more farmers join AgriHeal</p>
        </div>
      )}
      {!loading && farmers.map(f => (
        <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full border border-gray-100" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm">{f.name}</h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{f.village}</p>
            {f.exp && <p className="text-[10px] text-slate-400 mt-1">{f.exp} experience</p>}
          </div>
          {f.phone ? (
            <a href={`tel:${f.phone}`} className="text-xs font-black text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors shrink-0">
              Call
            </a>
          ) : (
            <span className="text-xs font-bold text-gray-300 px-3 py-1.5 shrink-0">No phone</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Events Tab ────────────────────────────────────────────────────────────────
function EventsTab({ events, loading, usingSample }) {
  const [registered, setRegistered] = useState(new Set());

  useEffect(() => {
    communityService.getMyEventRegistrations().then(ids => setRegistered(new Set(ids)));
  }, []);

  const toggleRegister = async (e) => {
    const id = String(e.id);
    const wasRegistered = registered.has(id);
    setRegistered(prev => { const s = new Set(prev); wasRegistered ? s.delete(id) : s.add(id); return s; });
    try {
      if (wasRegistered) await communityService.unregisterFromEvent(id);
      else await communityService.registerForEvent(id);
    } catch {
      setRegistered(prev => { const s = new Set(prev); wasRegistered ? s.add(id) : s.delete(id); return s; });
    }
  };

  useVoiceActions([
    {
      id: 'community.registerForEvent',
      description: 'Register or unregister for an upcoming community event, by its title',
      params: { eventTitle: 'string, required — e.g. "Organic Farming Workshop"' },
      destructive: false,
      handler: async ({ eventTitle }) => {
        const match = events.find((e) => e.title.toLowerCase().includes(String(eventTitle || '').toLowerCase()));
        if (!match) throw new Error(`I couldn't find an event matching "${eventTitle}".`);
        const wasRegistered = registered.has(String(match.id));
        await toggleRegister(match);
        return wasRegistered ? `Unregistered from ${match.title}.` : `Registered for ${match.title}.`;
      },
    },
  ], [events, registered]);

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white">
        <h3 className="font-black text-lg">Upcoming Events</h3>
        <p className="text-orange-100 text-sm mt-1">Workshops, webinars, and farmer meets near you</p>
      </div>
      {usingSample && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-medium">
          <span>⚠️</span><span>No events posted yet — showing sample events.</span>
        </div>
      )}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">Loading events…</div>
      )}
      {!loading && events.map(e => (
        <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className={`h-1.5 ${EVENT_COLOR[e.type] || 'bg-gray-400'}`} />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${EVENT_COLOR[e.type]}`}>{e.type}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{e.title}</h4>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-green-500" />{e.date} · {e.time}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-400" />{e.location}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{e.attendees.toLocaleString()} registered</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleRegister(e)}
              className={`mt-3 w-full py-2.5 rounded-xl text-xs font-black transition-colors ${registered.has(String(e.id)) ? 'bg-gray-100 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}>
              {registered.has(String(e.id)) ? '✓ Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Community Page ───────────────────────────────────────────────────────
export default function CommunityPage() {
  const { profile } = useFarmer();
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreate, setShowCreate] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [usingSamplePosts, setUsingSamplePosts] = useState(false);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [usingSampleEvents, setUsingSampleEvents] = useState(false);

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const data = await communityService.getPosts();
      if (data && data.length > 0) {
        setPosts(data.map(mapDbPostToUi));
        setUsingSamplePosts(false);
      } else {
        setPosts(SEED_POSTS);
        setUsingSamplePosts(true);
      }
    } catch {
      setPosts(SEED_POSTS);
      setUsingSamplePosts(true);
    }
    setPostsLoading(false);
  }, []);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const data = await communityService.getEvents();
      if (data && data.length > 0) {
        setEvents(data.map(mapDbEventToUi));
        setUsingSampleEvents(false);
      } else {
        setEvents(EVENTS);
        setUsingSampleEvents(true);
      }
    } catch {
      setEvents(EVENTS);
      setUsingSampleEvents(true);
    }
    setEventsLoading(false);
  }, []);

  useEffect(() => { loadPosts(); loadEvents(); }, [loadPosts, loadEvents]);

  const tabs = [
    { id: 'feed',    label: 'Feed',    icon: TrendingUp },
    { id: 'groups',  label: 'Groups',  icon: Users },
    { id: 'qa',      label: 'Ask AI',  icon: Sparkles },
    { id: 'farmers', label: 'Connect', icon: MapPin },
    { id: 'events',  label: 'Events',  icon: Megaphone },
  ];

  const handleCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setUsingSamplePosts(false);
    setActiveTab('feed');
  };

  useVoiceActions([
    {
      id: 'community.switchTab',
      description: 'Switch which section of the Community page is shown: Feed, Groups, Ask AI, Connect (farmers), or Events',
      params: { tab: 'one of: "feed", "groups", "qa", "farmers", "events"' },
      destructive: false,
      handler: ({ tab }) => {
        const match = tabs.find((t) => t.id === String(tab || '').toLowerCase());
        if (!match) throw new Error(`I don't have a "${tab}" section here.`);
        setActiveTab(match.id);
        return `Showing ${match.label}.`;
      },
    },
    {
      id: 'community.createPost',
      description: 'Create and publish a new community post with the given text content, and an optional category',
      params: {
        content: 'string, required — the full text of the post',
        category: 'optional — one of: "Question", "Crop Care", "Pest & Disease", "Farming Tip", "Success Story", "Market Prices". Defaults to "Question"',
      },
      destructive: true, // a real "submit" action that publishes publicly — confirm first
      handler: async ({ content, category }) => {
        if (!content) throw new Error('No post content given.');
        const cat = category || 'Question';
        const row = await communityService.createPost(content, cat, { authorName: profile?.name || 'Farmer' });
        handleCreated(mapDbPostToUi(row));
        return 'Posted to the community feed.';
      },
    },
  ], [profile?.name]);

  return (
    <div className="min-h-full bg-[#f4f7f5] pb-24 md:pb-12 relative">
      {/* Header */}
      <div className="bg-white px-4 md:px-8 py-5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Community</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Connect · Share · Grow Together</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-green-50 border border-green-100 px-3 py-2 rounded-xl">
            <Users className="w-4 h-4 text-green-600" />
            <span className="font-bold text-green-700">45k+ Farmers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 py-3.5 px-2 border-b-2 text-sm font-bold whitespace-nowrap transition-colors shrink-0 ${active ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-300'}`} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-5 w-full">
        {activeTab === 'feed'    && <FeedTab posts={posts} loading={postsLoading} usingSample={usingSamplePosts} onCreatePost={() => setShowCreate(true)} authorName={profile?.name} />}
        {activeTab === 'groups'  && <GroupsTab />}
        {activeTab === 'qa'      && <QATab />}
        {activeTab === 'farmers' && <FarmersTab />}
        {activeTab === 'events'  && <EventsTab events={events} loading={eventsLoading} usingSample={usingSampleEvents} />}
      </div>

      {/* FAB */}
      {activeTab === 'feed' && (
        <button onClick={() => setShowCreate(true)}
          className="fixed bottom-20 right-5 md:bottom-10 md:right-10 bg-green-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-green-700 z-30 flex items-center justify-center transition-all hover:scale-105">
          <Plus className="w-6 h-6" />
        </button>
      )}

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={handleCreated} authorName={profile?.name} />}
    </div>
  );
}

// Re-export Sparkles for use in QA tab's handleAsk  
function Sparkles({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
