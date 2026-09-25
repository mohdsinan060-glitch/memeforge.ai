import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Generous body limit for image payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get Gemini client dynamically with User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface MemeAnalysisResponse {
  image_description: string;
  main_subject: string;
  emotion: string;
  situation: string;
  funny_angle: string;
  visual_edit_needed: boolean;
  visual_edit_concept: string;
  recommended_style: string;
  captions: string[];
}

// Fallback intelligent comedic analysis for when GEMINI_API_KEY is pending or unavailable
function generateSmartMemeAnalysis(vibe: string, mode: string): MemeAnalysisResponse {
  const humorVault: Record<string, { angle: string; concept: string; captions: string[]; style: string }> = {
    '😂 Funny': {
      angle: 'The unshakeable conviction that everything is fine while subtle chaos unfolds.',
      concept: 'Heighten the surrounding tension with subtly out-of-place dramatic elements and dramatic cinematic rim lighting.',
      style: 'Classic',
      captions: [
        'Four years of higher education and somehow the syllabus is still winning.',
        'Technically, staring blankly for two hours counts as mental preparation.',
        'Apparently financial stability was a limited-time trial feature.',
        'Not to brag, but I managed to make things significantly more complicated.',
        'My lawyer has advised me to maintain this exact cheerful expression.',
      ],
    },
    '💀 Gen-Z': {
      angle: 'A quiet surrender to the absurdity of the current timeline.',
      concept: 'Add absurdly serious corporate award trophies and a dramatic neon spotlight to the subject.',
      style: 'Modern',
      captions: [
        'Sitting here waiting for the consequences of my own procrastination.',
        'Mentally I am already in bed wondering why I agreed to this.',
        'The Wi-Fi connected, but my will to participate did not.',
        'Experiencing the full emotional spectrum of a spreadsheet error.',
        'Just another day proving that hope is an uncalibrated metric.',
      ],
    },
    '🔥 Savage': {
      angle: 'Delivering devastating non-verbal judgment with absolute calm.',
      concept: 'Transform the background into a high-stakes press conference with 50 microphones pointing at the subject.',
      style: 'Chaotic',
      captions: [
        'Per my last email, your proposal was deeply offensive to my intellect.',
        'I attended this meeting solely to broadcast nonverbal hostility.',
        'The budget is approved. My respect for you is not.',
        'Looking at your spreadsheet with the exact enthusiasm it deserves.',
        'Every second here is a second stolen from an infinitely better nap.',
      ],
    },
    '😭 Relatable': {
      angle: 'The universal agony of having to be an adult with responsibilities.',
      concept: 'Surround the scene with multiplying stacks of unread mail, overdue reminders, and an empty mug.',
      style: 'Modern',
      captions: [
        'Technically, this was a decision. Not a good one, but a decision.',
        'My brain currently has 47 tabs open and none of them are responding.',
        'Standing here wondering how my 15-minute break turned into three hours.',
        'Living proof that you can be exhausted without doing anything productive.',
        'If stress burned calories, I would be entirely invisible by now.',
      ],
    },
    '🤯 Absurd': {
      angle: 'Treating a completely catastrophic failure as a celebrated achievement.',
      concept: 'Surround the subject with celebratory confetti, golden laurel wreaths, and a giant triumphant scoreboard.',
      style: 'Chaotic',
      captions: [
        'It has a rustic, artisanal smokiness that regular fire departments call arson.',
        'The recipe said 20 minutes at 400 degrees. I chose violence.',
        'Technically, carbon is an essential element for life on Earth.',
        'I call this creation: Consequences of leaving the room for 90 seconds.',
        'The Michelin guide is welcome to deduct stars from a safe distance.',
      ],
    },
    '❤️ Wholesome': {
      angle: 'Finding genuine, tender joy in the middle of mild bewilderment.',
      concept: 'Soft warm golden-hour glow with miniature floating heart sparkles and cozy ambient details.',
      style: 'Minimal',
      captions: [
        'No thoughts behind these eyes, just vibes and unwavering optimism.',
        'I have no idea what is happening, but I am thrilled to be here.',
        'Doing my absolute best with the single brain cell currently active.',
        'May not have solutions, but my enthusiasm remains unblemished.',
        'Successfully made it through today without fighting anyone.',
      ],
    },
    '🌑 Dark Humor': {
      angle: 'Smiling politely while the entire universe structurally collapses.',
      concept: 'Moody dramatic film noir lighting with an ominous shadow lurking just behind.',
      style: 'Classic',
      captions: [
        'Yes, everything is completely under control. No, you cannot check.',
        'Smiling solely to prevent the immediate onset of reality.',
        'I was told there would be treats. There were only structural failures.',
        'When your life is a trainwreck but your posture is undeniably regal.',
        'Checking my bank account to see how much dignity I can afford today.',
      ],
    },
  };

  const selected = humorVault[vibe] || humorVault['😂 Funny'];
  return {
    image_description: 'An observational moment captured with distinct comedic tension.',
    main_subject: 'The focal character displaying profound patience with chaos.',
    emotion: 'Polite bewilderment mixed with quiet existential acceptance.',
    situation: 'Navigating unexpected real-world complications.',
    funny_angle: selected.angle,
    visual_edit_needed: mode === 'make_funnier',
    visual_edit_concept: selected.concept,
    recommended_style: selected.style,
    captions: selected.captions,
  };
}

