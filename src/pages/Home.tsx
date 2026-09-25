import React, { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ImageUploader } from '../components/ImageUploader';
import { MemeModeSelector } from '../components/MemeModeSelector';
import { VibeSelector } from '../components/VibeSelector';
import { GenerateButton } from '../components/GenerateButton';
import { LoadingState } from '../components/LoadingState';
import { MemeResult } from '../components/MemeResult';
import { CaptionList } from '../components/CaptionList';
import { MemeEditor } from '../components/MemeEditor';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { ExamplesModal } from '../components/ExamplesModal';
import { MemeMode, MemeVibe, MemeConfig, MemeAnalysis, SampleImage } from '../types';
import { analyzeImageForMeme, editImageFunnier, regenerateCaptionsApi } from '../services/api';
import { renderMemeToCanvas, exportCanvasAsImage } from '../utils/memeRenderer';
import { AlertCircle, Sparkles, RefreshCw, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  // State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const [mode, setMode] = useState<MemeMode>('make_funnier');
  const [vibe, setVibe] = useState<MemeVibe>('🎲 Surprise Me');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isMakingFunnier, setIsMakingFunnier] = useState<boolean>(false);

  const [analysis, setAnalysis] = useState<MemeAnalysis | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);

  // Meme Editor Configuration
  const [memeConfig, setMemeConfig] = useState<MemeConfig>({
    caption: '',
    style: 'Modern',
    fontSize: 32,
    position: 'bottom',
    textColor: '#FFFFFF',
    strokeColor: '#000000',
    filter: 'none',
    showWatermark: true,
  });

  const resultRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleImageSelected = (base64: string, name: string) => {
    setUploadedImage(base64);
    setFileName(name);
    setEditedImage(null);
    setAnalysis(null);
    setCaptions([]);
    setError(null);
    setMemeConfig((prev) => ({ ...prev, caption: '' }));
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setFileName(null);
    setEditedImage(null);
    setAnalysis(null);
    setCaptions([]);
    setError(null);
  };

  const handleSelectSample = async (sample: SampleImage) => {
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleImageSelected(base64, `${sample.id}.jpg`);
        if (sample.suggestedVibe) {
          setVibe(sample.suggestedVibe);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image', err);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('No image yet — give us something to work with.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Multimodal Analysis & Caption Generation
      const analysisResult = await analyzeImageForMeme(uploadedImage, vibe, mode);
      setAnalysis(analysisResult);
      setCaptions(analysisResult.captions || []);

      const chosenCaption = analysisResult.captions?.[0] || 'Technically, this was a decision.';
      const recommendedStyle = (['Classic', 'Modern', 'Chaotic', 'Minimal', 'Reaction'].includes(
        analysisResult.recommended_style
      )
        ? analysisResult.recommended_style
        : 'Modern') as MemeConfig['style'];

      setMemeConfig((prev) => ({
        ...prev,
        caption: chosenCaption,
        style: recommendedStyle,
      }));

      // Step 2: If "Make It Funnier" is selected, trigger AI image editing
      if (mode === 'make_funnier') {
        try {
          const editResult = await editImageFunnier(
            uploadedImage,
            analysisResult.funny_angle,
            analysisResult.visual_edit_concept
          );
          if (editResult.editedImage) {
            setEditedImage(editResult.editedImage);
          }
        } catch (editErr) {
          console.warn('AI image edit step failed; using original photo with visual filters:', editErr);
        }
      }

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err?.message || 'That joke died during generation. Let’s try another photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateCaptions = async () => {
    if (!analysis) return;
    setIsRegenerating(true);
    try {
      const newCaptions = await regenerateCaptionsApi(
        analysis.image_description,
        analysis.funny_angle,
        vibe,
        captions
      );
      if (newCaptions && newCaptions.length > 0) {
        setCaptions(newCaptions);
        setMemeConfig((prev) => ({ ...prev, caption: newCaptions[0] }));
      }
    } catch (err: any) {
      console.error('Failed to regenerate captions:', err);
      setError(err?.message || 'Failed to craft fresh captions.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleMakeFunnier = async () => {
    if (!uploadedImage || !analysis) return;
    setIsMakingFunnier(true);
    try {
      const editResult = await editImageFunnier(
        uploadedImage,
        analysis.funny_angle,
        analysis.visual_edit_concept
      );
      if (editResult.editedImage) {
        setEditedImage(editResult.editedImage);
      }
    } catch (err: any) {
      console.error('Visual exaggeration failed:', err);
      setError('Reality resisted the edit. You can still apply dramatic filters in the editor below.');
    } finally {
      setIsMakingFunnier(false);
    }
  };

  const handleDownload = () => {
    const activeImgSrc = editedImage || uploadedImage;
    if (!activeImgSrc) return;

    // Create an offscreen canvas to render at full resolution and download
    const offscreenCanvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeImgSrc;
    img.onload = () => {
      renderMemeToCanvas(offscreenCanvas, img, memeConfig);
      exportCanvasAsImage(offscreenCanvas, 'memeforge-meme.png');
    };
  };

  const activeImage = editedImage || uploadedImage;

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans">
      <Header
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onOpenExamples={() => setExamplesOpen(true)}
        onReset={handleRemoveImage}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Hero />

        {/* Error notification if any */}
        {error && (
          <div className="max-w-2xl mx-auto my-4 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-200 underline font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step 1: Upload Photo */}
        <ImageUploader
          image={uploadedImage}
          fileName={fileName}
          onImageSelected={handleImageSelected}
          onRemoveImage={handleRemoveImage}
        />

        {/* Step 2: Options (Mode & Vibe) */}
        {uploadedImage && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
            <MemeModeSelector
              selectedMode={mode}
              onChangeMode={setMode}
            />

            <VibeSelector
              selectedVibe={vibe}
              onChangeVibe={setVibe}
            />

            <GenerateButton
              mode={mode}
              disabled={isLoading}
              onClick={handleGenerate}
            />
          </div>
        )}

        {/* Loading Experience */}
        {isLoading && <LoadingState mode={mode} />}

        {/* Step 3: Result & Editor Section */}
        {analysis && activeImage && !isLoading && (
          <div
            ref={resultRef}
            className="mt-12 pt-8 border-t border-zinc-800/80 space-y-8 animate-in fade-in duration-500"
          >
            {/* Split layout: Result on left, Captions & Editor on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Result Preview */}
              <div className="lg:col-span-7 space-y-6">
                <MemeResult
                  originalImage={uploadedImage!}
                  activeImage={activeImage}
                  hasEditedImage={Boolean(editedImage)}
                  config={memeConfig}
                  analysis={analysis}
                  onDownload={handleDownload}
                />
              </div>

              {/* Right Column: AI Captions & Meme Editor */}
              <div className="lg:col-span-5 space-y-6">
                <CaptionList
                  captions={captions}
                  selectedCaption={memeConfig.caption}
                  onSelectCaption={(cap) =>
                    setMemeConfig((prev) => ({ ...prev, caption: cap }))
                  }
                  onRegenerateCaptions={handleRegenerateCaptions}
                  isRegenerating={isRegenerating}
                />

                <MemeEditor
                  config={memeConfig}
                  onChangeConfig={setMemeConfig}
                  onMakeFunnier={handleMakeFunnier}
                  onRegenerateCaptions={handleRegenerateCaptions}
                  onDownload={handleDownload}
                  isMakingFunnier={isMakingFunnier}
                  isRegenerating={isRegenerating}
                  hasEditedImage={Boolean(editedImage)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="text-center mt-16 pt-8 border-t border-zinc-900 text-xs text-zinc-500 max-w-xl mx-auto space-y-1">
          <p>
            🔒 <strong className="text-zinc-400">Privacy Guarantee:</strong> Your photo is only used to create your meme. We never store photos permanently or create public feeds.
          </p>
          <p className="font-mono text-[11px] text-zinc-600">
            MemeForge AI · Intelligent multimodal meme synthesis
          </p>
        </div>
      </main>

      {/* Modals */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

      <ExamplesModal
        isOpen={examplesOpen}
        onClose={() => setExamplesOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
};
