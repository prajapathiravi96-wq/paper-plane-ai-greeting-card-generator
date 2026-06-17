import React from 'react';

const CardTemplate = ({ title, content, recipient, sender, occasion, tone, template = 'minimalist' }) => {
  
  // Style mappings based on template selected
  const templates = {
    minimalist: {
      cardClass: "bg-white border-2 border-amber-100 text-slate-800 relative shadow-lg hover:shadow-xl",
      accentBg: "bg-amber-50 text-amber-800 border border-amber-100/50",
      headerFont: "font-serif text-3xl font-normal tracking-wide text-amber-900 border-b border-amber-100 pb-4 text-center mt-4",
      bodyClass: "font-serif italic leading-relaxed text-slate-700 text-lg px-2",
      footerBorder: "border-t border-amber-100 pt-4 text-amber-850 font-serif",
      quoteColor: "text-amber-200/25",
      decorations: (
        <>
          <div className="absolute inset-4 border border-amber-100/60 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-amber-500/80 text-[10px] tracking-widest font-mono">
            ELEGANCE ∙ PAPER PLANE
          </div>
        </>
      )
    },
    modern: {
      cardClass: "bg-slate-950 text-white border border-slate-900 overflow-hidden relative shadow-2xl",
      accentBg: "bg-gradient-to-r from-brand-600 to-accent-indigo text-white shadow-sm",
      headerFont: "font-sans text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent pb-3 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-slate-300 text-base md:text-lg px-2",
      footerBorder: "border-t border-slate-900 pt-4 text-slate-400 font-sans text-sm",
      quoteColor: "text-purple-900/30",
      decorations: (
        <>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-4 border border-slate-800/60 pointer-events-none rounded-2xl"></div>
        </>
      )
    },
    cheerful: {
      cardClass: "bg-gradient-to-tr from-amber-50 to-orange-50 text-amber-950 border-2 border-orange-200 relative shadow-lg",
      accentBg: "bg-orange-100 text-orange-850 border border-orange-200/50",
      headerFont: "font-sans text-3xl font-extrabold text-orange-600 pb-3 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-amber-900 text-lg px-2",
      footerBorder: "border-t border-orange-200 pt-4 text-orange-850 font-sans",
      quoteColor: "text-orange-200/35",
      decorations: (
        <>
          <div className="absolute inset-4 border-2 border-dashed border-orange-200/50 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-2xl">🎉✨</div>
        </>
      )
    },
    romantic: {
      cardClass: "bg-rose-50 text-rose-950 border-2 border-rose-250 relative shadow-lg",
      accentBg: "bg-rose-100 text-rose-800 border border-rose-200/50",
      headerFont: "font-serif text-3xl font-bold text-rose-700 pb-3 text-center mt-4",
      bodyClass: "font-serif italic leading-loose text-rose-900 text-lg px-2",
      footerBorder: "border-t border-rose-250 pt-4 text-rose-800 font-serif",
      quoteColor: "text-rose-200/30",
      decorations: (
        <>
          <div className="absolute inset-4 border border-rose-200/60 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-xl">❤️</div>
          <div className="absolute bottom-6 left-6 text-xl opacity-20">🌹</div>
        </>
      )
    },
    corporate: {
      cardClass: "bg-white border-t-8 border-t-indigo-600 border-x border-b border-slate-200 text-slate-800 relative shadow-lg",
      accentBg: "bg-indigo-50 text-indigo-800 border border-indigo-100/50",
      headerFont: "font-sans text-2xl font-bold tracking-tight text-slate-900 pb-3 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-slate-650 text-base px-2",
      footerBorder: "border-t border-slate-200 pt-4 text-slate-500 font-sans text-xs",
      quoteColor: "text-indigo-100/40",
      decorations: (
        <>
          <div className="absolute inset-4 border border-slate-200/60 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-indigo-400 font-bold text-[10px] tracking-wider">
            PROFESSIONAL
          </div>
        </>
      )
    },
    vintage: {
      cardClass: "bg-gradient-to-br from-[#FCFBF7] to-[#F5EBD3] border-4 border-double border-[#8B5A2B]/40 text-[#4A2E16] relative shadow-lg overflow-hidden",
      accentBg: "bg-[#8B5A2B]/10 text-[#5C3E21] border border-[#8B5A2B]/30",
      headerFont: "font-serif text-3xl font-bold tracking-wide text-[#5C3E21] border-b border-[#8B5A2B]/20 pb-4 text-center mt-4",
      bodyClass: "font-serif italic leading-relaxed text-[#5C3E21] text-lg px-2",
      footerBorder: "border-t border-[#8B5A2B]/20 pt-4 text-[#8B5A2B] font-serif",
      quoteColor: "text-[#8B5A2B]/10",
      decorations: (
        <>
          <div className="absolute inset-4 border border-[#8B5A2B]/20 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-[#8B5A2B]/80 text-[10px] tracking-widest font-mono font-bold">
            RETRO CLASSIC
          </div>
        </>
      )
    },
    galaxy: {
      cardClass: "bg-gradient-to-br from-[#0C0C1E] via-[#170E2B] to-[#250D3D] border border-purple-900/60 text-white relative shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden",
      accentBg: "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm",
      headerFont: "font-sans text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-3 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-purple-100 text-base md:text-lg px-2 font-light",
      footerBorder: "border-t border-purple-900/50 pt-4 text-purple-400 font-mono text-xs",
      quoteColor: "text-purple-500/15",
      decorations: (
        <>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute inset-4 border border-purple-500/10 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-cyan-400 text-xs tracking-wider font-semibold">✨ COSMIC GALAXY</div>
        </>
      )
    },
    watercolor: {
      cardClass: "bg-gradient-to-tr from-[#F0F9FF] via-[#FDF4FF] to-[#FFF1F2] border-2 border-pink-100 text-slate-800 relative shadow-lg overflow-hidden",
      accentBg: "bg-pink-100/60 text-pink-700 border border-pink-200/50",
      headerFont: "font-sans text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent pb-3 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-slate-700 text-lg px-2 font-medium",
      footerBorder: "border-t border-pink-200/60 pt-4 text-slate-600 font-sans",
      quoteColor: "text-pink-300/20",
      decorations: (
        <>
          <div className="absolute top-0 right-0 w-36 h-36 bg-pink-300/15 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-300/15 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute inset-4 border border-pink-200/40 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-[10px] tracking-wider text-pink-500 font-bold uppercase">ARTISTIC</div>
        </>
      )
    }
  };

  const selected = templates[template] || templates.minimalist;

  return (
    <div 
      id="greeting-card-preview"
      className={`w-full max-w-xl aspect-[4/5] mx-auto p-8 md:p-12 rounded-[36px] flex flex-col justify-between relative transition-all duration-300 ${selected.cardClass}`}
    >
      {selected.decorations}

      {/* Card fold paper crease effect down the exact center */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-black/[0.04] to-transparent pointer-events-none z-15"></div>

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex justify-center mb-2">
          <span className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${selected.accentBg}`}>
            {occasion}
          </span>
        </div>
        <h2 className={selected.headerFont}>
          {title}
        </h2>
      </div>

      {/* Card Body with Elegant Quote Marks */}
      <div className="flex-1 flex flex-col justify-center my-4 relative z-10 px-4">
        <span className={`absolute -top-8 left-2 text-7xl font-serif select-none pointer-events-none ${selected.quoteColor}`}>“</span>
        
        <p className={`whitespace-pre-line text-center relative z-10 ${selected.bodyClass}`}>
          {content}
        </p>

        <span className={`absolute -bottom-14 right-2 text-7xl font-serif select-none pointer-events-none ${selected.quoteColor}`}>”</span>
      </div>

      {/* Card Footer */}
      <div className={`flex justify-between items-center text-sm relative z-10 ${selected.footerBorder}`}>
        <div>
          <span className="opacity-60 block text-[9px] uppercase tracking-widest font-semibold">For</span>
          <span className="font-bold">{recipient}</span>
        </div>
        <div className="text-right">
          <span className="opacity-60 block text-[9px] uppercase tracking-widest font-semibold">From</span>
          <span className="font-bold">{sender}</span>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
