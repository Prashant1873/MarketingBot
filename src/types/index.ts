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
