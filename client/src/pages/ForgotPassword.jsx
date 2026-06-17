import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const res = await forgotPassword(email);
      if (res.success || res.message) {
        setMessage(res.message || 'Reset instructions sent to your email.');
      } else {
        setError(res.error || 'Failed to submit request.');
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
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-650 hover:text-purple-500 dark:text-purple-400 mb-6">
            <FiArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white">Reset Password</h2>
          <p className="text-slate-500 dark:text-purple-300/60 text-xs mt-2 leading-relaxed font-medium">
            Enter your email address and we will simulate sending reset instructions to your inbox.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl text-xs flex gap-2 items-center">
            <FiAlertTriangle className="flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/40 dark:border-purple-800/10 rounded-3xl text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-650 dark:text-purple-400 flex items-center justify-center mx-auto text-2xl">
              <FiCheckCircle />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Request Submitted</h3>
            <p className="text-xs text-slate-500 dark:text-purple-300/60 leading-relaxed font-medium">
              {message}
            </p>
            <div className="pt-2">
              <Link to="/login" className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all inline-block">
                Return to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="name@company.com"
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
              <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
