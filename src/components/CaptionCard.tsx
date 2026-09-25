import React from 'react';
import { Check, Quote, Copy } from 'lucide-react';

interface CaptionCardProps {
  caption: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const COMEDIC_MECHANISMS = [
  { name: 'Observational', color: 'text-purple-400 border-purple-500/30 bg-purple-950/40' },
  { name: 'Deadpan', color: 'text-pink-400 border-pink-500/30 bg-pink-950/40' },
  { name: 'Mildly Dark', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40' },
  { name: 'Unexpected', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40' },
  { name: 'Absurd Exaggeration', color: 'text-orange-400 border-orange-500/30 bg-orange-950/40' },
];

export const CaptionCard: React.FC<CaptionCardProps> = ({
  caption,
  index,
  isSelected,
  onSelect,
}) => {
  const mechanism = COMEDIC_MECHANISMS[index % COMEDIC_MECHANISMS.length];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(caption);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 select-none ${
        isSelected
          ? 'bg-[#181826] border-purple-500 shadow-xl shadow-purple-500/25 ring-2 ring-purple-500/50 scale-[1.01]'
          : 'bg-[#141419] border-zinc-800/90 hover:border-zinc-700 hover:bg-[#181820]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Angle indicator */}
        <span
          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${mechanism.color}`}
        >
          {mechanism.name}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Quick copy text */}
          <button
            onClick={handleCopy}
            title="Copy text"
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Selected check circle */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-purple-500 text-white shadow-[0_0_8px_#a855f7]'
                : 'border border-zinc-700 text-transparent group-hover:border-zinc-500'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Caption text */}
      <p className="text-zinc-100 font-sans font-semibold text-sm sm:text-base leading-snug tracking-tight">
        "{caption}"
      </p>
    </div>
  );
};
