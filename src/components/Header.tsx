import React from 'react';
import { Sparkles, Flame, HelpCircle, LayoutGrid, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenExamples: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenExamples,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#09090B]/85 border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={onReset}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 p-[2px] shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#141419] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-syne font-black text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                MemeForge<span className="text-pink-500">.ai</span>
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 -mt-1 hidden sm:block">
              Intelligent Meme Foundry
            </p>
          </div>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
          <button
            onClick={onReset}
            className="text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
          >
            Home
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>How it works</span>
          </button>
          <button
            onClick={onOpenExamples}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-pink-400" />
            <span>Examples</span>
          </button>
        </nav>

        {/* Right Playful Badge */}
        <div className="hidden md:flex items-center">
          <div className="relative group cursor-pointer" onClick={onReset}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative px-3.5 py-1.5 bg-[#141419] border border-purple-500/40 rounded-full flex items-center gap-2 text-xs font-semibold text-purple-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Just upload, we'll handle the chaos ✨</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
