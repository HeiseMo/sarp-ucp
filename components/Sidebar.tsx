import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Trophy, LogOut, Settings, CreditCard, Gamepad2, Users, FileText, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, isOpen, toggleSidebar }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.AFFILIATIONS, label: 'Affiliations', icon: Users },
    { view: ViewState.COMMUNITY, label: 'Community', icon: FileText },
    { view: ViewState.LEADERBOARD, label: 'Leaderboard', icon: Trophy },
    { view: ViewState.PROPERTIES, label: 'Properties', icon: CreditCard },
    { view: ViewState.ADMIN, label: 'Admin Panel', icon: ShieldAlert },
    { view: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 
        bg-[#0f0f13]/80 backdrop-blur-2xl border-r border-white/5
        transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Gamepad2 size={24} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-wide">SARP UCP</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            const isAdmin = item.view === ViewState.ADMIN;
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  setView(item.view);
                  if(window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] border border-white/5' 
                    : 'text-glass-muted hover:bg-white/5 hover:text-white'
                  }
                  ${isAdmin && !isActive ? 'text-red-400/80 hover:text-red-400 hover:bg-red-500/10' : ''}
                  ${isAdmin && isActive ? '!bg-red-500/20 !text-red-400 !border-red-500/30' : ''}
                `}
              >
                <Icon size={20} className={
                  isActive 
                    ? (isAdmin ? 'text-red-400' : 'text-blue-400') 
                    : (isAdmin ? 'group-hover:text-red-400' : 'group-hover:text-white') + ' transition-colors'
                } />
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] ${isAdmin ? 'bg-red-400 shadow-red-500/50' : 'bg-blue-400'}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 mt-auto">
           <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 mb-4">
             <h4 className="text-xs font-bold text-glass-muted uppercase mb-1">Server Status</h4>
             <div className="flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-mono text-green-400">Online: 420/500</span>
             </div>
           </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};