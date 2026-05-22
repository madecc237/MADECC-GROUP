import React, { useState } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const CostEstimator: React.FC = () => {
  const [area, setArea] = useState<number>(0);
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    // Real-world baseline rates for Cameroon/Central Africa (approx. XAF per sqm)
    const baseRates = { 
      residential: 350000, // Mid-range villa
      commercial: 650000,  // Modern office block
      industrial: 850000   // High-spec warehouse/factory
    }; 
    const result = area * baseRates[projectType];
    setEstimatedCost(result);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-[#161920] border border-[#262B37] rounded-xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Calculator size={80} />
      </div>

      <h3 className="text-xl font-black mb-6 text-white uppercase tracking-tight flex items-center gap-2">
        <TrendingUp className="text-[#F26A36]" size={20} />
        Executive Cost Estimator
      </h3>

      <form onSubmit={calculateEstimate} className="space-y-5 relative z-10">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#718096]">
            Total Built Area (m²)
          </label>
          <input 
            type="number" 
            className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded text-white focus:outline-none focus:border-[#F26A36]/50 transition-all"
            value={area}
            onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#718096]">
            Project Profile Category
          </label>
          <select 
            className="w-full bg-[#0D0F12] border border-[#262B37] p-3 rounded text-white focus:outline-none focus:border-[#F26A36]/50 transition-all appearance-none"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as any)}
          >
            <option value="residential">Residential Villa / Complex</option>
            <option value="commercial">Commercial Corporate Tower</option>
            <option value="industrial">Industrial Infrastructure</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#F26A36] text-white py-3 rounded font-black uppercase tracking-widest hover:bg-[#ff7b4b] transition-colors shadow-lg shadow-[#F26A36]/10 text-xs"
        >
          Generate Baseline Valuation
        </button>
      </form>

      {estimatedCost !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#718096] mb-1">Forecasted Budget Range</p>
          <p className="text-2xl font-black text-emerald-400">
            {estimatedCost.toLocaleString()} <span className="text-[12px] font-normal opacity-60">XAF</span>
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-[#4A5568] text-[9px]">
            <Info size={10} />
            <span>Estimates based on current regional material indices</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
