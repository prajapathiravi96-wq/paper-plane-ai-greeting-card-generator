import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiGrid, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Generator', path: '/generator' },
    { name: 'History Vault', path: '/history' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="sticky top-4 z-50 w-full px-4 md:px-12 pointer-events-none">
      <nav className="w-full max-w-7xl mx-auto px-6 py-3 rounded-[20px] bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-[15px] border border-purple-500/15 dark:border-purple-800/15 shadow-[0_10px_40px_rgba(124,58,237,0.12)] flex items-center justify-between pointer-events-auto relative transition-colors duration-300">
      
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2.5 font-black text-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
        <motion.img 
          src="/logo.png" 
          alt="Paper Plane Logo" 
          className="w-8 h-8 object-contain rounded-lg shadow-sm"
          animate={{ y: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
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
                ? 'text-[#7C3AED] dark:text-[#C084FC] font-bold'
                : 'text-slate-600 dark:text-purple-250/70 hover:text-[#7C3AED] dark:hover:text-[#C084FC]'
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

      <div className="hidden md:flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200/40 dark:border-purple-800/10 transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>

        {/* User Auth Controls / Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {getInitials(user.name)}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div className="fixed inset-0 z-10 pointer-events-auto" onClick={() => setProfileOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3.5 w-60 bg-white dark:bg-[#150E35] border border-purple-200/50 dark:border-purple-800/20 rounded-2xl shadow-xl p-3 flex flex-col gap-1 z-25 text-left pointer-events-auto"
                  >
                    <div className="px-3 py-2 border-b border-purple-100/50 dark:border-purple-900/20 mb-1">
                      <span className="block text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</span>
                      <span className="block text-[10px] text-slate-400 dark:text-purple-300/60 truncate font-mono mt-0.5">{user.email}</span>
                      {user.role === 'admin' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/20 mt-1.5 tracking-wider">
                          Admin Portal
                        </span>
                      )}
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-purple-250/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                      >
                        <FiGrid size={14} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/history"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-purple-250/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                    >
                      <FiUser size={14} />
                      <span>My History Vault</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium border-t border-purple-500/5 mt-1 pt-2"
                    >
                      <FiLogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/25 transition-all text-xs hover:scale-[1.05] transform inline-block duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Mobile Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-purple-300 pointer-events-auto"
        >
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-700 dark:text-purple-200 hover:text-purple-600 transition-colors focus:outline-none pointer-events-auto"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile sliding drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-[#120B2E]/95 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/30 flex flex-col p-6 gap-4 shadow-xl md:hidden pointer-events-auto text-left"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                  isActive(link.path)
                    ? 'bg-[#F3EBFF]/60 dark:bg-purple-950/40 text-[#7C3AED] dark:text-[#C084FC] font-bold'
                    : 'text-slate-600 dark:text-purple-250/70 hover:bg-slate-50 dark:hover:bg-purple-950/20'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="py-2 px-4 rounded-xl font-semibold text-sm text-slate-600 dark:text-purple-250/70 hover:bg-slate-50 dark:hover:bg-purple-950/20 flex items-center gap-2"
              >
                <FiGrid size={16} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {user ? (
              <div className="border-t border-purple-100/50 dark:border-purple-900/30 pt-4 mt-2 flex flex-col gap-3">
                <div className="px-4">
                  <span className="block text-xs font-bold text-slate-800 dark:text-white">{user.name}</span>
                  <span className="block text-[10px] text-slate-400 dark:text-purple-300/60 font-mono mt-0.5 truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 font-bold text-sm text-center flex items-center justify-center gap-2"
                >
                  <FiLogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-purple-100/50 dark:border-purple-900/30 pt-4 mt-2 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7C3AED] dark:text-[#C084FC] font-bold text-sm text-center block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-sm text-center block shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
