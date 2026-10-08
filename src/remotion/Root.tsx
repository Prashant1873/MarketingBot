import React from 'react';
import { Composition } from 'remotion';
import { MarcutieComposition } from './MarcutieComposition';
import { Storyboard } from '../types';

export const fallbackStoryboard: Storyboard = {
  title: 'Marcutie Launch',
  tagline: 'AI Marketing Video Generator',
  tone: 'polished',
  aspectRatio: '16:9',
  targetDuration: 15,
  scenes: [
    {
      id: 'scene-1',
      type: 'hook',
      duration: 2.5,
      headline: 'Launch Products 10x Faster',
      subtext: 'Zero video editing skills required.',
    },
    {
      id: 'scene-2',
      type: 'product_reveal',
      duration: 4.5,
      headline: 'Meet Your New Secret Weapon',
      subtext: 'Automated video generation',
    },
    {
      id: 'scene-3',
      type: 'highlight_beats',
      duration: 4.5,
      headline: 'Built For High Performance',
      beats: ['Local Rendering', 'Zero Cloud Costs', 'Instant Preview'],
    },
    {
      id: 'scene-4',
      type: 'outro',
      duration: 3.5,
      headline: 'Start Generating Today',
      subtext: 'Open source & local-first',
      cta: 'Get Started Free',
    },
  ],
  audioDirection: {
    musicMood: 'Driving Tech Pulse',
    trackRecommendation: 'pulse-launch-theme',
    sfxCues: ['heavy_slam', 'whoosh', 'pop', 'click'],
  },
  shareCopy: {
    twitter: 'Check out Marcutie!',
    linkedin: 'Excited to announce Marcutie.',
    discord: 'Hey everyone, check out Marcutie!',
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Marcutie"
        component={MarcutieComposition as any}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          storyboard: fallbackStoryboard,
        }}
        calculateMetadata={({ props }) => {
          const sb = props.storyboard || fallbackStoryboard;
          const ratio = sb.aspectRatio || '16:9';
          let width = 1920;
          let height = 1080;
          if (ratio === '9:16') {
            width = 1080;
            height = 1920;
          } else if (ratio === '1:1') {
            width = 1080;
            height = 1080;
          }

          const durationFrames = Math.round((sb.targetDuration || 15) * 30);

          return {
            durationInFrames: durationFrames,
            width,
            height,
            fps: 30,
          };
        }}
      />
    </>
  );
};
