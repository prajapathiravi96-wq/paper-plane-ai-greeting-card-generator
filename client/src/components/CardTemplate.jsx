import React from 'react';

const CardTemplate = ({ title, content, recipient, sender, occasion, tone, template = 'birthday', imageUrl = null, flipped = false }) => {
  
  // High-end template configurations matching requested themes
  const templates = {
    birthday: {
      cardClass: "bg-gradient-to-tr from-[#FFF9E6] via-[#FFF0F3] to-[#F3EBFF] text-purple-950 border-2 border-purple-200/50 shadow-xl hover:shadow-2xl hover:border-purple-300",
      accentBg: "bg-purple-100 text-purple-800 border border-purple-250/30",
      headerFont: "font-serif text-3xl font-extrabold tracking-wide text-purple-900 border-b border-purple-200/40 pb-4 text-center mt-4",
      bodyClass: "font-serif italic leading-relaxed text-slate-700 text-lg px-2",
      footerBorder: "border-t border-purple-200/40 pt-4 text-purple-900 font-serif",
      quoteColor: "text-purple-300/20",
      decorations: (
        <>
          {/* Balloons and Confetti Decals */}
          <div className="absolute inset-4 border border-purple-200/30 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 left-6 text-2xl select-none animate-bounce">🎈</div>
          <div className="absolute top-6 right-6 text-2xl select-none animate-pulse">🎂</div>
          <div className="absolute bottom-16 right-6 text-xl select-none opacity-20">✨</div>
          <div className="absolute bottom-16 left-6 text-xl select-none opacity-20">🎉</div>
        </>
      )
    },
    anniversary: {
      cardClass: "bg-gradient-to-tr from-[#FFF0F3] via-[#FFE4E6] to-[#FFF5F5] text-rose-950 border-2 border-rose-200 shadow-xl hover:shadow-2xl hover:border-rose-300",
      accentBg: "bg-rose-100 text-rose-800 border border-rose-200/40",
      headerFont: "font-serif text-3xl font-bold tracking-wide text-rose-800 border-b border-rose-200/40 pb-4 text-center mt-4",
      bodyClass: "font-serif italic leading-loose text-rose-900/90 text-lg px-2",
      footerBorder: "border-t border-rose-250/30 pt-4 text-rose-850 font-serif",
      quoteColor: "text-rose-300/20",
      decorations: (
        <>
          {/* Hearts and Roses Decals */}
          <div className="absolute inset-4 border-2 border-double border-rose-200/40 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-2xl select-none">💖</div>
          <div className="absolute top-6 left-6 text-xl select-none opacity-40">🌹</div>
          <div className="absolute bottom-16 right-6 text-xl select-none opacity-20">🌹</div>
          <div className="absolute bottom-16 left-6 text-2xl select-none opacity-30">❤️</div>
        </>
      )
    },
    corporate: {
      cardClass: "bg-gradient-to-br from-[#F0F7FF] via-[#E0EFFF] to-[#F8FAFC] text-blue-950 border border-blue-200/60 shadow-xl hover:shadow-2xl hover:border-blue-300",
      accentBg: "bg-blue-100 text-blue-800 border border-blue-200/40",
      headerFont: "font-sans text-2xl font-bold tracking-tight text-blue-900 border-b border-blue-200/45 pb-4 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-slate-650 text-base px-2",
      footerBorder: "border-t border-blue-200/40 pt-4 text-blue-900/70 font-sans text-xs",
      quoteColor: "text-blue-300/15",
      decorations: (
        <>
          {/* Sleek Blue Geometrics */}
          <div className="absolute inset-4 border border-blue-200/35 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-blue-500 font-mono text-[9px] font-bold tracking-widest bg-blue-50 border border-blue-200/30 px-2 py-0.5 rounded-md">
            PROFESSIONAL
          </div>
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
        </>
      )
    },
    festival: {
      cardClass: "bg-gradient-to-tr from-[#2A104E] via-[#1C0838] to-[#0D021D] text-[#FFE4A3] border border-purple-900/60 shadow-[0_15px_40px_rgba(124,58,237,0.18)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.3)]",
      accentBg: "bg-purple-500/20 text-[#FFE4A3] border border-purple-500/30",
      headerFont: "font-sans text-3xl font-extrabold tracking-wide bg-gradient-to-r from-amber-200 via-orange-350 to-amber-200 bg-clip-text text-transparent border-b border-purple-900/30 pb-4 text-center mt-4",
      bodyClass: "font-serif leading-relaxed text-purple-100 text-lg px-2 font-light",
      footerBorder: "border-t border-purple-900/40 pt-4 text-amber-200/70 font-sans text-xs",
      quoteColor: "text-[#FFE4A3]/10",
      decorations: (
        <>
          {/* Lit diyas and festival patterns */}
          <div className="absolute inset-4 border border-purple-500/10 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 left-6 text-2xl select-none animate-pulse">🪔</div>
          <div className="absolute top-6 right-6 text-2xl select-none animate-pulse">✨</div>
          <div className="absolute bottom-16 right-6 text-xl select-none opacity-20">🪔</div>
          <div className="absolute bottom-16 left-6 text-xl select-none opacity-20">✨</div>
        </>
      )
    },
    friendship: {
      cardClass: "bg-gradient-to-tr from-[#FFFEE5] via-[#EBF7EE] to-[#EBF0FC] text-green-950 border-2 border-dashed border-green-200 shadow-xl hover:shadow-2xl hover:border-green-300",
      accentBg: "bg-green-100 text-green-800 border border-green-200/40",
      headerFont: "font-sans text-3xl font-black text-green-800 border-b border-green-200/40 pb-4 text-center mt-4",
      bodyClass: "font-sans leading-relaxed text-slate-700 text-base px-2 font-medium",
      footerBorder: "border-t border-green-200/40 pt-4 text-green-900 font-sans",
      quoteColor: "text-green-300/25",
      decorations: (
        <>
          {/* Friendly illustrations and smilies */}
          <div className="absolute top-6 right-6 text-2xl select-none animate-bounce">😊</div>
          <div className="absolute top-6 left-6 text-2xl select-none">⭐</div>
          <div className="absolute bottom-16 right-6 text-xl select-none opacity-20">✌️</div>
          <div className="absolute bottom-16 left-6 text-xl select-none opacity-20">💖</div>
        </>
      )
    },
    wedding: {
      cardClass: "bg-gradient-to-tr from-[#FFFDFC] via-[#FDF5E6] to-[#FFF9E6] text-amber-950 border-2 border-double border-amber-300 shadow-[0_20px_50px_rgba(218,165,32,0.12)] hover:shadow-[0_25px_60px_rgba(218,165,32,0.22)]",
      accentBg: "bg-[#FDF5E6] text-amber-800 border border-amber-300/40",
      headerFont: "font-serif text-3xl font-normal tracking-widest text-amber-800 border-b border-amber-250/30 pb-4 text-center mt-4",
      bodyClass: "font-serif italic leading-loose text-amber-900/90 text-lg px-2 font-light",
      footerBorder: "border-t border-amber-250/30 pt-4 text-amber-800 font-serif",
      quoteColor: "text-amber-300/15",
      decorations: (
        <>
          {/* Luxury gold filigrees and rings */}
          <div className="absolute inset-4 border border-amber-300/30 pointer-events-none rounded-2xl"></div>
          <div className="absolute top-6 right-6 text-2xl select-none">💍</div>
          <div className="absolute top-6 left-6 text-2xl select-none opacity-40">🔔</div>
          <div className="absolute bottom-16 right-6 text-xl select-none opacity-20">⚜️</div>
          <div className="absolute bottom-16 left-6 text-xl select-none opacity-20">⚜️</div>
        </>
      )
    }
  };

  // Fallback map for legacy styles
  const fallbackMap = {
    minimalist: 'birthday',
    modern: 'birthday',
    cheerful: 'friendship',
    romantic: 'anniversary',
    corporate: 'corporate',
    vintage: 'wedding',
    galaxy: 'festival',
    watercolor: 'friendship'
  };

  const selectedKey = templates[template] ? template : (fallbackMap[template] || 'birthday');
  const selected = templates[selectedKey];

  return (
    <div className="w-full max-w-xl aspect-[4/5] mx-auto relative [perspective:1000px]">
      <div 
        id="greeting-card-preview"
        className={`w-full h-full rounded-[36px] transition-transform duration-[800ms] [transform-style:preserve-3d] relative ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT VIEW */}
        <div 
          className={`absolute inset-0 p-8 md:p-12 rounded-[36px] flex flex-col justify-between [backface-visibility:hidden] transition-all duration-300 ${
            selected.cardClass
          }`}
        >
          {selected.decorations}

          {/* Card fold crease line in exact center */}
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

          {/* Card Body with Quote Marks */}
          <div className="flex-1 flex flex-col justify-center my-2 relative z-10 px-4 overflow-hidden">
            <span className={`absolute -top-6 left-2 text-6xl font-serif select-none pointer-events-none ${selected.quoteColor}`}>“</span>
            
            {/* Polaroid photo frame with picture inside */}
            {imageUrl && (
              <div className="mb-3 mx-auto w-44 max-w-full aspect-[4/3] rounded bg-white p-1.5 shadow-md border border-slate-200/40 rotate-[-1.5deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-300 flex-shrink-0 relative overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Memory representation" 
                  className="w-full h-full object-cover rounded-sm"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent"></div>
              </div>
            )}

            <p className={`whitespace-pre-line text-center relative z-10 max-h-[160px] overflow-y-auto ${selected.bodyClass}`}>
              {content}
            </p>

            <span className={`absolute -bottom-12 right-2 text-6xl font-serif select-none pointer-events-none ${selected.quoteColor}`}>”</span>
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

        {/* BACK VIEW */}
        <div 
          className={`absolute inset-0 p-8 md:p-12 rounded-[36px] flex flex-col justify-between items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300 ${
            selected.cardClass
          }`}
        >
          <div className="absolute inset-4 border border-purple-500/10 pointer-events-none rounded-2xl"></div>

          {/* Crease line on back */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-black/[0.04] to-transparent pointer-events-none z-15"></div>

          <div className="flex-1 flex flex-col justify-center items-center gap-4 z-10">
            {/* Paper Plane logo icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
              ✈️
            </div>
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-purple-800 to-indigo-800 dark:from-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Paper Plane Studio
              </h4>
              <p className="text-[9px] text-slate-400 dark:text-purple-300/40 mt-1 font-mono uppercase tracking-widest font-bold">
                Handcrafted with AI Magic
              </p>
            </div>
          </div>

          {/* barcode decalc */}
          <div className="w-full flex flex-col items-center gap-1 opacity-40 dark:opacity-20 z-10">
            <div className="h-5 w-32 bg-repeat-x" style={{ backgroundImage: 'linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px, transparent 7px, currentColor 7px, currentColor 10px, transparent 10px)' }}></div>
            <span className="text-[7px] font-mono tracking-widest text-slate-700 dark:text-purple-100">PP-GREETING-CARD-2206</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
