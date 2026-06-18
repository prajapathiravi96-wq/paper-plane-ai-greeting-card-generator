import React, { useState, useEffect } from 'react';
import API from '../api';
import CardTemplate from '../components/CardTemplate';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiTrash2, 
  FiEye, 
  FiCopy, 
  FiX, 
  FiCalendar, 
  FiFilter, 
  FiCheck,
  FiHeart,
  FiDownload,
  FiGlobe,
  FiSliders,
  FiExternalLink
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

const History = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('All');
  const [toneFilter, setToneFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal inspection state
  const [selectedCard, setSelectedCard] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  // Lists
  const occasions = [
    'All', 'Birthday', 'Anniversary', 'Wedding', 'Congratulations', 
    'Thank You', 'Festival', 'Corporate Appreciation', 'Friendship', 'Farewell'
  ];

  const tones = [
    'All', 'Professional', 'Emotional', 'Funny', 'Romantic', 'Formal', 'Inspirational'
  ];

  // Fetch cards
  const fetchCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/cards');
      if (response.data && response.data.success) {
        saveServerCache(response.data.data);
      }
    } catch (err) {
      console.warn('Could not retrieve cards from server, displaying offline/cached cards.', err);
    }

    const merged = getMergedCards();
    
    // Apply client-side manual filtering
    let filtered = merged;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        (c.recipient && c.recipient.toLowerCase().includes(searchLower)) ||
        (c.sender && c.sender.toLowerCase().includes(searchLower)) ||
        (c.title && c.title.toLowerCase().includes(searchLower)) ||
        (c.content && c.content.toLowerCase().includes(searchLower))
      );
    }
    if (occasionFilter !== 'All') {
      filtered = filtered.filter(c => c.occasion === occasionFilter);
    }
    if (toneFilter !== 'All') {
      filtered = filtered.filter(c => c.tone === toneFilter);
    }
    setCards(filtered);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCards();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, occasionFilter, toneFilter]);

  // Delete Card
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this greeting card?')) return;

    const isLocal = id.toString().startsWith('local_');

    const deleteLocally = () => {
      const locals = getLocalCards();
      saveLocalCards(locals.filter(c => c._id !== id));

      const cache = getServerCache();
      saveServerCache(cache.filter(c => c._id !== id));

      setCards(cards.filter(c => c._id !== id));
      if (selectedCard && selectedCard._id === id) {
        setSelectedCard(null);
      }
    };

    if (isLocal) {
      deleteLocally();
      return;
    }

    try {
      const response = await API.delete(`/cards/${id}`);
      if (response && response.data && response.data.success) {
        deleteLocally();
      } else {
        deleteLocally();
      }
    } catch (err) {
      console.warn('API delete failed, falling back to local delete:', err);
      deleteLocally();
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    const isLocal = id.toString().startsWith('local_');

    const toggleLocally = () => {
      const locals = getLocalCards();
      const updatedLocals = locals.map(c => c._id === id ? { ...c, isFavorite: !c.isFavorite } : c);
      saveLocalCards(updatedLocals);

      const cache = getServerCache();
      const updatedCache = cache.map(c => c._id === id ? { ...c, isFavorite: !c.isFavorite } : c);
      saveServerCache(updatedCache);

      setCards(cards.map(c => c._id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    };

    if (isLocal) {
      toggleLocally();
      return;
    }

    try {
      const res = await API.put(`/cards/${id}/favorite`);
      if (res.data && res.data.success) {
        const updatedCard = res.data.data;
        
        const cache = getServerCache();
        const updatedCache = cache.map(c => c._id === updatedCard._id ? updatedCard : c);
        saveServerCache(updatedCache);

        setCards(cards.map(c => c._id === id ? { ...c, isFavorite: updatedCard.isFavorite } : c));
      } else {
        toggleLocally();
      }
    } catch (err) {
      console.warn('API toggling favorite failed, falling back to local toggle:', err);
      toggleLocally();
    }
  };

  // Copy text helper
  const handleCopy = (text, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Export history as JSON
  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `paper_plane_history_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle sorting
  const getSortedCards = () => {
    let sorted = [...cards];
    switch (sortBy) {
      case 'Oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'Occasion':
        return sorted.sort((a, b) => a.occasion.localeCompare(b.occasion));
      case 'Tone':
        return sorted.sort((a, b) => a.tone.localeCompare(b.tone));
      case 'Newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const sortedCards = getSortedCards();

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 min-h-[calc(100vh-73px)] text-left text-[#0F172A] dark:text-[#F8F4FF] transition-colors duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            History Vault
          </h1>
          <p className="text-slate-500 dark:text-purple-200 text-sm max-w-xl font-medium">
            Browse through all generated greeting cards. Search, filter, inspect details, and manage favorites.
          </p>
        </div>
        
        {cards.length > 0 && (
          <button
            onClick={handleExportHistory}
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiDownload />
            <span>Export History (JSON)</span>
          </button>
        )}
      </div>

      {/* SEARCH AND FILTERS GRID */}
      <div className="bg-white dark:bg-[#120B2E]/60 backdrop-blur-xl p-5 rounded-3xl border border-slate-100 dark:border-purple-900/20 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between mb-8 transition-colors">
        
        {/* Search Input */}
        <div className="relative w-full xl:w-1/3">
          <FiSearch className="absolute left-4 top-3.5 text-slate-450 dark:text-purple-400" size={18} />
          <input
            type="text"
            placeholder="Search by recipient, sender, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-purple-950/10 border border-slate-200 dark:border-purple-900/30 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors text-sm font-medium"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 w-full xl:w-auto items-center justify-start xl:justify-end">
          
          {/* Occasions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiFilter className="text-slate-400 dark:text-purple-400" size={16} />
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2.5 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-700 dark:text-purple-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              {occasions.map(o => (
                <option key={o} value={o} className="dark:bg-[#120B2E]">Occasion: {o}</option>
              ))}
            </select>
          </div>

          {/* Tones */}
          <div className="w-full sm:w-auto">
            <select
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
              className="w-full sm:w-40 px-3 py-2.5 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-700 dark:text-purple-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              {tones.map(t => (
                <option key={t} value={t} className="dark:bg-[#120B2E]">Tone: {t}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-purple-150/40 dark:border-purple-900/20 pt-3 sm:pt-0 sm:pl-4">
            <FiSliders className="text-slate-400 dark:text-purple-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-36 px-3 py-2.5 bg-white/50 dark:bg-[#150E35]/70 border border-slate-200 dark:border-purple-900/30 rounded-xl text-slate-700 dark:text-purple-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
            >
              <option value="Newest" className="dark:bg-[#120B2E]">Sort: Newest</option>
              <option value="Oldest" className="dark:bg-[#120B2E]">Sort: Oldest</option>
              <option value="Occasion" className="dark:bg-[#120B2E]">Sort: Occasion</option>
              <option value="Tone" className="dark:bg-[#120B2E]">Sort: Tone</option>
            </select>
          </div>

        </div>
      </div>

      {/* CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white dark:bg-[#120B2E]/60 border border-slate-100 dark:border-purple-900/25 rounded-3xl p-6 flex flex-col justify-between animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-purple-950 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-purple-950 rounded-lg"></div>
              </div>
              <div className="h-16 w-full bg-slate-100 dark:bg-purple-950/40 rounded-xl"></div>
              <div className="flex justify-between pt-4">
                <div className="h-8 w-20 bg-slate-200 dark:bg-purple-950 rounded-full"></div>
                <div className="h-8 w-20 bg-slate-200 dark:bg-purple-950 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedCards.map((card) => (
            <motion.div
              layout
              key={card._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedCard(card)}
              className="bg-white dark:bg-[#120B2E]/60 border border-slate-100 dark:border-purple-900/20 p-6 rounded-[32px] shadow-sm hover:shadow-xl hover:border-purple-200/50 dark:hover:border-purple-800/20 transition-all duration-300 cursor-pointer flex flex-col justify-between group h-68 relative overflow-hidden text-left"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 tracking-wider">
                      {card.occasion}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-50 dark:bg-purple-900/20 text-slate-500 dark:text-purple-200 tracking-wider">
                      {card.tone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleFavorite(card._id, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors z-10 cursor-pointer"
                      title={card.isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
                    >
                      <FiHeart className={card.isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400 dark:text-purple-400"} size={16} />
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-purple-300 flex items-center gap-1">
                      <FiCalendar />
                      {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#0F172A] dark:text-white group-hover:text-[#7C3AED] dark:group-hover:text-purple-300 transition-colors text-base line-clamp-1 mb-2 font-serif">
                  {card.title}
                </h3>
                <p className="text-slate-500 dark:text-purple-200/90 text-xs line-clamp-3 leading-relaxed font-sans mb-4">
                  {card.content}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-purple-500/5 pt-4 text-xs">
                <div className="text-slate-450 dark:text-purple-300">
                  To: <span className="font-bold text-slate-700 dark:text-purple-200">{card.recipient}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleCopy(card.content, e)}
                    className="p-2 bg-purple-50/50 hover:bg-purple-100 dark:bg-[#1A1145] dark:hover:bg-purple-900/30 text-slate-500 dark:text-purple-300 rounded-xl transition-all cursor-pointer"
                    title="Copy card text"
                  >
                    {copiedText ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                  </button>
                  <button
                    onClick={(e) => handleDelete(card._id, e)}
                    className="p-2 bg-red-50/40 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-slate-500 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                    title="Delete Card"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty Search Results
        <div className="w-full bg-white dark:bg-[#120B2E]/60 border border-slate-150/40 dark:border-purple-900/25 rounded-[32px] p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-400 dark:text-purple-300 flex items-center justify-center text-3xl mx-auto mb-4 border border-purple-100/30 shadow-inner">
            🔍
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-1">No Cards Found</h3>
          <p className="text-slate-450 dark:text-purple-200 text-xs max-w-xs mx-auto leading-relaxed">
            We couldn't find any greeting cards matching your search query or selected filters.
          </p>
        </div>
      )}

      {/* INSPECTION MODAL DRAWER */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0B051D]/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedCard(null)}
            ></motion.div>
            
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white dark:bg-[#150E35] border border-purple-250/20 dark:border-purple-850/25 rounded-[36px] w-full max-w-xl shadow-2xl overflow-hidden z-10 text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-purple-100/50 dark:border-purple-900/20">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FiExternalLink />
                  <span>Card Inspection Workspace</span>
                </span>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-purple-950/40 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Card Canvas display in scroll viewport */}
              <div className="p-8 bg-slate-50/50 dark:bg-purple-950/20 max-h-[60vh] overflow-y-auto flex items-center justify-center border-b border-purple-100/50 dark:border-purple-900/20">
                <CardTemplate 
                  title={selectedCard.title}
                  content={selectedCard.content}
                  recipient={selectedCard.recipient}
                  sender={selectedCard.sender}
                  occasion={selectedCard.occasion}
                  tone={selectedCard.tone}
                  template={selectedCard.template || 'birthday'}
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-3 p-4 justify-end bg-white dark:bg-[#150E35]">
                <button
                  onClick={() => handleCopy(selectedCard.content)}
                  className="px-5 py-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[#7C3AED] dark:text-purple-300 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedText ? <FiCheck size={14} className="text-green-500 animate-bounce" /> : <FiCopy size={14} />}
                  <span>{copiedText ? 'Copied Text' : 'Copy Message'}</span>
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
