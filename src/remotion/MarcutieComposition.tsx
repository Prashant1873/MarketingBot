import { Sequence } from "remotion";
import { RemotionCompositionProps, secondsToFrames } from "./types";
import { HookScene, ProductRevealScene, HighlightScene, OutroScene } from "./scenes";
import { MarcutieAudioMixer } from "./audio/MarcutieAudioMixer";

export function MarcutieComposition({
  storyboard,
  audioConfig,
  fps = 30,
}: RemotionCompositionProps) {
  const {
    scenes,
    aspectRatio,
    tone,
    imageUrl,
    targetDuration,
    deviceFrame,
    themePalette,
    featureMockup,
  } = storyboard;

  // Calculate cumulative start frames for exact sequential alignment
  let currentStartFrame = 0;
  const sequencedScenes = (scenes || []).map((scene) => {
    const durationInFrames = secondsToFrames(scene.duration, fps);
    const from = currentStartFrame;
    currentStartFrame += durationInFrames;
    return {
      scene,
      from,
      durationInFrames,
    };
  });

  const totalDurationFrames = secondsToFrames(targetDuration, fps);

  // Resolve background music URL from audioConfig or storyboard audio direction
  const selectedTrackId =
    audioConfig?.selectedMusicTrack ||
    storyboard.audioDirection?.trackRecommendation?.replace(/\.wav$/i, "") ||
    "pulse-launch-theme";

  const musicUrl = selectedTrackId.startsWith("/")
    ? selectedTrackId
    : `/assets/music/${selectedTrackId.endsWith(".wav") ? selectedTrackId : `${selectedTrackId}.wav`}`;

  return (
    <>
      {/* Motion Audio Timeline Mixer (BGM and synchronized SFX hits) */}
      <MarcutieAudioMixer
        musicUrl={musicUrl}
        musicVolume={audioConfig?.musicVolume ?? 0.8}
        sfxVolume={audioConfig?.sfxVolume ?? 0.9}
        isMuted={audioConfig?.isMuted ?? false}
        scenes={scenes || []}
        totalDurationFrames={totalDurationFrames}
      />

      {/* Visual Scene Sequence */}
      {sequencedScenes.map(({ scene, from, durationInFrames }) => {
        return (
          <Sequence
            key={scene.id || `${scene.type}-${from}`}
            from={from}
            durationInFrames={durationInFrames}
          >
            {(() => {
              switch (scene.type) {
                case "hook":
                  return (
                    <HookScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
                case "product_reveal":
                  return (
                    <ProductRevealScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      imageUrl={imageUrl}
                      durationInFrames={durationInFrames}
                      deviceFrame={scene.deviceFrame || deviceFrame}
                      themePalette={scene.themePalette || themePalette}
                      featureMockup={scene.featureMockup || featureMockup}
                    />
                  );
                case "highlight_beats":
                  return (
                    <HighlightScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
                case "outro":
                  return (
                    <OutroScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
                default:
                  return (
                    <HookScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                    />
                  );
              }
            })()}
          </Sequence>
        );
      })}
    </>
  );
}
