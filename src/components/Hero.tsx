import React from 'react';
import {
  SparkleDoodle,
  CrownDoodle,
  CurvedArrowUp,
  SquiggleDoodle,
  LaughingSticker,
  ChefKissSticker,
} from './Doodles';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-6 pb-4 sm:pt-10 sm:pb-6 text-center max-w-4xl mx-auto px-4 overflow-visible">
      {/* Playful Floating Doodles around Hero */}
      <div className="absolute -top-3 left-4 sm:left-12 hidden sm:block animate-float">
        <CrownDoodle className="w-10 h-10 text-yellow-400 rotate-[-12deg] drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
      </div>

      <div className="absolute top-8 right-6 sm:right-16 hidden sm:block animate-float-delayed">
        <LaughingSticker className="rotate-[8deg]" />
      </div>

      <div className="absolute bottom-2 left-6 hidden md:block">
        <ChefKissSticker />
      </div>

      <div className="absolute top-1/2 -right-8 hidden lg:block animate-pulse">
        <SparkleDoodle className="w-8 h-8 text-pink-400" />
      </div>

      {/* Main Title Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 font-mono text-xs uppercase tracking-wider mb-4 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        MEMEFORGE AI
      </div>

      {/* Hero Headline */}
      <h1 className="font-syne font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-[1.08] mb-4">
        Upload a photo.{' '}
        <span className="block mt-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
          Let AI find the joke.
        </span>
      </h1>

      {/* Hero Subtitle */}
      <p className="text-zinc-300 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
        AI understands your photo, makes it funnier, and turns it into a genuinely hilarious meme.
      </p>

      {/* Hand-drawn scribble accent */}
      <div className="flex justify-center mt-2 opacity-80">
        <SquiggleDoodle className="w-28 sm:w-36 h-6 text-pink-500" />
      </div>
    </div>
  );
};
