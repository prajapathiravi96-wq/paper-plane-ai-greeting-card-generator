import React, { useState } from 'react';
import { FiSettings, FiCheck, FiWifi, FiCpu, FiLock } from 'react-icons/fi';

const AdminSettings = () => {
  const [model, setModel] = useState('gemini-1.5-flash');
  const [rateLimit, setRateLimit] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="text-slate-500 dark:text-purple-300/60 text-sm mt-1">
          Configure API credentials, model variables, rate limits, and checkout logic.
        </p>
      </div>

      {/* SYSTEM STATUS WIDGET */}
      <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 dark:border-purple-800/25 p-6 rounded-3xl space-y-4 shadow-sm transition-colors duration-300">
        <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2">
          <FiWifi className="text-emerald-550 dark:text-emerald-450 animate-pulse" />
          <span>Integration Connectivity</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/20 p-3.5 rounded-xl flex items-center justify-between">
            <span className="text-emerald-800/80 dark:text-emerald-400/80 font-semibold">Gemini LLM API Gateway:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/20 p-3.5 rounded-xl flex items-center justify-between">
            <span className="text-amber-800/80 dark:text-amber-400/80 font-semibold">MongoDB connection:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">FALLBACK (MEMORY_STORE)</span>
          </div>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 dark:border-purple-800/25 p-6 rounded-3xl space-y-6 shadow-sm transition-colors duration-300">
        <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 dark:border-purple-800/20 pb-3">
          <FiCpu className="text-[#7C3AED]" />
          <span>AI & Core Parameters</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-450 dark:text-purple-300/40 uppercase tracking-widest mb-2">
              Gemini LLM Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full md:w-2/3 px-4 py-2.5 bg-white dark:bg-[#1A1145]/40 border border-purple-500/15 dark:border-purple-800/25 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#7C3AED] text-xs font-medium shadow-inner"
            >
              <option value="gemini-1.5-flash" className="dark:bg-[#1A1145] dark:text-white">Gemini 1.5 Flash (Recommended - Fastest)</option>
              <option value="gemini-1.5-pro" className="dark:bg-[#1A1145] dark:text-white">Gemini 1.5 Pro (High-Fidelity Complex Prompting)</option>
              <option value="gemini-2.0-flash-exp" className="dark:bg-[#1A1145] dark:text-white">Gemini 2.0 Flash Experimental</option>
            </select>
            <span className="block text-[10px] text-slate-400 dark:text-purple-300/40 mt-1.5 leading-relaxed font-medium">
              Paper Plane defaults to gemini-1.5-flash to ensure low latency greeting outputs.
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 dark:text-purple-300/40 uppercase tracking-widest mb-2">
              Customer Rate Limiting (Generations / Hour / IP)
            </label>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full md:w-1/3 px-4 py-2.5 bg-white dark:bg-[#1A1145]/40 border border-purple-500/15 dark:border-purple-800/25 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#7C3AED] text-xs font-medium shadow-inner"
              min="5"
              max="200"
            />
            <span className="block text-[10px] text-slate-400 dark:text-purple-300/40 mt-1.5 leading-relaxed font-medium">
              Limits the frequency of Gemini generation calls to control operational API costs.
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 dark:text-purple-300/40 uppercase tracking-widest mb-2">
              Credentials (API Key Status)
            </label>
            <div className="w-full md:w-2/3 relative">
              <FiLock className="absolute left-4 top-3.5 text-slate-450 dark:text-purple-300/40" size={12} />
              <input
                type="password"
                value="••••••••••••••••••••••••••••"
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7FF] dark:bg-[#150E35]/40 border border-purple-500/10 dark:border-purple-800/15 rounded-xl text-slate-400 dark:text-purple-300/30 text-xs cursor-not-allowed font-mono"
              />
            </div>
            <span className="block text-[10px] text-slate-400 dark:text-purple-300/40 mt-1.5 leading-relaxed font-medium">
              Managed securely in your server backend via `GEMINI_API_KEY` in environment variables.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-purple-500/10 dark:border-purple-800/20">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] hover:shadow-md hover:shadow-purple-500/10 transform flex items-center gap-2"
          >
            {saved ? <FiCheck className="text-emerald-300" /> : null}
            <span>{saved ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
