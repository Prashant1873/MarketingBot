import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneComponentProps } from "../types";
import { calculateCardSlideUp, calculateSlamEntrance } from "../animations";

export function HighlightScene({ scene, aspectRatio }: SceneComponentProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        backgroundColor: "#070a13",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        padding: `0 ${paddingX}`,
      }}
    >
      {/* Background cyan/indigo ambient light */}
      <div
        style={{
          position: "absolute",
          width: "1200px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(99, 102, 241, 0.1) 40%, rgba(7, 10, 19, 0) 70%)",
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
            background: "rgba(6, 182, 212, 0.15)",
            border: "1px solid rgba(6, 182, 212, 0.35)",
            color: "#22d3ee",
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
            color: "#ffffff",
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.8)",
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
                background: "rgba(13, 19, 34, 0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)",
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
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)",
                  border: "1px solid rgba(6, 182, 212, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "#22d3ee",
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
                    color: "#ffffff",
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
