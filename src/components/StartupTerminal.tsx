import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Lock, AlertTriangle, Cpu, Command } from 'lucide-react';

interface StartupTerminalProps {
  onAccessGranted: (key: string, role: string, name: string) => void;
}

export const StartupTerminal: React.FC<StartupTerminalProps> = ({ onAccessGranted }) => {
  const [terminalText, setTerminalText] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = [
    "> MADECC_EXECUTIVE_OS [v4.2.1-STABLE]",
    "> CONNECTING TO YAOUNDE_NODE_01...",
    "> ENCRYPTION KEY HANDSHAKE: AES-256-GCM",
    "> ...........",
    "> SYSTEM_ROOT: AUTHORIZATION_LEVEL_REQUIRED"
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalText(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleKeyVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate Backend Key Verification with Role Mapping
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const key = inputKey.toUpperCase();
      let role = "";
      let name = "";

      // CEO Staff Members - Production Keys
      if (key === 'MADECC-CEO-NDI') { role = "CEO"; name = "Jean-Paul Ndi"; }
      else if (key === 'MADECC-EDT-ALPHA') { role = "CONTENT EDITOR"; name = "PR Team Alpha"; }
      else if (key === 'MADECC-FIN-NJOLE') { role = "FINANCIAL OFFICER"; name = "Marthe Njole"; }
      else if (key === 'MADECC-MGR-KALOU') { role = "PROJECT MANAGER"; name = "Bonaventure Kalou"; }
      else if (key === 'MADECC-SEC-SONG') { role = "SECRETARY"; name = "Rigobert Song"; }
      else if (key === 'MADECC-ACC-MBOMA') { role = "ACCOUNTANT"; name = "Patrick Mboma"; }
      else if (key === '1234') { role = "CEO"; name = "Jean-Paul Ndi"; } // Master Debug Key
      
      // Generic Key Patterns
      else if (key.startsWith('MADECC-CEO')) { role = "CEO"; name = "Executive Authority"; }
      else if (key.startsWith('MADECC-PM')) { role = "Project Manager"; name = "Site Manager"; }
      else if (key.startsWith('MADECC-CFO')) { role = "Financial Officer"; name = "Treasury Officer"; }
      else if (key.startsWith('MADECC-SEC')) { role = "Secretary"; name = "Administrative Staff"; }
      else if (key.startsWith('MADECC-ENG')) { role = "Engineer"; name = "Field Engineer"; }
      else if (key.startsWith('MADECC-ACC')) { role = "Accountant"; name = "Finance Assistant"; }
      else if (key.startsWith('MADECC-EDT')) { role = "Content Editor"; name = "PR Team"; }

      if (role) {
        // Log successful access for security terminal
        try {
          await fetch('/api/auth/log-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, role, name })
          });
        } catch (err) {
          console.error('Failed to log access audit:', err);
        }

        setTerminalText(prev => [...prev, `>> ACCESS_GRANTED: USER_${name.toUpperCase().replace(/\s/g, '_')}_IDENTIFIED`]);
        setTerminalText(prev => [...prev, `>> PROTOCOL_${role.toUpperCase().replace(/\s/g, '_')}_STRICT_ACCESS_LIVE`]);
        setTimeout(() => {
          onAccessGranted(key, role, name);
        }, 1000);
      } else {
        setError("CRITICAL: UNAUTHORIZED COMMAND KEY. TRACING LOGGED.");
        setTerminalText(prev => [...prev, ">> SECURITY_ALERT: UNKNOWN_FINGERPRINT_DETECTED"]);
        setLoading(false);
      }
    } catch (err) {
      setError("SYSTEM_TIMEOUT: SECURE_CHANNEL_INTERRUPTED");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-500 font-mono flex flex-col justify-center items-center p-6 overflow-hidden relative selection:bg-emerald-500 selection:text-black">
      {/* Background Grid & Scanline */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-[#080808] border border-emerald-500/20 p-8 rounded shadow-[0_0_100px_-20px_rgba(16,185,129,0.15)] relative z-10"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-8 border-b border-emerald-500/10 pb-4">
          <div className="flex items-center gap-3">
             <Cpu size={18} className="animate-pulse" />
             <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Executive Command Interface</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-emerald-500/50">
             <Command size={12} />
             SECURE_SESSION_ACTIVE
          </div>
        </div>

        <div className="space-y-3 mb-10 h-32 overflow-hidden text-xs">
          {terminalText.map((line, idx) => (
            <motion.p 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={idx}
              className={line && line.includes('GRANTED') ? 'text-emerald-400 font-bold' : 'text-emerald-500/60'}
            >
              {line}
            </motion.p>
          ))}
          {loading && (
            <p className="inline-block animate-pulse">Establishing handshake<span className="animate-bounce">...</span></p>
          )}
        </div>

        {!loading && (
          <form onSubmit={handleKeyVerification} className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <input 
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                autoFocus
                placeholder="ENTER COMMAND KEY..."
                className="relative w-full bg-black border border-emerald-500/40 rounded p-4 text-emerald-400 placeholder:text-emerald-900 focus:outline-none focus:border-emerald-400 font-mono tracking-widest text-sm"
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-emerald-900 font-bold uppercase tracking-widest">
               <span>Input: Alpha-Numeric Encrypted</span>
               <span>Level: Classified</span>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/20 border border-red-900/50 text-red-500 text-[10px] flex items-center gap-3"
              >
                <AlertTriangle size={16} />
                {error}
              </motion.div>
            )}
          </form>
        )}

        <div className="mt-12 pt-4 border-t border-emerald-500/10 flex justify-between items-center text-[8px] text-emerald-900 uppercase">
           <span>Node: YDE-GATE-01</span>
           <span>Status: Monitoring Access</span>
           <span>Uptime: 99.98%</span>
        </div>
      </motion.div>

      {/* Decorative Footers */}
      <div className="fixed bottom-4 left-6 text-[9px] text-emerald-900 uppercase font-black tracking-widest flex flex-col gap-1">
         <span>Trace: Operational</span>
         <span>IP: 102.***.***.11</span>
      </div>
    </div>
  );
};
