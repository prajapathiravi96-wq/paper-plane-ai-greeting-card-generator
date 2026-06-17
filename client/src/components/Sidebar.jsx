import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings, 
  FiArrowLeft 
} from 'react-icons/fi';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiGrid size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white/75 backdrop-blur-xl text-slate-600 min-h-[calc(100vh-73px)] border-r border-purple-500/15 flex flex-col justify-between py-6 relative z-20">
      <div className="flex flex-col gap-6">
        <div className="px-6">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Admin Workspace
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 px-3">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-600/15'
                    : 'hover:bg-[#F3EBFF]/60 hover:text-[#7C3AED] text-slate-600'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-6 flex flex-col gap-4 border-t border-purple-500/10 pt-6">
        <NavLink
          to="/generator"
          className="flex items-center gap-2 text-xs font-bold text-[#7C3AED] hover:text-[#8B5CF6] transition-colors"
        >
          <FiArrowLeft size={14} />
          <span>Exit Admin Mode</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
