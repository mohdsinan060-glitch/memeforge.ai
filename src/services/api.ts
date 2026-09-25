import { MemeAnalysis, MemeVibe, MemeMode } from '../types';

export async function analyzeImageForMeme(
  imageBase64: string,
  vibe: MemeVibe,
  mode: MemeMode
): Promise<MemeAnalysis> {
  const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const response = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      mimeType,
      vibe,
      mode,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze photo for comedic potential.');
  }

  return {
    ...data.analysis,
    notice: data.notice,
    isDemoMode: data.isDemoMode,
  };
}

export async function editImageFunnier(
  imageBase64: string,
  funnyAngle: string,
  visualConcept: string
): Promise<{ editedImage?: string; message?: string }> {
  const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const response = await fetch('/api/gemini/edit-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      mimeType,
      funnyAngle,
      visualConcept,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Could not exaggerate image humor.');
  }

  return {
    editedImage: data.editedImage,
    message: data.message,
  };
}

export async function regenerateCaptionsApi(
  imageDescription: string,
  funnyAngle: string,
  vibe: MemeVibe,
  previousCaptions: string[]
): Promise<string[]> {
  const response = await fetch('/api/gemini/regenerate-captions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageDescription,
      funnyAngle,
      vibe,
      previousCaptions,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to regenerate fresh captions.');
  }

  return data.captions;
}
