import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, X, ShieldCheck, HardHat, Ruler } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const projects = [
  { 
    id: 1, 
    title: 'Maritime Executive Tower', 
    location: 'Yaoundé, Central District', 
    category: 'Commercial', 
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    lead: 'Dr. Marc-Antoine Dembélé',
    duration: '22 Months',
    volume: '8,400 m³ C40/50 Concrete',
    steel: '1,200 Tons High-Yield Reinforcement',
    specs: 'A 22-story commercial core utilizing state-of-the-art sliding shutter frameworks and pre-stressed tension tendons. Designed fully under Eurocode 2 (EN 1992-1-1) with dual central elevator shafts serving as primary shear-bearing walls to absorb dynamic wind vectors and geotechnical tremors.'
  },
  { 
    id: 2, 
    title: 'Bastos Residential Complex', 
    location: 'Yaoundé, Bastos', 
    category: 'Residential', 
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    lead: 'Eng. Estelle Kamdem',
    duration: '16 Months',
    volume: '5,800 m³ C30/37 Concrete',
    steel: '720 Tons High-Yield Carbon-Steel',
    specs: 'An ultra-modern compound consisting of 6 separate structural residential blocks. Engineered with dynamic moisture barrier assemblies and high-grade thermal composite core cladding to assure maximum energy-saving parameters and microclimate regulation in tropical weather variables.'
  },
  { 
    id: 3, 
    title: 'Industrial Cold Storage', 
    location: 'Kribi Deep Seaport Gate', 
    category: 'Industrial', 
    img: 'https://images.unsplash.com/photo-1581094751156-4d2621743048?auto=format&fit=crop&q=80&w=800',
    lead: 'Eng. Olivier Nguemo',
    duration: '12 Months',
    volume: '6,200 m³ High-Slump Rafting Concrete',
    steel: '980 Tons Structural Steel I-Beams',
    specs: 'Heavy load-bearing industrial transfer terminal spanning 22,000 square meters. Framed with high-strength structural steel trusses and resting upon friction pile caps sunk 34 meters deep. Incorporates extensive concrete raft slabs coated with thick industrial epoxy composites.'
  },
  { 
    id: 4, 
    title: 'Civic Plaza Overpass', 
    location: 'Douala - Bassa District', 
    category: 'Civil Engineering', 
    img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800',
    lead: 'Dr. Marc-Antoine Dembélé',
    duration: '18 Months',
    volume: '9,600 m³ C50/60 Pre-Stressed Concrete',
    steel: '1,550 Tons High-Tensile Rebar Cables',
    specs: 'Four-lane urban traffic expansion overpass. Outfitted with pre-stressed cantilever spans and elastomeric seismic bearing pads. Geotechnical drilling confirmed dense bedrock anchoring, utilizing multi-axial tensioning parameters to ensure absolute structural balance under massive logistics tonnage.'
  },
  { 
    id: 5, 
    title: 'Yaoundé Green Tech Hub', 
    location: 'Yaoundé, University District', 
    category: 'Commercial', 
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    lead: 'Eng. Olivier Nguemo',
    duration: '14 Months',
    volume: '4,100 m³ Eco-Aggregate Concrete',
    steel: '450 Tons Recycled High-Strength Steel',
    specs: 'A three-story green technologies research compound featuring thermoelectrical cooling structures, open natural lighting pathways, and double-skin glass ventilation covers. Designed strictly in coordination with LEED energy compliance guidelines and regional development frameworks.'
  },
  { 
    id: 6, 
    title: 'Mvan Logistics Warehouse', 
    location: 'Yaoundé, Mvan Depot', 
    category: 'Industrial', 
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    lead: 'Eng. Estelle Kamdem',
    duration: '10 Months',
    volume: '3,800 m³ High-Durability C25/30 Concrete',
    steel: '650 Tons Steel Frame Assemblies',
    specs: 'Industrial storage and material staging facility built as a prime logistical hub for regional imports and exports. The flooring system is reinforced with dense double steel lattices and aggregate fillers, certified to withhold up to 60 kN per square meter of continuous heavy machinery weight.'
  }
];

export const PortfolioPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  return (
    <div className="pt-32 pb-20">
      <Helmet>
        <title>Our Portfolio & Projects - MADECC Construction Conglomerate</title>
        <meta name="description" content="Explore MADECC's heavy-duty industrial towers, commercial plazas, overpasses, and regional logistics depots. Our projects stand as civil engineering marvels in Cameroon." />
        <meta name="keywords" content="construction projects cameroon, portfolio heavy civil, commercial logistics towers, civil infrastructures projects" />
        <link rel="canonical" href="https://madecc-construction.com/portfolio" />
      </Helmet>
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white dark:bg-[#161920] border border-slate-200 dark:border-[#F26A36]/30 rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full space-y-8 shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#F26A36] text-white text-[9px] font-black uppercase tracking-widest rounded inline-block">
                  {selectedProject.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  {selectedProject.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                  <MapPin size={12} className="text-[#F26A36]" />
                  {selectedProject.location}
                </div>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#262B37]">
                <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-[#0D0F12] rounded-2xl border border-slate-100 dark:border-white/5">
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Project Lead</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedProject.lead}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedProject.duration}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Material Volume</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedProject.volume}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Structural Steel</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{selectedProject.steel}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Technical Summary & Structural Standards</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed">
                  {selectedProject.specs}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 py-4 bg-[#F26A36] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ff7b4b] transition-all"
                >
                  Close Specification Suite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onClick={() => setSelectedProject(p)}
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
                  <MapPin size={12} className="text-[#F26A36]" />
                  {p.location}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                Structural Audit Passed
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F26A36] hover:gap-4 transition-all"
              >
                Full Specs <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
