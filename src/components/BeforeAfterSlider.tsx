import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight, Sparkles, Image as ImageIcon } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  editedImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  editedImage,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clampedPercentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Original Photo
          </span>
          <span className="text-xs text-zinc-600">vs</span>
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400" />
            AI Version
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline-block">
          Drag slider to compare
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-full aspect-square sm:aspect-[4/3] max-h-[500px] rounded-2xl overflow-hidden cursor-ew-resize border border-zinc-800 bg-black/60 shadow-2xl"
      >
        {/* Underneath layer: Edited Image (AI Version) */}
        <img
          src={editedImage}
          alt="AI Exaggerated Meme Scene"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Top layer: Original Image clipped to slider percentage */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* We lock the inner image width to 100% of container so it doesn't compress */}
          <div
            className="h-full relative pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          >
            <img
              src={originalImage}
              alt="Original Photograph"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Badges on left and right */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-zinc-300 border border-white/10 pointer-events-none">
          ORIGINAL
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-pink-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-pink-300 border border-pink-500/30 flex items-center gap-1 pointer-events-none">
          <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
          AI VERSION
        </div>

        {/* Divider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-9 h-9 rounded-full bg-white text-zinc-900 shadow-xl border-2 border-purple-500 flex items-center justify-center hover:scale-110 transition-transform">
            <ChevronsLeftRight className="w-5 h-5 text-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
};
