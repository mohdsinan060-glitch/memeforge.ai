import React from 'react';
import { Type, Wand2, Sparkles, Flame } from 'lucide-react';
import { MemeMode } from '../types';

interface MemeModeSelectorProps {
  selectedMode: MemeMode;
  onChangeMode: (mode: MemeMode) => void;
}

export const MemeModeSelector: React.FC<MemeModeSelectorProps> = ({
  selectedMode,
  onChangeMode,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-syne font-bold text-lg text-white">
          Choose Creation Mode
        </h3>
        <span className="text-xs font-mono text-zinc-400">
          How unhinged do you want it?
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option 1: Caption Only */}
        <button
          type="button"
          onClick={() => onChangeMode('caption_only')}
          className={`relative p-5 rounded-2xl text-left transition-all duration-300 border-2 cursor-pointer focus:outline-none ${
            selectedMode === 'caption_only'
              ? 'bg-[#181822] border-purple-500 shadow-xl shadow-purple-500/20 ring-1 ring-purple-500/50'
              : 'bg-[#141419] border-zinc-800 hover:border-zinc-700 hover:bg-[#181820]'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                selectedMode === 'caption_only'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Type className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-base text-white">
                  Caption Only
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Keep the photo and let AI write the perfect meme.
              </p>
            </div>
          </div>

          {selectedMode === 'caption_only' && (
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
          )}
        </button>

        {/* Option 2: Make It Funnier ✨ (Visually Emphasized!) */}
        <button
          type="button"
          onClick={() => onChangeMode('make_funnier')}
          className={`relative p-5 rounded-2xl text-left transition-all duration-300 border-2 cursor-pointer focus:outline-none overflow-hidden ${
            selectedMode === 'make_funnier'
              ? 'bg-gradient-to-br from-purple-950/40 via-[#181824] to-pink-950/40 border-pink-500 shadow-2xl shadow-pink-500/25 ring-2 ring-pink-500/60 scale-[1.02]'
              : 'bg-[#141419] border-purple-500/40 hover:border-pink-500/60 hover:bg-[#191924]'
          }`}
        >
          {/* Glowing gradient background aura */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/30 rounded-full blur-2xl pointer-events-none" />

          {/* AI Recommended Badge */}
          <div className="absolute top-2.5 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-bold text-white shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            <span>POPULAR</span>
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                selectedMode === 'make_funnier'
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30'
                  : 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              }`}
            >
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-syne font-bold text-base text-white">
                  Make It Funnier
                </span>
                <span className="text-yellow-400">✨</span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Let AI creatively edit the photo and exaggerate the joke.
              </p>
            </div>
          </div>

          {selectedMode === 'make_funnier' && (
            <div className="mt-3 pt-2 border-t border-pink-500/20 flex items-center gap-1.5 text-[11px] font-medium text-pink-300">
              <span>🎭</span> Preserves identity while heightening the comedic scene
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
