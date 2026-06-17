import React, { useState } from 'react';
import { FiUsers, FiSearch, FiMail, FiUserCheck, FiShield } from 'react-icons/fi';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Ayesha Khan', email: 'ayesha.k@example.com', role: 'Customer', status: 'Active', joined: '2026-04-12' },
    { id: 2, name: 'Kabir Dev', email: 'kabir.d@example.com', role: 'Customer', status: 'Active', joined: '2026-05-01' },
    { id: 3, name: 'Priya Sharma', email: 'priya.s@example.com', role: 'Customer', status: 'Active', joined: '2026-05-18' },
    { id: 4, name: 'Ravi Verma', email: 'ravi.v@example.com', role: 'Admin', status: 'Active', joined: '2026-03-10' },
    { id: 5, name: 'Amit Patel', email: 'amit.p@example.com', role: 'Customer', status: 'Suspended', joined: '2026-05-20' },
    { id: 6, name: 'Neha Gupta', email: 'neha.g@example.com', role: 'Customer', status: 'Active', joined: '2026-06-02' },
    { id: 7, name: 'Siddharth Roy', email: 'sid.roy@example.com', role: 'Customer', status: 'Active', joined: '2026-06-15' },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
          Platform Users
        </h1>
        <p className="text-slate-500 dark:text-purple-300/60 text-sm mt-1">
          Manage and view registered accounts and access permissions on Paper Plane.
        </p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 dark:border-purple-800/20 p-5 rounded-3xl flex items-center justify-between shadow-sm transition-colors duration-300">
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-4 top-3 text-slate-450 dark:text-purple-300/40" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-white dark:bg-[#1A1145]/40 border border-purple-500/15 dark:border-purple-800/25 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-[#7C3AED] text-xs shadow-inner"
          />
        </div>
        <div className="text-[10px] font-bold text-slate-400 dark:text-purple-300/40 uppercase tracking-widest hidden sm:block">
          Total: {filteredUsers.length} accounts
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white/70 dark:bg-[#120B2E]/70 backdrop-blur-xl border border-purple-500/15 dark:border-purple-800/20 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700 dark:text-purple-200">
            <thead className="text-xs uppercase bg-[#F8F4FF] dark:bg-[#1A1145] text-slate-500 dark:text-purple-350 tracking-wider border-b border-purple-500/10 dark:border-purple-800/15">
              <tr>
                <th scope="col" className="px-6 py-4">Account Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Permission Role</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10 dark:divide-purple-800/20 bg-transparent">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F3EBFF]/20 dark:hover:bg-purple-950/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F3EBFF] dark:bg-purple-950/50 flex items-center justify-center text-xs font-bold text-[#7C3AED] dark:text-purple-300 border border-purple-500/10 dark:border-purple-800/20 shadow-sm">
                        {user.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-purple-300/60">
                      <span className="flex items-center gap-1.5">
                        <FiMail size={12} className="text-purple-400" />
                        <span>{user.email}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'Admin' ? (
                        <span className="flex items-center gap-1.5 text-xs text-[#7C3AED] dark:text-purple-400 font-extrabold">
                          <FiShield size={12} />
                          <span>{user.role}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-purple-300/40 font-semibold">
                          <FiUserCheck size={12} />
                          <span>{user.role}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        user.status === 'Active' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/20' 
                          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/20'
                      } tracking-wider`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-purple-300/40 font-mono">
                      {user.joined}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-xs text-slate-400 dark:text-purple-300/40">
                    No accounts match the search query.
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

export default AdminUsers;
