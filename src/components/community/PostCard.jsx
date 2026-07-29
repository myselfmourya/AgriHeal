import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, CheckCircle2 } from 'lucide-react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => setLiked(!liked);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Crop Care': return 'bg-green-100 text-green-700';
      case 'Success Story': return 'bg-yellow-100 text-yellow-700';
      case 'Farming Tip': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-gray-100" />
          <div>
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              {post.author}
              {post.author.includes('Expert') && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
            </h4>
            <p className="text-[11px] text-slate-500">{post.village} • {post.time}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
        {post.crop && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {post.crop}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <img src={post.images[0]} alt="Post media" className="w-full h-auto max-h-80 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-6">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-600">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600">
          <Share2 className="w-5 h-5" />
          <span>{post.shares || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt={comment.author} className="w-full h-full" />
              </div>
              <div className={`flex-1 rounded-2xl p-3 text-sm ${comment.isExpert ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-slate-800">{comment.author}</span>
                  {comment.isExpert && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                <p className="text-slate-700">{comment.text}</p>
              </div>
            </div>
          ))}
          
          {/* Add Comment */}
          <div className="flex gap-2 items-center mt-2">
            <div className="w-8 h-8 rounded-full bg-green-100 shrink-0 flex items-center justify-center">
              <span className="text-green-700 font-bold text-xs">RK</span>
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs hover:text-green-700 disabled:opacity-50" disabled={!commentText.trim()}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
