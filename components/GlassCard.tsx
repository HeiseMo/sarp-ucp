import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', interactive = false }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        rounded-2xl
        transition-all duration-300
        ${interactive ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};