import { MemeConfig } from '../types';

/**
 * Splits text into lines that fit within maxLineWidth on canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  // If text already has manual line breaks, honor them
  const paragraphs = text.split('\n');
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      allLines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    allLines.push(currentLine);
  }

  return allLines;
}

/**
 * Applies visual photo filters to the canvas
 */
function applyPhotoFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: MemeConfig['filter']
) {
  if (filter === 'none') return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  if (filter === 'grayscale') {
    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (filter === 'vintage') {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (filter === 'dramatic') {
    // Contrast boost + slight vignette
    const factor = (259 * (64 + 255)) / (255 * (259 - 64));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);

    // Vignette overlay
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else if (filter === 'deepfry') {
    // Extreme saturation & contrast for chaotic memes
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] > 120 ? Math.min(255, data[i] * 1.35) : data[i] * 0.8;
      data[i + 1] = data[i + 1] > 120 ? Math.min(255, data[i + 1] * 1.2) : data[i + 1] * 0.7;
      data[i + 2] = data[i + 2] * 0.7; // shift to warm/yellow unhinged look
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

/**
 * Main rendering routine: draws image & custom styled meme caption
 */
export function renderMemeToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  config: MemeConfig
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const originalWidth = image.naturalWidth || image.width || 800;
  const originalHeight = image.naturalHeight || image.height || 600;

  // For 'Reaction' style, we might add a top banner header area
  const isReaction = config.style === 'Reaction';
  let bannerHeight = 0;

  // Pre-calculate banner height for reaction style if needed
  if (isReaction) {
    const scaleFactor = originalWidth / 600;
    const computedFontSize = Math.max(18, Math.round(config.fontSize * scaleFactor * 0.8));
    ctx.font = `600 ${computedFontSize}px "Plus Jakarta Sans", sans-serif`;
    const lines = wrapText(ctx, config.caption, originalWidth - 60);
    bannerHeight = Math.max(90, lines.length * (computedFontSize * 1.4) + 40);
  }

  // Set canvas dimensions
  canvas.width = originalWidth;
  canvas.height = originalHeight + bannerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If reaction mode, fill banner background
  if (isReaction) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, bannerHeight);
    // Draw image below banner
    ctx.drawImage(image, 0, bannerHeight, originalWidth, originalHeight);
  } else {
    // Normal drawing
    ctx.drawImage(image, 0, 0, originalWidth, originalHeight);
  }

  // Apply photo filter to the image portion
  if (config.filter !== 'none') {
    ctx.save();
    if (isReaction) {
      // clip to image area
      ctx.beginPath();
      ctx.rect(0, bannerHeight, originalWidth, originalHeight);
      ctx.clip();
    }
    applyPhotoFilter(ctx, canvas.width, canvas.height, config.filter);
    ctx.restore();
  }

  // Now render captions based on style
  const caption = config.caption.trim();
  if (!caption) return;

  const scaleFactor = originalWidth / 600;
  const baseFontSize = Math.max(16, Math.round(config.fontSize * scaleFactor));

  ctx.save();

  if (isReaction) {
    // Render text inside top white reaction banner
    const computedFontSize = Math.max(18, Math.round(config.fontSize * scaleFactor * 0.8));
    ctx.font = `700 ${computedFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = wrapText(ctx, caption, originalWidth - 60);
    const lineHeight = computedFontSize * 1.35;
    const startY = Math.max(20, (bannerHeight - lines.length * lineHeight) / 2);

    lines.forEach((line, idx) => {
      ctx.fillText(line, 30, startY + idx * lineHeight);
    });
  } else if (config.style === 'Classic') {
    // Classic Impact Style: Uppercase, bold Anton/Impact, thick black stroke
    const textToDraw = caption.toUpperCase();
    const computedFontSize = Math.round(baseFontSize * 1.15);
    ctx.font = `900 ${computedFontSize}px "Anton", "Impact", sans-serif`;
    ctx.fillStyle = config.textColor || '#FFFFFF';
    ctx.strokeStyle = config.strokeColor || '#000000';
    ctx.lineWidth = Math.max(4, Math.round(computedFontSize * 0.16));
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.textAlign = 'center';

    const lines = wrapText(ctx, textToDraw, originalWidth * 0.88);
    const lineHeight = computedFontSize * 1.15;
    const totalHeight = lines.length * lineHeight;

    let startY = 40 + computedFontSize;
    if (config.position === 'center') {
      startY = (originalHeight - totalHeight) / 2 + computedFontSize;
    } else if (config.position === 'bottom') {
      startY = originalHeight - 40 - totalHeight + computedFontSize;
    }

    lines.forEach((line, idx) => {
      const y = startY + idx * lineHeight;
      ctx.strokeText(line, originalWidth / 2, y);
      ctx.fillText(line, originalWidth / 2, y);
    });
  } else if (config.style === 'Modern') {
    // Modern: Clean typography, semi-transparent dark rounded badge backing or crisp text with drop shadow
    const computedFontSize = Math.round(baseFontSize * 0.95);
    ctx.font = `800 ${computedFontSize}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';

    const lines = wrapText(ctx, caption, originalWidth * 0.82);
    const lineHeight = computedFontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;

    let centerY = 60 + totalTextHeight / 2;
    if (config.position === 'center') {
      centerY = originalHeight / 2;
    } else if (config.position === 'bottom') {
      centerY = originalHeight - 60 - totalTextHeight / 2;
    }

    // Draw modern translucent dark backdrop capsule
    const maxLineWidth = Math.max(
      ...lines.map((l) => ctx.measureText(l).width)
    );
    const boxPadX = 28 * scaleFactor;
    const boxPadY = 16 * scaleFactor;
    const boxW = maxLineWidth + boxPadX * 2;
    const boxH = totalTextHeight + boxPadY * 2;
    const boxX = (originalWidth - boxW) / 2;
    const boxY = centerY - totalTextHeight / 2 - boxPadY;

    // Rounded rectangle
    const radius = Math.min(24 * scaleFactor, boxH / 2);
    ctx.fillStyle = 'rgba(15, 15, 20, 0.78)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, radius);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'middle';

    const startY = centerY - (lines.length - 1) * (lineHeight / 2);
    lines.forEach((line, idx) => {
      ctx.fillText(line, originalWidth / 2, startY + idx * lineHeight);
    });
  } else if (config.style === 'Chaotic') {
    // Chaotic: Playful tilt, bold colorful offset stroke, expressive
    const computedFontSize = Math.round(baseFontSize * 1.1);
    ctx.font = `900 ${computedFontSize}px "Syne", "Anton", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, caption, originalWidth * 0.84);
    const lineHeight = computedFontSize * 1.25;
    const totalHeight = lines.length * lineHeight;

    let centerY = 70 + totalHeight / 2;
    if (config.position === 'center') {
      centerY = originalHeight / 2;
    } else if (config.position === 'bottom') {
      centerY = originalHeight - 70 - totalHeight / 2;
    }

    ctx.save();
    ctx.translate(originalWidth / 2, centerY);
    ctx.rotate((-2.5 * Math.PI) / 180); // Slight chaotic tilt

    const startY = -(lines.length - 1) * (lineHeight / 2);

    lines.forEach((line, idx) => {
      const y = startY + idx * lineHeight;
      // Vibrant yellow/pink drop shadow outline
      ctx.lineWidth = Math.max(6, Math.round(computedFontSize * 0.18));
      ctx.strokeStyle = '#000000';
      ctx.strokeText(line, 0, y);

      // Offset pop outline
      ctx.fillStyle = '#FACC15'; // yellow pop
      ctx.fillText(line, 3, y + 3);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(line, 0, y);
    });
    ctx.restore();
  } else if (config.style === 'Minimal') {
    // Minimal: Lowercase/clean, subtle cinematic letter spacing, delicate dark shadow
    const computedFontSize = Math.round(baseFontSize * 0.85);
    ctx.font = `600 ${computedFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, caption, originalWidth * 0.82);
    const lineHeight = computedFontSize * 1.4;
    const totalHeight = lines.length * lineHeight;

    let centerY = 60 + totalHeight / 2;
    if (config.position === 'center') {
      centerY = originalHeight / 2;
    } else if (config.position === 'bottom') {
      centerY = originalHeight - 60 - totalHeight / 2;
    }

    const startY = centerY - (lines.length - 1) * (lineHeight / 2);

    lines.forEach((line, idx) => {
      const y = startY + idx * lineHeight;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(line, originalWidth / 2, y);
    });
  }

  // Watermark stamp in bottom corner if enabled
  if (config.showWatermark) {
    const wmSize = Math.max(12, Math.round(14 * scaleFactor));
    ctx.font = `700 ${wmSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText('memeforge.ai ⚡', canvas.width - 20, canvas.height - 16);
  }

  ctx.restore();
}

/**
 * Downloads the current canvas as a PNG file
 */
export function exportCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'memeforge-meme.png'
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 0.95);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
