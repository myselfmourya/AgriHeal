import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Image as ImageIcon, Mic, FileText, Menu, X, Send, Trash2, Edit2, Paperclip } from 'lucide-react';
import { RECENT_CHATS, MOCK_FARM_CONTEXT } from './aiLearningData';

export default function AssistantMode() {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [chatHistory, setChatHistory] = useState(RECENT_CHATS);

  // Dummy messages for UI
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello Mourya! I see your paddy crop is entering the flowering stage. The weather today is 28°C and partly cloudy. How can I assist you today?' }
  ]);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newUserMsg = { id: Date.now(), type: 'user', text: inputText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');

    // Simulate Vani typing and responding
    setTimeout(() => {
      const newBotMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'That is a great question. Based on your current crop stage, I recommend maintaining water levels at 2-3 cm and ensuring there is no pest infestation. Would you like me to create a detailed schedule?' 
      };
      setMessages(prev => [...prev, newBotMsg]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([
      { id: Date.now(), type: 'bot', text: `Hello Mourya! I see your ${MOCK_FARM_CONTEXT.cropType} crop is entering the flowering stage. The weather today is ${MOCK_FARM_CONTEXT.weather.temp} and partly cloudy. How can I assist you today?` }
    ]);
    if (window.innerWidth < 768) {
      setIsLeftOpen(false);
    }
  };

  const loadChat = (title) => {
    setMessages([
      { id: Date.now(), type: 'user', text: `Can we talk about ${title}?` },
      { id: Date.now() + 1, type: 'bot', text: `Of course! What would you like to know about ${title}?` }
    ]);
    if (window.innerWidth < 768) {
      setIsLeftOpen(false);
    }
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(c => c.id !== id));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <div className="flex w-full h-full relative bg-white">
      
      {/* Mobile Drawer Overlay for Left Panel */}
      {isLeftOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setIsLeftOpen(false)} />
      )}

      {/* LEFT PANEL - Chat History */}
      <div className={`
        absolute md:relative z-40 md:z-auto h-full w-[280px] bg-slate-50 border-r border-gray-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isLeftOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={startNewChat}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> New Chat
          </button>
          <button className="md:hidden ml-2 p-2 text-gray-500" onClick={() => setIsLeftOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">


          {/* Chat Groups */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Today</h3>
            <div className="space-y-1">
              {chatHistory.filter(c => c.date.includes('Today')).map(chat => (
                <div key={chat.id} className="group relative">
                  <button 
                    onClick={() => loadChat(chat.title)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm text-sm text-gray-700 flex items-center gap-3 transition-all pr-10"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    <span className="truncate flex-1 font-medium">{chat.title}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm px-1 rounded">
                    <button className="p-1 text-gray-400 hover:text-blue-600 rounded"><Edit2 className="w-3 h-3" /></button>
                    <button onClick={(e) => deleteChat(e, chat.id)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Yesterday</h3>
            <div className="space-y-1">
              {chatHistory.filter(c => !c.date.includes('Today')).map(chat => (
                <div key={chat.id} className="group relative">
                  <button 
                    onClick={() => loadChat(chat.title)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm text-sm text-gray-700 flex items-center gap-3 transition-all pr-10"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    <span className="truncate flex-1 font-medium">{chat.title}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm px-1 rounded">
                    <button className="p-1 text-gray-400 hover:text-blue-600 rounded"><Edit2 className="w-3 h-3" /></button>
                    <button onClick={(e) => deleteChat(e, chat.id)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANEL - Chat Workspace */}
      <div className="flex-1 flex flex-col bg-white relative min-w-0">
        {/* Mobile Header for Toggles */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm z-20">
          <button onClick={() => setIsLeftOpen(true)} className="p-2 -ml-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-800">Vani Assistant</span>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Message Feed */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.type === 'bot' ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-green-700 font-bold text-sm">V</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mourya" alt="User" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className={`flex-1 flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed max-w-[85%] ${
                  msg.type === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-sm shadow-md' 
                    : 'bg-slate-50 text-gray-800 rounded-tl-sm border border-gray-100'
                }`}>
                  {msg.text}
                </div>
                
                {/* Example Quick Actions for first bot message */}
                {msg.id === 1 && msg.type === 'bot' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      onClick={() => { setInputText('Diagnose Crop Issue'); }}
                      className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-full text-sm font-semibold hover:bg-green-50 shadow-sm transition-colors"
                    >
                      Diagnose Crop Issue
                    </button>
                    <button 
                      onClick={() => { setInputText('Check Fertilizer Plan'); }}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors"
                    >
                      Check Fertilizer Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="shrink-0 bg-white pt-2 pb-4 px-4 md:px-8 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            {attachedFile && (
              <div className="mb-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                <Paperclip className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{attachedFile}</span>
                <button onClick={() => setAttachedFile(null)} className="hover:text-blue-900"><X className="w-4 h-4" /></button>
              </div>
            )}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-2 flex items-end gap-2 shadow-lg focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all">
              <button 
                onClick={startNewChat}
                className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors shrink-0"
              >
                <Plus className="w-6 h-6" />
              </button>
              
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Vani anything about your farm..."
                className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-3 px-2 text-gray-800 placeholder-gray-400 outline-none"
                rows="1"
              />
              
              <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors hidden sm:block">
                  <FileText className="w-5 h-5" />
                </button>
                
                {inputText.trim() || attachedFile ? (
                  <button 
                    onClick={handleSend}
                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition-transform hover:scale-105 ml-1"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition-transform hover:scale-105 ml-1">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-gray-400">
              Vani can make mistakes. Consider verifying important agricultural advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
