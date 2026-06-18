import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCpu, 
  FiArrowRight, 
  FiHeart,
  FiZap,
  FiStar,
  FiSmile,
  FiEdit,
  FiSliders,
  FiDownload,
  FiGlobe,
  FiShare2,
  FiDatabase
} from 'react-icons/fi';

const Home = () => {
  
  // Animation presets for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
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
    <div className="relative bg-[#F8F4FF] dark:bg-[#0B051D] overflow-hidden min-h-screen text-[#0F172A] dark:text-[#F8F4FF] transition-colors duration-300">
      
      {/* ======================================================
          BACKGROUND REDESIGN & DECORATIONS
          ====================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Layer 1: Large Blurred Purple Gradient Blobs */}
        <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#7C3AED]/15 dark:bg-[#7C3AED]/10 blur-[120px] mix-blend-multiply opacity-80"></div>
        <div className="absolute -top-[5%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-[#EDE9FE]/20 dark:bg-[#A855F7]/5 blur-[120px] mix-blend-multiply opacity-90"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-[#A855F7]/15 dark:bg-[#A855F7]/8 blur-[120px] mix-blend-multiply opacity-80"></div>
        <div className="absolute -bottom-[5%] -right-[5%] w-[55vw] h-[55vw] rounded-full bg-[#C084FC]/20 dark:bg-[#C084FC]/10 blur-[120px] mix-blend-multiply opacity-85"></div>

        {/* Layer 2: Floating Decorative Shapes */}
        {[
          { char: '✈️', top: '10%', left: '5%', delay: 0, scale: 1 },
          { char: '✨', top: '20%', left: '88%', delay: 0.5, scale: 1.1 },
          { char: '💖', top: '38%', left: '3%', delay: 1, scale: 0.9 },
          { char: '🎁', top: '55%', left: '92%', delay: 1.5, scale: 0.85 },
          { char: '✉️', top: '75%', left: '6%', delay: 2, scale: 1 },
          { char: '⭐', top: '82%', left: '85%', delay: 0.8, scale: 0.95 }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute text-3xl select-none opacity-[0.12] dark:opacity-[0.08] text-purple-700 dark:text-purple-400"
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
        {[...Array(25)].map((_, i) => (
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
          SECTION 1: HERO
          ====================================================== */}
      <section className="relative z-10 py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black text-purple-600/[0.03] dark:text-purple-400/[0.02] select-none pointer-events-none tracking-[0.25em] font-sans blur-[10px] whitespace-nowrap">
          ✈ PAPER PLANE
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-7 space-y-8 text-left relative"
          >
            {/* Giant glowing purple orb behind the title text */}
            <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.22)_0%,rgba(168,85,247,0.06)_50%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,rgba(124,58,237,0.03)_50%,transparent_100%)] blur-[90px] pointer-events-none z-0"></div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/20 tracking-wider">
              ✈️ AI-Powered Greeting Creator
            </span>

            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.1] relative z-10">
              Perfect Words.<br />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                Beautiful Cards.
              </span><br />
              Done in Seconds.
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 dark:text-purple-300/70 max-w-xl leading-relaxed relative z-10 font-medium">
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
                className="px-9 py-4.5 rounded-full bg-white/40 dark:bg-purple-950/20 backdrop-blur-md border border-purple-200/60 dark:border-purple-800/30 text-slate-700 dark:text-purple-200 font-bold hover:bg-white/60 dark:hover:bg-purple-900/30 hover:border-purple-300 hover:scale-[1.03] transition-all duration-300 shadow-sm text-sm"
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
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/30 to-[#C084FC]/30 rounded-[64px] blur-[80px] opacity-75 pointer-events-none"></div>
            
            {/* Floating items */}
            <motion.div 
              variants={floatAnimation(0.2, 5.2)}
              animate="animate"
              className="absolute -top-12 right-[10%] text-4xl text-purple-400 select-none z-20 pointer-events-none filter drop-shadow-md"
            >
              ✨
            </motion.div>
            <motion.div 
              variants={floatAnimation(0.8, 6.8)}
              animate="animate"
              className="absolute top-[40%] -left-16 w-28 h-28 hidden xl:block z-20 pointer-events-none"
            >
              <img src="/gift_box_card.png" alt="Gift box" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>
            <motion.div 
              variants={floatAnimation(1.4, 7.2)}
              animate="animate"
              className="absolute top-[12%] -right-20 w-32 h-32 hidden xl:block z-20 pointer-events-none"
            >
              <img src="/ai_assistant.png" alt="Card stack" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>
            <motion.div 
              variants={floatAnimation(2, 6.2)}
              animate="animate"
              className="absolute -bottom-16 left-[15%] w-24 h-24 hidden lg:block z-20 pointer-events-none"
            >
              <img src="/paper_airplane_illustration.png" alt="Paper plane" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.div>

            {/* Preview Card Canvas */}
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              variants={floatAnimation(0, 7)}
              animate="animate"
              className="w-full max-w-md bg-white/75 dark:bg-[#120B2E]/70 backdrop-blur-[20px] border border-purple-200/50 dark:border-purple-800/30 p-10 rounded-[40px] shadow-[0_25px_50px_rgba(124,58,237,0.12)] hover:shadow-[0_30px_70px_rgba(124,58,237,0.22)] border-t-white/85 border-l-white/85 dark:border-t-purple-800/20 dark:border-l-purple-800/20 transition-all duration-500 relative select-none"
            >
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none z-10"></div>
              <div className="absolute inset-5 border border-purple-500/5 pointer-events-none rounded-[32px]"></div>

              <div className="absolute top-8 right-8 text-[10px] font-mono text-purple-600/70 dark:text-purple-400/70 tracking-widest font-bold">
                PREMIUM MOCKUP
              </div>
              
              <div className="mb-6 relative z-10 text-left">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-250/30 dark:border-purple-800/20 tracking-wider">
                  Birthday Classic
                </span>
                <h3 className="font-serif text-3xl text-purple-950 dark:text-white mt-6 font-normal tracking-wide leading-tight">
                  Happy 30th, Kabir!
                </h3>
              </div>

              <div className="relative my-8 px-4">
                <span className="absolute -top-8 -left-2 text-8xl font-serif text-purple-300/30 select-none pointer-events-none">“</span>
                <p className="font-serif italic text-purple-900/80 dark:text-purple-200/80 text-base leading-relaxed text-center relative z-10 font-light">
                  Happy Birthday Kabir! You're officially at the age where a wild night out means leaving the living room lights on. May your day be filled with lots of laughs, zero back pain, and a very large cake.
                </p>
                <span className="absolute -bottom-16 -right-2 text-8xl font-serif text-purple-300/30 select-none pointer-events-none">”</span>
              </div>
              
              <div className="border-t border-purple-100 dark:border-purple-900/20 pt-5 flex justify-between text-sm text-purple-950 dark:text-white font-serif relative z-10 mt-10">
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
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white dark:text-[#120B2E] fill-current transition-colors">
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
          SECTION 2: HOW IT WORKS
          ====================================================== */}
      <section id="how-it-works" className="py-28 bg-white dark:bg-[#120B2E] relative z-10 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 tracking-wider">
              Work Flow
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              Three Steps to Card Magic
            </h2>
            <p className="text-slate-500 dark:text-purple-300/60 max-w-xl mx-auto text-base">
              Our automated system creates elegant custom copy and templates in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative max-w-5xl mx-auto">
            {/* Connectors for desktop */}
            <div className="absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-purple-200 dark:border-purple-900/40 hidden md:block z-0"></div>

            {[
              { num: "01", icon: <FiEdit size={22} className="text-purple-600 dark:text-purple-400" />, title: "1. Choose Occasion", desc: "Select from birthdays, weddings, anniversaries, corporate events and more." },
              { num: "02", icon: <FiSliders size={22} className="text-purple-600 dark:text-purple-400" />, title: "2. Select Tone", desc: "Set the emotion: romantic, funny, inspirational, formal, or humorous." },
              { num: "03", icon: <FiCpu size={22} className="text-purple-600 dark:text-purple-400" />, title: "3. Generate with AI", desc: "Gemini AI crafts human-like titles, tags, card copies and tags instantly." },
              { num: "04", icon: <FiDownload size={22} className="text-purple-600 dark:text-purple-400" />, title: "4. Download & Share", desc: "Export as professional PDF or PNG templates, or share directly." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center space-y-4 relative z-10 group bg-white dark:bg-[#1A1145]/30 p-6 rounded-[32px] border border-purple-500/5 dark:border-purple-800/10 shadow-sm"
              >
                <div className="w-18 h-18 rounded-2xl bg-[#F8F4FF] dark:bg-[#1A1145] border border-purple-500/10 flex items-center justify-center shadow-md relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {step.icon}
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Step {step.num}</span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-purple-300/50 text-xs leading-relaxed font-semibold">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (WHITE TO LIGHT PURPLE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-[#F8F4FF] dark:text-[#0B051D] fill-current transition-colors">
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
          SECTION 3: FEATURE HIGHLIGHTS
          ====================================================== */}
      <section id="features" className="py-24 bg-[#F8F4FF] dark:bg-[#0B051D] relative z-10 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-5">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              Feature Highlights
            </h2>
            <p className="text-slate-500 dark:text-purple-300/60 max-w-xl mx-auto text-base">
              A comprehensive greeting card platform equipped with modern tools to help you stand out.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <FiZap className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "AI Powered Messages",
                desc: "Powered by Gemini 1.5 Flash models for context-aware, emotionally intelligent card copies written instantly."
              },
              {
                icon: <FiHeart className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "Designer Templates",
                desc: "Bespoke styled borders and typography graphics tailored for weddings, festivals, corporate, and birthdays."
              },
              {
                icon: <FiGlobe className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "Multi-Language Support",
                desc: "Complete multi-lingual drafting support, easily writing cards in both clean English and emotional Hindi."
              },
              {
                icon: <FiDownload className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "PDF & PNG Downloads",
                desc: "Render high-resolution cards directly. Export to printable folded PDFs or high-quality PNGs for sharing."
              },
              {
                icon: <FiShare2 className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "Sharing Options",
                desc: "Instantly distribute messages. Share to WhatsApp, Email, or LinkedIn, or copy the direct clipboard link."
              },
              {
                icon: <FiDatabase className="text-[#7C3AED] dark:text-purple-400" size={24} />,
                title: "Secure History Vault",
                desc: "Safely index generated content in your history vault. Mark favorites, query tags, and export archives."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-8 rounded-[32px] border border-purple-200/50 dark:border-purple-900/25 bg-white/50 dark:bg-[#120B2E]/40 backdrop-blur-xl hover:bg-white dark:hover:bg-[#150E35] hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)] hover:border-purple-300 dark:hover:border-purple-800/40 transition-all duration-300 text-left group relative overflow-hidden"
              >
                <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1A1145] border border-purple-500/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-2 relative z-10">{feature.title}</h3>
                <p className="text-slate-500 dark:text-purple-300/50 text-xs leading-relaxed font-semibold relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (LIGHT PURPLE TO WHITE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white dark:text-[#120B2E] fill-current transition-colors">
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
          SECTION 4: TESTIMONIALS
          ====================================================== */}
      <section id="testimonials" className="py-24 bg-white dark:bg-[#120B2E] relative z-10 px-6 md:px-12 transition-colors duration-300">
        
        {/* Decorative background illustrations */}
        <div className="absolute top-[20%] right-[10%] w-44 h-44 opacity-[0.06] dark:opacity-[0.04] pointer-events-none hidden xl:block">
          <img src="/happy_customer_illustration.png" alt="Happy customer background" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-[20%] left-[8%] w-48 h-48 opacity-[0.06] dark:opacity-[0.04] pointer-events-none hidden xl:block">
          <img src="/celebration_illustration.png" alt="Celebration background" className="w-full h-full object-contain" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-20 relative z-10">
          <div className="space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 tracking-wider">
              Reviews
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              Loved by Gifting Enthusiasts
            </h2>
            <p className="text-slate-500 dark:text-purple-300/60 max-w-xl mx-auto text-base">
              See how Paper Plane is changing the gift attachment workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Writing birthday cards was always my bottleneck when sending gifts. Now, Paper Plane generates heartwarming messages in 5 seconds. The PDF styles are gorgeous!",
                author: "Ananya Sharma",
                role: "Product Manager",
                rating: 5,
                initials: "AS"
              },
              {
                quote: "The tone customizer works like magic. I generated a 'Formal' Corporate Appreciation note for our team and a 'Funny' anniversary text for my brother. Outstanding tool.",
                author: "Vikram Malhotra",
                role: "HR Director",
                rating: 5,
                initials: "VM"
              },
              {
                quote: "I integrated Paper Plane's generated copy into our custom checkout process. My gift-buying customers absolutely love the personalized captions and gift tag text.",
                author: "Rachel Green",
                role: "E-commerce Founder",
                rating: 5,
                initials: "RG"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 rounded-[32px] border border-purple-250/20 dark:border-purple-800/10 shadow-sm bg-white/60 dark:bg-[#150E35]/40 backdrop-blur-md flex flex-col justify-between text-left hover:shadow-[0_20px_50px_rgba(124,58,237,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative group">
                <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-400 text-amber-400" size={14} />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-purple-200/80 text-sm leading-relaxed italic mb-6 relative z-10 font-medium">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-purple-500/5 dark:border-purple-900/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] dark:text-white text-sm">{testimonial.author}</h4>
                    <span className="text-xs text-slate-450 dark:text-purple-300/50 font-semibold">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURVED SVG WAVE SEPARATOR (WHITE TO LIGHT PURPLE) */}
      <div className="relative z-10 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-[#F8F4FF] dark:text-[#0B051D] fill-current transition-colors">
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
          SECTION 5: STATS COUNTER
          ====================================================== */}
      <section className="py-20 bg-[#F8F4FF] dark:bg-[#0B051D] relative z-10 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-5xl mx-auto rounded-[40px] bg-white/70 dark:bg-[#120B2E]/60 backdrop-blur-xl border border-purple-250/15 dark:border-purple-800/10 p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divider-y md:divider-y-0 md:divider-x divider-purple-100">
            <div className="space-y-2">
              <span className="block text-4xl md:text-5xl font-black text-purple-600 dark:text-purple-400">10,000+</span>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-purple-300/60">Cards Generated</span>
            </div>
            <div className="space-y-2 border-y md:border-y-0 md:border-x border-purple-200/50 dark:border-purple-900/30 py-6 md:py-0">
              <span className="block text-4xl md:text-5xl font-black text-purple-600 dark:text-purple-400">2,500+</span>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-purple-300/60">Happy Users</span>
            </div>
            <div className="space-y-2">
              <span className="block text-4xl md:text-5xl font-black text-purple-600 dark:text-purple-400">500+</span>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-purple-300/60">Daily Creations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 6: CALL TO ACTION
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
          <p className="text-purple-105 max-w-xl mx-auto text-base md:text-lg opacity-90 leading-relaxed font-light">
            No signup required to start. Generate and customize your greeting text in real-time.
          </p>
          <div className="pt-4">
            <Link
              to="/generator"
              className="px-9 py-4.5 rounded-full bg-white text-[#7C3AED] font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform inline-flex items-center gap-2 text-sm cursor-pointer"
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
