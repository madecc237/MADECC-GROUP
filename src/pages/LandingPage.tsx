import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Building2, HardHat, Ruler, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden text-white">
          {/* SEO Background Video Placeholder */}
          <div className="absolute inset-0 bg-[#000]">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-40 grayscale mix-blend-screen"
              poster="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-construction-site-at-sunset-41666-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#F26A36_1px,transparent_1px),linear-gradient(to_bottom,#F26A36_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_100%,transparent_100%)] opacity-10"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#0D0F12] via-transparent to-white dark:to-[#0D0F12]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#F26A36]/10 text-[#F26A36] rounded-full border border-[#F26A36]/20 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Shield size={12} />
              Constructing Excellence since 2012
            </motion.div>
            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter text-slate-900 dark:text-white leading-[0.82] mb-8 uppercase">
              STRUCTURAL <br />
              <motion.span 
                initial={{ color: "#ffffff" }}
                animate={{ color: "#F26A36" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                EXECUTION
              </motion.span> <br />
              AT SCALE.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mb-10 leading-relaxed uppercase tracking-tight">
              Central Africa's leading engineering firm for complex infrastructure, industrial towers, and high-modernity residential complexes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/portfolio" className="px-10 py-5 bg-[#F26A36] text-white font-black uppercase tracking-widest rounded-xl shadow-2xl shadow-[#F26A36]/30 hover:bg-[#ff7b4b] transition-all flex items-center justify-center gap-2">
                {t('common.viewPortfolio')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center justify-center">
                {t('common.contactOffice')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="absolute bottom-10 right-0 left-0">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Sites Completed', val: '450+' },
              { label: 'Active Engineers', val: '142' },
              { label: 'Capital Managed', val: '2.5B' },
              { label: 'Safety Index', val: '99%' }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                key={stat.label}
              >
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F26A36]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-32 bg-slate-50 dark:bg-[#161920]/50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4">Our Services</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
                COMPREHENSIVE <br /> TECHNICAL CONTROL.
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest max-w-sm">
              From soil analysis to structural handovers, we manage every layer of construction complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Project Management', desc: 'Full-cycle field operations command for large-scale infrastructure.', icon: HardHat },
              { title: 'Structural Design', desc: 'Advanced engineering blueprints and structural integrity audits.', icon: Ruler },
              { title: 'Technical Audit', desc: 'Fiscal and physical progress monitoring for external stakeholders.', icon: TrendingUp },
            ].map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 bg-white dark:bg-[#161920] rounded-2xl border border-slate-200 dark:border-[#262B37] shadow-xl"
              >
                <div className="w-12 h-12 bg-[#F26A36]/10 rounded-xl flex items-center justify-center text-[#F26A36] mb-6">
                  <service.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{service.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Mission */}
      <section className="py-32">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1503387762-592dee58c42b?auto=format&fit=crop&q=80&w=1000" 
              alt="Mission Site" 
              className="rounded-3xl shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F26A36]/10 rounded-full blur-3xl"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight uppercase tracking-tighter italic">
              BUILT ON <span className="text-[#F26A36]">PRECISION</span> <br />
              DRIVEN BY TRUST.
            </h2>
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                MADECC Group stands at the forefront of structural innovation in Central Africa. Our methodology integrates advanced BIM modeling with rigorous field execution to ensure that every infrastructure project meets international safety and durability standards. We don't just build structures; we engineer the foundations of economic growth.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                Our team of certified engineers, project managers, and technical auditors work in unison to deliver excellence across Cameroon and beyond. From the dynamic landscapes of Yaoundé to the varied terrains of the hinterlands, our expertise adapts to local geotechnial challenges while maintaining global engineering excellence.
              </p>
              <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-[#262B37] rounded-xl">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                   <p className="text-xs font-black dark:text-white uppercase">ISO 9001 Certified Operations</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Quality Management Standard</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-20 bg-[#0D0F12] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">ENGINEERING INTEGRITY & <span className="text-[#F26A36]">TRANSPARENCY</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[#F26A36] font-black uppercase tracking-widest text-sm">Our Philosophy</h4>
                <p className="text-xs text-slate-400 leading-loose font-medium uppercase tracking-tight">
                  We maintain absolute transparency in project budgets and material sourcing. Every ton of steel and cubic meter of concrete is tracked via our digital command center, ensuring zero compromise on material quality for our clients.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[#F26A36] font-black uppercase tracking-widest text-sm">Environmental Commitment</h4>
                <p className="text-xs text-slate-400 leading-loose font-medium uppercase tracking-tight">
                  MADECC is committed to sustainable construction. We optimize resource use and implement waste management protocols on all active sites to minimize our ecological footprint while maximizing structural longevity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
