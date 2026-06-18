import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Failed to create user profile.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] relative flex items-center justify-center px-6 py-12 overflow-hidden bg-[#F8F4FF] dark:bg-[#0B051D] text-[#0F172A] dark:text-[#F8F4FF] transition-colors duration-300">
      
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[#7C3AED]/15 dark:bg-[#7C3AED]/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[45vw] h-[45vw] rounded-full bg-[#A855F7]/15 dark:bg-[#A855F7]/10 blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 dark:bg-[#120B2E]/60 backdrop-blur-xl border border-purple-200/50 dark:border-purple-900/30 p-8 rounded-[36px] shadow-2xl relative z-10 text-left"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-black text-3xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent mb-3">
            <span>✈️ Paper Plane</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-purple-300/60 text-xs mt-1.5 font-medium">
            Register to save cards and unlock your personal vault.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl text-xs flex gap-2 items-center">
            <FiAlertTriangle className="flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <FiUser size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-purple-200/60 dark:border-purple-900/30 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-purple-200/60 dark:border-purple-900/30 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <FiLock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-purple-200/60 dark:border-purple-900/30 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-lg shadow-purple-600/10 hover:shadow-xl hover:shadow-purple-600/25 hover:scale-[1.01] transition-all transform flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Registering...' : 'Get Started'}</span>
            <FiArrowRight />
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-slate-500 dark:text-purple-300/50">Already have an account? </span>
          <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500 dark:text-purple-400">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
