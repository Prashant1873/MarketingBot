import { Storyboard, StoryboardScene, AspectRatio, Tone } from "../types";

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

export interface RemotionCompositionProps {
  storyboard: Storyboard;
  fps?: number;
  width?: number;
  height?: number;
}

export interface SceneComponentProps {
  scene: StoryboardScene;
  aspectRatio: AspectRatio;
  tone: Tone;
  imageUrl?: string;
  durationInFrames: number;
}
