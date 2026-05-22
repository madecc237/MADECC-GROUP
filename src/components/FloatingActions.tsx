import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Phone, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FloatingActions: React.FC = () => {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    { id: 1, text: t('chat.welcome'), sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Reset welcome message on language change
    setMessages([{ id: 1, text: t('chat.welcome'), sender: 'bot' }]);
  }, [t]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = { id: Date.now(), text: message, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini (alternating user/model roles)
      const history = messages
        .filter(m => m.id !== 1) // skip welcome message
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, history }),
      });

      if (!response.ok) throw new Error("Failed to reach MADECC triage.");

      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.text, sender: 'bot' }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "System Alert: Local uplink disrupted. Please contact madecccons@gmail.com directly.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50">
      {/* Gemini Chat Bot Interface */}
      <AnimatePresence mode="wait">
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className="w-80 sm:w-96 bg-white dark:bg-[#161920] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-[#262B37] overflow-hidden mb-2 flex flex-col h-[500px]"
          >
            <div className="bg-[#F26A36] p-6 text-white shrink-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-xl">M</div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest">{t('chat.title') || 'MADECC AGENT'}</p>
                    <p className="text-[9px] font-bold opacity-80 flex items-center gap-1 uppercase tracking-tighter">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      {t('chat.status') || 'ORBITAL NEURAL LINK ACTIVE'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="hover:bg-white/20 p-2 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-[#0D0F12] text-xs space-y-4 custom-scrollbar"
            >
              {messages.map(msg => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-[85%] font-bold leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#F26A36] text-white rounded-tr-none' 
                      : 'bg-white dark:bg-[#161920] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-[#262B37]'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#161920] p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-[#262B37] flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-[#F26A36] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#F26A36] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#F26A36] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#161920] shrink-0">
              <div className="flex gap-2 bg-slate-50 dark:bg-[#0D0F12] p-2 rounded-2xl border border-slate-200 dark:border-[#262B37]">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('chat.placeholder') || 'Type a message...'} 
                  className="flex-1 text-xs px-3 py-2 focus:outline-none bg-transparent dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="bg-[#F26A36] text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        {/* WhatsApp Quick Link */}
        <motion.a 
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/237683316486"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-green-600 transition-all group overflow-hidden"
        >
          <motion.div initial={false} whileHover={{ rotate: 12 }}>
            <MessageSquare size={20} />
          </motion.div>
        </motion.a>

        {/* AI Chat Button */}
        <motion.button 
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all relative ${
            isChatOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 md:rotate-90' : 'bg-[#F26A36] text-white'
          }`}
        >
          {isChatOpen ? <X size={24} /> : (
            <>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-[#0D0F12] animate-pulse" title="AI Assistant Online"></div>
              <div className="font-black text-xl">M</div>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );

};
