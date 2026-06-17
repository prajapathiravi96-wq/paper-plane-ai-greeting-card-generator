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
  FiFileText
} from 'react-icons/fi';

const History = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('All');
  const [toneFilter, setToneFilter] = useState('All');

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
          template: "cheerful",
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
          template: "romantic",
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
    // Debounce search slightly
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
      // Fallback delete local state if offline
      setCards(cards.filter(c => c._id !== id));
    }
  };

  // Copy from list
  const handleCopy = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-12 min-h-[calc(100vh-73px)] text-left">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          History Vault
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Browse through all generated greeting cards. Search, filter, inspect details, and clean up entries as needed.
        </p>
      </div>

      {/* SEARCH AND FILTERS GRID */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        
        {/* Search input */}
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by recipient or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-brand-500 transition-colors text-sm"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <FiFilter className="text-slate-400" size={16} />
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              {occasions.map(o => (
                <option key={o} value={o}>Occasion: {o}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 border border-slate-200 rounded-xl text-slate-700 bg-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              {tones.map(t => (
                <option key={t} value={t}>Tone: {t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-60 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-16 w-full bg-slate-100 rounded"></div>
              <div className="flex justify-between">
                <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              layout
              key={card._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedCard(card)}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-transparent transition-all cursor-pointer flex flex-col justify-between group h-64 relative overflow-hidden text-left"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-brand-700 tracking-wider">
                      {card.occasion}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-50 text-slate-500 tracking-wider">
                      {card.tone}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FiCalendar />
                    {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-4 leading-relaxed font-sans mb-4">
                  {card.content}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-4 text-xs">
                <div className="text-slate-400">
                  To: <span className="font-semibold text-slate-700">{card.recipient}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleCopy(card.content, e)}
                    className="p-2 bg-slate-50 hover:bg-purple-50 hover:text-brand-600 text-slate-500 rounded-xl transition-all"
                    title="Copy card message"
                  >
                    {copiedText ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                  </button>
                  <button
                    onClick={(e) => handleDelete(card._id, e)}
                    className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-xl transition-all"
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
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="font-bold text-slate-800 mb-1">No Cards Found</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
            We couldn't find any greeting cards matching your search query or selected occasion filters.
          </p>
        </div>
      )}

      {/* EXPANSION MODAL */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header block with close button */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiFileText />
                  <span>Card Details Inspection</span>
                </span>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Template wrapper */}
              <div className="p-6 bg-slate-50 max-h-[70vh] overflow-y-auto flex items-center justify-center">
                <CardTemplate 
                  title={selectedCard.title}
                  content={selectedCard.content}
                  recipient={selectedCard.recipient}
                  sender={selectedCard.sender}
                  occasion={selectedCard.occasion}
                  tone={selectedCard.tone}
                  template={selectedCard.template || 'minimalist'}
                />
              </div>

              {/* Bottom modal actions */}
              <div className="flex gap-4 p-4 border-t border-slate-50 justify-end bg-white">
                <button
                  onClick={(e) => handleCopy(selectedCard.content, e)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-brand-600 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  {copiedText ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                  <span>{copiedText ? 'Copied' : 'Copy Message'}</span>
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
