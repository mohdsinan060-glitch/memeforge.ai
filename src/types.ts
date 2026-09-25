export type MemeVibe =
  | '😂 Funny'
  | '💀 Gen-Z'
  | '😭 Relatable'
  | '🔥 Savage'
  | '🤯 Absurd'
  | '❤️ Wholesome'
  | '🌑 Dark Humor'
  | '🎲 Surprise Me';

export type MemeMode = 'caption_only' | 'make_funnier';

export type MemeStyle = 'Classic' | 'Modern' | 'Chaotic' | 'Minimal' | 'Reaction';

export type TextPosition = 'top' | 'center' | 'bottom';

export interface MemeAnalysis {
  image_description: string;
  main_subject: string;
  emotion: string;
  situation: string;
  funny_angle: string;
  visual_edit_needed: boolean;
  visual_edit_concept: string;
  recommended_style: string;
  captions: string[];
  notice?: string;
  isDemoMode?: boolean;
}

export interface MemeConfig {
  caption: string;
  style: MemeStyle;
  fontSize: number;
  position: TextPosition;
  textColor: string;
  strokeColor: string;
  filter: 'none' | 'dramatic' | 'vintage' | 'deepfry' | 'grayscale';
  showWatermark: boolean;
}

export interface SampleImage {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  defaultCaptions?: string[];
  suggestedVibe?: MemeVibe;
}
