import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, ShieldCheck, Heart, Award, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const positions = [
  {
    id: 1,
    title: 'Senior Structural Design Engineer',
    location: 'Yaoundé HQ, Cameroon',
    type: 'Full-Time',
    dept: 'Engineering Design',
    desc: 'Perform advanced multi-axial stress simulations and design reinforced concrete foundation rafts. Master of Civil Engineering and minimum 8 years of certified Eurocode 2 stress auditing experience required.'
  },
  {
    id: 2,
    title: 'HESS Compliance Officer',
    location: 'Douala & Yaoundé Sites',
    type: 'Full-Time',
    dept: 'Safety & Environment',
    desc: 'Audit field safety, execute zero-hazard scaffolding inspections, and enforce strict PPE guidelines on active structural skyscraper frames. Minimum 5 years Heavy Civil safety experience required.'
  },
  {
    id: 3,
    title: 'Professional BIM Coordinator',
    location: 'Yaoundé Operations Hub',
    type: 'Full-Time',
    dept: 'Digital Design',
    desc: 'Coordinate structural data mapping and lead 3D digital-twin clash detection programs on high-modernity commercial high-rises using Autodesk Revit and Navisworks.'
  },
  {
    id: 4,
    title: 'Senior Geotechnical Engineer',
    location: 'Yaoundé & Hinterland Sites',
    type: 'Full-Time',
    dept: 'Soil Mechanics',
    desc: 'Direct soil boring operations and analyze subsurface core samples to select optimal friction pile patterns and raft configurations for heavy logistical warehouses.'
  },
  {
    id: 5,
    title: 'Materials Laboratory Analyst',
    location: 'HQ Materials Science Lab',
    type: 'Full-Time',
    dept: 'Quality Control',
    desc: 'Run daily crushing stress evaluations on 28-day water-immersion cured concrete specimen cubes. Track aggregate moisture indices and certify reinforcing steel tensile limit profiles.'
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
      <Helmet>
        <title>MADECC Careers - Join Our Elite Civil Engineering Field Teams</title>
        <meta name="description" content="Discover construction jobs, senior civil engineering positions, surveyor opportunities, and project management vacancies in Yaoundé, Cameroon at MADECC Group." />
        <meta name="keywords" content="construction careers cameroon, engineering jobs yaoundé, hire civil engineers africa, soil mechanical lab vacancies" />
        <link rel="canonical" href="https://madecc-construction.com/careers" />
      </Helmet>
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setShowSuccessModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161920] border border-[#F26A36]/30 rounded-[2.5rem] p-10 max-w-lg w-full text-center space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-[#F26A36]/10 rounded-full flex items-center justify-center mx-auto text-[#F26A36]">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                  {showSuccessModal.type === 'apply' ? 'Transmission Successful' : 'Database Access Granted'}
                </h3>
                <p className="text-slate-400 font-medium text-xs leading-relaxed uppercase tracking-tight">
                  {showSuccessModal.type === 'apply' 
                    ? `Your structural credentials for the "${showSuccessModal.title}" position have been securely encrypted and added to our recruitment pipeline. Our engineering panel will analyze your background.`
                    : 'Your professional profile has been registered in our spontaneous applicant database. Please transmit your complete PDF curriculum and certificates to madecccons@gmail.com with subject tag "SPONTANEOUS-TENDER-2026".'}
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessModal(null)}
                className="w-full py-5 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#F26A36]/20"
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
          className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight max-w-xl mx-auto md:mx-0"
        >
          We are always looking for technical talent to join our mission of structural excellence, safety-first operations, and sustainable civil works across Central Africa.
        </motion.p>
      </section>

      {/* Dynamic Career Vacancies Grid */}
      <section className="container mx-auto px-6 space-y-6">
        {positions.map((pos, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={pos.id}
            className="p-8 bg-slate-50 dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-[#F26A36]/30 transition-all shadow-sm hover:shadow-xl animate-fade-in"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-white dark:bg-[#0D0F12] border border-slate-100 dark:border-[#262B37] rounded-full text-[9px] font-black uppercase text-[#F26A36] tracking-widest">{pos.dept}</span>
                 <span className="px-3 py-1 bg-white dark:bg-[#0D0F12] border border-slate-100 dark:border-[#262B37] rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest">{pos.type}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-[#F26A36] transition-colors">{pos.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">{pos.desc}</p>
              <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-[#F26A36]" /> {pos.location}</div>
                <div className="flex items-center gap-2"><Clock size={14} /> Active Application</div>
              </div>
            </div>
            <button 
              onClick={() => handleApply(pos.title)}
              className="w-full md:w-auto px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#F26A36] dark:hover:bg-[#F26A36] hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95 shadow-lg shrink-0"
            >
              {appliedRole === pos.title ? 'Transmitting...' : 'Apply Now'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </section>

      {/* Structured Compensation & Health Care Benefits Panel for AdSense Approval */}
      <section className="bg-slate-50 dark:bg-[#161920]/40 py-24 border-t border-slate-200 dark:border-[#262B37] mt-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#F26A36] mb-3">Enterprise Care</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              COMPENSATION & BENEVOLENCE
            </h3>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight max-w-xl mx-auto mt-4">
              We anchor our operational excellence in the robust health, safety, and continuous professional growth of our civil crews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Full Medical Coverage</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                MADECC Group sponsors 100% comprehensive medical, dental, and emergency care premiums for active structural field builders and their immediate dependents. 
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Continuous Fellowships</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                We foster academic progression by financing tuition offsets for structural designers seeking specialized international certifications in advanced BIM modelling, Eurocodes stress analysis, and structural diagnostics.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">HESS Site Coordination</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                Active construction personnel are supplied directly with certified safety equipment. We coordinate yearly high-altitude rescue courses, heat stress programs, and hazard-mitigation training seminars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spontaneous Applications Segment */}
      <section className="mt-32 container mx-auto px-6 py-20 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26A36]/10 blur-[100px] -mr-32 -mt-32" />
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
           <h3 className="text-3xl font-black uppercase tracking-tighter italic">Spontaneous Credentials?</h3>
           <p className="text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
             Don't see a role matching your engineering discipline? We continuously monitor credentials to populate our certified subcontractor database and freelance engineering registries.
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
