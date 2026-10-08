import { Audio, Sequence, interpolate } from "remotion";
import { AudioMixerProps, secondsToFrames } from "../types";

export function MarcutieAudioMixer({
  musicUrl,
  musicVolume = 0.8,
  sfxVolume = 0.9,
  isMuted = false,
  scenes,
  totalDurationFrames,
}: AudioMixerProps) {
  // Volume interpolation curve for background music (fade-in, constant hold, fade-out)
  const getMusicVolume = (frame: number): number => {
    if (isMuted) return 0;

    // Fade-in across first 15 frames
    if (frame < 15) {
      return interpolate(frame, [0, 15], [0, musicVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    // Fade-out across last 30 frames
    if (frame > totalDurationFrames - 30) {
      return interpolate(
        frame,
        [totalDurationFrames - 30, totalDurationFrames],
        [musicVolume, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
    }

    return musicVolume;
  };

  const effectiveSfxVolume = isMuted ? 0 : sfxVolume;

  // Pre-calculate starting frame offset for each scene to sync SFX triggers
  let currentStartFrame = 0;
  const sfxEvents: Array<{ from: number; duration: number; src: string; key: string }> = [];

  (scenes || []).forEach((scene, sIdx) => {
    const sceneStart = currentStartFrame;
    const sceneFrames = secondsToFrames(scene.duration, 30);
    currentStartFrame += sceneFrames;

    switch (scene.type) {
      case "hook":
        // Heavy impact slam right as title slams down (frame 3)
        sfxEvents.push({
          from: sceneStart + 3,
          duration: 20,
          src: "/assets/sfx/impact/heavy_slam.wav",
          key: `hook-slam-${sIdx}`,
        });
        break;

      case "product_reveal":
        // Whoosh riser as device enters
        sfxEvents.push({
          from: sceneStart,
          duration: 15,
          src: "/assets/sfx/interface/whoosh.wav",
          key: `reveal-whoosh-${sIdx}`,
        });
        // Soft pop as card locks into 3D view
        sfxEvents.push({
          from: sceneStart + 4,
          duration: 12,
          src: "/assets/sfx/ui/pop.wav",
          key: `reveal-pop-${sIdx}`,
        });
        break;

      case "highlight_beats": {
        // Sequential soft pop hits on each feature card arrival (8 + idx * 8)
        const beats = Array.isArray(scene.beats) && scene.beats.length > 0 ? scene.beats : [1, 2, 3];
        beats.forEach((_, bIdx) => {
          sfxEvents.push({
            from: sceneStart + 8 + bIdx * 8,
            duration: 10,
            src: "/assets/sfx/ui/pop.wav",
            key: `highlight-pop-${sIdx}-${bIdx}`,
          });
        });
        break;
      }

      case "outro":
        // Heavy slam on punchline payoff
        sfxEvents.push({
          from: sceneStart,
          duration: 25,
          src: "/assets/sfx/impact/heavy_slam.wav",
          key: `outro-slam-${sIdx}`,
        });
        // Snappy click as CTA button pops
        sfxEvents.push({
          from: sceneStart + 8,
          duration: 10,
          src: "/assets/sfx/ui/click.wav",
          key: `outro-click-${sIdx}`,
        });
        break;

      default:
        break;
    }
  });

  return (
    <>
      {/* Background Music Bed */}
      {musicUrl && (
        <Audio
          src={musicUrl}
          volume={getMusicVolume}
          loop
        />
      )}

      {/* Synchronized Motion Sound Effect Hits */}
      {effectiveSfxVolume > 0 &&
        sfxEvents.map((evt) => (
          <Sequence
            key={evt.key}
            from={evt.from}
            durationInFrames={evt.duration}
          >
            <Audio src={evt.src} volume={effectiveSfxVolume} />
          </Sequence>
        ))}
    </>
  );
}
