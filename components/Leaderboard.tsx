import React from 'react';
import { LeaderboardEntry } from '../types';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  title: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data, title }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-glass-muted">Top performing players in the community</p>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-left text-sm font-semibold text-glass-muted uppercase tracking-wider">Rank</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-glass-muted uppercase tracking-wider">Player</th>
                <th className="py-4 px-6 text-right text-sm font-semibold text-glass-muted uppercase tracking-wider">Wealth</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-glass-muted uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((entry) => (
                <tr key={entry.rank} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.rank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                          <Crown size={18} />
                        </div>
                      ) : (
                        <span className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono
                          ${entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' : ''}
                          ${entry.rank === 3 ? 'bg-amber-700/20 text-amber-600' : ''}
                          ${entry.rank > 3 ? 'text-glass-muted' : ''}
                        `}>
                          {entry.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full border border-white/10 object-cover" src={entry.avatarUrl} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{entry.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="text-sm font-mono text-emerald-400 font-medium">{entry.stat}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    {entry.trend === 'up' && <TrendingUp size={16} className="inline text-green-400" />}
                    {entry.trend === 'down' && <TrendingDown size={16} className="inline text-red-400" />}
                    {entry.trend === 'same' && <Minus size={16} className="inline text-gray-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};