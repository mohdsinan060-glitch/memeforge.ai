import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Eye, Sliders, Layers, Check, Download } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { MemeConfig, MemeAnalysis } from '../types';
import { renderMemeToCanvas } from '../utils/memeRenderer';
import { ChefKissSticker, LaughingSticker } from './Doodles';

interface MemeResultProps {
  originalImage: string;
  activeImage: string;
  hasEditedImage: boolean;
  config: MemeConfig;
  analysis: MemeAnalysis | null;
  onDownload: () => void;
}

export const MemeResult: React.FC<MemeResultProps> = ({
  originalImage,
  activeImage,
  hasEditedImage,
  config,
  analysis,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'meme' | 'comparison'>(
    hasEditedImage ? 'comparison' : 'meme'
  );

  // Redraw canvas whenever activeImage or config changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeImage;

    img.onload = () => {
      if (canvasRef.current) {
        renderMemeToCanvas(canvasRef.current, img, config);
      }
    };
  }, [activeImage, config]);

  return (
    <div className="w-full bg-[#141419] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
      {/* Playful top sticker */}
      <div className="absolute -top-3.5 right-6 hidden sm:block">
        <ChefKissSticker />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <h2 className="font-syne font-black text-2xl text-white tracking-tight">
              RESULT
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            "Unfortunately, this is now funnier."
          </p>
        </div>

        {/* View Switcher if AI edit is available */}
        {hasEditedImage && (
          <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('meme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'meme'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Final Meme
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'comparison'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              Before / After
            </button>
          </div>
        )}
      </div>

      {/* Main Visual Display */}
      <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-zinc-800/80 flex items-center justify-center min-h-[350px]">
        {hasEditedImage && activeTab === 'comparison' ? (
          <BeforeAfterSlider
            originalImage={originalImage}
            editedImage={activeImage}
          />
        ) : (
          <div className="w-full flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] w-auto max-w-full rounded-xl shadow-2xl object-contain"
            />
          </div>
        )}
      </div>

      {/* Comedic Breakdown Card */}
      {analysis && (
        <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-left">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Comedic Read:</span>
            </div>
            {analysis.isDemoMode ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950/60 border border-yellow-500/40 text-yellow-300">
                Studio Fallback Active
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                ⚡ Live Gemini Vision
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            <span className="text-zinc-400 font-semibold">Funny premise:</span> "{analysis.funny_angle}"
          </p>
          {analysis.visual_edit_concept && (
            <p className="text-[11px] text-zinc-400 mt-1 italic">
              <span className="text-pink-400 font-medium">Visual direction:</span> {analysis.visual_edit_concept}
            </p>
          )}
          {analysis.notice && (
            <p className="text-[10px] text-zinc-500 mt-2 font-mono border-t border-zinc-800 pt-1.5">
              ℹ️ {analysis.notice}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
