import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVani } from '../contexts/VaniContext';
import { useFarmer } from '../contexts/FarmerContext';
import { 
  Bell, Volume2, X, Plus, Calendar, AlertTriangle, 
   Leaf, Activity, Shield, TrendingUp, CloudRain, 
  FileText, CheckCircle2, Pencil
} from 'lucide-react';

const getIconForCategory = (category, type) => {
  if (type === 'Alert' || type === 'Critical') return <AlertTriangle className="text-red-600" size={24} />;
  if (type === 'Warning') return <AlertTriangle className="text-amber-600" size={24} />;
  
  switch (category) {
    case 'Crop': return <Leaf className="text-emerald-600" size={24} />;
    case 'Livestock': return <Activity className="text-blue-600" size={24} />;
    case 'Health': return <Shield className="text-rose-600" size={24} />;
    case 'Market': return <TrendingUp className="text-emerald-600" size={24} />;
    case 'Weather': return <CloudRain className="text-sky-600" size={24} />;
    case 'Schemes': return <FileText className="text-purple-600" size={24} />;
    case 'Reminders': return <Calendar className="text-indigo-600" size={24} />;
    default: return <Bell className="text-zinc-600" size={24} />;
  }
};

const getBgForCategory = (category, type) => {
  if (type === 'Alert' || type === 'Critical') return 'bg-red-100';
  if (type === 'Warning') return 'bg-amber-100';
  
  switch (category) {
    case 'Crop': return 'bg-emerald-100';
    case 'Livestock': return 'bg-blue-100';
    case 'Health': return 'bg-rose-100';
    case 'Market': return 'bg-emerald-100';
    case 'Weather': return 'bg-sky-100';
    case 'Schemes': return 'bg-purple-100';
    case 'Reminders': return 'bg-indigo-100';
    default: return 'bg-zinc-100';
  }
};

