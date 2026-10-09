import {
  Storyboard,
  StoryboardScene,
  AspectRatio,
  Tone,
  DeviceFrame,
  ScreenMode,
  ThemePalette,
  FeatureMockup,
} from "../types";

export type { DeviceFrame, ScreenMode, ThemePalette, FeatureMockup };

export interface Dimensions {
  width: number;
  height: number;
}

export const AspectRatioDimensions: Record<AspectRatio, Dimensions> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

export function secondsToFrames(seconds: number, fps: number = 30): number {
  return Math.round(Number(seconds || 0) * fps);
}

export function framesToSeconds(frames: number, fps: number = 30): string {
  return (Number(frames || 0) / fps).toFixed(1);
}

export function resolveAssetUrl(url?: string | null, serverUrl?: string): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Headless Remotion Chromium runs on internal port (e.g. 3000), Vite runs on 5173
  const isHeadlessRemotion =
    typeof window !== "undefined" &&
    window.location.port !== "5173" &&
    window.location.protocol.startsWith("http");

  const base =
    serverUrl ||
    (isHeadlessRemotion ? "http://127.0.0.1:3001" : "");

  if (!base) return url;
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

export interface RemotionCompositionProps {
  storyboard: Storyboard;
  audioConfig?: {
    selectedMusicTrack?: string;
    musicVolume?: number;
    sfxVolume?: number;
    isMuted?: boolean;
    voiceoverUrl?: string;
    voiceoverVolume?: number;
    voiceoverEnabled?: boolean;
  };
  serverUrl?: string;
  fps?: number;
  width?: number;
  height?: number;
}

export interface AudioMixerProps {
  musicUrl: string;
  musicVolume?: number;
  sfxVolume?: number;
  isMuted?: boolean;
  voiceoverUrl?: string;
  voiceoverVolume?: number;
  scenes: StoryboardScene[];
  totalDurationFrames: number;
  serverUrl?: string;
}

export interface SceneComponentProps {
  scene: StoryboardScene;
  aspectRatio: AspectRatio;
  tone: Tone;
  imageUrl?: string;
  durationInFrames: number;
  deviceFrame?: DeviceFrame;
  screenMode?: ScreenMode;
  themePalette?: ThemePalette;
  featureMockup?: FeatureMockup;
}