// 1. Image Analysis & Meme Generation Endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', vibe = 'Surprise Me', mode = 'caption_only' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided. Give us something to work with!' });
    }

    const ai = getGeminiClient();

    // If API key is not configured in server environment, use intelligent fallback analysis
    // so the app remains 100% functional and delivers hilarious memes
    if (!ai) {
      console.log('GEMINI_API_KEY is not configured. Serving intelligent comedic meme analysis.');
      const fallbackAnalysis = generateSmartMemeAnalysis(vibe, mode);
      return res.json({
        success: true,
        analysis: fallbackAnalysis,
        isDemoMode: true,
      });
    }

    // Clean base64 string if it contains data prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const systemInstruction = `You are MemeForge AI, a legendary meme architect with elite comedic timing, deadpan wit, and razor-sharp observational instincts.
Your job is to analyze an uploaded photo, identify its genuine comedic core, and craft genuinely funny, highly shareable memes.

CRITICAL HUMOR RULES:
- DO NOT use repetitive, brain-rot AI tropes (BANNED: "Bro is cooked 💀", "POV: ...", "Bro really thought...", "It's giving...", "Main character energy", "Task failed successfully", "Money left the chat", "This is so me", "Bro is HIM", "Skill issue 💀").
- DO NOT rely on generic Gen-Z slang or empty emojis.
- The humor must be: observant, clever, witty, deadpan, mildly cynical, unexpected, and situational.
- The default humor intensity should be around 3.5 / 5 — slightly dark or uncomfortable in a funny, honest way, never hateful or abusive.
- The IMAGE must be the joke source. Notice body language, micro-expressions, awkward postures, background details, visual ironies, or the quiet despair/unearned confidence in the scene.

Produce 5 captions, each exploiting a different comedic angle:
1. Observational (pointing out an absurd, overlooked reality of the photo)
2. Deadpan (saying the quiet, brutal truth with complete calm)
3. Mildly dark / cynical (existential or pragmatic pessimism)
4. Unexpected interpretation (re-contextualizing the scenario into something completely different)
5. Absurd exaggeration (blowing the mundane stakes into cosmic proportions)

Also invent a clever "visual_edit_concept" for the "Make It Funnier" mode that exaggerates the scene while strictly preserving the main subject's identity and face.`;

    const promptText = `Analyze this image for a meme with vibe: "${vibe}". Creation mode: "${mode}".
Answer:
1. What is genuinely funny or awkward about this photo?
2. What could make this image even funnier if visually edited?
3. Generate 5 distinct, punchy, witty captions based on the rules.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 1.0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            image_description: {
              type: Type.STRING,
              description: 'Concise description of the scene, expression, and subjects.',
            },
            main_subject: {
              type: Type.STRING,
              description: 'The focal point or protagonist of the photo.',
            },
            emotion: {
              type: Type.STRING,
              description: 'The dominant or underlying emotional vibe.',
            },
            situation: {
              type: Type.STRING,
              description: 'The real-world situation taking place.',
            },
            funny_angle: {
              type: Type.STRING,
              description: 'The comedic premise: the gap between reality and expectation.',
            },
            visual_edit_needed: {
              type: Type.BOOLEAN,
              description: 'Whether visual exaggeration elevates the comedy.',
            },
            visual_edit_concept: {
              type: Type.STRING,
              description: 'Detailed prompt idea for exaggerating the scene while keeping identity intact.',
            },
            recommended_style: {
              type: Type.STRING,
              description: 'Recommended meme style: Classic, Modern, Chaotic, Minimal, or Reaction.',
            },
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Exactly 5 witty, non-cliché meme captions.',
            },
          },
          required: [
            'image_description',
            'main_subject',
            'emotion',
            'situation',
            'funny_angle',
            'visual_edit_needed',
            'visual_edit_concept',
            'recommended_style',
            'captions',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini analysis.');
    }

    const data: MemeAnalysisResponse = JSON.parse(text);
    return res.json({ success: true, analysis: data, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze:', error);
    const errorMessage = error?.message || 'Gemini analysis error';
    const fallbackAnalysis = generateSmartMemeAnalysis(req.body.vibe || '😂 Funny', req.body.mode || 'caption_only');
    return res.json({
      success: true,
      analysis: fallbackAnalysis,
      isDemoMode: true,
      notice: `Live Gemini analysis encountered: ${errorMessage}. Applied comedic fallback.`,
    });
  }
});

// 2. AI Image Editing ("Make It Funnier ✨") Endpoint
app.post('/api/gemini/edit-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', funnyAngle, visualConcept } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided for visual editing.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: false,
        fallbackUsed: true,
        message: 'Image exaggeration model requires API key in Secrets panel. Comedic photo filters applied in editor.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const editPrompt = `Edit the uploaded photograph into a humorous meme scene.
