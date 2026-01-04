import React from 'react';
import { Faction } from '../types';
import { GlassCard } from './GlassCard';
import { Shield, Users, DollarSign, Bell, Circle, Activity } from 'lucide-react';

interface FactionPanelProps {
  faction: Faction;
}

export const FactionPanel: React.FC<FactionPanelProps> = ({ faction }) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Section */}
      <GlassCard className="p-0 overflow-hidden relative">
        <div className={`h-32 w-full absolute top-0 left-0 bg-gradient-to-r 
          ${faction.type === 'Law Enforcement' ? 'from-blue-900/50 to-blue-600/20' : ''}
          ${faction.type === 'Criminal' ? 'from-purple-900/50 to-purple-600/20' : ''}
          ${faction.type === 'Medical' ? 'from-red-900/50 to-red-600/20' : ''}
        `}></div>
        <div className="relative p-8 pt-16 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-[#0f0f13] border-2 border-white/10 flex items-center justify-center shadow-2xl relative z-10">
              <span className="text-3xl font-display font-bold text-white tracking-widest">{faction.tag}</span>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border
                  ${faction.type === 'Law Enforcement' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                  ${faction.type === 'Criminal' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                  ${faction.type === 'Medical' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                `}>{faction.type}</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-white">{faction.name}</h1>
              <p className="text-glass-muted flex items-center gap-2 text-sm">
                <Shield size={14} /> Led by {faction.leader}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-xs text-glass-muted uppercase tracking-wider font-bold">Faction Bank</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">{formatMoney(faction.balance)}</p>
             </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-6">
           {/* MOTD */}
           <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <h4 className="text-yellow-500 font-bold text-sm uppercase mb-1 flex items-center gap-2">
                <Bell size={14} /> Message of the Day
              </h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {faction.messageOfTheDay}
              </p>
           </div>

           {/* Members Table */}
           <GlassCard className="p-0 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <Users size={18} className="text-blue-400" /> Member Roster
                </h3>
                <span className="text-xs bg-white/5 px-2 py-1 rounded text-glass-muted">
                  {faction.members.length} Members
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-glass-muted uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-glass-muted uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-glass-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {faction.members.map((member) => (
                      <tr key={member.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full object-cover mr-3 border border-white/10" src={member.avatarUrl} alt="" />
                            <span className="font-medium text-sm">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-white border border-white/10">
                            {member.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-glass-muted">{member.isOnline ? 'Online' : member.lastActive}</span>
                            <Circle size={8} className={`${member.isOnline ? 'text-emerald-500 fill-emerald-500' : 'text-gray-600 fill-gray-600'}`} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </GlassCard>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
           {/* Announcements */}
           <GlassCard className="p-5">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Activity size={18} className="text-purple-400" /> Internal Comms
              </h3>
              <div className="space-y-4">
                {faction.announcements.map((ann) => (
                  <div key={ann.id} className="relative pl-4 border-l border-white/10 pb-4 last:pb-0 last:border-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <p className="text-xs text-glass-muted mb-1">{ann.date}</p>
                    <h5 className="font-bold text-sm text-white mb-1">{ann.title}</h5>
                    <p className="text-xs text-glass-muted leading-relaxed line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
           </GlassCard>

           {/* Quick Actions */}
           <GlassCard className="p-5">
              <h3 className="font-display font-bold text-lg mb-4">Management</h3>
              <div className="space-y-2">
                <button className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-left transition-colors flex items-center justify-between group">
                  Manage Ranks <span className="text-glass-muted group-hover:text-white">&rarr;</span>
                </button>
                <button className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-left transition-colors flex items-center justify-between group">
                  Faction Logs <span className="text-glass-muted group-hover:text-white">&rarr;</span>
                </button>
                <button className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-left transition-colors flex items-center justify-between group">
                  Applications (3) <span className="text-amber-400 font-bold text-xs">New</span>
                </button>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};