import React from 'react';
import { MemeVibe } from '../types';

interface VibeSelectorProps {
  selectedVibe: MemeVibe;
  onChangeVibe: (vibe: MemeVibe) => void;
}

const VIBES: { label: MemeVibe; description: string }[] = [
  { label: '😂 Funny', description: 'Classic clever comedic timing' },
  { label: '💀 Gen-Z', description: 'Brainrot-free, internet-native wit' },
  { label: '😭 Relatable', description: 'Painfully accurate life moments' },
  { label: '🔥 Savage', description: 'No filter, zero mercy' },
  { label: '🤯 Absurd', description: 'Surreal and unhinged' },
  { label: '❤️ Wholesome', description: 'Warm-hearted and uplifting' },
  { label: '🌑 Dark Humor', description: 'Existential and mildly cynical' },
  { label: '🎲 Surprise Me', description: 'Let AI choose the chaos angle' },
];

export const VibeSelector: React.FC<VibeSelectorProps> = ({
  selectedVibe,
  onChangeVibe,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-syne font-bold text-lg text-white">
          Choose your vibe
        </h3>
        <span className="text-xs text-zinc-400">
          Tone of the roast / caption
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {VIBES.map((item) => {
          const isSelected = selectedVibe === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onChangeVibe(item.label)}
              title={item.description}
              className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border focus:outline-none ${
                isSelected
                  ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/50'
                  : 'bg-[#141419] border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="font-bold text-sm tracking-tight truncate">
                {item.label}
              </div>
              <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                {item.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
