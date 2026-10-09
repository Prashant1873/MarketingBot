import { Audio, Sequence, interpolate } from "remotion";
import { AudioMixerProps, secondsToFrames, resolveAssetUrl } from "../types";

export function MarcutieAudioMixer({
  musicUrl,
  musicVolume = 0.8,
  sfxVolume = 0.9,
  voiceoverUrl,
  voiceoverVolume = 1.0,
  isMuted = false,
  scenes,
  totalDurationFrames,
  serverUrl,
}: AudioMixerProps) {
  // Volume interpolation curve for background music (fade-in, ducking during voiceover, fade-out)
  const getMusicVolume = (frame: number): number => {
    if (isMuted) return 0;

    // Duck background music volume during voiceover narration
    const targetVolume = voiceoverUrl ? musicVolume * 0.25 : musicVolume;

    // Fade-in across first 15 frames
    if (frame < 15) {
      return interpolate(frame, [0, 15], [0, targetVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    // Fade-out across last 30 frames
    if (frame > totalDurationFrames - 30) {
      return interpolate(
        frame,
        [totalDurationFrames - 30, totalDurationFrames],
        [targetVolume, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
    }

    return targetVolume;
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
          src: resolveAssetUrl("/assets/sfx/impact/heavy_slam.wav", serverUrl),
          key: `hook-slam-${sIdx}`,
        });
        break;

      case "product_reveal":
        // Whoosh riser as device enters
        sfxEvents.push({
          from: sceneStart,
          duration: 15,
          src: resolveAssetUrl("/assets/sfx/interface/whoosh.wav", serverUrl),
          key: `reveal-whoosh-${sIdx}`,
        });
        // Soft pop as card locks into 3D view
        sfxEvents.push({
          from: sceneStart + 4,
          duration: 12,
          src: resolveAssetUrl("/assets/sfx/ui/pop.wav", serverUrl),
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
            src: resolveAssetUrl("/assets/sfx/ui/pop.wav", serverUrl),
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
          src: resolveAssetUrl("/assets/sfx/impact/heavy_slam.wav", serverUrl),
          key: `outro-slam-${sIdx}`,
        });
        // Snappy click as CTA button pops
        sfxEvents.push({
          from: sceneStart + 8,
          duration: 10,
          src: resolveAssetUrl("/assets/sfx/ui/click.wav", serverUrl),
          key: `outro-click-${sIdx}`,
        });
        break;

      default:
        break;
    }
  });

  const resolvedMusicUrl = resolveAssetUrl(musicUrl, serverUrl);
  const resolvedVoiceoverUrl = resolveAssetUrl(voiceoverUrl, serverUrl);

  return (
    <>
      {/* Background Music Bed */}
      {resolvedMusicUrl && (
        <Audio
          src={resolvedMusicUrl}
          volume={getMusicVolume}
          loop
          onError={(err) => {
            console.warn("[AudioMixer] Background music non-fatal load warning:", err);
          }}
        />
      )}

      {/* Voiceover Narration Track */}
      {resolvedVoiceoverUrl && !isMuted && (
        <Audio
          src={resolvedVoiceoverUrl}
          volume={voiceoverVolume}
          onError={(err) => {
            console.warn("[AudioMixer] Voiceover non-fatal load warning:", err);
          }}
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
            <Audio
              src={evt.src}
              volume={effectiveSfxVolume}
              onError={(err) => {
                console.warn(`[AudioMixer] SFX '${evt.key}' non-fatal load warning:`, err);
              }}
            />
          </Sequence>
        ))}
    </>
  );
}
