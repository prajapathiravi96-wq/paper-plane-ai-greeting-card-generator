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
    try {
      const response = await API.get('/cards', {
        params: {
          search: search || undefined,
          occasion: occasionFilter !== 'All' ? occasionFilter : undefined,
          tone: toneFilter !== 'All' ? toneFilter : undefined,
        }
      });
      if (response.data && response.data.success) {
        setCards(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve cards from database. Displaying offline memory cards.');
      
      // Fallback local memory cards
      const offlineCards = [
        {
          _id: "666e1234567890abcdef0001",
          occasion: "Birthday",
          tone: "Funny",
          recipient: "Amit",
          sender: "Ravi",
          length: "Medium",
          language: "English",
          title: "Another Year of Wisdom (or Lack Thereof)",
          content: "Happy Birthday Amit! You're not getting older, you're just becoming a classic. Like a fine wine, or a vintage car, or a piece of cheese left in the fridge too long. Hope your day is filled with lots of cake and zero calculations of your actual age. Cheers, Ravi!",
          caption: "Older? Yes. Wiser? Debatable. Happy Birthday, Amit! 🎂",
          giftTag: "To Amit, From Ravi. Wishing you cake and chaos!",
          template: "birthday",
          isFavorite: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          _id: "666e1234567890abcdef0002",
          occasion: "Anniversary",
          tone: "Romantic",
          recipient: "Priya",
          sender: "Rohan",
          length: "Medium",
          language: "English",
          title: "To My Forever",
          content: "Happy Anniversary, Priya! Every day spent with you feels like a beautiful dream come true. You are my laughter, my anchor, and my best friend. Thank you for sharing your life, your love, and your heart with me. Here's to forever, Rohan.",
          caption: "Years fly by when you're with your favorite human. Happy Anniversary! ❤️",
          giftTag: "To Priya, From Rohan. Forever and always.",
          template: "anniversary",
          isFavorite: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          _id: "666e1234567890abcdef0003",
          occasion: "Corporate Appreciation",
          tone: "Professional",
          recipient: "Tech Team",
          sender: "CEO",
          length: "Short",
          language: "English",
          title: "Outstanding Contribution",
          content: "Dear Tech Team, thank you for your exceptional commitment to delivering this project. Your engineering expertise and dedication have set a new benchmark for excellence. We appreciate everything you do.",
          caption: "Big shoutout to our Tech Team for their hard work! 🚀",
          giftTag: "Thank you for driving success. - CEO",
          template: "corporate",
          isFavorite: false,
          createdAt: new Date()
        }
      ];

      // Local manual filter
      let filtered = offlineCards;
      if (search) {
        filtered = filtered.filter(c => 
          c.recipient.toLowerCase().includes(search.toLowerCase()) ||
          c.sender.toLowerCase().includes(search.toLowerCase()) ||
          c.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (occasionFilter !== 'All') {
        filtered = filtered.filter(c => c.occasion === occasionFilter);
      }
      if (toneFilter !== 'All') {
        filtered = filtered.filter(c => c.tone === toneFilter);
      }
      setCards(filtered);
    }
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

    try {
      await API.delete(`/cards/${id}`);
      setCards(cards.filter(c => c._id !== id));
      if (selectedCard && selectedCard._id === id) {
        setSelectedCard(null);
      }
    } catch (err) {
      console.error(err);
      setCards(cards.filter(c => c._id !== id));
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/cards/${id}/favorite`);
      if (res.data && res.data.success) {
        setCards(cards.map(c => c._id === id ? { ...c, isFavorite: res.data.data.isFavorite } : c));
      }
    } catch (err) {
      console.error(err);
      // Fallback local toggle
      setCards(cards.map(c => c._id === id ? { ...c, isFavorite: !c.isFavorite } : c));
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
          <p className="text-slate-500 dark:text-purple-300/60 text-sm max-w-xl font-medium">
            Browse through all generated greeting cards. Search, filter, inspect details, and manage favorites.
          </p>
        </div>
        
        {cards.length > 0 && (
          <button
            onClick={handleExportHistory}
            className="px-5 py-2.5 bg-purple-650 hover:bg-purple-750 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
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
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-50 dark:bg-purple-900/20 text-slate-500 dark:text-purple-300/80 tracking-wider">
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
                    <span className="text-[10px] text-slate-400 dark:text-purple-300/60 flex items-center gap-1">
                      <FiCalendar />
                      {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-[#0F172A] dark:text-white group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors text-base line-clamp-1 mb-2 font-serif">
                  {card.title}
                </h3>
                <p className="text-slate-500 dark:text-purple-300/50 text-xs line-clamp-3 leading-relaxed font-sans mb-4">
                  {card.content}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-purple-500/5 pt-4 text-xs">
                <div className="text-slate-450 dark:text-purple-300/50">
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
          <p className="text-slate-450 dark:text-purple-300/60 text-xs max-w-xs mx-auto leading-relaxed">
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
                  className="px-5 py-2.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-650 dark:text-purple-300 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
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
