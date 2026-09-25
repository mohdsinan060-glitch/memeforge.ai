import React, { useState } from 'react';
import { Download, Sparkles, Check, Share2 } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  disabled = false,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleClick = () => {
    onDownload();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`w-full py-3.5 px-6 rounded-2xl font-syne font-black text-base sm:text-lg tracking-tight flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-xl ${
          downloaded
            ? 'bg-emerald-600 text-white shadow-emerald-600/30'
            : 'bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-500 hover:from-pink-400 hover:via-purple-500 hover:to-yellow-400 text-white shadow-purple-600/25 hover:scale-[1.01]'
        }`}
      >
        {downloaded ? (
          <>
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Meme Saved!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Meme (PNG)</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-zinc-500 font-mono text-center mt-1.5">
        "Release this into the internet."
      </p>
    </div>
  );
};
