import React from "react";
import { Monitor, Smartphone, Square, Video } from "lucide-react";
import { AspectRatio, Duration, DeviceFrame, ThemePalette, VisualTheme, ScreenMode, Tone } from "../types";
import { FluidSegmentedControl } from "./FluidSegmentedControl";

interface DirectorViewportStageProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  duration: Duration;
  onDurationChange: (dur: Duration) => void;
  imageUrl: string | null;
  imageFilename: string | null;
  screenMode: ScreenMode;
  deviceFrame?: DeviceFrame;
  onDeviceFrameChange?: (frame: DeviceFrame | undefined) => void;
  themePalette: ThemePalette;
  visualTheme: VisualTheme;
  tone: Tone;
  prompt: string;
}

export const DirectorViewportStage: React.FC<DirectorViewportStageProps> = ({
  aspectRatio,
  onAspectRatioChange,
  duration,
  onDurationChange,
  imageUrl,
  imageFilename,
  screenMode,
  deviceFrame,
  onDeviceFrameChange,
  themePalette,
  visualTheme,
  tone,
  prompt,
}) => {
  // Compute viewport container dimensions based on selected aspect ratio
  const getStageDimensions = () => {
    switch (aspectRatio) {
      case "9:16":
        return { maxWidth: "260px", aspectRatio: "9 / 16" };
      case "1:1":
        return { maxWidth: "340px", aspectRatio: "1 / 1" };
      case "16:9":
      default:
        return { maxWidth: "520px", aspectRatio: "16 / 9" };
    }
  };

  const stageDims = getStageDimensions();

  // Extract a clean display title from the prompt
  const displayTitle = prompt.trim()
    ? prompt.split("\n")[0].slice(0, 38)
    : "Your Next Big Launch";

  return (
    <div
      className="studio-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        background: "var(--bg-surface-1)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Viewport Stage Header with Aspect Ratio & Duration controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingBottom: "14px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video size={14} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
              Live Camera Viewport & Framing
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Interactive pre-render camera preview • 1080p @ 30fps
            </div>
          </div>
        </div>

        {/* Quick Format Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Aspect Ratio Switcher */}
          <FluidSegmentedControl<AspectRatio>
            value={aspectRatio}
            onChange={onAspectRatioChange}
            variant="primary"
            idPrefix="stage-aspect"
            options={[
              { id: "16:9", icon: <Monitor size={12} />, label: "16:9" },
              { id: "9:16", icon: <Smartphone size={12} />, label: "9:16" },
              { id: "1:1", icon: <Square size={12} />, label: "1:1" },
            ]}
            buttonStyle={{ minHeight: "32px", padding: "4px 10px" }}
          />

          {/* Device Frame Switcher */}
          {onDeviceFrameChange && (
            <FluidSegmentedControl<DeviceFrame | undefined>
              value={deviceFrame}
              onChange={onDeviceFrameChange}
              variant="cyan"
              idPrefix="stage-frame"
              options={[
                { id: undefined, label: "Frame: Auto" },
                { id: "macos", label: "Mac" },
                { id: "mobile", label: "Phone" },
              ]}
              buttonStyle={{ minHeight: "32px", padding: "4px 9px" }}
            />
          )}

          {/* Duration Selector */}
          <FluidSegmentedControl<Duration>
            value={duration}
            onChange={onDurationChange}
            variant="default"
            idPrefix="stage-dur"
            options={[
              { id: 15, label: "15s" },
              { id: 20, label: "20s" },
              { id: 25, label: "25s" },
            ]}
            buttonStyle={{ minHeight: "32px", padding: "4px 10px" }}
          />
        </div>
      </div>

      {/* Main Viewport Screen */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "340px",
          background: "radial-gradient(circle at center, #101420 0%, #06080e 100%)",
          borderRadius: "var(--radius-md)",
          padding: "24px 16px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* Subtle grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />

        {/* Viewport Frame with Simulated Device */}
        <div
          style={{
            width: "100%",
            ...stageDims,
            background: themePalette.background || "#080b12",
            borderRadius: aspectRatio === "9:16" ? "24px" : "12px",
            border: `2px solid ${themePalette.primary}50`,
            boxShadow: `0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 0 40px ${themePalette.primary}25`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all var(--dur-normal) var(--ease-settle)",
          }}
        >
          {/* Simulated Window Chrome / Phone Notch */}
          {aspectRatio === "9:16" ? (
            <div
              style={{
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 12px",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "10px",
                  borderRadius: "999px",
                  background: "#000000",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                height: "26px",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0, 0, 0, 0.4)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                zIndex: 2,
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginLeft: "6px", fontFamily: "var(--font-mono)" }}>
                marcutie-preview.mp4
              </span>
            </div>
          )}

          {/* Canvas Content Area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              position: "relative",
              textAlign: "center",
            }}
          >
            {imageUrl && screenMode === "screenshot" ? (
              <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: "8px" }}>
                <img
                  src={imageUrl}
                  alt={imageFilename || "Product visual"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  maxWidth: "85%",
                }}
              >
                <span className="editorial-meta" style={{ fontSize: "10px" }}>
                  <span className="editorial-meta-index">Act 02</span>
                  <span className="editorial-meta-divider">/</span>
                  <span>Product Reveal</span>
                </span>

                <div
                  style={{
                    fontSize: aspectRatio === "9:16" ? "15px" : "17px",
                    fontWeight: "800",
                    color: themePalette.text || "#ffffff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.25,
                  }}
                >
                  {displayTitle}
                </div>

                {/* Simulated UI Card */}
                <div
                  style={{
                    width: "100%",
                    background: themePalette.surface || "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    marginTop: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: "35%", height: "8px", borderRadius: "4px", background: themePalette.secondary || "rgba(255,255,255,0.3)" }} />
                    <div style={{ width: "15%", height: "8px", borderRadius: "4px", background: themePalette.accent || "#10b981" }} />
                  </div>
                  <div style={{ width: "75%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.15)" }} />
                  <div style={{ width: "55%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>
            )}

            {/* Cinematic Camera Motion Guides Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                right: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "9px",
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-mono)",
                padding: "4px 8px",
                background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "4px",
                backdropFilter: "blur(4px)",
              }}
            >
              <span>CAM: 3D TILT 4°</span>
              <span>LIGHT: {visualTheme.toUpperCase()}</span>
              <span>TONE: {tone.toUpperCase()}</span>
              <span>COLOR: {themePalette.primary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Act Storyboard Sequence Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          paddingTop: "6px",
        }}
      >
        {[
          { act: "Act 1", name: "Problem Hook", dur: "2.5s", cue: "Attention Snap" },
          { act: "Act 2", name: "Product Reveal", dur: "6.0s", cue: "3D Camera Pan" },
          { act: "Act 3", name: "Feature Beats", dur: "7.0s", cue: "Speed Typography" },
          { act: "Act 4", name: "Outro & CTA", dur: "4.5s", cue: "Brand Slam" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "8px 10px",
              background: "var(--bg-surface-2)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent-primary)" }}>
                {item.act}
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {item.dur}
              </span>
            </div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-primary)" }}>
              {item.name}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              {item.cue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
