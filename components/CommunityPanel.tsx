import React from 'react';
import { Ticket } from '../types';
import { GlassCard } from './GlassCard';
import { FileText, AlertTriangle, Gavel, UserPlus, Clock, CheckCircle2, XCircle, Search } from 'lucide-react';

interface CommunityPanelProps {
  tickets: Ticket[];
}

export const CommunityPanel: React.FC<CommunityPanelProps> = ({ tickets }) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Denied': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Under Review': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={14} />;
      case 'Denied': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Community Hub</h1>
        <p className="text-glass-muted">Submit complaints, appeal bans, or apply for official factions.</p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 group relative overflow-hidden" interactive>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={80} />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 mb-4 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">File Complaint</h3>
              <p className="text-sm text-glass-muted mb-4">Report a player for rule violations.</p>
              <button className="text-sm font-medium text-red-400 group-hover:text-red-300 flex items-center gap-1 transition-colors">
                Start Report &rarr;
              </button>
           </div>
        </GlassCard>

        <GlassCard className="p-6 group relative overflow-hidden" interactive>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gavel size={80} />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20">
                <Gavel size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Ban Appeal</h3>
              <p className="text-sm text-glass-muted mb-4">Appeal a server punishment.</p>
              <button className="text-sm font-medium text-amber-400 group-hover:text-amber-300 flex items-center gap-1 transition-colors">
                Submit Appeal &rarr;
              </button>
           </div>
        </GlassCard>

        <GlassCard className="p-6 group relative overflow-hidden" interactive>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserPlus size={80} />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                <UserPlus size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Faction Apps</h3>
              <p className="text-sm text-glass-muted mb-4">Apply to join an organization.</p>
              <button className="text-sm font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1 transition-colors">
                View Openings &rarr;
              </button>
           </div>
        </GlassCard>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-display font-bold flex items-center gap-2">
             <FileText size={20} className="text-white/60" /> My History
           </h3>
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" />
             <input 
               type="text" 
               placeholder="Search tickets..." 
               className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-white/20"
             />
           </div>
        </div>

        <GlassCard className="p-0 overflow-hidden">
           <table className="w-full text-left">
             <thead className="bg-white/5 border-b border-white/5">
               <tr>
                 <th className="px-6 py-4 text-xs font-bold text-glass-muted uppercase tracking-wider">ID</th>
                 <th className="px-6 py-4 text-xs font-bold text-glass-muted uppercase tracking-wider">Type</th>
                 <th className="px-6 py-4 text-xs font-bold text-glass-muted uppercase tracking-wider">Subject</th>
                 <th className="px-6 py-4 text-xs font-bold text-glass-muted uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-glass-muted uppercase tracking-wider text-right">Last Update</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {tickets.map(ticket => (
                 <tr key={ticket.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                   <td className="px-6 py-4 text-sm font-mono text-glass-muted group-hover:text-white">#{ticket.id}</td>
                   <td className="px-6 py-4 text-sm font-medium">{ticket.type}</td>
                   <td className="px-6 py-4">
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-white">{ticket.title}</span>
                       {ticket.target && <span className="text-xs text-glass-muted">Target: {ticket.target}</span>}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-sm text-glass-muted text-right">{ticket.lastUpdate}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </GlassCard>
      </div>
    </div>
  );
};