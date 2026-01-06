import React, { useState } from 'react';
import { Affiliation } from '../types';
import { GlassCard } from './GlassCard';
import { Shield, Users, Briefcase, Star, Crown, Hash, X, User as UserIcon, Clock, Settings, UserPlus, ArrowLeft, MoreHorizontal, LogOut, ChevronRight } from 'lucide-react';
import { affiliations as api } from '../services/api';

interface AffiliationsPanelProps {
  affiliations: Affiliation[];
}

export const AffiliationsPanel: React.FC<AffiliationsPanelProps> = ({ affiliations }) => {
  const [selectedAffiliation, setSelectedAffiliation] = useState<Affiliation | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'manage'>('roster');

  // Group by type
  const factions = affiliations.filter(a => a.type === 'Faction');
  const families = affiliations.filter(a => a.type === 'Family');
  const groups = affiliations.filter(a => a.type === 'Group'); 
  const agencies = affiliations.filter(a => a.type === 'Agency'); 

  const handleCardClick = async (aff: Affiliation) => {
      setSelectedAffiliation(aff);
      setLoading(true);
      setMembers([]);
      setActiveTab('roster');
      try {
          const data = await api.getDetails(aff.type, aff.id);
          if (data && data.members) {
              setMembers(data.members);
          }
      } catch (e) {
          console.error("Failed to load members", e);
      } finally {
          setLoading(false);
      }
  };
  
  const handleBack = () => setSelectedAffiliation(null);

  if (affiliations.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-20 opacity-50">
              <Users size={64} className="mb-4 text-glass-muted"/>
              <h2 className="text-xl font-bold">No Affiliations</h2>
              <p className="text-sm text-glass-muted">This civilian is not part of any organization.</p>
          </div>
      );
  }

  // --- DETAIL VIEW (DASHBOARD STYLE) ---
  if (selectedAffiliation) {
      const isLeader = selectedAffiliation.isLeader;
      
      return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header / Nav */}
            <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-glass-muted hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-4 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Overview
            </button>

            {/* Hero Section */}
            <GlassCard className="p-8 relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-10 -translate-y-10
                    ${selectedAffiliation.type === 'Faction' ? 'text-blue-400' : ''}
                    ${selectedAffiliation.type === 'Family' ? 'text-red-400' : ''}
                    ${selectedAffiliation.type === 'Group' ? 'text-emerald-400' : ''}
                    ${selectedAffiliation.type === 'Agency' ? 'text-purple-400' : ''}
                `}>
                    {selectedAffiliation.type === 'Faction' && <Shield size={300} />}
                    {selectedAffiliation.type === 'Family' && <Users size={300} />}
                    {selectedAffiliation.type === 'Group' && <Hash size={300} />}
                    {selectedAffiliation.type === 'Agency' && <Briefcase size={300} />}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                ${selectedAffiliation.type === 'Faction' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : ''}
                                ${selectedAffiliation.type === 'Family' ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''}
                                ${selectedAffiliation.type === 'Group' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : ''}
                                ${selectedAffiliation.type === 'Agency' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}
                            `}>
                                {selectedAffiliation.type}
                            </span>
                            {selectedAffiliation.isLeader && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                                    <Crown size={12} /> Leader Access
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 shadow-black drop-shadow-lg">
                            {selectedAffiliation.name}
                        </h1>
                        <div className="space-y-1">
                            <p className="text-xl text-glass-muted flex items-center gap-2">
                                Your Rank: <span className="text-white font-mono">{selectedAffiliation.rank}</span>
                            </p>
                            {selectedAffiliation.division && (
                                <p className="text-base text-glass-muted flex items-center gap-2">
                                    Division: <span className="text-emerald-300 font-mono">{selectedAffiliation.division}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                         {isLeader && (
                             <>
                                <button 
                                    onClick={() => setActiveTab('manage')}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg
                                        ${activeTab === 'manage' 
                                            ? 'bg-white text-black scale-[1.02]' 
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                                    `}
                                >
                                    <Settings size={18} /> Manage
                                </button>
                             </>
                         )}
                         <button 
                            onClick={() => setActiveTab('roster')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg
                                ${activeTab === 'roster' 
                                    ? 'bg-white text-black scale-[1.02]' 
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}
                            `}
                         >
                             <Users size={18} /> Roster
                         </button>
                    </div>
                </div>
            </GlassCard>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'roster' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-xl font-bold text-white">Member Roster ({members.length})</h3>
                            <button className="text-sm text-glass-muted hover:text-white flex items-center gap-1">
                                 <Clock size={14} /> Last Updated: Now
                            </button>
                        </div>
                        
                        <GlassCard className="overflow-hidden">
                             {loading ? (
                                <div className="flex flex-col items-center justify-center p-20 gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/20"></div>
                                    <p className="text-glass-muted animate-pulse">Fetching personnel records...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-glass-muted uppercase tracking-wider">Member Name</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-glass-muted uppercase tracking-wider">Rank ID</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-glass-muted uppercase tracking-wider">Last Active</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-glass-muted uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {members.length > 0 ? members.map(m => (
                                            <tr key={m.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 p-0.5 border border-white/10 overflow-hidden">
                                                        <img src={m.avatarUrl} alt="" className="w-full h-full object-cover rounded-full"/>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-white block">{m.name}</span>
                                                        <span className="text-xs text-glass-muted">ID: {m.id}</span>
                                                    </div>
                                                </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 font-mono font-bold text-white/80">
                                                        {m.rank}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-glass-muted font-mono">{new Date(m.lastActive).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 rounded-lg hover:bg-white/10 text-glass-muted hover:text-white transition-colors">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-12 text-glass-muted flex flex-col items-center gap-2">
                                                    <Users size={32} className="opacity-20" />
                                                    No members found in this list.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                        <GlassCard className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Invite Member</h3>
                                    <p className="text-sm text-glass-muted">Add a new player to this organization.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Player Name or ID" className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
                                <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20 rounded-lg font-bold transition-colors">
                                    Verify
                                </button>
                            </div>
                            <button disabled className="w-full py-3 bg-white/5 text-glass-muted rounded-lg font-bold text-sm uppercase tracking-wider border border-white/5 cursor-not-allowed">
                                Send Contract (Disabled)
                            </button>
                        </GlassCard>

                        <GlassCard className="p-6 space-y-4 border-red-500/10 hover:border-red-500/20 transition-colors">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                                    <LogOut size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Resignation</h3>
                                    <p className="text-sm text-glass-muted">Leave this organization gracefully.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                                <p className="text-sm text-red-200/70 mb-4">
                                    You will lose your rank ({selectedAffiliation.rank}) and all associated privileges immediately.
                                </p>
                                <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold transition-colors">
                                    Confirm Resignation
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- OVERVIEW LIST VIEW (DEFAULT) ---
  return (
    <div className="space-y-8 animate-fade-in-up relative">
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          My Affiliations
        </h2>
        <p className="text-glass-muted">Manage your standing in factions, families, and groups.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Factions Section */}
        {factions.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-glass-muted flex items-center gap-2">
                    <Shield size={16} className="text-blue-400" /> Official Factions (Jobs)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {factions.map((faction, i) => (
                        <GlassCard 
                            key={i} 
                            className="relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all active:scale-[0.98]"
                            onClick={() => handleCardClick(faction)}
                            interactive
                        >
                           <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                               <Briefcase size={80} />
                           </div>
                           <div className="relative z-10 p-2">
                               <div className="flex justify-between items-start mb-4">
                                   <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                       <Shield size={24} />
                                   </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <ChevronRight size={20} className="text-glass-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        {faction.isLeader && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                                                Leader
                                            </span>
                                        )}
                                   </div>
                               </div>
                               <h3 className="text-xl font-bold text-white mb-1 leading-tight">{faction.name}</h3>
                               <p className="text-sm text-glass-muted mb-4 font-mono">ID: {faction.id}</p>
                               <div className="pt-4 border-t border-white/5 space-y-2 group-hover:border-blue-500/20 transition-colors">
                                   <div className="flex justify-between items-center">
                                       <span className="text-xs uppercase font-bold text-glass-muted">Current Rank</span>
                                       <span className="font-mono font-bold text-blue-300">{faction.rank}</span>
                                   </div>
                                   {faction.division && (
                                       <div className="flex justify-between items-center text-xs">
                                           <span className="uppercase font-bold text-glass-muted/70">Division</span>
                                           <span className="font-mono font-bold text-emerald-400">{faction.division}</span>
                                       </div>
                                   )}
                               </div>
                           </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        )}

        {/* Agencies Section */}
        {agencies.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-glass-muted flex items-center gap-2">
                    <Briefcase size={16} className="text-purple-400" /> Contract Agencies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agencies.map((agency, i) => (
                        <GlassCard 
                            key={i} 
                            className="relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all active:scale-[0.98]"
                            onClick={() => handleCardClick(agency)}
                            interactive
                        >
                           <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                               <Briefcase size={80} />
                           </div>
                           <div className="relative z-10 p-2">
                               <div className="flex justify-between items-start mb-4">
                                   <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                       <Briefcase size={24} />
                                   </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <ChevronRight size={20} className="text-glass-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        {agency.isLeader && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">
                                                Leader
                                            </span>
                                        )}
                                   </div>
                               </div>
                               <h3 className="text-xl font-bold text-white mb-1 leading-tight">{agency.name}</h3>
                               <p className="text-sm text-glass-muted mb-4 font-mono">ID: {agency.id}</p>
                               <div className="pt-4 border-t border-white/5 flex justify-between items-center group-hover:border-purple-500/20 transition-colors">
                                   <span className="text-xs uppercase font-bold text-glass-muted">Status</span>
                                   <span className="font-mono font-bold text-purple-300">{agency.rank}</span>
                               </div>
                           </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        )}

        {/* Families Section */}
        {families.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-glass-muted flex items-center gap-2">
                    <Users size={16} className="text-red-400" /> Families & Gangs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {families.map((fem, i) => (
                        <GlassCard 
                            key={i} 
                            className="relative overflow-hidden group cursor-pointer hover:border-red-500/30 transition-all active:scale-[0.98]"
                            onClick={() => handleCardClick(fem)}
                            interactive
                        >
                           <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                               <Crown size={80} />
                           </div>
                           <div className="relative z-10 p-2">
                               <div className="flex justify-between items-start mb-4">
                                   <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                       <Users size={24} />
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                        <ChevronRight size={20} className="text-glass-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        {fem.isLeader && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">
                                                Leader
                                            </span>
                                        )}
                                   </div>
                               </div>
                               <h3 className="text-xl font-bold text-white mb-1 leading-tight">{fem.name}</h3>
                               <p className="text-sm text-glass-muted mb-4 font-mono">ID: {fem.id}</p>
                               <div className="pt-4 border-t border-white/5 flex justify-between items-center group-hover:border-red-500/20 transition-colors">
                                   <span className="text-xs uppercase font-bold text-glass-muted">Status</span>
                                   <span className="font-mono font-bold text-red-300">{fem.rank}</span>
                               </div>
                           </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        )}

        {/* Groups Section */}
        {groups.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-glass-muted flex items-center gap-2">
                    <Hash size={16} className="text-emerald-400" /> Community Groups
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group, i) => (
                        <GlassCard 
                            key={i} 
                            className="relative overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all active:scale-[0.98]"
                            onClick={() => handleCardClick(group)}
                            interactive
                        >
                           <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                               <Star size={80} />
                           </div>
                           <div className="relative z-10 p-2">
                               <div className="flex justify-between items-start mb-4">
                                   <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                       <Hash size={24} />
                                   </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <ChevronRight size={20} className="text-glass-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        {group.isLeader && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">
                                                Leader
                                            </span>
                                        )}
                                   </div>
                               </div>
                               <h3 className="text-xl font-bold text-white mb-1 leading-tight">{group.name}</h3>
                               <p className="text-sm text-glass-muted mb-4 font-mono">ID: {group.id}</p>
                               <div className="pt-4 border-t border-white/5 flex justify-between items-center group-hover:border-emerald-500/20 transition-colors">
                                   <span className="text-xs uppercase font-bold text-glass-muted">Rank</span>
                                   <span className="font-mono font-bold text-emerald-300">{group.rank}</span>
                               </div>
                           </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
