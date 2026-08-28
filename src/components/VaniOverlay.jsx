import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function VaniOverlay({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Namaskaram! I am Vani, your Smart Farming Assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userText = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInput('')

    try {
      const { generateStructuredResponse } = await import('../services/aiProvider');
      const historyText = messages.slice(-3).map(m => `${m.sender === 'user' ? 'User' : 'Vani'}: ${m.text}`).join('\n');
      const prompt = `Context:\n${historyText}\nUser: ${userText}\n\nProvide a very short, helpful agricultural response (under 2 sentences). Determine if the user wants to navigate to a page.`;
      
      const schemaDescription = `{ "responseText": "Your reply", "action": "navigate" | "none", "payload": "if action is navigate, specify route path, e.g., '/', '/news', '/crop', '/weather', '/settings', '/documents', '/market', '/community'" }`;
      
      const aiData = await generateStructuredResponse(prompt, schemaDescription);
      setMessages(prev => [...prev, { sender: 'ai', text: aiData.responseText || 'I did not understand that.' }]);
      
      if (aiData.action === 'navigate' && aiData.payload) {
         if (onClose) onClose();
         navigate(aiData.payload);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col h-[500px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-[#1b5e20] text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Ask Vani</h4>
            <p className="text-[10px] text-green-100 font-medium">Smart AI Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-[85%] p-3 shadow-sm ${msg.sender === 'ai' ? 'self-start bg-white rounded-2xl rounded-tl-sm border border-gray-100 text-slate-700' : 'self-end bg-[#1b5e20] text-white rounded-2xl rounded-tr-sm'}`}>
            <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a farming question..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-800"
        />
        <button 
          onClick={handleSend}
          className={`p-2.5 rounded-xl transition-colors ${input.trim() ? 'bg-[#1b5e20] hover:bg-[#144d18] text-white' : 'bg-slate-100 text-slate-400'}`}
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
