import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Calendar,
    Users,
    FileText,
    Syringe,
    Menu,
    ChevronLeft,
    LayoutDashboard,
    LogOut
} from 'lucide-react';

const StaffSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const navItems = [
        { path: '/staff/appointments', label: 'Appointments', icon: Calendar },
        { path: '/staff/clients', label: 'Clients', icon: Users },
        { path: '/staff/petRecord', label: 'Pet Records', icon: FileText },
        { path: '/staff/vaccinations', label: 'Vaccinations', icon: Syringe },
    ];

    return (
        <div
            className={`h-screen bg-[#FCF9F4] border-r border-[#A98868]/20 transition-all duration-300 ease-in-out flex flex-col relative ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 bg-[#C58D52] text-white p-1 rounded-full shadow-md hover:bg-[#b67e46] transition-colors z-10"
            >
                {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Header/Logo Area */}
            <div className="p-6 flex items-center justify-center border-b border-[#A98868]/10">
                <div className={`transition-all duration-300 ${isCollapsed ? 'scale-75' : 'scale-100'}`}>
                    <h1 className={`font-bold text-2xl text-[#86654F] ${isCollapsed ? 'hidden' : 'block'}`}>
                        Petique
                    </h1>
                    {isCollapsed && <span className="text-xl font-bold text-[#C58D52]">P</span>}
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive
                                ? 'bg-[#C58D52] text-white shadow-md shadow-[#C58D52]/20'
                                : 'text-[#86654F] hover:bg-[#f3ede6]'
                            }`
                        }
                    >
                        <item.icon
                            size={22}
                            className={`transition-colors min-w-[22px] ${isCollapsed ? 'mx-auto' : ''}`}
                        />

                        <span
                            className={`whitespace-nowrap transition-all duration-300 origin-left 
              ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}
                        >
                            {item.label}
                        </span>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-[#4f3f36] text-[#FCF9F4] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout Section */}
            <div className="p-4 border-t border-[#A98868]/10">
                <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#86654F] hover:bg-red-50 hover:text-red-500 transition-colors group ${isCollapsed ? 'justify-center' : ''}`}>
                    <LogOut size={20} />
                    <span
                        className={`whitespace-nowrap transition-all duration-300 
              ${isCollapsed ? 'hidden' : 'block'}`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default StaffSidebar;
