import { Sequence } from "remotion";
import { RemotionCompositionProps, secondsToFrames, resolveAssetUrl } from "./types";
import { HookScene, ProductRevealScene, HighlightScene, OutroScene } from "./scenes";
import { MarcutieAudioMixer } from "./audio/MarcutieAudioMixer";
import { KineticCaptions } from "./captions/KineticCaptions";
import { computeSceneWordTimestamps } from "../utils/subtitleTiming";
import { VisualThemeOverlay } from "./themes/VisualThemeOverlay";

export function MarcutieComposition({
  storyboard,
  audioConfig,
  serverUrl,
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
    subtitlesConfig,
  } = storyboard;

  const effectiveServerUrl = serverUrl || (storyboard as { serverUrl?: string })?.serverUrl;

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
    storyboard.audioDirection?.trackRecommendation ||
    "happy-beats-vol-1";

  const trackMap: Record<string, string> = {
    "happy-beats-vol-1": "/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    "happy-beats-vol-10": "/assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3",
    "happy-beats-vol-9": "/assets/music/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3",
    "happy-beats-vol-11": "/assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3",
    "happy-beats-vol-12": "/assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3",
    "pulse-launch-theme": "/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    "cyber-synth-groove": "/assets/music/cyber-synth-groove.wav",
    "indie-hustle-acoustic": "/assets/music/indie-hustle-acoustic.wav",
    "minimal-dark-sub": "/assets/music/minimal-dark-sub.wav",
  };

  const cleanTrackId = selectedTrackId.replace(/\.(wav|mp3)$/i, "");
  const rawMusicUrl = selectedTrackId.startsWith("/")
    ? selectedTrackId
    : trackMap[selectedTrackId] ||
      trackMap[cleanTrackId] ||
      (selectedTrackId.endsWith(".mp3") || selectedTrackId.endsWith(".wav")
        ? `/assets/music/${selectedTrackId}`
        : `/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`);

  const musicUrl = resolveAssetUrl(rawMusicUrl, effectiveServerUrl);
  const effectiveVoiceoverUrl = resolveAssetUrl(audioConfig?.voiceoverUrl || storyboard.voiceoverUrl, effectiveServerUrl);
  const effectiveImageUrl = resolveAssetUrl(imageUrl, effectiveServerUrl);
  const effectiveScreenMode = storyboard.screenMode || "mockup";

  const globalSubtitlesConfig = subtitlesConfig || {
    enabled: true,
    style: "karaoke-bounce",
    position: "bottom",
  };

  return (
    <>
      {/* Motion Audio Timeline Mixer (BGM, Voiceover narration, and synchronized SFX hits) */}
      <MarcutieAudioMixer
        musicUrl={musicUrl}
        musicVolume={audioConfig?.musicVolume ?? 0.75}
        sfxVolume={audioConfig?.sfxVolume ?? 0.85}
        voiceoverUrl={effectiveVoiceoverUrl}
        voiceoverVolume={audioConfig?.voiceoverVolume ?? 1.0}
        isMuted={audioConfig?.isMuted ?? false}
        scenes={scenes || []}
        totalDurationFrames={totalDurationFrames}
        serverUrl={effectiveServerUrl}
      />

      {/* Visual Scene Sequence */}
      {sequencedScenes.map(({ scene, from, durationInFrames }) => {
        const scenePalette = scene.themePalette || themePalette;
        const sceneSubtitlesConfig = scene.subtitlesConfig || globalSubtitlesConfig;
        const effectiveTheme = scenePalette?.visualTheme || storyboard.visualTheme || "default-dark";

        // Resolve narration text for kinetic captions
        const sceneScript =
          scene.voiceoverScript ||
          (scene.subtext ? `${scene.headline}. ${scene.subtext}` : scene.headline);

        const sceneTiming = sceneScript
          ? computeSceneWordTimestamps(sceneScript, scene.duration, fps)
          : null;

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
                      themePalette={scenePalette}
                    />
                  );
                case "product_reveal":
                  return (
                    <ProductRevealScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      imageUrl={effectiveImageUrl}
                      durationInFrames={durationInFrames}
                      deviceFrame={scene.deviceFrame || deviceFrame}
                      screenMode={scene.screenMode || effectiveScreenMode}
                      themePalette={scenePalette}
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
                      themePalette={scenePalette}
                    />
                  );
                case "outro":
                  return (
                    <OutroScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                      themePalette={scenePalette}
                    />
                  );
                default:
                  return (
                    <HookScene
                      scene={scene}
                      aspectRatio={aspectRatio}
                      tone={tone}
                      durationInFrames={durationInFrames}
                      themePalette={scenePalette}
                    />
                  );
              }
            })()}

            {/* Visual Theme Style Overlay (Scanlines, CRT, Neo-Brutalist Grid, Aurora Glow, Apple Clean) */}
            <VisualThemeOverlay
              theme={effectiveTheme}
              themePalette={scenePalette}
            />

            {/* Kinetic Animated Captions Overlay */}
            {sceneSubtitlesConfig.enabled !== false && sceneTiming && sceneTiming.words.length > 0 && (
              <KineticCaptions
                timing={sceneTiming}
                style={sceneSubtitlesConfig.style || "karaoke-bounce"}
                position={sceneSubtitlesConfig.position || "bottom"}
                aspectRatio={aspectRatio}
                themePalette={scenePalette}
              />
            )}
          </Sequence>
        );
      })}
    </>
  );
}
