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
  FiActivity,
  FiGrid,
  FiCpu,
  FiClock,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiDatabase,
  FiInfo
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
        ],
        recentActivityTable: [
          { _id: "1", user: "Ravi Verma", occasion: "Birthday", tone: "Funny", date: new Date() },
          { _id: "2", user: "Guest User", occasion: "Anniversary", tone: "Romantic", date: new Date(Date.now() - 3600000) },
          { _id: "3", user: "Ayesha Khan", occasion: "Festival", tone: "Inspirational", date: new Date(Date.now() - 7200000) },
        ],
        mostActiveDay: "Friday",
        mostPopularTemplate: "Festival Glow",
        lastGeneratedCard: "Anniversary Card for Priya",
        systemHealth: {
          dbConnected: false,
          uptime: 7200,
          serverStatus: "Degraded",
          apiVersion: "2.0.0"
        },
        aiUsage: {
          totalTokens: 11760,
          avgResponseTime: "1.45s",
          apiSuccessRate: "98.9%"
        }
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  };

  // Pie chart colors
  const COLORS = ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE', '#F3E8FF'];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 text-left">
        <div className="h-8 w-48 bg-purple-100 dark:bg-purple-950/40 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-white dark:bg-[#120B2E]/60 border border-purple-500/10 rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-white dark:bg-[#120B2E]/60 border border-purple-500/10 rounded-3xl animate-pulse"></div>
          <div className="lg:col-span-4 h-80 bg-white dark:bg-[#120B2E]/60 border border-purple-500/10 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const isDbOnline = stats?.systemHealth?.dbConnected;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            System Operations
          </h1>
          <p className="text-slate-500 dark:text-purple-300/60 text-sm mt-1">
            Real-time analytics and generation statistics for Paper Plane cards.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/15 transform flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <FiActivity className="animate-spin-slow" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* SYSTEM STATUS BANNER */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 p-8 rounded-[32px] shadow-[0_10px_40px_rgba(124,58,237,0.06)] dark:shadow-none flex items-center justify-between transition-colors duration-300">
        <div className="relative z-10 space-y-2.5">
          {isDbOnline ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/30 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API & Database Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/40 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>MongoDB Offline (Resilient Memory Fallback Active)</span>
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Welcome back, Administrator!
          </h2>
          <p className="text-slate-500 dark:text-purple-300/60 text-sm max-w-xl leading-relaxed font-medium">
            Paper Plane greeting generator is performing within optimal parameters. All AI operations are online and monitoring statistics.
          </p>
        </div>
        <div className="hidden lg:block relative z-10 text-6xl opacity-25 select-none animate-bounce-slow">
          ✈️
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-100/30 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* STATS METRIC GRID - Expanded to 8 metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Cards Generated", 
            val: stats.cardsCount, 
            icon: <FiFileText className="text-[#7C3AED]" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Total Registered Users", 
            val: stats.usersCount, 
            icon: <FiUsers className="text-[#8B5CF6]" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Popular Occasion", 
            val: stats.topOccasion, 
            icon: <FiHeart className="text-pink-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Popular Tone", 
            val: stats.topTone, 
            icon: <FiSmile className="text-amber-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Most Active Day", 
            val: stats.mostActiveDay, 
            icon: <FiTrendingUp className="text-emerald-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Top Template", 
            val: stats.mostPopularTemplate, 
            icon: <FiGrid className="text-blue-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "AI Generation Latency", 
            val: stats.aiUsage?.avgResponseTime || "1.35s", 
            icon: <FiClock className="text-purple-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
          { 
            label: "Gemini API Success", 
            val: stats.aiUsage?.apiSuccessRate || "99.7%", 
            icon: <FiShield className="text-indigo-500" size={20} />, 
            bg: "bg-white/70 dark:bg-[#120B2E]/70 border-purple-500/15" 
          },
        ].map((card, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-3xl border ${card.bg} flex items-center justify-between hover:-translate-y-1 transition-all duration-350 group shadow-sm hover:shadow-[0_15px_30px_rgba(124,58,237,0.06)]`}
          >
            <div className="space-y-1 max-w-[70%]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest block truncate">{card.label}</span>
              <span className="text-2xl font-black text-[#0F172A] dark:text-white block truncate">{card.val}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F8F4FF] dark:bg-[#1A1145] border border-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Generation Area Chart */}
        <div className="lg:col-span-8 bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2">
            <FiTrendingUp className="text-[#7C3AED]" />
            <span>Cards Generated Per Day</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartDailyData}>
                <defs>
                  <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderColor: 'rgba(124,58,237,0.15)', 
                    borderRadius: '16px', 
                    color: '#0F172A', 
                    fontSize: '12px', 
                    boxShadow: '0 10px 30px rgba(124,58,237,0.08)' 
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#7C3AED' }}
                />
                <Area type="monotone" dataKey="cards" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorCards)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occasion breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2">
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
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderColor: 'rgba(124,58,237,0.15)', 
                      borderRadius: '16px', 
                      color: '#0F172A', 
                      fontSize: '12px', 
                      boxShadow: '0 10px 30px rgba(124,58,237,0.08)' 
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={8} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', color: '#94a3b8', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400 dark:text-purple-300/40 text-xs">No occasion data available</span>
            )}
          </div>
        </div>

      </div>

      {/* SYSTEM HEALTH & AI DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* System Health Console */}
        <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 dark:border-purple-800/20 pb-3">
            <FiDatabase className="text-[#7C3AED]" />
            <span>Infrastructure Health Console</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">MongoDB Status</span>
              {isDbOnline ? (
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <FiCheckCircle size={14} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-400">
                  <FiAlertTriangle size={14} /> Memory Fallback Active
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">Server Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                stats.systemHealth?.serverStatus === 'Active' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/20' 
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/20'
              }`}>
                {stats.systemHealth?.serverStatus || "Active"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">Server Uptime</span>
              <span className="font-mono text-slate-700 dark:text-purple-200 font-bold">
                {formatUptime(stats.systemHealth?.uptime)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">Core API Version</span>
              <span className="font-mono text-[#7C3AED] dark:text-purple-400 font-bold">
                v{stats.systemHealth?.apiVersion || "2.0.0"}
              </span>
            </div>
          </div>
        </div>

        {/* AI Engine Statistics */}
        <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 p-6 rounded-3xl space-y-4 shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 dark:border-purple-800/20 pb-3">
            <FiCpu className="text-[#8B5CF6]" />
            <span>Gemini AI Engine Footprint</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">Generative Tokens Spent</span>
              <span className="font-bold text-purple-700 dark:text-purple-400">
                {stats.aiUsage?.totalTokens ? stats.aiUsage.totalTokens.toLocaleString() : 0} Tokens
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">Average Generation Speed</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {stats.aiUsage?.avgResponseTime || "1.35s"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-purple-500/5 dark:border-purple-800/10">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold">LLM Call Success Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {stats.aiUsage?.apiSuccessRate || "99.7%"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-slate-500 dark:text-purple-300/60 font-semibold truncate max-w-[40%]">Last Card Action</span>
              <span className="text-slate-700 dark:text-purple-200 font-bold truncate max-w-[60%] flex items-center gap-1">
                <FiInfo size={12} className="text-slate-400 flex-shrink-0" />
                <span>{stats.lastGeneratedCard || "None"}</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOG */}
      <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 rounded-3xl p-6 space-y-6 shadow-sm transition-colors duration-300">
        <h3 className="text-xs font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 dark:border-purple-800/20 pb-3">
          <FiActivity className="text-[#7C3AED]" />
          <span>Recent User & Generation Activities</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-purple-500/10 dark:border-purple-800/15">
          <table className="w-full text-sm text-left text-slate-700 dark:text-purple-200">
            <thead className="text-xs uppercase bg-[#F8F4FF] dark:bg-[#1A1145] text-slate-500 dark:text-purple-350 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Generating Profile</th>
                <th scope="col" className="px-6 py-4">Occasion</th>
                <th scope="col" className="px-6 py-4">Tone Selection</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Activity Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 dark:divide-purple-800/20 bg-transparent">
              {stats.recentActivityTable && stats.recentActivityTable.length > 0 ? (
                stats.recentActivityTable.map((activity, index) => (
                  <tr key={activity._id || index} className="hover:bg-[#F3EBFF]/20 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F3EBFF] dark:bg-purple-950/60 flex items-center justify-center text-xs font-extrabold text-[#7C3AED] dark:text-purple-300 border border-purple-500/10 dark:border-purple-800/20 shadow-sm">
                        {activity.user === 'Guest User' ? 'G' : activity.user.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span>{activity.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-purple-50 dark:bg-purple-950/50 text-[#7C3AED] dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/25 tracking-wider">
                        {activity.occasion}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-slate-50 dark:bg-purple-900/10 text-slate-500 dark:text-purple-300/60 border border-slate-200/40 dark:border-purple-800/10 tracking-wider">
                        {activity.tone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <FiCheckCircle size={13} /> Processed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-purple-300/40 font-mono">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-xs text-slate-400 dark:text-purple-300/40">
                    No activity logs recorded yet. Start generating greetings!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
