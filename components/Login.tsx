import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { User as UserIcon, Lock, ArrowRight, Gamepad2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-xl rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-400/30 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
            <Gamepad2 className="text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">SARP UCP</h1>
          <p className="text-glass-muted">Enter your credentials to access the mainframe.</p>
        </div>

        <GlassCard className="p-8 backdrop-blur-2xl bg-black/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-glass-muted uppercase tracking-wider">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                  placeholder="SanAndreas_Player"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-glass-muted uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-glass-muted" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-xl font-bold text-white shadow-lg 
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
                transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
                ${isLoading ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <>
                  Connect <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <div className="pt-4 border-t border-white/10 text-center">
              <button type="button" className="text-sm text-glass-muted hover:text-white transition-colors flex items-center justify-center gap-2 w-full">
                 Sign in with Discord
              </button>
            </div>
          </form>
        </GlassCard>
        
        <p className="text-center text-xs text-glass-muted mt-8">
          &copy; 2025 SARP. Secure Connection Established.
        </p>
      </div>
    </div>
  );
};