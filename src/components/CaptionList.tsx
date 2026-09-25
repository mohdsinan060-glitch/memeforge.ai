import React from 'react';
import { RefreshCw, Sparkles, MessageSquareQuote } from 'lucide-react';
import { CaptionCard } from './CaptionCard';

interface CaptionListProps {
  captions: string[];
  selectedCaption: string;
  onSelectCaption: (caption: string) => void;
  onRegenerateCaptions: () => void;
  isRegenerating: boolean;
}

export const CaptionList: React.FC<CaptionListProps> = ({
  captions,
  selectedCaption,
  onSelectCaption,
  onRegenerateCaptions,
  isRegenerating,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-purple-400" />
          <h3 className="font-syne font-bold text-xl text-white">
            AI CAPTIONS
          </h3>
        </div>

        <button
          type="button"
          onClick={onRegenerateCaptions}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-purple-900/40 text-purple-300 hover:text-white border border-zinc-700/60 hover:border-purple-500/50 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Crafting fresh wit...' : 'Regenerate Captions'}</span>
        </button>
      </div>

      <p className="text-xs text-zinc-400 mb-3 px-1">
        Select a caption to apply it to your meme, or customize it below.
      </p>

      <div className="space-y-2.5">
        {captions.map((caption, index) => (
          <CaptionCard
            key={`${index}-${caption.slice(0, 15)}`}
            caption={caption}
            index={index}
            isSelected={selectedCaption === caption}
            onSelect={() => onSelectCaption(caption)}
          />
        ))}
      </div>
    </div>
  );
};
