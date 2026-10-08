export type Tone =
  | "default"
  | "polished"
  | "yc-parody"
  | "chaotic"
  | "deadpan"
  | "cinematic"
  | "app-store";

export type AspectRatio = "16:9" | "9:16" | "1:1";

export type Duration = 15 | 20 | 25;

export interface ApiKeys {
  gemini?: string;
  anthropic?: string;
  openai?: string;
}

export interface Preferences {
  defaultTone: Tone;
  defaultFormat: AspectRatio;
  defaultDuration: Duration;
  preferredProvider: "gemini" | "anthropic" | "openai";
}

export interface ConfigResponse {
  apiKeys: {
    gemini?: string;
    anthropic?: string;
    openai?: string;
  };
  preferences: Preferences;
  hasKey: {
    gemini: boolean;
    anthropic: boolean;
    openai: boolean;
  };
}

export interface ProjectInput {
  prompt: string;
  imageUrl: string | null;
  imageFilename: string | null;
  tone: Tone;
  customTone: string;
  aspectRatio: AspectRatio;
  duration: Duration;
}

export interface TonePreset {
  id: Tone;
  name: string;
  tagline: string;
  iconName: string;
}

export interface StoryboardScene {
  id: string;
  type: "hook" | "product_reveal" | "highlight_beats" | "outro" | string;
  duration: number;
  headline: string;
  subtext?: string;
  cta?: string;
  beats?: string[];
  visualEmphasis?: string;
  transition?: string;
}

export interface AudioDirection {
  musicMood: string;
  trackRecommendation: string;
  sfxCues: string[];
}

export interface ShareCopy {
  twitter: string;
  linkedin: string;
  discord: string;
}

export interface Storyboard {
  title: string;
  tagline: string;
  tone: Tone;
  aspectRatio: AspectRatio;
  targetDuration: number;
  imageUrl?: string;
  scenes: StoryboardScene[];
  audioDirection: AudioDirection;
  shareCopy: ShareCopy;
}
