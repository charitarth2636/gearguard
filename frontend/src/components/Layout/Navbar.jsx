import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Toolbox, 
  Users, 
  ClipboardList, 
  Calendar as CalendarIcon, 
  LogOut,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/equipment', label: 'Equipment', icon: <Toolbox size={18} /> },
    { path: '/kanban', label: 'Requests', icon: <ClipboardList size={18} /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon size={18} /> },
    { path: '/teams', label: 'Teams', icon: <Users size={18} /> },
    { path: '/analysis', label: 'Analysis', icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
             <Logo className="w-8 h-8 md:w-9 md:h-9" />
            <span className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              GearGuard
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${isActive 
                    ? 'text-blue-500 bg-blue-500/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Profile & Logout (Desktop) */}
          {user && (
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-gray-800">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role}</p>
                  </div>
               </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold tracking-wide"
              >
                <LogOut size={16} />
                <span>LOGOUT</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-gray-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `
                  px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center gap-4
                  ${isActive 
                    ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            {user && (
              <div className="pt-4 border-t border-gray-800 space-y-4">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-base font-bold"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
