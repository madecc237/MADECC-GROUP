import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6 mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
          viewport={{ once: true }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4"
        >
          Corporate Identity
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase mb-8"
        >
          LEGACY OF STRUCTURAL <br /> <span className="text-[#F26A36]">INTEGRITY.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-3xl mx-auto font-medium uppercase tracking-tight"
        >
          Founded in 2012, MADECC Group has evolved from a local consulting firm into Central Africa's premier engineering and construction powerhouse.
        </motion.p>
      </section>

      <section className="bg-slate-50 dark:bg-[#161920] py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-black uppercase text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
              To be the definitive catalyst for architectural modernization across the African continent, delivering infrastructure that stands as a testament to engineering excellence, safety, and aesthetic brilliance.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white dark:bg-[#0D0F12] rounded-2xl shadow-sm border border-slate-100 dark:border-[#262B37]"
              >
                <Target size={24} className="text-[#F26A36] mb-4" />
                <h4 className="text-xs font-black uppercase mb-2">Precision</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">Exact mathematical execution in every structural calculation.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white dark:bg-[#0D0F12] rounded-2xl shadow-sm border border-slate-100 dark:border-[#262B37]"
              >
                <Users size={24} className="text-[#F26A36] mb-4" />
                <h4 className="text-xs font-black uppercase mb-2">Community</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">Building inclusive structures that empower local growth.</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
               src="https://images.unsplash.com/photo-1581094751156-4d2621743048?auto=format&fit=crop&q=80&w=1000" 
               alt="Team Site" 
               className="rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
               referrerPolicy="no-referrer"
            />
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 10 }}
              className="absolute -bottom-6 -right-6 p-8 bg-[#F26A36] text-white rounded-3xl shadow-2xl"
            >
               <span className="text-4xl font-black block">14+</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Years Experience</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <h3 className="text-center text-3xl font-black uppercase mb-16 underline decoration-[#F26A36] underline-offset-8">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Quality Assurance', desc: 'We implement a three-tier quality control process on all concrete and steel reinforcement to ensure maximum structural life.' },
            { title: 'Safety Protocols', desc: 'Our zero-accident initiative ensures that every staff member returns home safely, with rigorous HESS training enforced daily.' },
            { title: 'Innovation', desc: 'Leveraging AI-driven structural simulations and drone site surveys to optimize project timelines and accuracy.' }
          ].map(v => (
            <div key={v.title} className="text-center space-y-4">
              <h4 className="text-xl font-black uppercase text-[#F26A36]">{v.title}</h4>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-tight leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
