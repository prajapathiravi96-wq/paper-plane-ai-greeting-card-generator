import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FiX,
  FiHeart,
  FiArrowLeft,
  FiUploadCloud,
  FiTrash2
} from 'react-icons/fi';

// LocalStorage helpers for resilient offline operations
const getLocalCards = () => {
  try {
    const local = localStorage.getItem('paper_plane_local_cards');
    return local ? JSON.parse(local) : [];
  } catch (e) {
    console.error('Error reading paper_plane_local_cards:', e);
    return [];
  }
};

const saveLocalCards = (cards) => {
  try {
    localStorage.setItem('paper_plane_local_cards', JSON.stringify(cards));
  } catch (e) {
    console.error('Error saving paper_plane_local_cards:', e);
  }
};

const getServerCache = () => {
  try {
    const cache = localStorage.getItem('paper_plane_server_cache');
    return cache ? JSON.parse(cache) : [];
  } catch (e) {
    console.error('Error reading paper_plane_server_cache:', e);
    return [];
  }
};

const saveServerCache = (cards) => {
  try {
    localStorage.setItem('paper_plane_server_cache', JSON.stringify(cards));
  } catch (e) {
    console.error('Error saving paper_plane_server_cache:', e);
  }
};

const getMergedCards = (serverCards = null) => {
  const localCards = getLocalCards();
  const actualServerCards = serverCards !== null ? serverCards : getServerCache();
  const seenIds = new Set();
  const merged = [];

  for (const card of localCards) {
    if (card && card._id && !seenIds.has(card._id)) {
      seenIds.add(card._id);
      merged.push(card);
    }
  }

  for (const card of actualServerCards) {
    if (card && card._id && !seenIds.has(card._id)) {
      seenIds.add(card._id);
      merged.push(card);
    }
  }

  return merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

const Generator = () => {
  // Tabs and view states
  const [activeTab, setActiveTab] = useState('copywriter'); // copywriter, designer, memory, history, favorites
  const [cardFlipped, setCardFlipped] = useState(false);

  // Form input states (for AI Copywriter)
  const [formData, setFormData] = useState({
    occasion: 'Birthday',
    tone: 'Emotional',
    recipient: '',
    sender: '',
    length: 'Medium',
    language: 'English',
    template: 'birthday'
  });

  // Memory Card inputs
  const [memoryImage, setMemoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [memoryRecipient, setMemoryRecipient] = useState('');
  const [memoryDescription, setMemoryDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Generator workflow states
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Saved lists
  const [savedCards, setSavedCards] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  
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

  // Fetch saved cards on tab change
  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'favorites') {
      fetchSavedCards();
    }
  }, [activeTab]);

  const fetchSavedCards = async () => {
    setLoadingSaved(true);
    try {
      const response = await API.get('/cards');
      if (response.data && response.data.success) {
        saveServerCache(response.data.data);
        const combined = getMergedCards(response.data.data);
        setSavedCards(combined);
      } else {
        const combined = getMergedCards();
        setSavedCards(combined);
      }
    } catch (err) {
      console.error('Error fetching saved cards, returning cached cards:', err);
      const combined = getMergedCards();
      setSavedCards(combined);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!generatedCard || !generatedCard._id) return;
    const isLocal = generatedCard._id.toString().startsWith('local_');

    const toggleLocally = () => {
      const targetId = generatedCard._id;
      const newFavoriteState = !generatedCard.isFavorite;

      const locals = getLocalCards();
      const updatedLocals = locals.map(c => c._id === targetId ? { ...c, isFavorite: newFavoriteState } : c);
      saveLocalCards(updatedLocals);

      const cache = getServerCache();
      const updatedCache = cache.map(c => c._id === targetId ? { ...c, isFavorite: newFavoriteState } : c);
      saveServerCache(updatedCache);

      setGeneratedCard(prev => ({ ...prev, isFavorite: newFavoriteState }));
      setSavedCards(getMergedCards());
    };

    if (isLocal) {
      toggleLocally();
      return;
    }

    try {
      const response = await API.put(`/cards/${generatedCard._id}/favorite`);
      if (response.data && response.data.success) {
        const updatedCard = response.data.data;
        setGeneratedCard(prev => ({ ...prev, isFavorite: updatedCard.isFavorite }));
        
        const cache = getServerCache();
        const updatedCache = cache.map(c => c._id === updatedCard._id ? updatedCard : c);
        saveServerCache(updatedCache);
        
        setSavedCards(getMergedCards());
      } else {
        toggleLocally();
      }
    } catch (err) {
      console.warn('API toggling favorite failed, falling back to local toggle:', err);
      toggleLocally();
    }
  };

  const handleDeleteSavedCard = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this card from history?")) return;

    const isLocal = id.toString().startsWith('local_');

    const deleteLocally = () => {
      const locals = getLocalCards();
      saveLocalCards(locals.filter(c => c._id !== id));

      const cache = getServerCache();
      saveServerCache(cache.filter(c => c._id !== id));

      setSavedCards(prev => prev.filter(c => c._id !== id));
      if (generatedCard && generatedCard._id === id) {
        setGeneratedCard(null);
      }
    };

    if (isLocal) {
      deleteLocally();
      return;
    }

    try {
      const response = await API.delete(`/cards/${id}`);
      if (response.data && response.data.success) {
        deleteLocally();
      } else {
        deleteLocally();
      }
    } catch (err) {
      console.warn('API delete failed, falling back to local delete:', err);
      deleteLocally();
    }
  };

  const selectCardFromHistory = (card) => {
    setGeneratedCard(card);
    setCardFlipped(false);
    setFormData({
      occasion: card.occasion,
      tone: card.tone,
      recipient: card.recipient,
      sender: card.sender || formData.sender,
      length: card.length || 'Medium',
      language: card.language || 'English',
      template: card.template || 'birthday'
    });
  };

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

  // Submit and call standard API (AI Copywriter)
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.recipient.trim() || !formData.sender.trim()) {
      setError('Recipient and Sender names are required.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCard(null);
    setCardFlipped(false);

    try {
      const response = await API.post('/generate-card', formData);
      if (response.data && response.data.success) {
        const generated = response.data.data;
        setGeneratedCard(generated);
        // Save to server cache in localStorage
        const currentCache = getServerCache();
        const updatedCache = [generated, ...currentCache.filter(c => c._id !== generated._id)];
        saveServerCache(updatedCache);
      } else {
        throw new Error('Failed to generate card content');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection failed. Using offline backup content.');
      
      // Secondary fallback logic
      setTimeout(() => {
        const fallbackData = {
          _id: 'local_' + new Date().getTime().toString(),
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
          giftTag: `To: ${formData.recipient} ∙ From: ${formData.sender} ∙ Happy ${formData.occasion}!`,
          isFavorite: false,
          createdAt: new Date().toISOString()
        };
        
        // Save to local-only list in localStorage
        const currentLocals = getLocalCards();
        saveLocalCards([fallbackData, ...currentLocals]);
        
        setGeneratedCard(fallbackData);
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  // Drag and drop processing
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMemoryImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      setError('Only image files (PNG, JPG, WEBP) are supported.');
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setMemoryImage(null);
    setImagePreview(null);
  };

  // Multimodal Memory Generator API call
  const handleGenerateMemory = async (e) => {
    if (e) e.preventDefault();
    if (!memoryRecipient.trim()) {
      setError('Recipient name is required.');
      return;
    }
    if (!memoryDescription.trim()) {
      setError('Memory description is required.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCard(null);
    setCardFlipped(false);

    try {
      const payload = {
        image: memoryImage,
        recipient: memoryRecipient,
        description: memoryDescription,
        sender: formData.sender || 'Someone who loves you',
        template: formData.template || 'birthday'
      };

      const response = await API.post('/generate-memory-card', payload);
      if (response.data && response.data.success) {
        const generated = response.data.data;
        setGeneratedCard(generated);
        setFormData(prev => ({
          ...prev,
          occasion: generated.occasion,
          tone: generated.tone,
          recipient: memoryRecipient
        }));
        // Save to server cache in localStorage
        const currentCache = getServerCache();
        const updatedCache = [generated, ...currentCache.filter(c => c._id !== generated._id)];
        saveServerCache(updatedCache);
      } else {
        throw new Error('Failed to generate card from memory');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection failed. Using offline backup content.');
      
      setTimeout(() => {
        const inferredOccasion = (memoryDescription.toLowerCase().includes('birthday') || memoryDescription.toLowerCase().includes('candles')) ? 'Birthday' : 'Memories';
        const fallbackCard = {
          _id: 'local_' + new Date().getTime().toString(),
          occasion: inferredOccasion,
          tone: 'Nostalgic',
          recipient: memoryRecipient,
          sender: formData.sender || 'Me',
          length: 'Medium',
          language: 'English',
          template: formData.template || 'birthday',
          title: `Cherishing our memory, ${memoryRecipient}`,
          content: `Dearest ${memoryRecipient},\n\nThinking back to that beautiful memory of: "${memoryDescription}". It brings so much warmth and happiness to my heart. Thank you for always being such a special part of my life.\n\nWith all my love,\n${formData.sender || 'Me'}`,
          caption: `Cherishing beautiful memories with ${memoryRecipient}! ❤️✨`,
          giftTag: `To ${memoryRecipient}, From ${formData.sender || 'Me'}. Forever in my heart.`,
          imageUrl: imagePreview,
          isFavorite: false,
          createdAt: new Date().toISOString()
        };

        // Save to local-only list in localStorage
        const currentLocals = getLocalCards();
        saveLocalCards([fallbackCard, ...currentLocals]);

        setGeneratedCard(fallbackCard);
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

  // Quality metric calculators
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

  const qualityScores = getQualityScores(generatedCard?.tone || formData.tone);

  // Tabs definitions
  const workspaceTabs = [
    { id: 'copywriter', label: 'AI Copywriter', icon: <FiZap /> },
    { id: 'designer', label: 'Visual Designer', icon: <FiSliders /> },
    { id: 'memory', label: 'AI Memory Cards', icon: <FiActivity /> },
    { id: 'history', label: 'Saved Cards', icon: <FiCopy /> },
    { id: 'favorites', label: 'Favorites', icon: <FiHeart /> }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 min-h-[calc(100vh-73px)] text-[#0F172A] dark:text-[#F8F4FF]">
      
      {/* Workspace Header */}
      <div className="flex items-center gap-4 mb-8 text-left">
        <Link 
          to="/" 
          className="p-3 bg-white dark:bg-[#120B2E]/60 border border-slate-100 dark:border-purple-900/20 text-slate-700 dark:text-purple-300 hover:text-purple-600 rounded-full transition-colors flex items-center justify-center"
          title="Back to Home"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Creative Studio Workspace
          </h1>
          <p className="text-slate-500 dark:text-purple-300/60 text-xs font-medium mt-0.5">
            Design premium greeting templates & memory cards
          </p>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-[#120B2E]/50 border border-slate-200/50 dark:border-purple-900/10 rounded-2xl mb-8 max-w-fit shadow-inner">
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setError('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-purple-300/60 hover:text-slate-800 dark:hover:text-purple-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT WORKSPACE CONTROL PANEL */}
        <div className="lg:col-span-5 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-100 dark:border-purple-900/20 shadow-sm text-left relative overflow-hidden transition-colors min-h-[480px]">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* TAB CONTENT: AI COPYWRITER */}
          {activeTab === 'copywriter' && (
            <form onSubmit={handleGenerate} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3 flex items-center gap-2">
                <FiZap className="text-purple-600 dark:text-purple-400" />
                <span>Card Configuration</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Recipient Name</label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="e.g. Priya"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-purple-950/10 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Sender Name</label>
                  <input
                    type="text"
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    placeholder="e.g. Rohan"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-purple-950/10 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Occasion</label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#150E35]/70 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ} className="dark:bg-[#120B2E]">{occ}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Tone Settings</label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#150E35]/70 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                >
                  {tones.map((t) => (
                    <option key={t} value={t} className="dark:bg-[#120B2E]">{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Length</label>
                  <select
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#150E35]/70 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                  >
                    <option value="Short" className="dark:bg-[#120B2E]">Short (~2 sentences)</option>
                    <option value="Medium" className="dark:bg-[#120B2E]">Medium (~4 sentences)</option>
                    <option value="Long" className="dark:bg-[#120B2E]">Long (~6+ sentences)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#150E35]/70 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                  >
                    <option value="English" className="dark:bg-[#120B2E]">English</option>
                    <option value="Hindi" className="dark:bg-[#120B2E]">Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-250/30 dark:border-amber-900/20 rounded-xl text-xs flex gap-2 items-center">
                  <FiAlertTriangle className="flex-shrink-0" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold shadow-lg shadow-purple-600/10 hover:shadow-xl hover:shadow-purple-600/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    <span>Crafting message...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Greeting Card</span>
                    <FiChevronRight />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB CONTENT: VISUAL DESIGNER */}
          {activeTab === 'designer' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3 flex items-center gap-2">
                <FiSliders className="text-purple-600 dark:text-purple-400" />
                <span>Visual Style Library</span>
              </h2>
              <p className="text-slate-500 dark:text-purple-300/60 text-xs font-medium">
                Choose a handcrafted aesthetic framework. Swapping templates updates the active preview canvas instantly.
              </p>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.key}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl.key)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between aspect-[4/3.2] transition-all cursor-pointer relative overflow-hidden group ${
                      (generatedCard?.template || formData.template) === tmpl.key
                        ? 'bg-gradient-to-tr from-purple-700 to-[#A855F7] border-transparent text-white shadow-md shadow-purple-600/10'
                        : 'bg-slate-50 dark:bg-purple-950/10 border-slate-200/50 dark:border-purple-900/20 text-slate-800 dark:text-purple-250 hover:border-purple-500'
                    }`}
                  >
                    <span className="font-extrabold text-sm relative z-10">{tmpl.name}</span>
                    <span className={`text-[9px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded-full w-fit relative z-10 ${
                      (generatedCard?.template || formData.template) === tmpl.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-purple-100/50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    }`}>
                      {tmpl.key}
                    </span>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: AI MEMORY CARDS */}
          {activeTab === 'memory' && (
            <form onSubmit={handleGenerateMemory} className="space-y-5">
              <div className="text-left">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3 flex items-center gap-2">
                  <FiActivity className="text-purple-600 dark:text-purple-400" />
                  <span>Memory Card AI Generator</span>
                </h2>
                <p className="text-slate-500 dark:text-purple-300/50 text-xs font-medium mt-2">
                  Upload a photo of a memory. The AI will compose personal greetings and compile gift suggestions.
                </p>
              </div>

              {/* Multimodal uploader */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-2 uppercase tracking-wider">Snap a Memory Photo</label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('memory-file-input').click()}
                  className={`w-full aspect-[16/9] border-2 border-dashed rounded-2xl flex flex-col justify-center items-center p-4 text-center cursor-pointer transition-all relative overflow-hidden ${
                    isDragOver 
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 scale-[1.01]' 
                      : imagePreview 
                        ? 'border-slate-200 dark:border-purple-900/40' 
                        : 'border-slate-200 dark:border-purple-900/30 hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-purple-950/10'
                  }`}
                >
                  <input 
                    type="file" 
                    id="memory-file-input" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />

                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Uploaded preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 hover:opacity-100 flex items-center justify-center transition-all">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg animate-float-1"
                          title="Remove Image"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud size={28} className="text-slate-400 dark:text-purple-400 mb-2 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800 dark:text-purple-200">Upload Image File</span>
                      <span className="text-[10px] text-slate-400 dark:text-purple-300/50 mt-1">PNG, JPG, or WEBP up to 5MB</span>
                    </>
                  )}
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Recipient Name</label>
                <input
                  type="text"
                  value={memoryRecipient}
                  onChange={(e) => setMemoryRecipient(e.target.value)}
                  placeholder="e.g. Grandma"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-purple-950/10 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium"
                  required
                />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-purple-300/70 mb-1.5 uppercase tracking-wider">Describe the Memory</label>
                <textarea
                  rows={3}
                  value={memoryDescription}
                  onChange={(e) => setMemoryDescription(e.target.value)}
                  placeholder="Grandma blowing candles on her 80th birthday surrounded by kids.."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-purple-950/10 border border-slate-200/50 dark:border-purple-900/30 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium placeholder-slate-400/80 leading-relaxed"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-250/30 dark:border-amber-900/20 rounded-xl text-xs flex gap-2 items-center">
                  <FiAlertTriangle className="flex-shrink-0" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    <span>Analyzing & generating memory card...</span>
                  </>
                ) : (
                  <>
                    <FiActivity />
                    <span>Analyze & Generate Memory Card</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB CONTENT: SAVED CARDS */}
          {activeTab === 'history' && (
            <div className="space-y-4 flex flex-col h-full">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3 flex items-center gap-2">
                <FiCopy className="text-purple-600 dark:text-purple-400" />
                <span>Saved Cards Archive</span>
              </h2>

              {loadingSaved ? (
                <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
                  <FiRefreshCw className="animate-spin mr-2" />
                  <span className="text-xs font-medium">Retrieving saved cards...</span>
                </div>
              ) : savedCards.length === 0 ? (
                <div className="text-center py-20 text-slate-400 dark:text-purple-300/40">
                  <p className="text-xs font-semibold">No saved cards found in archive.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {savedCards.map((card) => (
                    <div
                      key={card._id}
                      onClick={() => selectCardFromHistory(card)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between hover:scale-[1.01] ${
                        generatedCard?._id === card._id
                          ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-500/50'
                          : 'bg-slate-50/50 dark:bg-purple-950/5 border-slate-100 dark:border-purple-900/10 hover:border-purple-500/20'
                      }`}
                    >
                      <div className="truncate pr-4 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 mb-1">
                          {card.occasion}
                        </span>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-purple-100 truncate">{card.title}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-purple-300/50 truncate mt-0.5">For: {card.recipient} ∙ From: {card.sender}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {card.isFavorite && <FiHeart className="text-rose-500 fill-rose-500" size={13} />}
                        <button
                          onClick={(e) => handleDeleteSavedCard(e, card._id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-655 rounded-lg transition-colors cursor-pointer"
                          title="Delete card"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4 flex flex-col h-full">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-purple-900/20 pb-3 flex items-center gap-2">
                <FiHeart className="text-rose-500 fill-rose-500" />
                <span>Favorites Vault</span>
              </h2>

              {loadingSaved ? (
                <div className="flex-1 flex items-center justify-center py-20 text-slate-400">
                  <FiRefreshCw className="animate-spin mr-2" />
                  <span className="text-xs font-medium">Loading favorites...</span>
                </div>
              ) : savedCards.filter(c => c.isFavorite).length === 0 ? (
                <div className="text-center py-20 text-slate-400 dark:text-purple-300/40">
                  <p className="text-xs font-semibold">No favorited cards found.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {savedCards.filter(c => c.isFavorite).map((card) => (
                    <div
                      key={card._id}
                      onClick={() => selectCardFromHistory(card)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between hover:scale-[1.01] ${
                        generatedCard?._id === card._id
                          ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-500/50'
                          : 'bg-slate-50/50 dark:bg-purple-950/5 border-slate-100 dark:border-purple-900/10 hover:border-purple-500/20'
                      }`}
                    >
                      <div className="truncate pr-4 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 mb-1">
                          {card.occasion}
                        </span>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-purple-100 truncate">{card.title}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-purple-300/50 truncate mt-0.5">For: {card.recipient} ∙ From: {card.sender}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleDeleteSavedCard(e, card._id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-655 rounded-lg transition-colors cursor-pointer"
                          title="Delete card"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: LIVE PREVIEW & CONTROLS */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-white/70 dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/25 rounded-3xl shadow-sm p-12 flex flex-col justify-center items-center"
              >
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{ x: [-8, 8, -8], y: [-12, 12, -12], rotate: [-5, 8, -5] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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
              <motion.div
                key="preview-active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Canvas Control Header */}
                <div className="flex items-center justify-center p-2 bg-white dark:bg-[#120B2E]/70 border border-slate-100 dark:border-purple-900/20 rounded-2xl max-w-xl mx-auto shadow-sm w-full">
                  <button
                    type="button"
                    onClick={() => setCardFlipped(!cardFlipped)}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      cardFlipped
                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#120B2E]/40 border-slate-200 dark:border-purple-900/30 text-slate-700 dark:text-purple-200 hover:border-purple-500'
                    }`}
                  >
                    <span>Flip Card: {cardFlipped ? 'Front View' : 'Back View'}</span>
                  </button>
                </div>

                {/* Device View Wrapper */}
                <div className="w-full flex justify-center items-center">
                  <div className="relative w-full max-w-xl">
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
                      template={generatedCard.template || formData.template}
                      imageUrl={generatedCard.imageUrl}
                      flipped={cardFlipped}
                    />
                  </div>
                </div>

                {/* Primary Card Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => handleCopyToClipboard(generatedCard.content, 'content')}
                    className="px-6 py-3 rounded-full bg-white dark:bg-[#120B2E]/40 border border-slate-200 dark:border-purple-900/30 hover:border-purple-500 text-slate-700 dark:text-purple-200 font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] transform cursor-pointer"
                  >
                    {copiedField.content ? <FiCheck className="text-green-500 animate-bounce" /> : <FiCopy />}
                    <span>{copiedField.content ? 'Copied Text!' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-xs shadow-md shadow-purple-600/10 hover:shadow-purple-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] transform cursor-pointer"
                  >
                    <FiShare2 />
                    <span>Share or Download</span>
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className="px-6 py-3 rounded-full bg-white dark:bg-[#120B2E]/40 border border-slate-200 dark:border-purple-900/30 hover:border-purple-500 text-slate-700 dark:text-purple-200 font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] transform cursor-pointer"
                  >
                    <FiHeart className={generatedCard.isFavorite ? "text-rose-500 fill-rose-500 animate-pulse" : "text-slate-400"} />
                    <span>{generatedCard.isFavorite ? 'Favorited!' : 'Favorite Card'}</span>
                  </button>

                  <button
                    onClick={activeTab === 'memory' ? handleGenerateMemory : handleGenerate}
                    className="px-6 py-3 rounded-full bg-white dark:bg-[#120B2E]/40 border border-slate-200 dark:border-purple-900/30 text-slate-700 dark:text-purple-200 font-bold text-xs shadow-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-purple-950/20 transition-all cursor-pointer"
                  >
                    <FiRefreshCw />
                    <span>Regenerate</span>
                  </button>
                </div>

                {/* Metadata & Quality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto text-left items-start">
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-2 relative">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider font-semibold">Social Caption</span>
                      <p className="text-xs text-slate-750 dark:text-purple-200 leading-relaxed pr-8 font-medium">{generatedCard.caption}</p>
                      <button
                        onClick={() => handleCopyToClipboard(generatedCard.caption, 'caption')}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 dark:border-purple-900/30 hover:border-purple-500 hover:text-purple-600 text-slate-400 transition-colors cursor-pointer"
                      >
                        {copiedField.caption ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                      </button>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-2 relative">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider font-semibold">Gift Tag Message</span>
                      <p className="text-xs text-slate-750 dark:text-purple-200 leading-relaxed pr-8 font-medium">{generatedCard.giftTag}</p>
                      <button
                        onClick={() => handleCopyToClipboard(generatedCard.giftTag, 'giftTag')}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 dark:border-purple-900/30 hover:border-purple-500 hover:text-purple-600 text-slate-400 transition-colors cursor-pointer"
                      >
                        {copiedField.giftTag ? <FiCheck className="text-green-500" /> : <FiCopy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl border border-slate-100 dark:border-purple-900/20 rounded-2xl shadow-sm space-y-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-purple-400 block tracking-wider flex items-center gap-1.5 font-semibold">
                      <FiActivity />
                      <span>AI Quality Indicators</span>
                    </span>
                    
                    <div className="flex justify-between items-center text-xs border-b border-purple-100/50 dark:border-purple-900/20 pb-2">
                      <span className="text-slate-500 dark:text-purple-300/60 font-medium">Body Character Count</span>
                      <span className="font-bold font-mono text-purple-700 dark:text-purple-300">{(generatedCard.content || '').length} chars</span>
                    </div>

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
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl aspect-[4/5] mx-auto bg-white/40 dark:bg-[#120B2E]/30 border border-dashed border-purple-200 dark:border-purple-800/30 rounded-3xl flex flex-col justify-center items-center p-8 text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl mb-4 border border-purple-200/20 shadow-sm animate-bounce duration-[4s]">
                  ✈️
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-base">Workspace Canvas Ready</h3>
                <p className="text-slate-400 dark:text-purple-300/50 text-xs max-w-xs leading-relaxed font-medium">
                  {activeTab === 'memory' 
                    ? 'Upload a memory snapshot, configure details on the left, and generate your custom multimodal greeting!'
                    : 'Configure the parameters on the left and click "Generate Card" to watch Gemini AI design your greeting.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SHARING MODAL */}
      <AnimatePresence>
        {showShareModal && generatedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-[#0B051D]/60 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
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

              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-semibold">Digital Delivery</span>
                
                <div className="grid grid-cols-3 gap-3">
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

                  <button
                    onClick={() => {
                      window.open(`mailto:?subject=${encodeURIComponent(generatedCard.title)}&body=${encodeURIComponent(generatedCard.content)}`);
                    }}
                    className="p-3 bg-[#EEF2FF] dark:bg-indigo-950/20 border border-indigo-200/30 rounded-2xl flex flex-col items-center gap-1.5 hover:scale-[1.03] transition-transform cursor-pointer"
                  >
                    <FiMail size={20} className="text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-600">Email</span>
                  </button>

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

              <div className="mt-8 pt-6 border-t border-purple-100/50 dark:border-purple-900/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 font-semibold">Download Layout Template</span>
                
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

              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-655 dark:hover:text-white p-1.5 rounded-lg border border-transparent hover:border-purple-200/30"
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
