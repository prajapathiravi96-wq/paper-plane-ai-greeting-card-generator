import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiSend } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#0F0826] via-[#160D33] to-[#0A0518] text-purple-200/80 py-20 px-6 md:px-12 border-t border-purple-500/10 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative vector plane in footer background */}
      <div className="absolute -bottom-10 -right-10 text-[15vw] font-black text-purple-500/[0.02] select-none pointer-events-none tracking-widest">
        ✈️
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        
        {/* Company Info Left */}
        <div className="flex flex-col gap-4 md:col-span-4 text-left">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl text-white">
            <span className="text-3xl">✈️</span>
            <span className="bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#EDE9FE] bg-clip-text text-transparent">
              Paper Plane
            </span>
          </Link>
          <p className="text-sm text-purple-300/70 leading-relaxed mt-2 font-medium">
            Instantly create personalized, AI-powered greeting cards matching any occasion and tone. Elevate your gifting experiences with premium digital templates.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiGithub size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiLinkedin size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiTwitter size={16} />
            </a>
            <a href="mailto:support@paperplane.ai" className="p-2.5 bg-purple-950/40 border border-purple-800/30 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-600/50 hover:scale-105 transition-all duration-200">
              <FiMail size={16} />
            </a>
          </div>
        </div>

        {/* Product links */}
        <div className="md:col-span-2 text-left">
          <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest text-purple-400">Product</h4>
          <ul className="space-y-3.5 text-sm">
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

        {/* Resources & Info */}
        <div className="md:col-span-2 text-left">
          <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest text-purple-400">Resources</h4>
          <ul className="space-y-3.5 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors duration-250 font-medium">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors duration-250 font-medium">How it works</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors duration-250 font-medium">Testimonials</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription Column */}
        <div className="md:col-span-4 text-left flex flex-col gap-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest text-purple-400">Stay Updated</h4>
          <p className="text-xs text-purple-350 leading-relaxed font-medium">
            Subscribe to our newsletter to receive the latest updates, design styles, and feature rollouts.
          </p>

          <form onSubmit={handleSubscribe} className="relative mt-2 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-purple-950/50 border border-purple-800/40 rounded-xl text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500 font-medium pr-12"
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white hover:scale-105 transition-transform"
            >
              <FiSend size={12} />
            </button>
          </form>

          {subscribed && (
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider animate-pulse">
              🎉 Thanks for subscribing!
            </span>
          )}
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto border-t border-purple-900/40 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-purple-400/50 font-medium relative z-10">
        <div>
          © {new Date().getFullYear()} Paper Plane Inc. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
