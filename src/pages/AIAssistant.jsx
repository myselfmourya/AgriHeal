import React, { useState, useRef, useEffect } from "react";
import { 
    Send, Mic, Image as ImageIcon, Sparkles, Activity, Stethoscope, Brain, RefreshCw,
    CircleAlert, Pill, ShieldCheck, UserRound, ChevronRight, BarChart3, MicOff, History, Plus, X, Volume2, Camera, Upload, Leaf, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFarmer } from '../contexts/FarmerContext';
import { useVani } from '../contexts/VaniContext';
import { useNavigate } from 'react-router-dom';
import { useVoiceActions } from '../hooks/useVoiceActions';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ─── Image Analysis Tab ────────────────────────────────────────────────────
const QUICK_ISSUES = ["Yellowing Leaves", "White Spots", "Pests Detected", "Wilting", "Stunted Growth"];

function AnalysisTab() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Downscale to max 800px dimension
                const MAX_SIZE = 800;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.8 quality
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setImagePreview(compressedDataUrl);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const analyze = async () => {
        if (!input && !imagePreview) return;
        setLoading(true); setError(""); setResult(null);
        
        try {
            const { analyzeImage, generateStructuredResponse } = await import('../services/aiProvider');

            // Two steps on purpose: a focused visual-description pass first,
            // then a separate reasoning pass over that description, is
            // measurably more accurate than asking one call to both look at
            // the image and produce the final structured diagnosis at once
            // (tested: single-call consistently misdiagnosed early blight as
            // late blight). Both steps are fast on their own (~2-4s each
            // with Groq first in the fallback chain), so this still lands
            // well under the two-step worst case.
            let aiResultText = "";
            if (imagePreview) {
                const base64Image = imagePreview.split(',')[1] || imagePreview;
                aiResultText = await analyzeImage(base64Image, `Act as an expert agricultural pathologist. Analyze this crop image in extreme detail. Identify any diseases, pests, or nutrient deficiencies accurately. Pay attention to specific colors (e.g., bright orange/red spots might indicate rust, not just anthracnose). Describe the exact visual symptoms. Context from user: ${input}`);
            }

            const prompt = `Crop Analysis Data:\nUser input: ${input}\nImage analysis (if any): ${aiResultText}\n\nBased on this, determine the crop condition, severity, causes, treatments, and precautions. Be highly accurate. If you see bright orange-red spots with central fruiting bodies on pear leaves, it is "Pear Rust" (Gymnosporangium sabinae), not leaf miners or anthracnose.`;

            const schema = `{
              "condition": "string",
              "severity": "moderate | severe | low",
              "causes": ["string"],
              "treatments": ["string"],
              "precautions": ["string"],
              "expert": "string"
            }`;

            const resultObj = await generateStructuredResponse(prompt, schema);
            setResult(resultObj);
        } catch (err) {
            console.error("Analysis Error:", err);
            setError("Failed to analyze. Please try again or check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="relative mb-3">
                {imagePreview && (
                    <div className="relative p-3 mb-2 border border-gray-200 rounded-2xl bg-gray-50">
                        <img src={imagePreview} alt="Upload preview" className="h-24 w-auto rounded-xl object-cover border border-gray-200" />
                        <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-full text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <textarea
                    className="w-full px-4 py-3.5 pl-14 pr-14 rounded-2xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-green-500 shadow-sm"
                    rows={3} placeholder="Describe the crop issue or upload an image... (e.g., 'Leaves are turning yellow')"
                    value={input} onChange={(e) => setInput(e.target.value)}
                />
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                    <Camera className="w-5 h-5" />
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImage} />
                </button>
                <button
                    onClick={analyze}
                    disabled={(!input && !imagePreview) || loading}
                    className={cn("absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        (input || imagePreview) && !loading ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-100 text-gray-400")}
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex gap-2 flex-wrap mb-5">
                {QUICK_ISSUES.map((s) => (
                    <button key={s} onClick={() => { setInput((p) => p ? `${p}, ${s}` : s); }}
                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100 transition-colors">
                        + {s}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
                    <CircleAlert className="w-4 h-4 inline mr-2" />{error}
                </div>
            )}

            {loading && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.04)]">
                    <RefreshCw className="w-8 h-8 text-green-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-900">VANI is analyzing your crop...</p>
                    <p className="text-xs text-gray-500 mt-1">Comparing against agricultural databases</p>
                </div>
            )}

            {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-4">
                    <div className={cn("rounded-2xl p-4 flex items-center justify-between border", 
                        result.severity === 'severe' ? 'border-red-100 bg-red-50' :
                        result.severity === 'moderate' ? 'border-amber-100 bg-amber-50' : 'border-green-100 bg-green-50'
                    )}>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">Detected Condition</p>
                            <p className="text-lg font-black text-gray-900">{result.condition}</p>
                        </div>
                        <span className={cn("text-[11px] font-black px-3 py-1.5 rounded-full border capitalize shadow-sm", 
                             result.severity === 'severe' ? 'text-red-700 border-red-200 bg-white' :
                             result.severity === 'moderate' ? 'text-amber-700 border-amber-200 bg-white' : 'text-green-700 border-green-200 bg-white'
                        )}>
                            {result.severity} Risk
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { icon: CircleAlert, label: "Likely Causes", items: result.causes, color: "text-orange-700", bg: "bg-orange-50 border-orange-100" },
                            { icon: Pill, label: "Suggested Treatments", items: result.treatments, color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
                            { icon: ShieldCheck, label: "Precautions", items: result.precautions, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
                        ].map(({ icon: Icon, label, items, color, bg }) => (
                            <div key={label} className={cn("rounded-2xl p-4 border", bg)}>
                                <div className={cn("flex items-center gap-2 mb-2 font-bold text-sm", color)}>
                                    <Icon className="w-4 h-4" />{label}
                                </div>
                                <ul className="space-y-1.5">
                                    {items?.map((item, i) => (
                                        <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", color.replace("text", "bg"))} />
                                            <span className="leading-relaxed font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <UserRound className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Recommended Specialist</p>
                            <p className="text-sm font-bold text-gray-900">{result.expert}</p>
                        </div>
                        <button className="text-xs font-bold text-blue-600 flex items-center gap-0.5 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                            Consult <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wide">⚠️ AI analysis is for advisory purposes. Always consult an expert.</p>
                </motion.div>
            )}
        </div>
    );
}

// ─── AI Assistant Chat Tab ──────────────────────────────────────────────────
function AssistantTab() {
    const { profile } = useFarmer();
    const { speak, isSpeaking } = useVani();
    const defaultGreeting = { role: "assistant", text: `Hello ${profile?.name || "Farmer"}! 👋 I'm VANI, your personal agriculture AI assistant. I can help you with crop issues, weather advice, pest control, and more. How can I assist your farm today?`, timestamp: new Date() };
    const [messages, setMessages] = useState([defaultGreeting]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceMode, setVoiceMode] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    
    const bottomRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("agriheal_ai_history");
        if (saved) {
            try {
                const parsed = JSON.parse(saved).map(chat => ({
                    ...chat,
                    date: new Date(chat.date),
                    messages: chat.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
                }));
                setChatHistory(parsed);
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, showHistory]);

    const saveCurrentChat = () => {
        if (messages.length <= 1) return;
        const newChat = {
            id: Date.now().toString(),
            date: new Date(),
            preview: messages.find(m => m.role === 'user')?.text || "Chat session",
            messages: [...messages]
        };
        const updated = [newChat, ...chatHistory];
        setChatHistory(updated);
        localStorage.setItem("agriheal_ai_history", JSON.stringify(updated));
        setMessages([defaultGreeting]);
    };

    const loadChat = (id) => {
        const chat = chatHistory.find(c => c.id === id);
        if (chat) {
            setMessages(chat.messages);
            setShowHistory(false);
        }
    };

    const clearAllChatHistory = () => {
        localStorage.removeItem("agriheal_ai_history");
        setChatHistory([]);
    };

    useVoiceActions([
        {
            id: 'assistant.ask',
            description: 'Ask the AI assistant an agriculture question and get a spoken/written answer',
            params: { question: 'string, required' },
            destructive: false,
            handler: async ({ question }) => {
                if (!question) throw new Error('I need a question to ask.');
                // send() returns the reply text directly — reading it from
                // `messages` state here would be a stale closure, since this
                // handler can run long after the render that created it.
                const reply = await send(question);
                return reply ? reply.replace(/[*#]/g, '') : 'Answered in the chat.';
            },
        },
        {
            id: 'assistant.newChat',
            description: 'Archive the current chat and start a fresh conversation',
            params: {},
            destructive: false, // archives, does not delete
            handler: () => {
                saveCurrentChat();
                return 'Started a new conversation.';
            },
        },
        {
            id: 'assistant.clearHistory',
            description: 'Permanently delete all saved chat history',
            params: {},
            destructive: true,
            handler: () => {
                clearAllChatHistory();
                return 'Cleared all chat history.';
            },
        },
    ], [messages, chatHistory]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const send = async (text) => {
        if (!text.trim()) return;
        const userMsg = { role: "user", text, timestamp: new Date() };
        setMessages((p) => [...p, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const { generateText } = await import('../services/aiProvider');
            // Provide recent chat history as context
            const historyText = messages.slice(-4).map(m => `${m.role}: ${m.text}`).join('\n');
            const prompt = `Recent context:\n${historyText}\nUser: ${text}\n\nProvide a helpful, empathetic, and expert agricultural response. Keep it concise, use markdown formatting, and emojis where appropriate. If it's a greeting, keep it very short.`;
            
            const reply = await generateText(prompt);

            setMessages((p) => [...p, { role: "assistant", text: reply, timestamp: new Date() }]);

            if (voiceMode) {
                speak(reply.replace(/[*#]/g, ''));
            }
            return reply;
        } catch (error) {
            console.error("AI Error:", error);
            const fallback = "I'm having trouble connecting to my brain right now. Please check your internet connection.";
            setMessages((p) => [...p, { role: "assistant", text: fallback, timestamp: new Date() }]);
            return fallback;
        } finally {
            setLoading(false);
        }
    };

    const startVoice = (autoSend = false) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Voice input not supported in this browser."); return; }
        if (window.speechSynthesis) window.speechSynthesis.cancel();

        const rec = new SpeechRecognition();
        rec.lang = "en-IN";
        rec.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            setIsRecording(false);
            if (autoSend) {
                setTimeout(() => send(transcript), 500);
            }
        };
        rec.onend = () => setIsRecording(false);
        rec.start();
        setIsRecording(true);
    };

    const stopVoice = () => {
        setIsRecording(false);
        window.speechSynthesis?.cancel();
    };

    const SUGGESTIONS = ["What's the weather like?", "How to treat yellow leaves?", "Best time to apply Urea?"];

    if (showHistory) {
        return (
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Chat History</h3>
                    <div className="flex gap-3 items-center">
                        {chatHistory.length > 0 && (
                            <button onClick={() => {
                                localStorage.removeItem("agriheal_ai_history");
                                setChatHistory([]);
                            }} className="text-sm text-red-500 font-bold hover:text-red-700">Clear All</button>
                        )}
                        <button onClick={() => setShowHistory(false)} className="text-sm text-green-600 font-bold">Back</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                    {chatHistory.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">No saved chats yet.</div>
                    ) : (
                        chatHistory.map(chat => (
                            <div key={chat.id} onClick={() => loadChat(chat.id)} className="glass rounded-2xl p-4 cursor-pointer hover:bg-white shadow-sm transition-colors border border-gray-100">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{chat.preview}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{chat.date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                                    <span>{chat.messages.length} messages</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Top Bar for Chat */}
            <div className="flex justify-between items-center mb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={() => saveCurrentChat()} className="text-xs bg-white border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-gray-600 font-bold hover:bg-gray-50 shadow-sm">
                        <Plus className="w-3 h-3" /> New
                    </button>
                    <button
                        onClick={() => { setVoiceMode(true); startVoice(true); }}
                        className="text-xs bg-green-50 border border-green-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-green-700 font-bold hover:bg-green-100 shadow-sm transition-colors"
                    >
                        <Volume2 className="w-3 h-3" /> Voice Mode
                    </button>
                </div>
                <button
                    onClick={() => setShowHistory(true)}
                    className="text-xs bg-white border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-gray-600 font-bold hover:bg-gray-50 shadow-sm"
                >
                    <History className="w-3 h-3" /> History
                </button>
            </div>

            {voiceMode ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl mb-4 relative overflow-hidden shadow-inner w-full">
                    <button onClick={() => { setVoiceMode(false); stopVoice(); }} className="absolute top-4 right-4 text-white/50 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-20">
                        <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-white/80 font-bold mb-16 text-center text-lg z-10 transition-all">
                        {loading ? "VANI is thinking..." : isSpeaking ? "VANI is speaking..." : isRecording ? "Listening to you..." : "Tap the orb to speak"}
                    </h3>

                    <button
                        onClick={() => isRecording ? stopVoice() : startVoice(true)}
                        className="relative group z-10"
                    >
                        {/* Glow effects - Green themed */}
                        <div className={cn("absolute inset-0 rounded-full blur-3xl transition-all duration-700",
                            isRecording ? "bg-amber-500/60 scale-[1.8] animate-pulse" :
                                isSpeaking ? "bg-emerald-500/60 scale-[1.8] animate-pulse" :
                                    loading ? "bg-teal-500/50 scale-[1.5] animate-spin" :
                                        "bg-green-500/40 scale-[1.2] group-hover:scale-[1.3]"
                        )} />

                        {/* Core Orb */}
                        <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-green-900 via-emerald-800 to-teal-500 shadow-[0_0_40px_rgba(16,185,129,0.6)] flex items-center justify-center border-2 border-white/20">
                            {isRecording ? <Mic className="w-10 h-10 text-white animate-bounce" /> : <Sparkles className="w-10 h-10 text-white" />}
                        </div>
                    </button>

                    <div className="mt-16 h-20 flex items-center justify-center z-10 w-full">
                        {loading ? null : isRecording && input ? (
                            <p className="text-white/60 text-center max-w-[280px] italic font-medium">"{input}"... </p>
                        ) : messages.length > 1 ? (
                            <p className="text-white/90 text-center max-w-[280px] font-bold text-lg leading-snug">"{messages[messages.length - 1].text.length > 90 ? messages[messages.length - 1].text.slice(0, 90) + "..." : messages[messages.length - 1].text}"</p>
                        ) : null}
                    </div>
                </div>
            ) : (
                <>
                    {/* Chat */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-3 scrollbar-none">
                        {messages.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                                <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                                    msg.role === "user" ? "bg-green-600 text-white rounded-br-sm shadow-sm" : "glass rounded-bl-sm")}>
                                    {msg.role === "assistant" && (
                                        <div className="flex items-center gap-1.5 mb-2 text-green-700 font-bold text-[11px] uppercase tracking-wider">
                                            <Sparkles className="w-3.5 h-3.5" /> VANI AI
                                        </div>
                                    )}
                                    <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                    <p className={cn("text-[10px] mt-1.5 font-bold", msg.role === "user" ? "text-green-200" : "text-gray-400")}>
                                        {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-1.5 mb-2 text-green-700 font-bold text-[11px] uppercase tracking-wider">
                                        <Sparkles className="w-3.5 h-3.5" /> VANI AI
                                    </div>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map(i => (
                                            <motion.div key={i} className="w-2 h-2 bg-green-400 rounded-full"
                                                animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick suggestions */}
                    {messages.length <= 2 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0 mb-1">
                            {SUGGESTIONS.map((s) => (
                                <button key={s} onClick={() => send(s)}
                                    className="shrink-0 bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded-full whitespace-nowrap hover:bg-green-100 transition-colors">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="relative shrink-0 pb-4 pt-2 z-50 bg-transparent">
                        <div className="bg-white border-2 border-gray-200/60 rounded-[32px] p-2 flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:border-green-500 focus-within:shadow-green-100 transition-all duration-300">
                            <button className="p-3.5 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors rounded-[24px]">
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send(input)}
                                placeholder="Ask VANI about your farm..."
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] px-2 placeholder:text-gray-400"
                            />
                            {input.trim() ? (
                                <button onClick={() => send(input)} className="p-3.5 bg-slate-900 text-white rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-lg">
                                    <Send className="w-5 h-5" />
                                </button>
                            ) : (
                                <button className="p-3.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-[24px]">
                                    <Mic className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Predictive Analytics Tab ───────────────────────────────────────────────
function PredictTab() {
    const { myCrops } = useFarmer();
    const [selectedCropId, setSelectedCropId] = useState(myCrops[0]?.id || null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const predict = async () => {
        if (!selectedCropId) return;
        setLoading(true); setResult(null);

        try {
            const crop = myCrops.find(c => c.id === selectedCropId);
            const { generateStructuredResponse } = await import('../services/aiProvider');
            
            const prompt = `Analyze predictive risks for crop: ${crop.name}. Region: India. Consider typical weather patterns and current agricultural trends.\n\nProvide yield loss risk (0-100), pest risk (0-100), and soil degradation risk (0-100). Also provide 3 concrete agricultural suggestions and up to 2 critical alerts if necessary.`;
            
            const schema = `{
                "cropName": "string",
                "yieldRisk": "number (0-100)",
                "pestRisk": "number (0-100)",
                "soilDegradationRisk": "number (0-100)",
                "suggestions": ["string"],
                "alerts": ["string"]
            }`;
            
            const resultObj = await generateStructuredResponse(prompt, schema);
            setResult(resultObj);
        } catch (err) {
            console.error("Predict Error:", err);
            // fallback
            const crop = myCrops.find(c => c.id === selectedCropId);
            setResult({
                cropName: crop.name,
                yieldRisk: 15,
                pestRisk: 30,
                soilDegradationRisk: 20,
                suggestions: ["Rotate crops next season", "Monitor moisture levels"],
                alerts: []
            });
        } finally {
            setLoading(false);
        }
    };

    const riskColor = (val) => val >= 70 ? "#ef4444" : val >= 40 ? "#f59e0b" : "#10b981";
    const riskLabel = (val) => val >= 70 ? "High Risk" : val >= 40 ? "Moderate" : "Low Risk";

    return (
        <div>
            <div className="glass rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Select Crop to Analyze</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {myCrops.map(crop => (
                        <button 
                            key={crop.id}
                            onClick={() => setSelectedCropId(crop.id)}
                            className={cn("px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                                selectedCropId === crop.id ? "bg-green-50 text-green-700 border-green-200 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {crop.emoji} {crop.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={predict}
                disabled={loading || !selectedCropId}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200 mb-6"
            >
                {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing with VANI...</> : <><Brain className="w-5 h-5" /> Run Predictive Analysis</>}
            </button>

            {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-6">
                    <h3 className="text-lg font-black text-gray-900 mb-2">Predictions for {result.cropName}</h3>
                    
                    {[
                        { name: "Yield Loss", value: result.yieldRisk },
                        { name: "Pest & Disease", value: result.pestRisk },
                        { name: "Soil Degradation", value: result.soilDegradationRisk },
                    ].map(({ name, value }) => {
                        const fill = riskColor(value);
                        return (
                            <div key={name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-sm font-bold text-gray-900">{name} Risk</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black" style={{ color: fill }}>{value}%</span>
                                        <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full font-bold" style={{ color: fill, backgroundColor: `${fill}20` }}>
                                            {riskLabel(value)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-3 rounded-full"
                                        style={{ backgroundColor: fill }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm bg-gradient-to-br from-green-50 to-white">
                        <p className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" /> VANI's Recommendations
                        </p>
                        <ul className="space-y-3">
                            {result.suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 font-medium leading-relaxed">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />{s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {result.alerts?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm font-black text-red-700 mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5" /> Critical Alerts
                            </p>
                            {result.alerts.map((a, i) => <p key={i} className="text-sm text-red-700 font-bold">{a}</p>)}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}

// ─── Main AIAssistant Page ──────────────────────────────────────────────────
export default function AIAssistant() {
    const TABS = [
        { id: "analysis", label: "Analysis", icon: Stethoscope },
        { id: "chat", label: "Assistant", icon: Sparkles },
        { id: "predict", label: "Predict", icon: Brain },
    ];
    
    const searchParams = new URLSearchParams(window.location.search);
    const initialTab = searchParams.get("tab") || "chat";
    const [activeTab, setActiveTab] = useState(TABS.some(t => t.id === initialTab) ? initialTab : "chat");

    useVoiceActions([
        {
            id: 'assistant.switchTab',
            description: `Switch which AI Assistant tool is shown: ${TABS.map(t => `"${t.id}" (${t.label})`).join(', ')}`,
            params: { tab: `one of: ${TABS.map(t => t.id).join(', ')}` },
            destructive: false,
            handler: ({ tab }) => {
                const match = TABS.find((t) => t.id === String(tab || '').toLowerCase());
                if (!match) throw new Error(`I don't have a "${tab}" tool here.`);
                setActiveTab(match.id);
                return `Showing ${match.label}.`;
            },
        },
    ], []);

    return (
        <div className="absolute left-0 md:left-64 right-0 top-0 bottom-0 z-40 flex flex-col mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-16 md:pt-10 pb-24 md:pb-8 pointer-events-none">
            <div className="animate-in fade-in duration-500 flex-1 flex flex-col bg-white relative md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="px-5 py-4 shrink-0 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur z-10">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            VANI <span className="text-green-600">Agriculture AI</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-bold text-[10px] uppercase tracking-wider border border-green-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        VANI Online
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-4 shrink-0 bg-white">
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-2">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                                    activeTab === id ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}
                            >
                                <Icon className="w-3.5 h-3.5" />{label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn("flex-1 w-full max-w-2xl mx-auto px-4 flex flex-col min-h-0", activeTab === "chat" ? "" : "pb-20 overflow-y-auto scrollbar-none")}
                    >
                        {activeTab === "analysis" && <AnalysisTab />}
                        {activeTab === "chat" && <AssistantTab />}
                        {activeTab === "predict" && <PredictTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
