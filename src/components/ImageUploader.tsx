import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, FolderUp, Camera } from 'lucide-react';
import { HandDrawnArrow } from './Doodles';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImage } from '../types';

interface ImageUploaderProps {
  image: string | null;
  fileName: string | null;
  onImageSelected: (base64: string, name: string) => void;
  onRemoveImage: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  fileName,
  onImageSelected,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelected(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: SampleImage) => {
    try {
      // Fetch sample image and convert to data URL
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageSelected(base64, `${sample.id}.jpg`);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Upload Box */}
      {!image ? (
        <div className="relative">
          {/* Playful side doodle */}
          <div className="absolute -left-16 top-10 hidden xl:block pointer-events-none">
            <span className="font-hand text-pink-400 text-lg font-bold rotate-[-10deg] block">
              drop your bad decisions here ↓
            </span>
            <HandDrawnArrow className="w-14 h-10 text-pink-400 rotate-[-20deg]" />
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
              isDragging
                ? 'border-purple-400 bg-purple-950/30 scale-[1.01] shadow-2xl shadow-purple-500/20'
                : 'border-zinc-700/80 hover:border-purple-500/80 bg-[#141419]/90 hover:bg-[#181820]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-purple-400 group-hover:text-yellow-400 group-hover:scale-110 group-hover:border-purple-500/60 transition-all duration-300 shadow-inner">
                <UploadCloud className="w-10 h-10 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="font-syne font-bold text-2xl text-white tracking-tight mb-1">
                  Drop your photo here
                </h3>
                <p className="text-zinc-400 text-sm">
                  or <span className="text-purple-400 underline decoration-purple-400/50 underline-offset-4 font-semibold group-hover:text-purple-300">Choose Image</span> from your files
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                  JPG • PNG • WEBP
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Up to 25MB
                </span>
              </div>

              <p className="text-xs text-zinc-500 italic mt-1">
                "Give us a photo. We'll handle the chaos."
              </p>
            </div>
          </div>

          {/* Quick Preset Selector for instant testing */}
          <div className="mt-5 text-center">
            <p className="text-xs font-medium text-zinc-400 mb-2.5 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Or test with a preset photo:</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/80 bg-zinc-900/60 p-1.5 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 focus:outline-none"
                >
                  <div className="h-16 w-full rounded-lg overflow-hidden bg-zinc-800 relative">
                    <img
                      src={sample.url}
                      alt={sample.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="px-1 pt-1.5">
                    <p className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-purple-300">
                      {sample.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">
                      {sample.suggestedVibe}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-3xl p-5 bg-[#141419] border border-purple-500/40 shadow-xl shadow-purple-500/10">
          <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-zinc-800 flex items-center justify-center max-h-[380px]">
            <img
              src={image}
              alt="Uploaded photo"
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[380px] object-contain"
            />

            {/* Remove / Change Button */}
            <button
              onClick={onRemoveImage}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-red-600 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg"
              title="Remove photo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* File info pill */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 truncate max-w-[80%]">
              {fileName || 'uploaded-photo.jpg'}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 px-1 text-xs text-zinc-400">
            <span>Ready for meme generation ✨</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
            >
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
