import React, { useState } from 'react';
import API from '../api';
import CardTemplate from '../components/CardTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { 
  FiChevronRight, 
  FiCopy, 
  FiDownload, 
  FiRefreshCw, 
  FiCheck, 
  FiAlertTriangle,
  FiZap
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
    template: 'minimalist'
  });

  // Generator workflow states
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [error, setError] = useState('');
  
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
    { key: 'minimalist', name: 'Classic Minimal' },
    { key: 'modern', name: 'Vibrant Neon' },
    { key: 'cheerful', name: 'Bright Festive' },
    { key: 'romantic', name: 'Elegant Rose' },
    { key: 'corporate', name: 'Sleek Corporate' },
    { key: 'vintage', name: 'Vintage Retro' },
    { key: 'galaxy', name: 'Cosmic Galaxy' },
    { key: 'watercolor', name: 'Artistic Splash' }
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

  // Clipboard Copier
  const handleCopyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(prev => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setCopiedField(prev => ({ ...prev, [fieldName]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 min-h-[calc(100vh-73px)]">
      <div className="flex flex-col gap-4 mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Generator Workspace
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Fill in your recipient details, select your custom occasion and emotional tone, and watch Paper Plane create the perfect greeting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: OPTIONS FORM */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 text-left">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
            <FiZap className="text-brand-600" />
            <span>Card Details</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Recipient Name</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="e.g. Priya"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Sender Name</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="e.g. Rohan"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Occasion</label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-brand-500 transition-colors text-sm"
            >
              {occasions.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tone</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-brand-500 transition-colors text-sm"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Length</label>
              <select
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-brand-500 transition-colors text-sm"
              >
                <option value="Short">Short (1-2 sentences)</option>
                <option value="Medium">Medium (3-5 sentences)</option>
                <option value="Long">Long (6+ sentences)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:border-brand-500 transition-colors text-sm"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs flex gap-2 items-center">
              <FiAlertTriangle className="flex-shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-deep text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] transform flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
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
              // Loading Skeleton Animation
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-white border border-slate-100 rounded-3xl shadow-sm p-12 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-10 w-3/4 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-3 py-12">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
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
                {/* Template Switcher */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl max-w-xl mx-auto shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-wider">Style</span>
                  {templates.map(tmpl => (
                    <button
                      key={tmpl.key}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        formData.template === tmpl.key
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>

                {/* Card Canvas */}
                <CardTemplate 
                  title={generatedCard.title}
                  content={generatedCard.content}
                  recipient={generatedCard.recipient}
                  sender={generatedCard.sender}
                  occasion={generatedCard.occasion}
                  tone={generatedCard.tone}
                  template={formData.template}
                />

                {/* Primary Card Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => handleCopyToClipboard(generatedCard.content, 'content')}
                    className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-600 font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] transform"
                  >
                    {copiedField.content ? <FiCheck className="text-green-500" /> : <FiCopy />}
                    <span>{copiedField.content ? 'Copied Card Text!' : 'Copy Card Text'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] transform"
                  >
                    <FiDownload />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <FiRefreshCw />
                    <span>Regenerate</span>
                  </button>
                </div>

                {/* Auxiliary metadata sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                  {/* Caption Module */}
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 relative">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Social Caption</span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed pr-8">{generatedCard.caption}</p>
                    <button
                      onClick={() => handleCopyToClipboard(generatedCard.caption, 'caption')}
                      className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 hover:border-brand-500 hover:text-brand-600 text-slate-400 transition-colors"
                      title="Copy Caption"
                    >
                      {copiedField.caption ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                    </button>
                  </div>

                  {/* Gift Tag Module */}
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 relative">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Gift Tag Message</span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed pr-8">{generatedCard.giftTag}</p>
                    <button
                      onClick={() => handleCopyToClipboard(generatedCard.giftTag, 'giftTag')}
                      className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 hover:border-brand-500 hover:text-brand-600 text-slate-400 transition-colors"
                      title="Copy Gift Tag"
                    >
                      {copiedField.giftTag ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Empty State
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-slate-100/50 border border-dashed border-slate-200 rounded-3xl flex flex-col justify-center items-center p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center text-3xl mb-4">
                  ✈️
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Canvas is Ready</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Fill out the parameters on the left and click "Generate Card" to create your customized message.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Generator;
