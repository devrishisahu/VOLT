import { Link } from 'react-router-dom';
import { currentUser } from '../data/mockData';

const adminNav = [
  { path: '/admin', label: 'Dashboard', icon: '◫' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/events', label: 'Events', icon: '🎪' },
  { path: '/admin/orders', label: 'Orders', icon: '📋' },
  { path: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
  { path: '/admin/credits', label: 'Credit Requests', icon: '💰' },
];

export default function AdminLayout({ children, current }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">VOLT</Link>
            <span className="px-2 py-0.5 bg-[#f72585]/20 text-[#f72585] text-[10px] font-bold uppercase rounded-full tracking-wider">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">← Back to Site</Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f72585] to-[#00f5ff] flex items-center justify-center text-white text-xs font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        {/* Admin Nav */}
        <div className="flex gap-1 px-6 md:px-10 pb-3 overflow-x-auto">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                current === item.path
                  ? 'bg-[#f72585]/10 text-[#f72585]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-6 md:px-10 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
