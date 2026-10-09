import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneSubtitleTiming, TimedWord, getActiveSubtitleAtFrame } from "../../utils/subtitleTiming";
import { ThemePalette, AspectRatio } from "../../types";

export type SubtitleStyle = "karaoke-bounce" | "clean-pill" | "cyber-glow" | "minimal";
export type SubtitlePosition = "bottom" | "middle";

export interface KineticCaptionsProps {
  timing: SceneSubtitleTiming;
  sceneFrame?: number; // If provided, uses relative scene frame; otherwise uses useCurrentFrame()
  style?: SubtitleStyle;
  position?: SubtitlePosition;
  aspectRatio?: AspectRatio;
  themePalette?: ThemePalette;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  timing,
  sceneFrame,
  style = "karaoke-bounce",
  position = "bottom",
  aspectRatio = "16:9",
  themePalette,
}) => {
  const currentVideoFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Use explicit scene relative frame if provided, otherwise composition frame
  const frame = sceneFrame !== undefined ? sceneFrame : currentVideoFrame;

  const { activePhrase, activeWord } = getActiveSubtitleAtFrame(timing, frame);

  if (!activePhrase || !activePhrase.words || activePhrase.words.length === 0) {
    return null;
  }

  // Palette tokens with harmonious fallbacks
  const primaryColor = themePalette?.primary || "#6366f1";
  const accentColor = themePalette?.accent || "#38bdf8";
  const textColor = themePalette?.text || "#ffffff";

  // Aspect-ratio safe area container styles
  const getContainerPosition = (): React.CSSProperties => {
    if (position === "middle") {
      return {
        top: "50%",
        transform: "translate(-50%, -50%)",
        left: "50%",
      };
    }

    // Bottom safe zone positioning
    switch (aspectRatio) {
      case "9:16":
        // Elevate above TikTok/Reels user action & description zone
        return {
          bottom: "160px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
        };
      case "1:1":
        return {
          bottom: "54px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "88%",
        };
      case "16:9":
      default:
        return {
          bottom: "64px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
        };
    }
  };

  // Base font size scaling by aspect ratio
  const getFontSize = (): string => {
    switch (aspectRatio) {
      case "9:16":
        return "28px";
      case "1:1":
        return "26px";
      case "16:9":
      default:
        return "32px";
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        ...getContainerPosition(),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        pointerEvents: "none",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: style === "clean-pill" ? "8px" : "10px",
          padding:
            style === "clean-pill"
              ? "10px 24px"
              : style === "cyber-glow"
              ? "8px 20px"
              : "6px 14px",
          borderRadius: style === "clean-pill" ? "9999px" : "12px",
          background:
            style === "clean-pill"
              ? "rgba(10, 14, 26, 0.78)"
              : style === "cyber-glow"
              ? "rgba(6, 9, 18, 0.65)"
              : "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:
            style === "clean-pill"
              ? "1px solid rgba(255, 255, 255, 0.14)"
              : style === "cyber-glow"
              ? `1px solid ${accentColor}55`
              : "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow:
            style === "cyber-glow"
              ? `0 0 25px ${accentColor}33, 0 10px 30px rgba(0,0,0,0.5)`
              : "0 12px 35px rgba(0, 0, 0, 0.55)",
          maxWidth: "100%",
        }}
      >
        {activePhrase.words.map((w: TimedWord, idx: number) => {
          const isActive = activeWord?.word === w.word && activeWord?.startFrame === w.startFrame;
          const isPast = frame > w.endFrame;

          // Word entrance / active spring physics
          const wordAgeFrames = Math.max(0, frame - w.startFrame);
          const bounceSpring = spring({
            fps,
            frame: wordAgeFrames,
            config: {
              damping: 11,
              stiffness: 220,
              mass: 0.8,
            },
          });

          // Style rendering rules
          let wordScale = 1.0;
          let wordColor = textColor;
          let textShadow = "0 2px 8px rgba(0,0,0,0.8)";
          let fontWeight: React.CSSProperties["fontWeight"] = "700";
          let extraStyle: React.CSSProperties = {};

          if (style === "karaoke-bounce") {
            fontWeight = "800";
            if (isActive) {
              wordScale = 1.0 + 0.22 * bounceSpring;
              wordColor = accentColor;
              textShadow = `0 0 20px ${accentColor}99, 0 4px 12px rgba(0,0,0,0.95)`;
              extraStyle = {
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              };
            } else if (isPast) {
              wordColor = "rgba(255, 255, 255, 0.85)";
            } else {
              wordColor = "rgba(255, 255, 255, 0.45)";
            }
          } else if (style === "clean-pill") {
            fontWeight = isActive ? "800" : "600";
            if (isActive) {
              wordScale = 1.0 + 0.1 * bounceSpring;
              wordColor = primaryColor;
              extraStyle = {
                background: `${primaryColor}22`,
                padding: "2px 8px",
                borderRadius: "6px",
              };
            } else {
              wordColor = isPast ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)";
            }
          } else if (style === "cyber-glow") {
            fontWeight = "800";
            if (isActive) {
              wordScale = 1.0 + 0.15 * bounceSpring;
              wordColor = "#38bdf8";
              textShadow = `0 0 10px #38bdf8, 0 0 22px ${primaryColor}, 0 2px 4px rgba(0,0,0,0.9)`;
            } else {
              wordColor = isPast ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)";
            }
          } else {
            // minimal
            fontWeight = isActive ? "800" : "500";
            if (isActive) {
              wordColor = accentColor;
              wordScale = 1.0 + 0.05 * bounceSpring;
            } else {
              wordColor = isPast ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)";
            }
          }

          return (
            <span
              key={`${w.word}-${w.startFrame}-${idx}`}
              style={{
                display: "inline-block",
                transform: `scale(${wordScale})`,
                color: wordColor,
                fontWeight,
                fontSize: getFontSize(),
                lineHeight: 1.25,
                textShadow,
                transition: "color 0.1s ease, transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)",
                letterSpacing: "-0.3px",
                ...extraStyle,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
