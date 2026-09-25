import React from 'react';
import { ArrowUp, Minus, ArrowDown, Wand2, RefreshCw, Sliders, Palette } from 'lucide-react';
import { MemeConfig, MemeStyle, TextPosition } from '../types';
import { StyleSelector } from './StyleSelector';
import { DownloadButton } from './DownloadButton';

interface MemeEditorProps {
  config: MemeConfig;
  onChangeConfig: (newConfig: MemeConfig) => void;
  onMakeFunnier: () => void;
  onRegenerateCaptions: () => void;
  onDownload: () => void;
  isMakingFunnier: boolean;
  isRegenerating: boolean;
  hasEditedImage: boolean;
}

export const MemeEditor: React.FC<MemeEditorProps> = ({
  config,
  onChangeConfig,
  onMakeFunnier,
  onRegenerateCaptions,
  onDownload,
  isMakingFunnier,
  isRegenerating,
  hasEditedImage,
}) => {
  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeConfig({ ...config, caption: e.target.value });
  };

  const handleStyleChange = (style: MemeStyle) => {
    onChangeConfig({ ...config, style });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeConfig({ ...config, fontSize: Number(e.target.value) });
  };

  const handlePositionChange = (position: TextPosition) => {
    onChangeConfig({ ...config, position });
  };

  const handleFilterChange = (filter: MemeConfig['filter']) => {
    onChangeConfig({ ...config, filter });
  };

  return (
    <div className="w-full bg-[#141419] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-pink-400" />
          <h3 className="font-syne font-bold text-xl text-white">
            Edit Your Meme
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Fine-tune the punchline
        </span>
      </div>

      {/* Editable Caption Textarea */}
      <div>
        <label className="block text-xs font-mono uppercase text-zinc-400 font-bold mb-1.5">
          Caption Text
        </label>
        <textarea
          rows={3}
          value={config.caption}
          onChange={handleCaptionChange}
          placeholder="Enter your punchline..."
          className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-purple-500 rounded-xl p-3.5 text-white font-medium text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
        />
      </div>

      {/* Style Selector */}
      <StyleSelector
        selectedStyle={config.style}
        onChangeStyle={handleStyleChange}
      />

      {/* Text Size Slider & Position controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Text Size Slider */}
        <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
              Text Size
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">
              {config.fontSize}px
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={72}
            value={config.fontSize}
            onChange={handleSizeChange}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Text Position */}
        <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
          <span className="block text-xs font-mono uppercase text-zinc-400 font-bold mb-1.5">
            Position
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handlePositionChange('top')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                config.position === 'top'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>

            <button
              type="button"
              onClick={() => handlePositionChange('center')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                config.position === 'center'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>

            <button
              type="button"
              onClick={() => handlePositionChange('bottom')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                config.position === 'bottom'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Bottom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Tone Filter */}
      <div className="pt-1">
        <label className="block text-xs font-mono uppercase text-zinc-400 font-bold mb-1.5">
          Comedic Photo Filter
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { id: 'none', label: 'Raw' },
            { id: 'dramatic', label: 'Dramatic' },
            { id: 'vintage', label: 'Vintage' },
            { id: 'deepfry', label: 'Deepfry' },
            { id: 'grayscale', label: 'Despair' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFilterChange(f.id as MemeConfig['filter'])}
              className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                config.filter === f.id
                  ? 'bg-pink-950/70 border-pink-500 text-pink-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons (Make Funnier + Regenerate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onMakeFunnier}
          disabled={isMakingFunnier}
          className="py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800 hover:to-pink-800 text-pink-200 border border-pink-500/40 transition-all cursor-pointer disabled:opacity-50"
        >
          <Wand2 className={`w-4 h-4 ${isMakingFunnier ? 'animate-spin' : ''}`} />
          <span>{hasEditedImage ? 'Re-Exaggerate Image ✨' : 'Make Image Funnier ✨'}</span>
        </button>

        <button
          type="button"
          onClick={onRegenerateCaptions}
          disabled={isRegenerating}
          className="py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate Captions</span>
        </button>
      </div>

      {/* Download Button */}
      <div className="pt-2">
        <DownloadButton onDownload={onDownload} />
      </div>
    </div>
  );
};
