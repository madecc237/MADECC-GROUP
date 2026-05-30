import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Users, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <Helmet>
        <title>About MADECC - Leading Construction Engineering & Team Legacy</title>
        <meta name="description" content="Discover MADECC Construction's history since geotechnical inception in 2012. Learn about our veteran civil engineers, operations governance, core safety values, and modernization pillars in Yaoundé." />
        <meta name="keywords" content="about madecc construction, corporate history civil engineering, cameroon project managers, architectural team yaounde" />
        <link rel="canonical" href="https://madecc-construction.com/about" />
      </Helmet>
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

      <section className="container mx-auto px-6 py-24 border-b border-slate-100 dark:border-[#262B37]">
        <h3 className="text-center text-3xl font-black uppercase mb-16 underline decoration-[#F26A36] underline-offset-8">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Quality Assurance', desc: 'We implement a three-tier quality control process on all concrete and steel reinforcement to ensure maximum structural life.' },
            { title: 'Safety Protocols', desc: 'Our zero-accident initiative ensures that every staff member returns home safely, with rigorous HESS training enforced daily.' },
            { title: 'Innovation', desc: 'Leveraging AI-driven structural simulations and drone site surveys to optimize project timelines and accuracy.' }
          ].map(v => (
            <div key={v.title} className="text-center space-y-4">
              <h4 className="text-xl font-black uppercase text-[#F26A36]">{v.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Timeline Milestones - High SEO value */}
      <section className="bg-slate-50 dark:bg-[#161920]/30 py-24 border-b border-slate-100 dark:border-[#262B37]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#F26A36] mb-3">Our History</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">BUILDING MILESTONES</h3>
          </div>
          
          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {[
              { year: '2012', title: 'Geotechnical Inception', desc: 'Founded in Yaoundé as a specialized soil mechanics & foundation engineering consulting firm. Audited over 80 existing residential scopes.' },
              { year: '2016', title: 'Heavy Civil Expansion', desc: 'Secured first public tender for bridge construction and drainage networks in Douala-Bassa, scaling our active engineering staff to 45 personnel.' },
              { year: '2021', title: 'Digital Twin Adoption', desc: 'Fully modernized operations with advanced BIM structural clash-detection tools. Appointed as primary executors for Bastos premium high-rises.' },
              { year: '2026', title: 'Regional Leadership', desc: 'Established as Central Africa\'s premier construction conglomerate with 2.5B in capital managed and over 450 sites delivered safely.' }
            ].map((milestone, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} relative`}>
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#F26A36] -translate-x-2 md:-translate-x-2 border-4 border-white dark:border-[#0D0F12] top-2" />
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <span className="text-2xl font-black text-[#F26A36] block mb-2">{milestone.year}</span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{milestone.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">{milestone.desc}</p>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Board - High SEO AdSense relevance */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#F26A36] mb-3">Governance</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">EXECUTIVE LEADERSHIP</h3>
          <p className="text-slate-500 font-medium uppercase tracking-tight mt-4 text-sm max-w-xl mx-auto">
            Our governance council brings together recognized academics, certified engineers, and veteran field coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Dr. Marc-Antoine Dembélé', role: 'Chief Executive Officer', bio: 'Doctorate in Forensic Structural Engineering. Formerly lead structural inspector for regional ministries. Over 24 years leading heavy civil designs.' },
            { name: 'Eng. Estelle Kamdem', role: 'Director of Operations', bio: 'Master of Civil Engineering from ENSP. Coordinates site logistics, crane routing, scheduling, and concrete procurement operations.' },
            { name: 'Eng. Olivier Nguemo', role: 'Lead Structural Analyst', bio: 'Chief of BIM compliance and structural simulations. Dedicated specialist in Eurocode stress optimization with 15+ years field experience.' }
          ].map((leader, i) => (
            <div key={i} className="p-8 bg-slate-50 dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] text-center space-y-4">
              <div className="w-16 h-16 bg-[#F26A36]/10 text-[#F26A36] rounded-full flex items-center justify-center font-black text-xl mx-auto uppercase">
                {leader.name.split(' ').pop()?.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{leader.name}</h4>
                <p className="text-[10px] text-[#F26A36] font-black uppercase tracking-widest mt-1">{leader.role}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
