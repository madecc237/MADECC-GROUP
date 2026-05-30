import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: 'Structural Design',
    budget: '$250K - $1M',
    location: '',
    timeline: '1-3 Months',
    estimatedArea: '500',
    materialsOption: 'Reinforced Concrete Column Structure',
    message: ''
  });
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceType: 'Structural Design',
          budget: '$250K - $1M',
          location: '',
          timeline: '1-3 Months',
          estimatedArea: '500',
          materialsOption: 'Reinforced Concrete Column Structure',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 font-sans">
      <Helmet>
        <title>Contact MADECC Construction - Site Tender & Proposal Request</title>
        <meta name="description" content="Connect with MADECC Construction's operational field offices in Yaoundé, Bastos. Request bids, submit tenders, or consult with our structural analysts." />
        <meta name="keywords" content="contact madecc, submit construction tender, request structural quote, building contractors yaounde" />
        <link rel="canonical" href="https://madecc-construction.com/contact" />
      </Helmet>
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
            Established field offices in Yaoundé. Secure communication lines open 24/7 for project evaluations and technical consultations.
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
                <p className="text-emerald-700 dark:text-emerald-500 font-medium uppercase tracking-tight">Our operations team will review your construction requirements, evaluate structural parameters, and respond with a preliminary proposal within 24 hours.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-4 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all"
                >
                  Submit Another Bid Request
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
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
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
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                      placeholder="john@company.com" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                    <input 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      type="tel" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                      placeholder="+237 6XX XX XX XX" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company / Organization</label>
                    <input 
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                      placeholder="e.g., MADECC Capital" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Required</label>
                    <select 
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Structural Design">Structural Design & Audit</option>
                      <option value="Civil Engineering">Civil Engineering & Bridges</option>
                      <option value="Industrial Construction">Industrial & Warehousing</option>
                      <option value="Residential Development">Residential High-Rise</option>
                      <option value="BIM & Clash Detection">BIM Modeling & Simulation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Project Budget</label>
                    <select 
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Under $250K">Under $250K USD</option>
                      <option value="$250K - $1M">$250K - $1M USD</option>
                      <option value="$1M - $5M">$1M - $5M USD</option>
                      <option value="$5M - $20M">$5M - $20M USD</option>
                      <option value="$20M+">$20M+ USD / Mega Scale</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Location / Site Coordinates</label>
                    <input 
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                      placeholder="e.g., Bastos, Yaoundé" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline / Scope Speed</label>
                    <select 
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Immediate">Immediate Deployment (0-30 days)</option>
                      <option value="1-3 Months">Pre-Planning phase (1-3 months)</option>
                      <option value="3-6 Months">Technical study phase (3-6 months)</option>
                      <option value="6+ Months">Long-term roadmap (6+ months)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Built Area (m²)</label>
                    <input 
                      required
                      value={formData.estimatedArea}
                      onChange={(e) => setFormData({ ...formData, estimatedArea: e.target.value })}
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                      placeholder="e.g. 1200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structural Material Type</label>
                    <select 
                      value={formData.materialsOption}
                      onChange={(e) => setFormData({ ...formData, materialsOption: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Reinforced Concrete Column Structure">Reinforced Concrete Columns</option>
                      <option value="Hot-Rolled Steel Frame Structure">Heavy Hot-Rolled Structural Steel</option>
                      <option value="Hybrid Composite Stress Matrix">Hybrid Concrete-Steel Composite</option>
                      <option value="Lightweight Timber Frame Profile">Treated Structural Timber & Timber Joists</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Project Briefing</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5} 
                    className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#262B37] rounded-xl p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F26A36] transition-all text-slate-900 dark:text-white" 
                    placeholder="Provide a structural description, site dimensions, or specific design constraints..."
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-[#F26A36] text-white font-black uppercase tracking-widest rounded-xl shadow-2xl shadow-[#F26A36]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Submit Tender / Request Bid Proposal <Send size={18} /></>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-4">Failed to register proposal. Check communication layers and try again.</p>
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
