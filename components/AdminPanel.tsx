import React, { useState } from 'react';
import { Ticket, User, ServerLog } from '../types';
import { GlassCard } from './GlassCard';
import { ShieldAlert, Users, FileText, Activity, Search, Ban, Eye, Check, X, AlertOctagon, Terminal } from 'lucide-react';

interface AdminPanelProps {
  tickets: Ticket[];
  logs: ServerLog[];
  players: User[];
}

type AdminTab = 'OVERVIEW' | 'TICKETS' | 'PLAYERS';

export const AdminPanel: React.FC<AdminPanelProps> = ({ tickets, logs, players }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  const getLogColor = (action: string) => {
    switch(action) {
        case 'BAN': return 'text-red-500';
        case 'KICK': return 'text-amber-500';
        case 'WARN': return 'text-yellow-400';
        case 'SYSTEM': return 'text-blue-400';
        default: return 'text-glass-muted';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
               <ShieldAlert size={24} />
             </div>
             <h1 className="text-3xl font-display font-bold text-white">Staff Control Panel</h1>
           </div>
           <p className="text-glass-muted pl-1">Restricted Access • Administrator Level 4</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
           <button 
             onClick={() => setActiveTab('OVERVIEW')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'OVERVIEW' ? 'bg-white/10 text-white shadow-sm' : 'text-glass-muted hover:text-white'}`}
           >
             Overview
           </button>
           <button 
             onClick={() => setActiveTab('TICKETS')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'TICKETS' ? 'bg-white/10 text-white shadow-sm' : 'text-glass-muted hover:text-white'}`}
           >
             Tickets <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px]">{tickets.filter(t => t.status === 'Pending').length}</span>
           </button>
           <button 
             onClick={() => setActiveTab('PLAYERS')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'PLAYERS' ? 'bg-white/10 text-white shadow-sm' : 'text-glass-muted hover:text-white'}`}
           >
             Player Mgmt
           </button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Stats Column */}
           <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <GlassCard className="p-4 border-l-4 border-red-500">
                    <p className="text-xs text-glass-muted uppercase font-bold tracking-wider mb-1">Open Reports</p>
                    <p className="text-2xl font-mono font-bold text-white">12</p>
                 </GlassCard>
                 <GlassCard className="p-4 border-l-4 border-amber-500">
                    <p className="text-xs text-glass-muted uppercase font-bold tracking-wider mb-1">Active Bans</p>
                    <p className="text-2xl font-mono font-bold text-white">342</p>
                 </GlassCard>
                 <GlassCard className="p-4 border-l-4 border-blue-500">
                    <p className="text-xs text-glass-muted uppercase font-bold tracking-wider mb-1">Staff Online</p>
                    <p className="text-2xl font-mono font-bold text-white">8/24</p>
                 </GlassCard>
              </div>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                   <Activity size={18} className="text-blue-400" /> Pending Actions
                </h3>
                <div className="space-y-3">
                   {tickets.slice(0, 3).map(ticket => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${ticket.type === 'Complaint' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <div>
                               <p className="text-sm font-bold text-white">{ticket.title}</p>
                               <p className="text-xs text-glass-muted">{ticket.type} • {ticket.createdAt}</p>
                            </div>
                         </div>
                         <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">Review</button>
                      </div>
                   ))}
                </div>
              </GlassCard>
           </div>

           {/* Server Logs */}
           <GlassCard className="p-0 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                 <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-glass-muted">
                   <Terminal size={14} /> SERVER_LOGS.log
                 </h3>
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-black/40">
                 {logs.map(log => (
                    <div key={log.id} className="flex gap-2">
                       <span className="text-glass-muted shrink-0">[{log.timestamp}]</span>
                       <div>
                          <span className={`font-bold ${getLogColor(log.action)}`}>{log.action}</span>
                          <span className="text-glass-muted mx-1">|</span>
                          <span className="text-blue-300">{log.admin}</span>
                          <span className="text-glass-muted"> &rarr; </span>
                          <span className="text-white">{log.target}</span>: 
                          <span className="text-glass-muted ml-1">{log.details}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      )}

      {activeTab === 'TICKETS' && (
         <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-bold text-lg">Support Tickets</h3>
               <div className="flex gap-2">
                  <button className="text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10">Filter: All</button>
               </div>
            </div>
            <table className="w-full text-left">
               <thead className="bg-white/5 text-xs text-glass-muted uppercase font-bold tracking-wider">
                  <tr>
                     <th className="px-6 py-4">ID</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Title</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {tickets.map(t => (
                     <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-glass-muted">#{t.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{t.type}</td>
                        <td className="px-6 py-4 text-sm">{t.title}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border 
                              ${t.status === 'Pending' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                              ${t.status === 'Under Review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                              ${t.status === 'Denied' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                           `}>{t.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <button className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Approve">
                                 <Check size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Deny">
                                 <X size={16} />
                              </button>
                              <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="View Details">
                                 <Eye size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </GlassCard>
      )}

      {activeTab === 'PLAYERS' && (
         <div className="space-y-4">
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" />
                  <input 
                     type="text" 
                     placeholder="Search players by name, IP, or ID..." 
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-glass-muted focus:outline-none focus:border-white/20"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-900/20">
                  Search
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {players.map(player => (
                  <GlassCard key={player.id} className="p-4 flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <img src={player.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                           <div className="absolute -bottom-1 -right-1 bg-black/50 backdrop-blur rounded px-1 text-[10px] font-mono border border-white/10">#{player.id}</div>
                        </div>
                        <div>
                           <h4 className="font-bold text-white text-lg">{player.username}</h4>
                           <div className="flex items-center gap-2 text-xs text-glass-muted">
                              <span>Lvl {player.level}</span>
                              <span>•</span>
                              <span>{player.organization}</span>
                              <span>•</span>
                              <span>{player.hoursPlayed}h Played</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors">
                           Edit Stats
                        </button>
                        <button className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 transition-colors" title="Kick">
                           <AlertOctagon size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors" title="Ban">
                           <Ban size={16} />
                        </button>
                     </div>
                  </GlassCard>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};