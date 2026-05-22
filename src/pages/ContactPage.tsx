import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 font-sans">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8 uppercase">
            CONNECT WITH <br />
            <span className="text-[#F26A36]">OPERATIONS.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight max-w-xl">
            Established field offices in Yaoundé. Secure communication lines open 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            {status === 'success' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-12 rounded-[2rem] text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">Transmission Successful</h3>
                <p className="text-emerald-700 dark:text-emerald-500 font-medium uppercase tracking-tight">Our operations team will review your inquiry and respond within 24 hours.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-4 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      type="email" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all" 
                      placeholder="john@company.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6} 
                    className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all" 
                    placeholder="Project details or inquiry..."
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-[#F26A36] text-white font-black uppercase tracking-widest rounded-xl shadow-2xl shadow-[#F26A36]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Deploy Inquiry <Send size={18} /></>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-4">Failed to send message. Please try again.</p>
                )}
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Yaoundé HQ</h4>
                 <p className="text-xs font-bold dark:text-white leading-relaxed">Central District, Tower 2<br />+237 671 063 511</p>
              </div>
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Support Hub</h4>
                 <p id="support-email" className="text-xs font-bold dark:text-white leading-relaxed">24/7 Digital Concierge<br />madecccons@gmail.com</p>
              </div>
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Operations</h4>
                 <p className="text-xs font-bold dark:text-white leading-relaxed">WhatsApp Field Hub<br />+237 683 316 486</p>
              </div>
            </div>
          </div>

          <div className="h-[600px] w-full bg-slate-100 dark:bg-[#161920] rounded-3xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-[#262B37]">
            {/* Yaoundé Map Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15923.46881745423!2d11.498877!3d3.848033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7967%3A0x2d9a6f3b0f7e6f3a!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2scm!4v1715807612345!5m2!1sen!2scm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MADECC Group Yaoundé Location"
            />
            
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-[#0D0F12]/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-[#262B37] shadow-xl pointer-events-none">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F26A36]/10 text-[#F26A36] rounded-xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm dark:text-white uppercase tracking-tighter">YAOUNDÉ COMMAND HUB</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Site operations & Executive management</p>
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 pointer-events-auto">
                 <a 
                   href="https://maps.google.com/?q=Yaounde,Cameroon" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#F26A36] hover:gap-3 transition-all"
                 >
                   View Larger Map <ExternalLink size={12} />
                 </a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
