import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Flame, Compass, RefreshCw, Wand2 } from 'lucide-react';
import { ChaosStamp } from './Doodles';

interface LoadingStateProps {
  mode: 'caption_only' | 'make_funnier';
}

const STAGES = [
  { text: 'Looking at the photo...', icon: '👀', desc: 'Examining subtle facial tensions and background chaos' },
  { text: 'Finding the funny angle...', icon: '🧠', desc: 'Calculating the gap between expectation and reality' },
  { text: 'Questioning your life choices...', icon: '🤔', desc: 'Observing the quiet despair or unearned confidence' },
  { text: 'Making reality slightly worse...', icon: '🎭', desc: 'Exaggerating the narrative stakes for comedic effect' },
  { text: 'Writing the caption...', icon: '✍️', desc: 'Filtering out tired clichés and formulating deadpan truth' },
  { text: "Unfortunately, it's ready.", icon: '💥', desc: 'Preparing final meme for internet release' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ mode }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    // Cycle through stages progressively
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const stage = STAGES[currentStageIndex];
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-[#141419] border border-purple-500/50 shadow-2xl shadow-purple-500/20 text-center relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Funny stamp */}
      <div className="flex justify-center mb-6">
        <ChaosStamp />
      </div>

      {/* Stage Icon */}
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 animate-spin opacity-70 blur-md" />
        <div className="relative w-20 h-20 rounded-full bg-[#181822] border-2 border-purple-400 flex items-center justify-center text-4xl shadow-inner">
          <span className="animate-bounce">{stage.icon}</span>
        </div>
      </div>

      {/* Stage Title */}
      <h3 className="font-syne font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
        {stage.text}
      </h3>

      {/* Stage Subtitle */}
      <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8 font-medium">
        {stage.desc}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800/80 rounded-full h-3 p-0.5 border border-zinc-700/60 overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_#ec4899]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-1">
        <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
        <span className="text-purple-300 font-bold">{progressPercent}%</span>
      </div>
    </div>
  );
};
