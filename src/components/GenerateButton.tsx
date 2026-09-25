import React from 'react';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { MemeMode } from '../types';

interface GenerateButtonProps {
  mode: MemeMode;
  disabled: boolean;
  onClick: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  mode,
  disabled,
  onClick,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6 text-center">
      <div className="relative inline-block w-full">
        {/* Ambient neon blur */}
        {!disabled && (
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={`relative w-full py-4 px-6 rounded-2xl font-syne font-black text-lg sm:text-xl tracking-tight flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-2xl ${
            disabled
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white hover:scale-[1.01] active:scale-[0.99] border border-white/20'
          }`}
        >
          <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          <span>
            {mode === 'make_funnier' ? 'Forge Funnier Meme ✨' : 'Generate Meme Captions ⚡'}
          </span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 font-mono mt-2.5">
        ⚡ Powered by Gemini Multimodal Intelligence · 100% Free · No cringe AI tropes
      </p>
    </div>
  );
};
