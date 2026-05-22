import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';

const projects = [
  { 
    id: 1, 
    title: 'Maritime Executive Tower', 
    location: 'Yaoundé, Central District', 
    category: 'Commercial', 
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 2, 
    title: 'Bastos Residential Complex', 
    location: 'Yaoundé', 
    category: 'Residential', 
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 3, 
    title: 'Industrial Cold Storage', 
    location: 'Kribi Port', 
    category: 'Industrial', 
    img: 'https://images.unsplash.com/photo-1581094751156-4d2621743048?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 4, 
    title: 'Civic Plaza Bridge', 
    location: 'Dla - Bassa', 
    category: 'Civil Engineering', 
    img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800' 
  }
];

export const PortfolioPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6 mb-20">
        <motion.h2 
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
          viewport={{ once: true }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4"
        >
          Case Studies
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8 uppercase"
        >
          PROJECTS OF <br />
          <span className="text-[#F26A36]">SIGNIFICANCE.</span>
        </motion.h1>
      </section>

      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((p, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={p.id}
            className="group cursor-pointer"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden mb-6">
              <img 
                src={p.img} 
                alt={p.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-[#F26A36] text-white text-[9px] font-black uppercase tracking-widest rounded mb-3 inline-block">
                  {p.category}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{p.title}</h3>
                <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase mt-2">
                  <MapPin size={12} />
                  {p.location}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Structural Audit Passed</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F26A36] hover:gap-4 transition-all">
                Full Specs <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
