import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Film, Sparkles, Monitor, Smartphone, Square, Music, ChevronDown, ChevronUp } from "lucide-react";
import { MarcutieComposition } from "../remotion/MarcutieComposition";
import { AspectRatioDimensions, secondsToFrames } from "../remotion/types";
import { Storyboard, AspectRatio, AudioConfig } from "../types";
import { AudioControls } from "./AudioControls";

export interface VideoPlayerPreviewHandle {
  seekToFrame: (frame: number) => void;
  play: () => void;
  pause: () => void;
}

interface VideoPlayerPreviewProps {
  storyboard: Storyboard;
  audioConfig?: AudioConfig;
  onAudioConfigChange?: (config: AudioConfig) => void;
  onAspectRatioChange?: (ratio: AspectRatio) => void;
  onProceedToExport?: () => void;
  onUpdateStoryboard?: (updated: Storyboard) => void;
}

export const VideoPlayerPreview = forwardRef<VideoPlayerPreviewHandle, VideoPlayerPreviewProps>(
  (
    {
      storyboard,
      audioConfig = {
        selectedMusicTrack: "happy-beats-vol-1",
        musicVolume: 0.8,
        sfxVolume: 0.9,
        isMuted: false,
      },
      onAudioConfigChange,
      onAspectRatioChange,
      onProceedToExport,
      onUpdateStoryboard,
    },
    ref
  ) => {
    const internalPlayerRef = useRef<PlayerRef>(null);
    const [isAudioDrawerOpen, setIsAudioDrawerOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      seekToFrame: (frame: number) => {
        internalPlayerRef.current?.seekTo(frame);
      },
      play: () => {
        internalPlayerRef.current?.play();
      },
      pause: () => {
        internalPlayerRef.current?.pause();
      },
    }));

    const dimensions = AspectRatioDimensions[storyboard.aspectRatio] || AspectRatioDimensions["16:9"];
    const durationInFrames = secondsToFrames(storyboard.targetDuration, 30);

    // Responsive player dimensions on screen
    const getContainerStyles = (): React.CSSProperties => {
      switch (storyboard.aspectRatio) {
        case "9:16":
          return { maxWidth: "380px", aspectRatio: "9 / 16" };
        case "1:1":
          return { maxWidth: "560px", aspectRatio: "1 / 1" };
        case "16:9":
        default:
          return { maxWidth: "860px", aspectRatio: "16 / 9" };
      }
    };

    const handleSeekToSceneIndex = (idx: number) => {
      let frameOffset = 0;
      for (let i = 0; i < idx && i < storyboard.scenes.length; i++) {
        frameOffset += secondsToFrames(storyboard.scenes[i].duration, 30);
      }
      internalPlayerRef.current?.seekTo(frameOffset);
    };

    return (
      <div
        className="glass-panel"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          border: "1px solid var(--border-highlight)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15)",
        }}
      >
        {/* Player Header Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Film size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>Live Motion Graphic Preview</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                {storyboard.targetDuration}s runtime • {durationInFrames} frames @ 30fps
              </div>
            </div>
          </div>

          {/* Quick Canvas & Audio Toggles */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Audio Drawer Button */}
            {onAudioConfigChange && (
              <button
                onClick={() => setIsAudioDrawerOpen(!isAudioDrawerOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  background: isAudioDrawerOpen ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: isAudioDrawerOpen ? "var(--accent-secondary)" : "var(--text-primary)",
                }}
              >
                <Music size={13} />
                <span>Audio Design</span>
                {isAudioDrawerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}

            {/* Aspect Ratio Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {(
                [
                  { id: "16:9", icon: <Monitor size={12} />, label: "16:9" },
                  { id: "9:16", icon: <Smartphone size={12} />, label: "9:16" },
                  { id: "1:1", icon: <Square size={12} />, label: "1:1" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onAspectRatioChange?.(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    background:
                      storyboard.aspectRatio === opt.id
                        ? "var(--accent-primary)"
                        : "rgba(255, 255, 255, 0.05)",
                    color: storyboard.aspectRatio === opt.id ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {onProceedToExport && (
              <button
                onClick={onProceedToExport}
                className="btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Sparkles size={12} />
                <span>Export MP4</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Audio Settings Panel */}
        {isAudioDrawerOpen && onAudioConfigChange && (
          <AudioControls
            audioConfig={audioConfig}
            onAudioConfigChange={onAudioConfigChange}
            storyboardTone={storyboard.tone}
            storyboard={storyboard}
            onUpdateStoryboard={onUpdateStoryboard}
          />
        )}

        {/* Video Player Display Screen */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.75)",
            borderRadius: "var(--radius-lg)",
            padding: "16px",
            border: "1px solid var(--border-color)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              ...getContainerStyles(),
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
              background: "#070a13",
            }}
          >
            <Player
              ref={internalPlayerRef}
              component={MarcutieComposition}
              inputProps={{ storyboard, audioConfig }}
              durationInFrames={durationInFrames}
              fps={30}
              compositionWidth={dimensions.width}
              compositionHeight={dimensions.height}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls
              autoPlay={false}
              loop
            />
          </div>
        </div>

        {/* Quick Jump Timeline Ribbon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Quick Jump:</span>
            {storyboard.scenes.map((scene, idx) => (
              <button
                key={scene.id || idx}
                onClick={() => handleSeekToSceneIndex(idx)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
                title={`Seek to Scene ${idx + 1}`}
              >
                Act {idx + 1}: {scene.type.replace("_", " ")}
              </button>
            ))}
          </div>

          {onProceedToExport && (
            <button
              onClick={onProceedToExport}
              className="btn-primary"
              style={{ fontSize: "12px", padding: "6px 14px" }}
            >
              <Sparkles size={13} /> Export Local MP4 Video
            </button>
          )}
        </div>
      </div>
    );
  }
);
