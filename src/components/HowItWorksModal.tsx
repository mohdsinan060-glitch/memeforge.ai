import React from 'react';
import { X, Sparkles, Brain, Wand2, MessageSquare, Download, CheckCircle2 } from 'lucide-react';
import { ChaosStamp } from './Doodles';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Upload Photo',
    desc: 'Feed in any photo — an awkward glance, an everyday fail, a pet with serious judgment, or a group shot.',
    icon: '📸',
  },
  {
    step: '02',
    title: 'Multimodal Reading',
    desc: 'Gemini visual intelligence reads the room: micro-expressions, posture, props, and quiet situational despair.',
    icon: '🧠',
  },
  {
    step: '03',
    title: 'Find The Joke',
    desc: 'Pinpoints the exact comedic premise. No generic "Bro is cooked" tropes — only genuine observational irony.',
    icon: '🎯',
  },
  {
    step: '04',
    title: 'Make It Funnier ✨',
    desc: 'Exaggerates surrounding details, props, and drama while strictly preserving your facial identity.',
    icon: '🎭',
  },
  {
    step: '05',
    title: '5 Witty Captions',
    desc: 'Generates 5 distinct comedy mechanisms: Deadpan, Observational, Cynical, Unexpected, and Absurd.',
    icon: '✍️',
  },
  {
    step: '06',
    title: 'Render & Release',
    desc: 'High-res HTML5 Canvas renders crisp text with customizable styles, outlines, and instant PNG download.',
    icon: '🚀',
  },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#141419] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ChaosStamp />
            <h3 className="font-syne font-black text-2xl text-white">
              How MemeForge AI Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-zinc-300 text-sm mt-4 mb-6 leading-relaxed">
          Most meme generators merely slap generic text on pictures. MemeForge AI treats your photo as the punchline source, understands what's genuinely awkward about it, and heightens the comedic timing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3"
            >
              <div className="text-2xl p-2 bg-zinc-800/80 rounded-xl">
                {s.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-xs font-bold text-pink-400">
                    {s.step}
                  </span>
                  <h4 className="font-syne font-bold text-sm text-white">
                    {s.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-center">
          <p className="text-xs text-purple-200 font-medium">
            🔒 Privacy First: Your photos are processed temporarily in memory only. No accounts, no public feeds.
          </p>
        </div>
      </div>
    </div>
  );
};
