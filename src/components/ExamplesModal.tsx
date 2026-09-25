import React from 'react';
import { X, Sparkles, Flame, Check } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: any) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#141419] border border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h3 className="font-syne font-black text-2xl text-white">
                Meme Showcase & Samples
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Click any example to load it into MemeForge AI immediately!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          {SAMPLE_IMAGES.map((sample) => (
            <div
              key={sample.id}
              className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-purple-500 transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                <img
                  src={sample.url}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  {sample.suggestedVibe}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-syne font-bold text-base text-white">
                    {sample.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {sample.subtitle}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-zinc-800/80">
                    <p className="text-xs font-semibold text-zinc-200 italic">
                      "{sample.defaultCaptions?.[0]}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try This Example</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