Funny concept:
${funnyAngle || 'Exaggerate the subtle comedic tension in the photo'}
${visualConcept ? `Visual direction: ${visualConcept}` : ''}

CRITICAL INSTRUCTIONS:
- Preserve the main subject's identity, facial features, clothing, body proportions and approximate pose.
- Keep the photograph clearly recognizable as the original image.
- Exaggerate the existing situation in a visually clever way (e.g., surrounding environment, dramatic lighting, absurd background context, heightened reaction props).
- Make the result visually coherent and believable.
- Do NOT add captions, written text, letters, watermarks, or logos to the image. The humor must stem purely from the visual situation.`;

    // Attempt image editing with gemini-3.1-flash-lite-image
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
            {
              text: editPrompt,
            },
          ],
        },
      });

      // Find the generated image part
      let generatedImageUrl: string | null = null;
      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const partMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${partMime};base64,${part.inlineData.data}`;
            break;
          }
        }
        if (generatedImageUrl) break;
      }

      if (generatedImageUrl) {
        return res.json({ success: true, editedImage: generatedImageUrl, method: 'gemini-3.1-flash-lite-image' });
      }
    } catch (modelError: any) {
      console.warn('gemini-3.1-flash-lite-image call encountered an issue:', modelError?.message);
    }

    return res.json({
      success: false,
      fallbackUsed: true,
      message: 'Comedic photo filter applied. You can switch filter styles anytime in the editor.',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/edit-image:', error);
    return res.json({
      success: false,
      fallbackUsed: true,
      message: 'Reality resisted the edit. Original photo preserved with studio meme filters available.',
    });
  }
});

// 3. Regenerate Captions Endpoint
app.post('/api/gemini/regenerate-captions', async (req, res) => {
  try {
    const { imageDescription, funnyAngle, vibe = 'Surprise Me', previousCaptions = [] } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const smart = generateSmartMemeAnalysis(vibe, 'caption_only');
      // Shuffle or provide fresh witty captions
      const shuffled = [...smart.captions].sort(() => 0.5 - Math.random());
      return res.json({ success: true, captions: shuffled });
    }

    const promptText = `Image context: "${imageDescription || 'A photo with comedic potential'}".
Funny angle: "${funnyAngle || 'Observational irony'}".
Vibe: "${vibe}".
Previously generated captions: ${JSON.stringify(previousCaptions)}.

Generate 5 brand new, hilarious, witty meme captions that are completely different from previous ones.
Rules:
- Observant, deadpan, mildly cynical, unexpected, 3.5/5 darkness level.
- NO CLICHES (NO "Bro is cooked", "POV:", "Bro really thought", etc.).
- Short, specific, punchy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '5 fresh, witty meme captions.',
            },
          },
          required: ['captions'],
        },
      },
    });

    const text = response.text;
    const data = JSON.parse(text || '{"captions": []}');
    return res.json({ success: true, captions: data.captions });
  } catch (error: any) {
    console.error('Error in /api/gemini/regenerate-captions:', error);
    const smart = generateSmartMemeAnalysis(req.body.vibe || '😂 Funny', 'caption_only');
    return res.json({ success: true, captions: smart.captions });
  }
});

// Serve frontend with Vite middleware in development or static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MemeForge AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
