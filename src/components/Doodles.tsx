import React from 'react';

export const SparkleDoodle = ({ className = 'w-6 h-6 text-yellow-400' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
  </svg>
);

export const CrownDoodle = ({ className = 'w-8 h-8 text-yellow-400' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 19h20M4 19l2-11 5 6 5-6 2 11" fill="currentColor" fillOpacity="0.2" />
    <circle cx="6" cy="7" r="1.5" fill="currentColor" />
    <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    <circle cx="18" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

export const HandDrawnArrow = ({ className = 'w-16 h-12 text-pink-500' }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 15 C 35 10, 65 20, 85 45" />
    <path d="M72 48 L 88 47 L 85 32" />
  </svg>
);

export const CurvedArrowUp = ({ className = 'w-12 h-16 text-purple-400' }: { className?: string }) => (
  <svg viewBox="0 0 60 90" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M45 80 C 10 70, 15 35, 30 15" />
    <path d="M18 24 L 32 14 L 38 28" />
  </svg>
);

export const SquiggleDoodle = ({ className = 'w-24 h-6 text-purple-400' }: { className?: string }) => (
  <svg viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className={className}>
    <path d="M5 12 Q 20 2, 35 12 T 65 12 T 95 12 T 115 12" />
  </svg>
);

export const LaughingSticker = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <div className={`inline-flex items-center justify-center rounded-2xl bg-yellow-400 text-black font-black text-xs px-2.5 py-1 rotate-[-6deg] shadow-lg shadow-yellow-500/20 border-2 border-black tracking-wider uppercase font-syne select-none ${className}`}>
    😂 100% UNHINGED
  </div>
);

export const ChefKissSticker = ({ className = 'w-auto' }: { className?: string }) => (
  <div className={`inline-flex items-center gap-1.5 rounded-full bg-pink-500 text-white font-extrabold text-xs px-3 py-1 rotate-[4deg] shadow-lg shadow-pink-500/20 border border-pink-400 select-none ${className}`}>
    <span>✨</span> AI COOKED
  </div>
);

export const ChaosStamp = ({ className = '' }: { className?: string }) => (
  <div className={`inline-flex items-center gap-1 rounded-md bg-purple-600/30 border border-purple-500/60 text-purple-300 font-mono text-[11px] px-2 py-0.5 tracking-tight ${className}`}>
    <span>⚡</span> MEME ENGINE ACTIVE
  </div>
);
