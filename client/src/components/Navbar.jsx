import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Generator', path: '/generator' },
    { name: 'History Vault', path: '/history' },
    { name: 'Admin Panel', path: '/admin' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-4 z-50 w-full px-4 md:px-12 pointer-events-none">
      <nav className="w-full max-w-7xl mx-auto px-6 py-3 rounded-[20px] bg-white/70 backdrop-blur-[15px] border border-purple-500/15 shadow-[0_10px_40px_rgba(124,58,237,0.15)] flex items-center justify-between pointer-events-auto relative">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 font-black text-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
        <motion.span 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="text-3xl"
        >
          ✈️
        </motion.span>
        <span>Paper Plane</span>
      </Link>
 
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition-colors relative py-1 text-sm ${
              isActive(link.path)
                ? 'text-[#7C3AED] font-bold'
                : 'text-slate-600 hover:text-[#7C3AED]'
            }`}
          >
            {link.name}
            {isActive(link.path) && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
 
      <div className="hidden md:block">
        <Link
          to="/generator"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm hover:scale-[1.05] transform inline-block duration-300"
        >
          Generate Card
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-700 hover:text-brand-600 transition-colors focus:outline-none"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile sliding drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-purple-100 flex flex-col p-6 gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  isActive(link.path)
                    ? 'bg-[#F3EBFF]/60 text-[#7C3AED] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/generator"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white font-bold shadow-md shadow-purple-500/15 inline-block text-sm"
            >
              Generate Card
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