const getBadgeColor = (type) => {
  switch (type) {
    case 'Critical':
    case 'Alert': return 'bg-red-50 text-red-700 border-red-200';
    case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Reminder': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Market': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Info':
    default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

export default function Notifications() {
  const { speak } = useVani();
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    addNotification, 
    updateNotification, 
    deleteNotification 
  } = useFarmer();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());

  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; 
    const startOfWeek = new Date(d.setDate(diff));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startOfWeek);
      nextDate.setDate(startOfWeek.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  const weekDates = getWeekDates(calendarDate);
  const displayedMonth = weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevWeek = () => {
    setCalendarDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
  };
  const handleNextWeek = () => {
    setCalendarDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
  };
  
  // Default datetime for new reminder is 1 hour from now
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    // Format YYYY-MM-DDTHH:MM for input[type="datetime-local"]
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [newReminder, setNewReminder] = useState({ 
    title: '', 
    message: '', 
    category: 'Reminders',
    scheduledTime: getDefaultDateTime()
  });
  
  const filters = ['All', 'Crop', 'Livestock', 'Health', 'Market', 'Weather', 'Schemes', 'Reminders'];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Reminders') {
      if (n.type !== 'Reminder') return false;
      const taskDate = new Date(n.scheduledTime);
      return taskDate.toDateString() === selectedDate.toDateString();
    }
    return n.category === activeFilter;
  });

  const handleSpeak = (title, message, id) => {
    speak(`${title}. ${message}`);
    markNotificationRead(id);
  };

  const handleEdit = (e, notif) => {
    e.stopPropagation();
    setEditingId(notif.id);
    let dt = getDefaultDateTime();
    if (notif.scheduledTime) {
       const d = new Date(notif.scheduledTime);
       dt = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    setNewReminder({
      title: notif.title,
      message: notif.message || '',
      category: notif.category,
      scheduledTime: dt
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewReminder({ 
      title: '', 
      message: '', 
      category: 'Reminders',
      scheduledTime: getDefaultDateTime()
    });
    setIsModalOpen(true);
  };

  const handleSaveReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title) return;
    
    // Parse scheduledTime string back to ISO
    const scheduledDate = new Date(newReminder.scheduledTime).toISOString();

    if (editingId) {
      updateNotification(editingId, {
        title: newReminder.title,
        message: newReminder.message || 'Custom reminder',
        category: newReminder.category,
        scheduledTime: scheduledDate
      });
    } else {
      addNotification({
        title: newReminder.title,
        message: newReminder.message || 'Custom reminder',
        type: 'Reminder',
        category: newReminder.category,
        time: 'Just now', // Display string, could be formatted differently
        scheduledTime: scheduledDate
      });
    }
    
    setIsModalOpen(false);
  };

  const grouped = filteredNotifications.reduce((acc, notif) => {
    const group = notif.group || 'Earlier';
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const groups = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  // Add groups that might not be in the hardcoded list
  Object.keys(grouped).forEach(g => {
    if (!groups.includes(g)) groups.push(g);
  });

  return (
    <div className="page-content px-4 md:px-8 pt-6 w-full min-h-screen">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 min-h-[calc(100vh-120px)] flex flex-col overflow-hidden relative mb-10 p-6 md:p-10">
        <div className="w-full max-w-5xl mx-auto pb-32 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3">
            Alerts & Reminders
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Stay updated with critical alerts and your scheduled tasks.</p>
        </div>
        <button 
          onClick={markAllNotificationsRead} 
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors"
        >
          <CheckCircle2 size={18} />
          Mark All Read
        </button>
      </div>

      <button 
        onClick={markAllNotificationsRead} 
        className="md:hidden w-full flex justify-center items-center gap-2 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors mb-4"
      >
        <CheckCircle2 size={18} />
        Mark All Read
      </button>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2 mb-6">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeFilter === f 
                ? 'bg-zinc-900 text-white shadow-md' 
                : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {activeFilter === 'Reminders' && (
        <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-zinc-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-zinc-900 text-lg">{displayedMonth}</h3>
            <div className="flex gap-2">
              <button onClick={handlePrevWeek} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button onClick={handleNextWeek} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-zinc-400 font-bold mb-3 w-full">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 text-center w-full gap-2">
            {weekDates.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={idx} className="flex justify-center">
                  <button 
                    onClick={() => setSelectedDate(date)}
                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl transition-all font-bold text-sm md:text-base ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md' : 
                      isToday ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-zinc-100 text-zinc-700 bg-zinc-50/50'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-zinc-400" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900 mb-2">You're all caught up!</h3>
          <p className="text-zinc-500">No new notifications in this category.</p>
        </div>
      ) : (
        groups.map(group => grouped[group] && grouped[group].length > 0 && (
          <div key={group} className="mb-8">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 ml-2">
              {group}
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {grouped[group].map((n, i) => (
                  <motion.div 
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={(e) => {
                      if (n.type === 'Reminder') {
                        handleEdit(e, n);
                      } else {
                        markNotificationRead(n.id);
                      }
                    }}
                    className={`
                      relative p-5 rounded-2xl md:rounded-[24px] border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-start gap-4 md:gap-5
                      ${n.unread ? 'bg-white shadow-md border-indigo-100 ring-1 ring-indigo-50' : 'bg-white/60 shadow-sm border-zinc-100 hover:bg-white'}
                    `}
                  >
                    {/* Unread Indicator */}
                    {n.unread && (
                      <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgForCategory(n.category, n.type)}`}>
                      {getIconForCategory(n.category, n.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1 sm:gap-4">
                        <h4 className={`text-lg m-0 leading-tight ${n.unread ? 'font-extrabold text-zinc-900' : 'font-bold text-zinc-700'}`}>
                          {n.title}
                        </h4>
                        <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap shrink-0">
                          {n.scheduledTime ? new Date(n.scheduledTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : n.time}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-4 leading-relaxed ${n.unread ? 'text-zinc-600 font-medium' : 'text-zinc-500'}`}>
                        {n.message}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeColor(n.type)}`}>
                          {n.type}
                        </span>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          {n.type === 'Reminder' && (
                            <button 
                              className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              onClick={(e) => handleEdit(e, n)}
                              title="Edit Reminder"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          <button 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleSpeak(n.title, n.message, n.id); }}
                          >
                            <Volume2 size={16} /> Listen
                          </button>
                          <button 
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                            aria-label="Dismiss notification"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-6 right-6 md:right-8 bg-zinc-900 text-white w-14 h-14 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center z-40"
        onClick={openAddModal}
      >
        <Plus size={28} />
      </button>

      {/* Add/Edit Reminder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-white"
            >
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">{editingId ? 'Edit Reminder' : 'Add Reminder'}</h2>
              <form onSubmit={handleSaveReminder} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="E.g., Buy seeds"
                    className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Details (Optional)</label>
                  <input 
                    type="text" 
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                    placeholder="Extra details..."
                    className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Category</label>
                  <select 
                    value={newReminder.category}
                    onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                    className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium appearance-none"
                  >
                    <option value="Crop">Crop</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Health">Health</option>
                    <option value="Market">Market</option>
                    <option value="Weather">Weather</option>
                    <option value="Schemes">Schemes</option>
                    <option value="Reminders">General Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Date & Time</label>
                  <div className="flex gap-3">
                    <input 
                      type="date" 
                      value={newReminder.scheduledTime.split('T')[0]}
                      onChange={(e) => {
                        const time = newReminder.scheduledTime.split('T')[1];
                        setNewReminder({ ...newReminder, scheduledTime: `${e.target.value}T${time}` });
                      }}
                      className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium"
                      required
                    />
                    <input 
                      type="time" 
                      value={newReminder.scheduledTime.split('T')[1]}
                      onChange={(e) => {
                        const date = newReminder.scheduledTime.split('T')[0];
                        setNewReminder({ ...newReminder, scheduledTime: `${date}T${e.target.value}` });
                      }}
                      className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    className="flex-1 py-3.5 bg-zinc-100 text-zinc-700 font-bold rounded-xl hover:bg-zinc-200 transition-all"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-md"
                  >
                    {editingId ? 'Save Changes' : 'Save Reminder'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
