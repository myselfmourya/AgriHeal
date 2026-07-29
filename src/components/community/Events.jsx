import React from 'react';
import { Calendar, Clock, MapPin, Users, Megaphone, ArrowRight } from 'lucide-react';
import { MOCK_EVENTS } from './communityData';

export default function Events() {
  const getEventIcon = (type) => {
    switch (type) {
      case 'Scheme':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      case 'Workshop':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'Meeting':
      default:
        return <Calendar className="w-5 h-5 text-orange-600" />;
    }
  };

  const getEventBg = (type) => {
    switch (type) {
      case 'Scheme':
        return 'bg-blue-100';
      case 'Workshop':
        return 'bg-green-100';
      case 'Meeting':
      default:
        return 'bg-orange-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with upcoming badge */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Community Events</h2>
          <p className="text-gray-500 text-sm mt-1">Discover workshops, scheme launches, and farmer meets.</p>
        </div>
        <button className="hidden md:flex bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
          Host an Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_EVENTS.map(event => (
          <div key={event.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-300 transition-colors group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getEventBg(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                {event.type}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
            
            <div className="space-y-2 mt-auto pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Event${event.id}${i}`} alt="Attendee" className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                  ))}
                </div>
                <span className="text-gray-500 font-medium">+{event.attendees} going</span>
              </div>
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-green-600 group-hover:text-white transition-colors text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
