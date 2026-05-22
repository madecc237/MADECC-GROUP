import React from 'react';
import { motion } from 'motion/react';
import { HardHat, Ruler, TrendingUp, ShieldCheck, Factory, Home, Landmark, Building } from 'lucide-react';

const services = [
  { 
    title: 'Residential Complexes', 
    icon: Home, 
    desc: 'High-end luxury apartments and secure living estates with sustainable energy infrastructure.',
    details: ['Structural Stability', 'Advanced MEP Systems', 'Smart Security Integration']
  },
  { 
    title: 'Commercial Skyscrapers', 
     icon: Building, 
     desc: 'Corporate towers and office hubs designed for Central Africa\'s growing economic centers.',
     details: ['Curtain Wall Engineering', 'High-Speed Grid Systems', 'LEED-Standard Efficiency']
  },
  { 
    title: 'Industrial Facilities', 
    icon: Factory, 
    desc: 'Heavy-duty structural frames for factories, cold storage warehouses, and logistics hubs.',
    details: ['Heavy Load Foundations', 'Thermal Management', 'Automated Logistics Flow']
  },
  { 
    title: 'Civil Engineering', 
    icon: Landmark, 
    desc: 'Bridge construction, drainage networks, and road infrastructure projects of massive scale.',
    details: ['Soil Mechanics', 'Hydraulic Systems', 'Reinforced Concrete']
  }
];

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6 mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4">Capabilities</h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8 uppercase">
            ENGINEERING <br />
            WITHOUT <span className="text-[#F26A36]">COMPROMISE.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight max-w-xl">
            We provide turn-key construction management and structural design for the most ambitious projects in the region.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={service.title}
              className="p-10 bg-slate-50 dark:bg-[#161920] rounded-3xl border border-slate-200 dark:border-[#262B37] hover:border-[#F26A36]/30 transition-all group"
            >
              <div className="w-16 h-16 bg-white dark:bg-[#0D0F12] rounded-2xl shadow-xl flex items-center justify-center text-[#F26A36] mb-8 group-hover:scale-110 transition-transform">
                <service.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 uppercase tracking-tight">
                {service.desc}
              </p>
              <ul className="space-y-3">
                {service.details.map(detail => (
                  <li key={detail} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <ShieldCheck size={14} className="text-[#F26A36]" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Callout */}
      <section className="mt-32 bg-[#F26A36] py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
            READY TO <br /> BASELINE YOUR SITE?
          </h3>
          <div className="flex gap-4">
            <button className="px-10 py-5 bg-white text-[#F26A36] font-black uppercase tracking-widest rounded-xl shadow-2xl shadow-black/20 hover:scale-105 transition-all">
              Request Quote
            </button>
            <button className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all">
              Case Studies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
