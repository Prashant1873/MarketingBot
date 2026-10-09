import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateSlamEntrance } from "../animations";

export function HighlightScene({ scene, aspectRatio, themePalette }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active theme tokens
  // Active theme tokens
  const palette = scene.themePalette || themePalette;
  const isDark = palette?.isDark !== false;
  const bg = palette?.background || "#070a13";
  const primary = palette?.primary || "#06b6d4";
  const secondary = palette?.secondary || "#6366f1";
  const surface = palette?.surface || (isDark ? "rgba(13, 19, 34, 0.75)" : "rgba(255, 255, 255, 0.9)");
  const textColor = palette?.text || (isDark ? "#ffffff" : "#0f172a");
  const cardBorder = isDark ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(0, 0, 0, 0.08)";
  const cardShadow = isDark
    ? `0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${primary}22`
    : `0 15px 35px rgba(0, 0, 0, 0.08), 0 0 20px ${primary}12`;
  const titleTextShadow = isDark
    ? `0 4px 30px rgba(0, 0, 0, 0.8), 0 0 30px ${primary}35`
    : `0 2px 10px rgba(0, 0, 0, 0.06)`;

  const titleAnim = calculateSlamEntrance(frame, fps, 0);

  const isVertical = aspectRatio === "9:16";
  const isSquare = aspectRatio === "1:1";

  const titleSize = isVertical ? "50px" : isSquare ? "48px" : "62px";
  const paddingX = isVertical ? "60px" : "120px";

  // Use beats or fallback to readable chunks
  const featureBeats =
    Array.isArray(scene.beats) && scene.beats.length > 0
      ? scene.beats
      : [scene.headline, scene.subtext || "Engineered for maximum velocity", "Local-first performance"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        padding: `0 ${paddingX}`,
      }}
    >
      {/* Background ambient light tailored to brand colors */}
      <div
        style={{
          position: "absolute",
          width: "1200px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}35 0%, ${secondary}15 45%, rgba(0, 0, 0, 0) 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Header section */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "1300px",
          marginBottom: isVertical ? "50px" : "48px",
          zIndex: 10,
          transform: `scale(${titleAnim.scale})`,
          opacity: titleAnim.opacity,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 20px",
            borderRadius: "999px",
            background: `${primary}22`,
            border: `1px solid ${primary}55`,
            color: primary,
            fontSize: "15px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}
        >
          <span>🔥</span>
          <span>{scene.visualEmphasis || "KEY ADVANTAGES"}</span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: titleSize,
            fontWeight: "900",
            color: textColor,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            textShadow: titleTextShadow,
          }}
        >
          {scene.headline}
        </h2>
      </div>

      {/* Feature Beats Cards Layout */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: isVertical ? "20px" : "28px",
          width: "100%",
          maxWidth: isVertical ? "880px" : "1400px",
          justifyContent: "center",
          alignItems: "stretch",
          zIndex: 10,
        }}
      >
        {featureBeats.map((beat, idx) => {
          // Staggered entrance for each card (8 frames delay between each)
          const cardAnim = calculateCardSlideUp(frame, fps, 8 + idx * 8);

          return (
            <div
              key={idx}
              style={{
                flex: isVertical ? "none" : 1,
                padding: isVertical ? "24px 32px" : "36px 32px",
                borderRadius: "20px",
                background: surface,
                backdropFilter: "blur(20px)",
                border: cardBorder,
                boxShadow: cardShadow,
                display: "flex",
                flexDirection: isVertical ? "row" : "column",
                alignItems: isVertical ? "center" : "flex-start",
                gap: "18px",
                transform: `translateY(${cardAnim.translateY}px)`,
                opacity: cardAnim.opacity,
              }}
            >
              {/* Badge Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${primary}40 0%, ${secondary}40 100%)`,
                  border: `1px solid ${primary}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: primary,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: isVertical ? "24px" : "22px",
                    fontWeight: "800",
                    color: textColor,
                    lineHeight: 1.3,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {beat}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
