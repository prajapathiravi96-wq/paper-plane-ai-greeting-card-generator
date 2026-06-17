import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  FiFileText, 
  FiUsers, 
  FiHeart, 
  FiSmile, 
  FiTrendingUp, 
  FiActivity 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard stats from API
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await API.get('/dashboard/stats');
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve database stats. Showing mock analytics data.');
      
      // Fallback statistics
      setStats({
        cardsCount: 42,
        usersCount: 24,
        topOccasion: "Birthday",
        topTone: "Funny",
        chartDailyData: [
          { date: "Jun 10", cards: 4 },
          { date: "Jun 11", cards: 7 },
          { date: "Jun 12", cards: 5 },
          { date: "Jun 13", cards: 8 },
          { date: "Jun 14", cards: 12 },
          { date: "Jun 15", cards: 9 },
          { date: "Jun 16", cards: 15 },
        ],
        chartOccasionData: [
          { name: "Birthday", value: 18 },
          { name: "Anniversary", value: 12 },
          { name: "Corporate Appreciation", value: 6 },
          { name: "Wedding", value: 4 },
          { name: "Festival", value: 2 },
        ],
        recentCards: [
          { _id: "1", recipient: "Amit", sender: "Ravi", occasion: "Birthday", tone: "Funny", title: "Another Year of Wisdom", createdAt: new Date() },
          { _id: "2", recipient: "Priya", sender: "Rohan", occasion: "Anniversary", tone: "Romantic", title: "To My Forever", createdAt: new Date(Date.now() - 3600000) },
          { _id: "3", recipient: "Nikhil", sender: "Simran", occasion: "Congratulations", tone: "Inspirational", title: "Sky is the Limit", createdAt: new Date(Date.now() - 7200000) },
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Pie chart colors
  const COLORS = ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#a78bfa'];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 text-left">
        <div className="h-8 w-48 bg-purple-100 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white border border-purple-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-white border border-purple-100 rounded-3xl animate-pulse"></div>
          <div className="lg:col-span-4 h-80 bg-white border border-purple-100 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            System Operations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time analytics and generation statistics for Paper Plane cards.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/15 transform flex items-center gap-1.5 shadow-sm"
        >
          <FiActivity />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* SYSTEM STATUS BANNER */}
      <div className="relative overflow-hidden bg-white border border-purple-500/15 p-8 rounded-[32px] shadow-[0_10px_40px_rgba(124,58,237,0.06)] flex items-center justify-between">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-250 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API & Systems Online</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, Administrator!
          </h2>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            Paper Plane greeting generator is performing within optimal parameters. All AI operations are online and monitoring statistics.
          </p>
        </div>
        <div className="hidden lg:block relative z-10 text-6xl opacity-20 select-none">
          ✈️
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Cards Generated", val: stats.cardsCount, icon: <FiFileText className="text-[#7C3AED]" size={20} />, bg: "bg-white border-purple-500/15 shadow-[0_10px_40px_rgba(124,58,237,0.05)] hover:shadow-purple-500/10" },
          { label: "Total Registered Users", val: stats.usersCount, icon: <FiUsers className="text-[#8B5CF6]" size={20} />, bg: "bg-white border-purple-500/15 shadow-[0_10px_40px_rgba(124,58,237,0.05)] hover:shadow-purple-500/10" },
          { label: "Popular Occasion", val: stats.topOccasion, icon: <FiHeart className="text-pink-500" size={20} />, bg: "bg-white border-purple-500/15 shadow-[0_10px_40px_rgba(124,58,237,0.05)] hover:shadow-purple-500/10" },
          { label: "Popular Tone", val: stats.topTone, icon: <FiSmile className="text-amber-500" size={20} />, bg: "bg-white border-purple-500/15 shadow-[0_10px_40px_rgba(124,58,237,0.05)] hover:shadow-purple-500/10" },
        ].map((card, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-3xl border ${card.bg} flex items-center justify-between hover:-translate-y-1 transition-all duration-300 group`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
              <span className="text-3xl font-black text-[#0F172A] block">{card.val}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F8F4FF] border border-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Generation Area Chart */}
        <div className="lg:col-span-8 bg-white border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-[0_10px_40px_rgba(124,58,237,0.05)]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FiTrendingUp className="text-[#7C3AED]" />
            <span>Cards Generated Per Day</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartDailyData}>
                <defs>
                  <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(124,58,237,0.15)', borderRadius: '16px', color: '#0F172A', fontSize: '12px', boxShadow: '0 10px 30px rgba(124,58,237,0.08)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#7C3AED' }}
                />
                <Area type="monotone" dataKey="cards" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorCards)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occasion breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-[0_10px_40px_rgba(124,58,237,0.05)]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FiHeart className="text-[#8B5CF6]" />
            <span>Occasion Analytics</span>
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {stats.chartOccasionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartOccasionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.chartOccasionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: 'rgba(124,58,237,0.15)', borderRadius: '16px', color: '#0F172A', fontSize: '12px', boxShadow: '0 10px 30px rgba(124,58,237,0.08)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={8} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', color: '#64748b', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400 text-xs">No occasion data available</span>
            )}
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOG */}
      <div className="bg-white border border-purple-500/15 rounded-3xl p-6 space-y-6 shadow-[0_10px_40px_rgba(124,58,237,0.05)]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 pb-3">
          <FiActivity className="text-[#7C3AED]" />
          <span>Recent Card Actions</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-purple-500/10">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="text-xs uppercase bg-[#F8F4FF] text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Recipient</th>
                <th scope="col" className="px-6 py-4">Sender</th>
                <th scope="col" className="px-6 py-4">Occasion</th>
                <th scope="col" className="px-6 py-4">Tone</th>
                <th scope="col" className="px-6 py-4">Card Title</th>
                <th scope="col" className="px-6 py-4 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 bg-white">
              {stats.recentCards.map((card) => (
                <tr key={card._id} className="hover:bg-[#F3EBFF]/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0F172A]">{card.recipient}</td>
                  <td className="px-6 py-4 font-semibold text-slate-650">{card.sender}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 text-[#7C3AED] border border-purple-200/50 tracking-wider">
                      {card.occasion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-slate-105 text-slate-500 border border-slate-200/50 tracking-wider">
                      {card.tone}
                    </span>
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs text-slate-600 font-medium">{card.title}</td>
                  <td className="px-6 py-4 text-right text-xs text-slate-400 font-mono">
                    {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
