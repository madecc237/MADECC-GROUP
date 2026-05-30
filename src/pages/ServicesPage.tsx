import React from 'react';
import { motion } from 'motion/react';
import { HardHat, Ruler, TrendingUp, ShieldCheck, Factory, Home, Landmark, Building } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const services = [
  { 
    title: 'Residential Complexes', 
    icon: Home, 
    desc: 'High-end luxury apartments, gated estates, and multi-family residential towers designed for maximum stability, thermal comfort, and longevity. We integrate energy-independent solar grids, centralized water filtration networks, and modern architectural aesthetics to deliver state-of-the-art livability hubs across Central African capitals.',
    details: [
      'Eurocode 2 Structural Stability Verification', 
      'Advanced MEP (Mechanical, Electrical, Plumbing) Layouts', 
      'Integrated Solar Micro-Grid & Power Storage',
      'Non-Destructive Sonic Concrete Testing',
      'Smart Automated Security Integrations'
    ]
  },
  { 
    title: 'Commercial Skyscrapers', 
     icon: Building, 
     desc: 'High-rise corporate headquarters, multi-use skyscrapers, and office complexes engineered with advanced heavy-load frames to anchor metropolitan growth. We optimize floor space ratios using structural composite steel-concrete columns and utilize architectural double-skin glass curtain walls to substantially reduce energy dissipation and climate stress.',
     details: [
       'High-Load Composite Column Engineering', 
       'Thermodynamic Curtain Wall Ventilation Systems', 
       'LEED Gold Standard Building Efficiency',
       'Integrated High-Speed Fiber Ingress Routing',
       'Active Seismic Dampening & Sway Control Models'
     ]
  },
  { 
    title: 'Industrial Facilities', 
    icon: Factory, 
    desc: 'Massive factory campuses, temperature-regulated cold storage units, logistical shipping centers, and heavy-duty warehouses. Designed with deep-friction piles and thick concrete raft floorings to resist repetitive dynamic vibrations, structural shear forces, and excessive load requirements of industrial tooling.',
    details: [
      'Seismic Raft Foundation and Pile Cap Integrity', 
      'Multi-Zone Thermal Regulation Insulation Barriers', 
      'Automated Gantry Crane Rail Alignment Blueprints',
      'Vibration Diagnostic Isolation Dampeners',
      'High-Durability Epoxy Coated Floor Slabs'
    ]
  },
  { 
    title: 'Civil Engineering', 
    icon: Landmark, 
    desc: 'Bridges of extensive scale, integrated subterranean drainage networks, heavy transport highways, and municipal water channels. Our senior operations crew handles complex geotechnical mapping, bridge cantilever calculations, and water discharge analytics to secure municipal routes against flood disruptions and geomorphic erosion.',
    details: [
      'Comprehensive Micro-Deep Soil Borings and SPT Diagnostics', 
      'Hydraulic Outflow Expansion Sizing Analytics', 
      'Pre-Stressed Concrete Cantilever Overpass Execution',
      'Multi-Axial Stress Test Monitoring Systems',
      'Anti-Erosion Subterranean Support Bulkheads'
    ]
  }
];

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <Helmet>
        <title>Engineering & Construction Services - MADECC Conglomerate</title>
        <meta name="description" content="Explore MADECC's heavy-duty construction services: premium residential complexes, civil engineering, industrial warehouses, geotechnical surveys, and BIM modeling in Yaoundé." />
        <meta name="keywords" content="construction services cameroon, geotechnical structural audits, concrete pouring specialists yaounde, infrastructure builders africa" />
        <link rel="canonical" href="https://madecc-construction.com/services" />
      </Helmet>
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

      {/* Lab Control and Geotechnical Specifications Section - Highly valuable for SEO */}
      <section className="container mx-auto px-6 py-24 border-t border-slate-200 dark:border-[#262B37] mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26A36] mb-4">Material Diagnostics</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 leading-tight">
              MATERIALS LAB <br />CONTROL PROTOCOLS
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium uppercase tracking-tight leading-relaxed mb-6 text-sm">
              Our in-house material science division operates 24/7, conducting rigorous quality checks and diagnostic tests to verify raw concrete and load-bearing steel conform to Eurocode parameters. We operate in collaboration with Labogen Cameroon and international technical bureau supervisors to deliver uncompromised safety indices across all structural elements.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-[#161920] rounded-xl border border-slate-100 dark:border-[#262B37] flex items-center gap-4">
                <span className="text-[#F26A36] font-black text-lg">01.</span>
                <div>
                  <h4 className="text-xs font-black uppercase dark:text-white">Ultrasonic Concrete Testing</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Systematic non-destructive ultrasonic pulse velocity scans to map out void profiles inside main pillars.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#161920] rounded-xl border border-slate-100 dark:border-[#262B37] flex items-center gap-4">
                <span className="text-[#F26A36] font-black text-lg">02.</span>
                <div>
                  <h4 className="text-xs font-black uppercase dark:text-white">Tensile Carbon-Steel Pull Auditing</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Yield-limit stress testing on steel sample bars to confirm load limits prior to assembling rebar cages.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8">
              <h4 className="text-xl font-black uppercase tracking-tight text-[#F26A36]">Standard Concrete Strength Classes</h4>
              <p className="text-xs text-slate-400 leading-loose font-medium uppercase tracking-tight">
                MADECC Group maintains absolute control over concrete aggregate grading, water-cement ratios, and additive mixtures to ensure optimal compressive strengths. Below is our baseline classification grid enforced across yaoundé and Douala field operations:
              </p>
              <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="pb-3 text-[#F26A36]">Strength Class</th>
                    <th className="pb-3">Cylinder strength</th>
                    <th className="pb-3 text-right">Primary Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="py-3 text-[#F26A36]">C25/30</td>
                    <td className="py-3">25 MPa / 30 MPa</td>
                    <td className="py-3 text-right">Standard Ground Slabs and Rafts</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-[#F26A36]">C30/37</td>
                    <td className="py-3">30 MPa / 37 MPa</td>
                    <td className="py-3 text-right">Reinforced Beams and Core Slabs</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-[#F26A36]">C40/50</td>
                    <td className="py-3">40 MPa / 50 MPa</td>
                    <td className="py-3 text-right">Heavy-Load High-Rise Core Columns</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-[#F26A36]">C50/60</td>
                    <td className="py-3">50 MPa / 60 MPa</td>
                    <td className="py-3 text-right">Pre-Stressed Cantilevers & Bridge Mains</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                *All concrete specimens undergo 28-day water-immersion curing and hydraulic crush verification.
              </p>
            </div>
          </div>
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
