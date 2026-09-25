import React from 'react';
import { MemeStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: MemeStyle;
  onChangeStyle: (style: MemeStyle) => void;
}

const STYLES: { id: MemeStyle; name: string; preview: string; desc: string }[] = [
  { id: 'Classic', name: 'Classic', preview: 'IMPACT', desc: 'Bold uppercase with black stroke' },
  { id: 'Modern', name: 'Modern', preview: 'Clean', desc: 'Social backdrop badge with drop shadow' },
  { id: 'Chaotic', name: 'Chaotic', preview: 'UNHINGED', desc: 'Tilted energetic text with pop outline' },
  { id: 'Minimal', name: 'Minimal', preview: 'subtle', desc: 'Cinematic quiet dark shadow' },
  { id: 'Reaction', name: 'Reaction', preview: 'Header', desc: 'Top banner layout (Reddit/Twitter)' },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onChangeStyle,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-mono uppercase text-zinc-400 font-bold mb-2">
        Meme Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChangeStyle(style.id)}
              className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer focus:outline-none ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div
                className={`text-xs font-black truncate mb-0.5 ${
                  style.id === 'Classic'
                    ? 'font-anton tracking-wider uppercase'
                    : style.id === 'Chaotic'
                    ? 'font-syne rotate-[-2deg] text-yellow-300'
                    : style.id === 'Minimal'
                    ? 'font-sans font-medium lowercase'
                    : 'font-sans'
                }`}
              >
                {style.preview}
              </div>
              <div className="text-[11px] font-bold text-zinc-200">
                {style.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
