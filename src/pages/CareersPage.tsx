import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const positions = [
  {
    id: 1,
    title: 'Senior Structural Engineer',
    location: 'Yaoundé, CM',
    type: 'Full-Time',
    dept: 'Engineering',
    desc: 'Join our elite structural design team. Minimum 8 years experience in high-rise concrete structures required.'
  },
  {
    id: 2,
    title: 'Site Safety Inspector',
    location: 'Yaoundé, CM',
    type: 'Contract',
    dept: 'HESS',
    desc: 'Enforce zero-accident protocols on our active residential complex sites.'
  },
  {
    id: 3,
    title: 'BIM Coordinator',
    location: 'Remote / Yaoundé',
    type: 'Full-Time',
    dept: 'Digital Design',
    desc: 'Manage structural data flows and clash detection for large-scale industrial projects.'
  }
];

export const CareersPage: React.FC = () => {
  const [appliedRole, setAppliedRole] = React.useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState<{ type: 'apply' | 'cv', title?: string } | null>(null);

  const handleApply = (title: string) => {
    setAppliedRole(title);
    setTimeout(() => {
      setAppliedRole(null);
      setShowSuccessModal({ type: 'apply', title });
    }, 1200);
  };

  const handleSubmitCV = () => {
    setShowSuccessModal({ type: 'cv' });
  };

  return (
    <div className="pt-32 pb-20">
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161920] border border-[#F26A36]/30 rounded-[2.5rem] p-10 max-w-lg w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#F26A36]/10 rounded-full flex items-center justify-center mx-auto text-[#F26A36]">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                  {showSuccessModal.type === 'apply' ? 'Transmission Success' : 'Database Access Granted'}
                </h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  {showSuccessModal.type === 'apply' 
                    ? `Your credentials for the "${showSuccessModal.title}" position have been securely encrypted and added to our recruitment triage. We will contact you via the executive network.`
                    : 'CV Upload window is active. Please transmit your PDF credentials directly to madecccons@gmail.com with reference "SPONTANEOUS-DB-2026".'}
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessModal(null)}
                className="w-full py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="container mx-auto px-6 mb-20 text-center md:text-left">
        <motion.h2 
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
          viewport={{ once: true }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4"
        >
          Join the Fleet
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8 uppercase"
        >
          ENGINEER THE <br />
          <span className="text-[#F26A36]">FUTURE.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight max-w-xl mx-auto md:mx-0"
        >
          We are always looking for technical talent to join our mission of structural excellence across Central Africa.
        </motion.p>
      </section>

      <section className="container mx-auto px-6 space-y-6">
        {positions.map((pos, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={pos.id}
            className="p-8 bg-slate-50 dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-[#F26A36]/30 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-white dark:bg-[#0D0F12] border border-slate-100 dark:border-[#262B37] rounded-full text-[9px] font-black uppercase text-[#F26A36] tracking-widest">{pos.dept}</span>
                 <span className="px-3 py-1 bg-white dark:bg-[#0D0F12] border border-slate-100 dark:border-[#262B37] rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest">{pos.type}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-[#F26A36] transition-colors">{pos.title}</h3>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-tight leading-relaxed">{pos.desc}</p>
              <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2"><MapPin size={14} /> {pos.location}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> Posted 2 days ago</div>
              </div>
            </div>
            <button 
              onClick={() => handleApply(pos.title)}
              className="w-full md:w-auto px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#F26A36] dark:hover:bg-[#F26A36] hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95 shadow-lg"
            >
              {appliedRole === pos.title ? 'Processing...' : 'Apply Now'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </section>

      <section className="mt-32 container mx-auto px-6 py-20 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26A36]/10 blur-[100px] -mr-32 -mt-32" />
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
           <h3 className="text-3xl font-black uppercase tracking-tighter italic">Spontaneous Application?</h3>
           <p className="text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
             Don't see a role that fits? We are always expanding our database of certified subcontractors and freelance specialized engineers.
           </p>
           <button 
            onClick={handleSubmitCV}
            className="group px-12 py-6 border-2 border-white/20 hover:border-[#F26A36] hover:text-white hover:bg-[#F26A36]/20 font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-4 mx-auto"
           >
             Submit CV to Database
             <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </section>
    </div>
  );
};
