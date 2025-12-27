import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Toolbox, 
    Users, 
    ClipboardList, 
    Calendar as CalendarIcon, 
    BarChart3,
    LogOut
} from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
    const navItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Toolbox size={18} />, label: 'Equipment', path: '/equipment' },
        { icon: <ClipboardList size={18} />, label: 'Requests', path: '/requests' },
        { icon: <CalendarIcon size={18} />, label: 'Calendar', path: '/calendar' },
        { icon: <Users size={18} />, label: 'Teams', path: '/teams' },
        { icon: <BarChart3 size={18} />, label: 'Analysis', path: '/analysis' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 h-20">
            <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0">
                        <img src={logo} alt="GearGuard Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight uppercase hidden md:block">
                        Gear<span className="text-blue-500">Guard</span>
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 md:gap-4 lg:gap-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-bold tracking-tight
                                ${isActive 
                                    ? 'text-blue-500 bg-blue-600/10' 
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                            `}
                        >
                            {item.icon}
                            <span className="hidden lg:block">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="flex items-center gap-4">
                    <NavLink
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm font-bold tracking-tight"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:block">LOGOUT</span>
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;
