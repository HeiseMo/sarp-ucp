import React from 'react';
import { User, Property } from '../types';
import { GlassCard } from './GlassCard';
import { Wallet, Clock, Trophy, Shield, Home, Building2, Lock, Unlock, AlertCircle, Calendar, User as UserIcon, Activity, AlertTriangle, Key } from 'lucide-react';

interface DashboardProps {
  user: User;
  properties: Property[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, properties }) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Locked': return <Lock size={14} className="text-red-400" />;
      case 'Active': return <Unlock size={14} className="text-emerald-400" />;
      case 'Impounded': return <AlertCircle size={14} className="text-amber-400" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6 group">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-glass-muted text-xs font-bold uppercase tracking-wider mb-1">Cash</p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">{formatMoney(user.cash)}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Wallet size={32} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 group">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-glass-muted text-xs font-bold uppercase tracking-wider mb-1">Bank</p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">{formatMoney(user.bank)}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Building2 size={32} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 group">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-glass-muted text-xs font-bold uppercase tracking-wider mb-1">Playtime</p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">{user.hoursPlayed}h</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Clock size={32} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 group">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-glass-muted text-xs font-bold uppercase tracking-wider mb-1">VIP Rank</p>
              <div className="flex flex-col">
                <p className="text-3xl font-display font-bold text-white tracking-tight">
                    {user.vipLevel > 0 ? `Tier ${user.vipLevel}` : 'Free'}
                </p>
                {user.vipExpiration && (
                    <span className="text-[10px] text-glass-muted">Expires: {user.vipExpiration}</span>
                )}
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy size={32} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character Profile & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
             {/* Decorative Header */}
             <div className="h-28 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-[#0f0f13] relative">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
               <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
             </div>
             
             <div className="px-6 pb-6 relative flex-1">
                {/* Avatar */}
                <div className="relative -mt-14 mb-4 inline-block">
                  <div className="p-1.5 rounded-full bg-[#0f0f13] ring-1 ring-white/10">
                    <img 
                      src={user.avatarUrl} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#0f0f13] shadow-sm ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} title={user.status}></div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">{user.username}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-glass-muted">
                      Organization
                    </span>
                    <span className="text-sm font-medium text-white">{user.organization}</span>
                    
                    {user.adminLevel > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 border border-red-500/20 text-red-400">
                          Admin Lvl {user.adminLevel}
                        </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                         <Activity size={16} />
                       </div>
                       <span className="text-sm font-medium text-glass-muted">Current Level</span>
                    </div>
                    <span className="font-display font-bold text-lg">{user.level}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                         <Calendar size={16} />
                       </div>
                       <span className="text-sm font-medium text-glass-muted">Registered</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-white/80">{user.joinedDate}</span>
                  </div>

                   <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                         <AlertTriangle size={16} />
                       </div>
                       <span className="text-sm font-medium text-glass-muted">Warnings</span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${user.warnings > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {user.warnings}/3
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                         <UserIcon size={16} />
                       </div>
                       <span className="text-sm font-medium text-glass-muted">Account ID</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-white/80">#{user.id}</span>
                  </div>
                </div>

                <button className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 transition-all font-medium border border-white/10 text-sm flex items-center justify-center gap-2 text-white shadow-lg shadow-black/20 group">
                  <Shield size={16} className="text-glass-muted group-hover:text-white transition-colors" />
                  Account Settings
                </button>
             </div>
          </GlassCard>
        </div>

        {/* Right Column: Assets List */}
        <div className="lg:col-span-8">
           <div className="flex items-center justify-between mb-6 px-1">
              <div>
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Home size={20} className="text-blue-400" />
                  My Assets
                </h3>
              </div>
              <button className="text-xs font-medium text-glass-muted hover:text-white transition-colors">
                View History &rarr;
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {properties.map(prop => (
                <GlassCard key={prop.id} className="group p-0 overflow-hidden border-white/5 hover:border-white/20" interactive>
                  <div className="flex min-h-[9rem]">
                     <div className="w-[140px] relative shrink-0">
                        <img 
                          src={prop.imageUrl} 
                          alt={prop.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                     </div>
                     <div className="flex-1 p-4 flex flex-col justify-between relative bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                             <div className={`
                               text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider
                               ${prop.type === 'House' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                               ${prop.type === 'Business' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                               ${prop.type === 'Vehicle' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                             `}>
                               {prop.type}
                             </div>
                             <div className="p-1.5 rounded-full bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                                {getStatusIcon(prop.status)}
                             </div>
                          </div>
                          <h4 className="font-bold text-white text-lg truncate pr-2 group-hover:text-blue-400 transition-colors">{prop.name}</h4>
                          <p className="text-xs text-glass-muted flex items-center gap-1.5 mt-0.5 truncate">
                             {prop.type === 'Vehicle' ? <Key size={12}/> : <Home size={12} />} 
                             {prop.type === 'Vehicle' ? prop.details : prop.location}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                           <div>
                             <p className="text-[10px] text-glass-muted uppercase tracking-wider font-bold">Value</p>
                             <p className="text-sm font-mono font-bold text-emerald-400">${prop.value.toLocaleString()}</p>
                           </div>
                           <button className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-3 py-1.5 rounded-lg transition-all">
                             Manage
                           </button>
                        </div>
                     </div>
                  </div>
                </GlassCard>
             ))}
             
             {/* Add New Slot Placeholder */}
             <button className="min-h-[9rem] rounded-2xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 group text-glass-muted hover:text-white">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-light">+</span>
                </div>
                <span className="text-sm font-medium">Purchase Asset</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};