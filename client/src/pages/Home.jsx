import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCpu, 
  FiArrowRight, 
  FiHeart,
  FiZap,
  FiCheckCircle,
  FiStar,
  FiAward,
  FiSmile
} from 'react-icons/fi';

const Home = () => {
  
  // Animation presets for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 35, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const floatAnimation = (delay = 0, duration = 6) => ({
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  });

  return (
    <div className="relative bg-[#F8F4FF] overflow-hidden min-h-screen text-[#0F172A]">
      
      {/* ======================================================
          BACKGROUND REDESIGN & DECORATIONS
          ====================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Layer 1: Large Blurred Purple Gradient Blobs */}
        {/* Top Left: Purple Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#7C3AED]/20 blur-[120px] mix-blend-multiply opacity-80"></div>
        {/* Top Right: Lavender Glow */}
        <div className="absolute -top-[5%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#EDE9FE]/25 blur-[120px] mix-blend-multiply opacity-90"></div>
        {/* Bottom Left: Pink-Purple Glow */}
        <div className="absolute bottom-[10%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-[#A855F7]/20 blur-[120px] mix-blend-multiply opacity-80"></div>
        {/* Bottom Right: Light Violet Glow */}
        <div className="absolute -bottom-[5%] -right-[5%] w-[55vw] h-[55vw] rounded-full bg-[#C084FC]/25 blur-[120px] mix-blend-multiply opacity-85"></div>

        {/* Layer 2: Floating Decorative Shapes */}
        {[
          { char: '✈️', top: '12%', left: '6%', delay: 0, scale: 1 },
          { char: '💖', top: '40%', left: '4%', delay: 1, scale: 0.9 },
          { char: '✨', top: '22%', left: '90%', delay: 0.5, scale: 1.1 },
          { char: '🎁', top: '60%', left: '94%', delay: 1.5, scale: 0.85 },
          { char: '✉️', top: '78%', left: '8%', delay: 2, scale: 1 },
          { char: '⭐', top: '85%', left: '88%', delay: 0.8, scale: 0.95 }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute text-3xl select-none opacity-[0.12] text-purple-700"
            style={{ top: item.top, left: item.left, scale: item.scale }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, 15, -15, 0],
              scale: [item.scale, item.scale * 1.08, item.scale * 0.92, item.scale]
            }}
            transition={{
              duration: 8 + idx * 2,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.char}
          </motion.div>
        ))}

        {/* Layer 3: Animated Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#7C3AED' : '#C084FC',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -45, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [0.8, 1.4, 0.8]
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* ======================================================
          HERO SECTION
          ====================================================== */}
      <section className="relative z-10 py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Giant Watermark behind Hero content */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black text-purple-600/[0.03] select-none pointer-events-none tracking-[0.25em] font-sans blur-[10px] whitespace-nowrap">
          ✈ PAPER PLANE
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Hero Content Left */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-7 space-y-8 text-left relative"
          >
            {/* Giant glowing purple orb behind the title text */}
            <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.22)_0%,rgba(168,85,247,0.06)_50%,transparent_100%)] blur-[90px] pointer-events-none z-0"></div>

            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1] relative z-10">
              Perfect Words.<br />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                Beautiful Cards.
              </span><br />
              Done in Seconds.
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 max-w-xl leading-relaxed relative z-10 font-medium">
              Paper Plane uses advanced generative AI to craft heartfelt, funny, or professional greeting card messages, styled in exquisite designer templates. Attach them to gift orders or download instantly.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-3 relative z-10">
              <Link
                to="/generator"
                className="px-9 py-4.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/35 hover:scale-105 transition-all duration-300 transform flex items-center gap-2.5 text-sm glow-button glow-button-hover"
              >
                <span>Create a Card</span>
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/history"
                className="px-9 py-4.5 rounded-full bg-white/40 backdrop-blur-md border border-purple-200/60 text-slate-700 font-bold hover:bg-white/60 hover:border-purple-300 hover:scale-[1.03] transition-all duration-300 shadow-sm text-sm"
              >
                View Vault
              </Link>
            </div>
          </motion.div>

          {/* Luxury Greeting Card Preview Container Right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Ambient Behind-Card Glow Circle */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/30 to-[#C084FC]/30 rounded-[64px] blur-[80px] opacity-75 pointer-events-none"></div>
            
            {/* Floating illustrations around the preview card */}
            {/* Top Right: Sparkles */}
            <motion.div 
              variants={floatAnimation(0.2, 5.2)}
              animate="animate"
              className="absolute -top-12 right-[10%] text-4xl text-purple-400 select-none z-20 pointer-events-none filter drop-shadow-md"
            >
              ✨
            </motion.div>
            {/* Left: Gift Box Illustration */}
            <motion.div 
              variants={floatAnimation(0.8, 6.8)}
              animate="animate"
              className="absolute top-[40%] -left-16 w-28 h-28 hidden xl:block z-20 pointer-events-none"
            >
              <img src="/gift_box_card.png" alt="Gift box illustration" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>
            {/* Right: Greeting Card Stack (represented by Assistant illustration) */}
            <motion.div 
              variants={floatAnimation(1.4, 7.2)}
              animate="animate"
              className="absolute top-[12%] -right-20 w-32 h-32 hidden xl:block z-20 pointer-events-none"
            >
              <img src="/ai_assistant.png" alt="AI greeting card stack" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>
            {/* Bottom: Paper Airplane Illustration */}
            <motion.div 
              variants={floatAnimation(2, 6.2)}
              animate="animate"
              className="absolute -bottom-16 left-[15%] w-24 h-24 hidden lg:block z-20 pointer-events-none"
            >
              <img src="/paper_airplane_illustration.png" alt="Paper airplane illustration" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>

            {/* Luxury Preview Card Canvas */}
            <motion.div 
              whileHover={{ y: -12, scale: 1.02 }}
              variants={floatAnimation(0, 7)}
              animate="animate"
              className="w-full max-w-md bg-white/75 backdrop-blur-[20px] border border-purple-200/50 p-10 rounded-[40px] shadow-[0_25px_50px_rgba(124,58,237,0.12)] hover:shadow-[0_30px_70px_rgba(124,58,237,0.22)] border-t-white/85 border-l-white/85 hover:border-purple-300/60 transition-all duration-500 relative select-none"
            >
              {/* Crease folded line in center */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none z-10"></div>
              {/* Inner stationery border */}
              <div className="absolute inset-5 border border-purple-500/5 pointer-events-none rounded-[32px]"></div>

              <div className="absolute top-8 right-8 text-[10px] font-mono text-purple-600/70 tracking-widest font-semibold">
                PREMIUM EDITION
              </div>
              
              <div className="mb-6 relative z-10 text-left">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700 border border-purple-250 tracking-wider">
                  Birthday Classic
                </span>
                <h3 className="font-serif text-3xl text-purple-950 mt-6 font-normal tracking-wide leading-tight">
                  Happy 30th, Kabir!
                </h3>
              </div>

              {/* Quotation Marks layout */}
              <div className="relative my-8 px-4">
                <span className="absolute -top-8 -left-2 text-8xl font-serif text-purple-300/30 select-none pointer-events-none">“</span>
                <p className="font-serif italic text-purple-900/80 text-base leading-relaxed text-center relative z-10 font-light">
                  Happy Birthday Kabir! You're officially at the age where a wild night out means leaving the living room lights on. May your day be filled with lots of laughs, zero back pain, and a very large cake.
                </p>
                <span className="absolute -bottom-16 -right-2 text-8xl font-serif text-purple-300/30 select-none pointer-events-none">”</span>
              </div>
              
              <div className="border-t border-purple-100 pt-5 flex justify-between text-sm text-purple-950 font-serif relative z-10 mt-10">
                <div>
                  <span className="block text-[9px] text-purple-500 uppercase tracking-widest font-mono">For</span>
                  <span className="font-bold">Kabir</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-purple-500 uppercase tracking-widest font-mono">From</span>
                  <span className="font-bold">Ayesha</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (LIGHT PURPLE TO WHITE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0] -mt-8">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" fill="url(#waveGradient1)"></path>
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8F4FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ======================================================
          PREMIUM FEATURE SHOWCASE (WHY PAPER PLANE)
          ====================================================== */}
      <section id="features" className="py-28 bg-white relative z-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-5">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              Aesthetics & Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Why Paper Plane is Premium
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Our tool isn't just a basic form—it's a comprehensive design platform built to craft beautiful emotions.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <FiZap className="text-[#7C3AED]" size={26} />,
                title: "⚡ AI Powered Content",
                desc: "Powered by Gemini 1.5 Flash for context-aware, emotionally intelligent greeting messages written instantly."
              },
              {
                icon: <FiHeart className="text-[#7C3AED]" size={26} />,
                title: "🎨 Beautiful Templates",
                desc: "Handcrafted layout templates built for different occasions: Minimalist, Slate Retro, Cosmic, Rose Gold and more."
              },
              {
                icon: <FiCpu className="text-[#7C3AED]" size={26} />,
                title: "🚀 Instant Generation",
                desc: "Export to high-resolution, design-rich PDF files matching real-world folded card geometries with a single click."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[36px] border border-purple-200/50 bg-[#F8F4FF]/50 backdrop-blur-xl hover:bg-white hover:shadow-[0_25px_60px_rgba(124,58,237,0.12)] hover:border-purple-300/80 hover:scale-[1.03] transition-all duration-300 text-left group relative overflow-hidden"
              >
                {/* Glowing light radial backdrop inside cards */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/8 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-white border border-purple-500/10 flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-3 relative z-10">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (WHITE TO LIGHT PURPLE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-[#F8F4FF] fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" fill="url(#waveGradient2)"></path>
          <defs>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8F4FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ======================================================
          VISUAL PIPELINE (HOW IT WORKS)
          ====================================================== */}
      <section id="how-it-works" className="py-24 bg-[#F8F4FF] relative z-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              Step-by-Step
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Three Steps to Card Magic
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Our automated system creates elegant custom copy in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative max-w-5xl mx-auto">
            {/* Background floating paper plane illustration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none">
              <img src="/paper_airplane_illustration.png" alt="floating background airplane" className="w-full h-full object-contain" />
            </div>

            {[
              { num: "01", icon: "👤", title: "1. Customer Input", desc: "Choose occasion, tone, recipient, and sender names." },
              { num: "02", icon: "🤖", title: "2. AI Generator", desc: "Gemini 1.5 writes highly custom emotional messages." },
              { num: "03", icon: "✉️", title: "3. Choose Style", desc: "Select custom designer template card styles." },
              { num: "04", icon: "😊", title: "4. Download Card", desc: "Download high resolution PDF or copy message." }
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-5 relative group"
              >
                <div className="w-18 h-18 rounded-3xl bg-white border border-purple-500/10 shadow-lg flex items-center justify-center text-3xl group-hover:-translate-y-1 group-hover:shadow-purple-500/10 transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Step {step.num}</span>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-semibold">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (LIGHT PURPLE TO WHITE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" fill="url(#waveGradient3)"></path>
          <defs>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8F4FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ======================================================
          PREMIUM ILLUSTRATION DETAILS SPLITS
          ====================================================== */}
      <section className="py-24 bg-white relative z-10 px-6 md:px-12 space-y-36">
        
        {/* Detail Block 1 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              No More Writers Block
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Crafting sentiments shouldn't be a bottleneck
            </h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Writing greetings is always the bottleneck when ordering gifts. Our platform empowers checkout buyers with instant drafts containing custom titles, body paragraphs, and social captions, matching exactly what they want to say.
            </p>
            <Link 
              to="/generator"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7C3AED] hover:text-[#8B5CF6] transition-colors group"
            >
              <span>Explore generator workspace</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="p-5 bg-[#F8F4FF] border border-purple-500/10 rounded-[36px] shadow-xl relative group max-w-lg">
              <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/creator_laptop.png" 
                alt="Creating card laptop" 
                className="max-h-80 w-auto object-contain select-none relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Detail Block 2 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="flex justify-center order-last lg:order-first">
            <div className="p-5 bg-[#F8F4FF] border border-purple-500/10 rounded-[36px] shadow-xl relative group max-w-lg">
              <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/ai_assistant.png" 
                alt="AI assistant generation" 
                className="max-h-80 w-auto object-contain select-none relative z-10"
              />
            </div>
          </div>
          <div className="space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              Generative Intelligence
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Powering conversations with advanced AI
            </h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              We leverage Google Gemini 1.5 Flash models to build structured prompts in English and Hindi. The API generates human-like, emotionally resonant text according to 6 custom tone options (e.g. Romantic, Funny, Formal, Inspirational).
            </p>
          </div>
        </div>

        {/* Detail Block 3 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              Perfect Presentation
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              A complete stationery experience in a box
            </h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Beyond simple copy sentences, Paper Plane provides beautifully themed vector templates and downloads. Every card generates a custom gift tag attachment to deliver a holistic package right to your recipient's hands.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-5 bg-[#F8F4FF] border border-purple-500/10 rounded-[36px] shadow-xl relative group max-w-lg">
              <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/gift_box_card.png" 
                alt="Gift box greeting card" 
                className="max-h-80 w-auto object-contain select-none relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (WHITE TO LIGHT PURPLE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-[#F8F4FF] fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" fill="url(#waveGradient4)"></path>
          <defs>
            <linearGradient id="waveGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8F4FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ======================================================
          TESTIMONIALS
          ====================================================== */}
      <section id="testimonials" className="py-24 bg-[#F8F4FF] relative z-10 px-6 md:px-12 border-t border-purple-500/10 overflow-hidden">
        
        {/* Floating happy customer illustration in background */}
        <div className="absolute top-[20%] right-[10%] w-44 h-44 opacity-10 pointer-events-none hidden xl:block">
          <img src="/happy_customer_illustration.png" alt="Happy Customer Background" className="w-full h-full object-contain" />
        </div>

        {/* Floating celebration illustration in background */}
        <div className="absolute bottom-[20%] left-[8%] w-48 h-48 opacity-10 pointer-events-none hidden xl:block">
          <img src="/celebration_illustration.png" alt="Celebration background illustration" className="w-full h-full object-contain" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-20 relative z-10">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700 tracking-wider">
              User Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Loved by Gifting Enthusiasts
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              See how Paper Plane is changing the gift attachment workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Writing birthday cards was always my bottleneck when sending gifts. Now, Paper Plane generates heartwarming messages in 5 seconds. The PDF styles are gorgeous!",
                author: "Ananya Sharma",
                role: "Product Manager"
              },
              {
                quote: "The tone customizer works like magic. I generated a 'Formal' Corporate Appreciation note for our team and a 'Funny' anniversary text for my brother. Outstanding tool.",
                author: "Vikram Malhotra",
                role: "HR Director"
              },
              {
                quote: "I integrated Paper Plane's generated copy into our custom checkout process. My gift-buying customers absolutely love the personalized captions and gift tag text.",
                author: "Rachel Green",
                role: "E-commerce Founder"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 rounded-[32px] border border-purple-250/20 shadow-sm bg-white/60 backdrop-blur-md flex flex-col justify-between text-left hover:shadow-[0_20px_50px_rgba(124,58,237,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group">
                <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="text-2xl text-purple-400 mb-4 font-serif">“</div>
                <p className="text-slate-605 text-sm leading-relaxed italic mb-6 relative z-10 font-medium">
                  {testimonial.quote}
                </p>
                <div className="relative z-10 pt-4 border-t border-purple-500/5">
                  <h4 className="font-bold text-[#0F172A] text-sm">{testimonial.author}</h4>
                  <span className="text-xs text-slate-400 font-semibold">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA SECTION
          ====================================================== */}
      <section className="py-24 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white px-6 md:px-12 text-center relative overflow-hidden z-10 border-t border-purple-500/10 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent)]"></div>
        
        {/* Floating background celebration elements */}
        <div className="absolute right-[5%] top-[10%] w-36 h-36 opacity-10 pointer-events-none hidden md:block">
          <img src="/celebration_illustration.png" alt="celebration decal" className="w-full h-full object-contain filter invert" />
        </div>
        <div className="absolute left-[5%] bottom-[10%] w-32 h-32 opacity-10 pointer-events-none hidden md:block">
          <img src="/paper_airplane_illustration.png" alt="paper airplane decal" className="w-full h-full object-contain filter invert" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to craft your custom card?
          </h2>
          <p className="text-purple-100 max-w-xl mx-auto text-base md:text-lg opacity-90 leading-relaxed font-light">
            No signup required to start. Generate and customize your greeting text in real-time.
          </p>
          <div className="pt-4">
            <Link
              to="/generator"
              className="px-9 py-4.5 rounded-full bg-white text-[#7C3AED] font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform inline-flex items-center gap-2 text-sm"
            >
              <span>Launch Generator Space</span>
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
