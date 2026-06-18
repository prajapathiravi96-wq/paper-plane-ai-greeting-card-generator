import React, { useState } from 'react';
import API from '../api';
import CardTemplate from '../components/CardTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { 
  FiChevronRight, 
  FiCopy, 
  FiDownload, 
  FiRefreshCw, 
  FiCheck, 
  FiAlertTriangle,
  FiZap,
  FiShare2,
  FiMail,
  FiLinkedin,
  FiMessageCircle,
  FiLink,
  FiActivity,
  FiSliders,
  FiX
} from 'react-icons/fi';

const Generator = () => {
  // Form input states
  const [formData, setFormData] = useState({
    occasion: 'Birthday',
    tone: 'Emotional',
    recipient: '',
    sender: '',
    length: 'Medium',
    language: 'English',
    template: 'birthday'
  });

  // Generator workflow states
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Copy notification states
  const [copiedField, setCopiedField] = useState({
    content: false,
    caption: false,
    giftTag: false
  });

  // Options lists
  const occasions = [
    'Birthday', 'Anniversary', 'Wedding', 'Congratulations', 
    'Thank You', 'Festival', 'Corporate Appreciation', 'Friendship', 'Farewell'
  ];

  const tones = [
    'Professional', 'Emotional', 'Funny', 'Romantic', 'Formal', 'Inspirational'
  ];

  const templates = [
    { key: 'birthday', name: 'Classic Birthday' },
    { key: 'anniversary', name: 'Elegant Anniversary' },
    { key: 'corporate', name: 'Sleek Corporate' },
    { key: 'festival', name: 'Festival Glow' },
    { key: 'friendship', name: 'Friendship Fun' },
    { key: 'wedding', name: 'Luxury Wedding' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTemplateChange = (tmplKey) => {
    setFormData(prev => ({ ...prev, template: tmplKey }));
    if (generatedCard) {
      setGeneratedCard(prev => ({ ...prev, template: tmplKey }));
    }
  };

  // Submit and call API
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.recipient.trim() || !formData.sender.trim()) {
      setError('Recipient and Sender names are required.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCard(null);

    try {
      const response = await API.post('/generate-card', formData);
      if (response.data && response.data.success) {
        setGeneratedCard(response.data.data);
      } else {
        throw new Error('Failed to generate card content');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection failed. Using offline backup content.');
      
      // Secondary fallback logic to keep UI responsive
      setTimeout(() => {
        const fallbackData = {
          _id: new Date().getTime().toString(),
          occasion: formData.occasion,
          tone: formData.tone,
          recipient: formData.recipient,
          sender: formData.sender,
          length: formData.length,
          language: formData.language,
          template: formData.template,
          title: `To my dear ${formData.recipient}`,
          content: `Dearest ${formData.recipient},\n\nWishing you a wonderful and blessed ${formData.occasion}! May your day be filled with warm smiles, joyful laughter, and great memories that you'll cherish forever.\n\nWith all my love and best wishes,\n${formData.sender}`,
          caption: `Wishing a very happy ${formData.occasion} to ${formData.recipient}! 🎉✨`,
          giftTag: `To: ${formData.recipient} ∙ From: ${formData.sender} ∙ Happy ${formData.occasion}!`
        };
        setGeneratedCard(fallbackData);
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  // PDF Export
  const handleDownloadPDF = () => {
    if (!generatedCard) return;
    const element = document.getElementById('greeting-card-preview');
    const opt = {
      margin:       10,
      filename:     `${generatedCard.recipient}_${generatedCard.occasion}_card.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a5', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  // PNG Export
  const handleDownloadPNG = () => {
    if (!generatedCard) return;
    const element = document.getElementById('greeting-card-preview');
    html2canvas(element, { useCORS: true, scale: 2, backgroundColor: null }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `${generatedCard.recipient}_${generatedCard.occasion}_card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // Clipboard Copier
  const handleCopyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(prev => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setCopiedField(prev => ({ ...prev, [fieldName]: false }));
    }, 2000);
  };

  // Share link copy
  const handleCopyLink = () => {
    const mockLink = `${window.location.origin}/card/${generatedCard?._id || 'demo'}`;
    navigator.clipboard.writeText(mockLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Quality metric calculators based on selected tone
  const getQualityScores = (tone) => {
    const defaultScores = { professional: 75, creativity: 80, emotional: 80 };
    const mappings = {
      Professional: { professional: 98, creativity: 70, emotional: 40 },
      Formal: { professional: 96, creativity: 65, emotional: 35 },
      Emotional: { professional: 50, creativity: 85, emotional: 98 },
      Romantic: { professional: 30, creativity: 90, emotional: 99 },
      Funny: { professional: 45, creativity: 96, emotional: 70 },
      Inspirational: { professional: 75, creativity: 92, emotional: 88 }
    };
    return mappings[tone] || defaultScores;
  };

  const qualityScores = getQualityScores(formData.tone);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 min-h-[calc(100vh-73px)] text-[#0F172A] dark:text-[#F8F4FF]">
      
      <div className="flex flex-col gap-4 mb-10 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Generator Workspace
        </h1>
        <p className="text-slate-500 dark:text-purple-300/60 text-sm max-w-xl font-medium">
          Fill in your recipient details, select your custom occasion and emotional tone, and watch Paper Plane create the perfect greeting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT PANEL: OPTIONS FORM */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-100 dark:border-purple-900/20 shadow-sm space-y-6 text-left relative overflow-hidden transition-colors">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3.5 flex items-center gap-2 relative z-10">
            <FiZap className="text-purple-600 dark:text-purple-400" />
            <span>Card Configuration</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Recipient Name</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="e.g. Priya"
                className="w-full px-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Sender Name</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="e.g. Rohan"
                className="w-full px-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="relative z-10">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Occasion</label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white bg-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
            >
              {occasions.map((occ) => (
                <option key={occ} value={occ} className="dark:bg-[#120B2E]">{occ}</option>
              ))}
            </select>
          </div>

          <div className="relative z-10">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Tone Settings</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white bg-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
            >
              {tones.map((t) => (
                <option key={t} value={t} className="dark:bg-[#120B2E]">{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Length</label>
              <select
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white bg-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
              >
                <option value="Short" className="dark:bg-[#120B2E]">Short (~2 sentences)</option>
                <option value="Medium" className="dark:bg-[#120B2E]">Medium (~4 sentences)</option>
                <option value="Long" className="dark:bg-[#120B2E]">Long (~6+ sentences)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white bg-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
              >
                <option value="English" className="dark:bg-[#120B2E]">English</option>
                <option value="Hindi" className="dark:bg-[#120B2E]">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20 rounded-xl text-xs flex gap-2 items-center relative z-10">
              <FiAlertTriangle className="flex-shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-lg shadow-purple-600/10 hover:shadow-xl hover:shadow-purple-600/25 transition-all hover:scale-[1.01] transform flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed relative z-10 cursor-pointer"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                <span>Crafting message...</span>
              </>
            ) : (
              <>
                <span>Generate Card</span>
                <FiChevronRight />
              </>
            )}
          </button>
        </form>

        {/* RIGHT PANEL: LIVE PREVIEW & CONTROLS */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              // Animated Paper Plane Loading skeleton
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-white/70 dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/25 rounded-3xl shadow-sm p-12 flex flex-col justify-center items-center"
              >
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{
                      x: [-8, 8, -8],
                      y: [-12, 12, -12],
                      rotate: [-5, 8, -5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    className="text-6xl text-[#7C3AED] dark:text-purple-400"
                  >
                    ✈️
                  </motion.div>
                  <div className="absolute inset-0 border-2 border-dashed border-purple-500/10 rounded-full animate-spin duration-[10s]"></div>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Gemini AI is crafting...</h3>
                <p className="text-slate-400 dark:text-purple-300/50 text-xs text-center max-w-xs leading-relaxed font-medium">
                  Configuring prompt coordinates, structuring copywriting lines, and setting tone balances.
                </p>
              </motion.div>
            ) : generatedCard ? (
              // Greeting Card Preview Render
              <motion.div
                key="preview-active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Style Switcher capsule */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-[#120B2E]/70 border border-slate-100 dark:border-purple-900/20 rounded-2xl max-w-xl mx-auto shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 px-3 tracking-wider flex items-center gap-1.5">
                    <FiSliders />
                    <span>Style Template</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {templates.map(tmpl => (
                      <button
                        key={tmpl.key}
                        type="button"
                        onClick={() => handleTemplateChange(tmpl.key)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          formData.template === tmpl.key
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-650 dark:text-purple-300/70 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                        }`}
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Live Canvas Wrapper */}
                <div className="relative">
                  {/* AI Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 dark:bg-purple-950/90 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 shadow-sm backdrop-blur-sm select-none">
                    <span>✈️ Custom AI Generated</span>
                  </div>

                  <CardTemplate 
                    title={generatedCard.title}
                    content={generatedCard.content}
                    recipient={generatedCard.recipient}
                    sender={generatedCard.sender}
                    occasion={generatedCard.occasion}
                    tone={generatedCard.tone}
                    template={formData.template}
                  />
                </div>

                {/* Primary Card Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => handleCopyToClipboard(generatedCard.content, 'content')}
                    className="px-6 py-3 rounded-full bg-white dark:bg-[#120B2E]/40 border border-slate-200 dark:border-purple-900/30 hover:border-purple-500 text-slate-700 dark:text-purple-200 font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] transform cursor-pointer"
                  >
                    {copiedField.content ? <FiCheck className="text-green-500 animate-bounce" /> : <FiCopy />}
                    <span>{copiedField.content ? 'Copied Card Text!' : 'Copy Card Text'}</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs shadow-md shadow-purple-600/10 hover:shadow-purple-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] transform cursor-pointer"
                  >
                    <FiShare2 />
                    <span>Share or Download</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="px-6 py-3 rounded-full bg-white dark:bg-[#120B2E]/40 border border-slate-200 dark:border-purple-900/30 text-slate-700 dark:text-purple-200 font-bold text-xs shadow-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
                  >
                    <FiRefreshCw />
                    <span>Regenerate</span>
                  </button>
                </div>

                {/* Auxiliary metadata & Quality scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto text-left items-start">
                  
                  {/* Left Column: Social Copy Modules */}
                  <div className="space-y-4">
                    {/* Caption Module */}
                    <div className="p-4 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-2 relative">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider">Social Caption</span>
                      <p className="text-xs text-slate-700 dark:text-purple-200 leading-relaxed pr-8">{generatedCard.caption}</p>
                      <button
                        onClick={() => handleCopyToClipboard(generatedCard.caption, 'caption')}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 dark:border-purple-900/30 hover:border-purple-500 hover:text-purple-600 text-slate-400 transition-colors cursor-pointer"
                        title="Copy Caption"
                      >
                        {copiedField.caption ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                      </button>
                    </div>

                    {/* Gift Tag Module */}
                    <div className="p-4 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-2 relative">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider">Gift Tag Message</span>
                      <p className="text-xs text-slate-700 dark:text-purple-200 leading-relaxed pr-8">{generatedCard.giftTag}</p>
                      <button
                        onClick={() => handleCopyToClipboard(generatedCard.giftTag, 'giftTag')}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 dark:border-purple-900/30 hover:border-purple-500 hover:text-purple-600 text-slate-400 transition-colors cursor-pointer"
                        title="Copy Gift Tag"
                      >
                        {copiedField.giftTag ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: AI Analytics & Quality Indicators */}
                  <div className="p-5 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider flex items-center gap-1.5">
                      <FiActivity />
                      <span>AI Quality Indicators</span>
                    </span>
                    
                    {/* Character count */}
                    <div className="flex justify-between items-center text-xs border-b border-purple-100/50 dark:border-purple-900/20 pb-2">
                      <span className="text-slate-500 dark:text-purple-300/60 font-medium">Body Character Count</span>
                      <span className="font-bold font-mono text-purple-700 dark:text-purple-300">{(generatedCard.content || '').length} chars</span>
                    </div>

                    {/* Progress bars */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-500 dark:text-purple-300/70">Professionalism Score</span>
                          <span className="text-purple-700 dark:text-purple-300 font-mono">{qualityScores.professional}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-[#7C3AED] rounded-full" style={{ width: `${qualityScores.professional}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-500 dark:text-purple-300/70">Creativity Index</span>
                          <span className="text-purple-700 dark:text-purple-300 font-mono">{qualityScores.creativity}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-[#7C3AED] rounded-full" style={{ width: `${qualityScores.creativity}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-slate-500 dark:text-purple-300/70">Emotional Weight</span>
                          <span className="text-purple-700 dark:text-purple-300 font-mono">{qualityScores.emotional}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-[#7C3AED] rounded-full" style={{ width: `${qualityScores.emotional}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              // Empty State view
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-white/40 dark:bg-[#120B2E]/30 border border-dashed border-purple-200 dark:border-purple-800/30 rounded-3xl flex flex-col justify-center items-center p-8 text-center"
              >
                <div className="w-18 h-18 rounded-3xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl mb-4 border border-purple-200/20 shadow-sm animate-float-1">
                  ✈️
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-base">Workspace Canvas Ready</h3>
                <p className="text-slate-400 dark:text-purple-300/50 text-xs max-w-xs leading-relaxed font-medium">
                  Fill out the parameters on the left and click "Generate Card" to watch Gemini AI design your greeting.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ======================================================
          SHARING DRAWER / MODAL POPUP
          ====================================================== */}
      <AnimatePresence>
        {showShareModal && generatedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-[#0B051D]/60 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#150E35] border border-purple-250/20 dark:border-purple-800/20 rounded-[32px] shadow-2xl p-8 z-10 text-left overflow-hidden"
            >
              <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-white mb-2">Share or Export Card</h3>
              <p className="text-xs text-slate-450 dark:text-purple-300/50 mb-6 font-medium">
                Distribute your generated card content to messaging portals or export design files.
              </p>

              {/* Share Channels */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Digital Delivery</span>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = `${generatedCard.title}\n\n${generatedCard.content}\n\n${generatedCard.caption}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="p-3 bg-[#E8F8F0] dark:bg-[#075E54]/10 border border-[#25D366]/20 rounded-2xl flex flex-col items-center gap-1.5 hover:scale-[1.03] transition-transform cursor-pointer"
                  >
                    <FiMessageCircle size={20} className="text-[#25D366]" />
                    <span className="text-[10px] font-bold text-[#25D366]">WhatsApp</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => {
                      window.open(`mailto:?subject=${encodeURIComponent(generatedCard.title)}&body=${encodeURIComponent(generatedCard.content)}`);
                    }}
                    className="p-3 bg-[#EEF2FF] dark:bg-indigo-950/20 border border-indigo-200/30 rounded-2xl flex flex-col items-center gap-1.5 hover:scale-[1.03] transition-transform cursor-pointer"
                  >
                    <FiMail size={20} className="text-indigo-650" />
                    <span className="text-[10px] font-bold text-indigo-600">Email</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank');
                    }}
                    className="p-3 bg-[#E0F2FE] dark:bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-2xl flex flex-col items-center gap-1.5 hover:scale-[1.03] transition-transform cursor-pointer"
                  >
                    <FiLinkedin size={20} className="text-[#0A66C2]" />
                    <span className="text-[10px] font-bold text-[#0A66C2]">LinkedIn</span>
                  </button>
                </div>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/10 rounded-2xl flex items-center justify-between text-xs font-bold text-[#7C3AED] dark:text-[#C084FC] hover:bg-purple-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FiLink />
                    <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Card Secret Link'}</span>
                  </span>
                  {copiedLink && <FiCheck className="text-green-500 animate-bounce" />}
                </button>
              </div>

              {/* Exports */}
              <div className="mt-8 pt-6 border-t border-purple-100/50 dark:border-purple-900/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Download Layout Template</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      handleDownloadPNG();
                      setShowShareModal(false);
                    }}
                    className="py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transform transition-all cursor-pointer"
                  >
                    <FiDownload />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={() => {
                      handleDownloadPDF();
                      setShowShareModal(false);
                    }}
                    className="py-3.5 bg-white border border-slate-200 dark:border-purple-900/40 text-slate-800 dark:text-purple-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-purple-950/40 hover:scale-[1.02] transform transition-all cursor-pointer"
                  >
                    <FiDownload />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 dark:hover:text-white p-1.5 rounded-lg border border-transparent hover:border-purple-200/30"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Generator;
