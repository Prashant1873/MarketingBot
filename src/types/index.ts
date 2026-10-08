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

export type DeviceFrame = "macos" | "mobile";

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ProjectInput {
  prompt: string;
  imageUrl: string | null;
  imageFilename: string | null;
  imageDimensions?: ImageDimensions | null;
  tone: Tone;
  customTone: string;
  aspectRatio: AspectRatio;
  duration: Duration;
  deviceFrame?: DeviceFrame;
}

export interface TonePreset {
  id: Tone;
  name: string;
  tagline: string;
  iconName: string;
}

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  isDark: boolean;
}

export type FeatureType =
  | "analytics"
  | "kanban"
  | "chat"
  | "feed"
  | "checkout"
  | "settings"
  | "generic";

export interface FeatureMockupItem {
  label: string;
  value?: string;
  badge?: string;
  status?: string;
  color?: string;
}

export interface FeatureMockup {
  featureType: FeatureType;
  title: string;
  subtitle?: string;
  items?: FeatureMockupItem[];
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
  deviceFrame?: DeviceFrame;
  themePalette?: ThemePalette;
  featureMockup?: FeatureMockup;
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
  deviceFrame?: DeviceFrame;
  imageDimensions?: ImageDimensions;
  themePalette?: ThemePalette;
  featureMockup?: FeatureMockup;
  scenes: StoryboardScene[];
  audioDirection: AudioDirection;
  shareCopy: ShareCopy;
}

export interface MusicTrack {
  id: string;
  name: string;
  filename: string;
  url: string;
  bpm: number;
  mood: string;
  tones: string[];
  description?: string;
  available?: boolean;
}

export interface AudioConfig {
  selectedMusicTrack: string;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

