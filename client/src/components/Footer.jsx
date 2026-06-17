import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0F0826] via-[#160D33] to-[#0A0518] text-purple-200/80 py-16 px-6 md:px-12 border-t border-purple-500/10 relative overflow-hidden">
      {/* Decorative vector plane fading in footer background */}
      <div className="absolute -bottom-10 -right-10 text-[15vw] font-black text-purple-500/[0.02] select-none pointer-events-none tracking-widest">
        ✈️
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="flex flex-col gap-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl text-white">
            <span className="text-3xl">✈️</span>
            <span className="bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#EDE9FE] bg-clip-text text-transparent">
              Paper Plane
            </span>
          </Link>
          <p className="text-sm text-purple-300/70 leading-relaxed mt-2 font-medium">
            Instantly create personalized, AI-powered greeting cards matching any occasion and tone. Elevate your gifting experiences with premium digital templates.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest text-purple-400">Product</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/generator" className="hover:text-white transition-colors duration-250 font-medium">AI Generator</Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-white transition-colors duration-250 font-medium">History Vault</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors duration-250 font-medium">Admin Panel</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest text-purple-400">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors duration-250 font-medium">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors duration-250 font-medium">How it works</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors duration-250 font-medium">Testimonials</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest text-purple-400">Connect</h4>
          <div className="flex gap-3 mb-5">
            <a href="#" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiGithub size={18} />
            </a>
            <a href="#" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiLinkedin size={18} />
            </a>
            <a href="#" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiMail size={18} />
            </a>
          </div>
          <p className="text-xs text-purple-400/50 font-medium">
            © {new Date().getFullYear()} Paper Plane Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
