import React from 'react';
import { Users, PlusCircle } from 'lucide-react';
import { MOCK_GROUPS } from './communityData';

export default function DiscussionGroups() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">Your Groups</h2>
          <p className="text-sm text-slate-500 mt-1">Join groups to discuss specific crops or farming methods.</p>
        </div>
        <button className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-colors">
          <PlusCircle className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Group List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_GROUPS.map(group => (
          <div key={group.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-green-200 transition-colors group cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              {group.image}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-green-700 transition-colors">{group.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {group.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">{group.members} members</span>
                </div>
                <button className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Card */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">Don't see your local group?</h3>
          <p className="text-sm text-slate-600">Start a new group for your village or specific farming interest.</p>
        </div>
        <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-orange-200 text-orange-600 font-bold rounded-xl text-sm shadow-sm hover:bg-orange-50 transition-colors">
          Create New Group
        </button>
      </div>
    </div>
  );
}
