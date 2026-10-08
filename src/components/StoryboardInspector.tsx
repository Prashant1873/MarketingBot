import { useState } from "react";
import {
  Sparkles,
  Zap,
  Eye,
  Layers,
  Rocket,
  Clock,
  Copy,
  Check,
  Music,
  Share2,
  Film,
  RotateCcw,
  CheckCircle2,
  Info,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Storyboard, StoryboardScene } from "../types";

interface StoryboardInspectorProps {
  storyboard: Storyboard;
  providerUsed: string;
  isMock: boolean;
  onUpdateStoryboard: (updated: Storyboard) => void;
  onRegenerate: () => void;
  onProceedToPreview?: () => void;
  onSeekToScene?: (sceneIndex: number) => void;
}

export function StoryboardInspector({
  storyboard,
  providerUsed,
  isMock,
  onUpdateStoryboard,
  onRegenerate,
  onProceedToPreview,
  onSeekToScene,
}: StoryboardInspectorProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeShareTab, setActiveShareTab] = useState<"twitter" | "linkedin" | "discord">("twitter");

  // Calculate current total scene duration
  const currentTotalDuration = storyboard.scenes.reduce(
    (acc, scene) => acc + (Number(scene.duration) || 0),
    0
  );

  const isTimingBalanced = Math.abs(currentTotalDuration - storyboard.targetDuration) < 0.1;

  const handleSceneChange = (index: number, updates: Partial<StoryboardScene>) => {
    const nextScenes = [...storyboard.scenes];
    nextScenes[index] = { ...nextScenes[index], ...updates };
    onUpdateStoryboard({
      ...storyboard,
      scenes: nextScenes,
    });
  };

  const handleCopyText = async (text: string, tabKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // Fallback
      setCopiedTab(null);
    }
  };

  const getSceneIcon = (type: string) => {
    switch (type) {
      case "hook":
        return <Zap size={16} color="#f59e0b" />;
      case "product_reveal":
        return <Eye size={16} color="#6366f1" />;
      case "highlight_beats":
        return <Layers size={16} color="#06b6d4" />;
      case "outro":
        return <Rocket size={16} color="#10b981" />;
      default:
        return <Film size={16} color="#a855f7" />;
    }
  };

  const getSceneBadgeColor = (type: string) => {
    switch (type) {
      case "hook":
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      case "product_reveal":
        return { bg: "rgba(99, 102, 241, 0.15)", text: "#818cf8", border: "rgba(99, 102, 241, 0.3)" };
      case "highlight_beats":
        return { bg: "rgba(6, 182, 212, 0.15)", text: "#22d3ee", border: "rgba(6, 182, 212, 0.3)" };
      case "outro":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)" };
      default:
        return { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "rgba(168, 85, 247, 0.3)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Overview & Metadata Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          border: "1px solid var(--border-highlight)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                background: "rgba(99, 102, 241, 0.2)",
                color: "var(--accent-primary)",
              }}
            >
              <Sparkles size={12} /> Generated Storyboard
            </span>
            <span
              style={{
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "4px",
                background: isMock ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                color: isMock ? "#f59e0b" : "#10b981",
                fontWeight: "600",
              }}
            >
              {isMock ? "⚡ Local Mock Storyboard" : `Engine: ${providerUsed}`}
            </span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            {storyboard.title}
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            {storyboard.tagline}
          </p>
        </div>

        {/* Action Controls & Device Framing */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Adaptive Device Framing Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "4px",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: "600",
                textTransform: "uppercase",
                padding: "0 6px",
              }}
            >
              Frame
            </span>
            <button
              type="button"
              onClick={() => {
                const updated: Storyboard = {
                  ...storyboard,
                  deviceFrame: "macos",
                  scenes: storyboard.scenes.map((s) =>
                    s.type === "product_reveal" ? { ...s, deviceFrame: "macos" } : s
                  ),
                };
                onUpdateStoryboard(updated);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                background:
                  (storyboard.deviceFrame || "macos") === "macos"
                    ? "rgba(99, 102, 241, 0.25)"
                    : "transparent",
                color:
                  (storyboard.deviceFrame || "macos") === "macos"
                    ? "#818cf8"
                    : "var(--text-secondary)",
                boxShadow:
                  (storyboard.deviceFrame || "macos") === "macos"
                    ? "0 0 0 1px rgba(99, 102, 241, 0.4)"
                    : "none",
                transition: "all 0.15s ease",
              }}
              title="macOS Chrome Landscape Browser Window"
            >
              <Monitor size={13} /> macOS Chrome
            </button>
            <button
              type="button"
              onClick={() => {
                const updated: Storyboard = {
                  ...storyboard,
                  deviceFrame: "mobile",
                  scenes: storyboard.scenes.map((s) =>
                    s.type === "product_reveal" ? { ...s, deviceFrame: "mobile" } : s
                  ),
                };
                onUpdateStoryboard(updated);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                background:
                  storyboard.deviceFrame === "mobile"
                    ? "rgba(99, 102, 241, 0.25)"
                    : "transparent",
                color:
                  storyboard.deviceFrame === "mobile"
                    ? "#818cf8"
                    : "var(--text-secondary)",
                boxShadow:
                  storyboard.deviceFrame === "mobile"
                    ? "0 0 0 1px rgba(99, 102, 241, 0.4)"
                    : "none",
                transition: "all 0.15s ease",
              }}
              title="Mobile Phone Portrait Frame with Dynamic Island"
            >
              <Smartphone size={13} /> Mobile Phone
            </button>
          </div>

          <button
            onClick={onRegenerate}
            className="btn-secondary"
            style={{ fontSize: "13px", padding: "8px 16px" }}
            title="Re-run AI engine with current input parameters"
          >
            <RotateCcw size={14} /> Re-generate
          </button>

          {onProceedToPreview && (
            <button
              onClick={onProceedToPreview}
              className="btn-primary"
              style={{ fontSize: "13px", padding: "8px 18px" }}
            >
              <Film size={14} /> Preview Live Video
            </button>
          )}
        </div>
      </div>

      {/* Timing & Timeline Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderRadius: "var(--radius-md)",
          background: "rgba(13, 19, 34, 0.7)",
          border: `1px solid ${isTimingBalanced ? "var(--border-color)" : "rgba(239, 68, 68, 0.4)"}`,
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
            <Clock size={14} />
            <span>Target Duration: <strong>{storyboard.targetDuration}s</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Current Total:</span>
            <strong style={{ color: isTimingBalanced ? "var(--success)" : "var(--error)" }}>
              {currentTotalDuration.toFixed(1)}s
            </strong>
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            Format: <strong style={{ color: "var(--text-primary)" }}>{storyboard.aspectRatio}</strong>
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            Tone: <strong style={{ color: "var(--text-primary)" }}>{storyboard.tone}</strong>
          </div>
        </div>

        <div>
          {isTimingBalanced ? (
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={13} /> Timing Perfectly Balanced
            </span>
          ) : (
            <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Info size={13} /> Scene durations sum to {currentTotalDuration.toFixed(1)}s (target is {storyboard.targetDuration}s)
            </span>
          )}
        </div>
      </div>

      {/* Visual Scene Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {storyboard.scenes.map((scene, idx) => {
          const badgeStyle = getSceneBadgeColor(scene.type);
          return (
            <div
              key={scene.id || idx}
              className="glass-panel"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                position: "relative",
                border: "1px solid var(--border-color)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              {/* Scene Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      background: badgeStyle.bg,
                      color: badgeStyle.text,
                      border: `1px solid ${badgeStyle.border}`,
                    }}
                  >
                    {getSceneIcon(scene.type)}
                    <span>Scene {idx + 1}: {scene.type.replace("_", " ")}</span>
                  </div>

                  {onSeekToScene && (
                    <button
                      onClick={() => onSeekToScene(idx)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        color: "var(--text-secondary)",
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                      title={`Jump player to Scene ${idx + 1}`}
                    >
                      <span>▶</span>
                      <span>Seek</span>
                    </button>
                  )}
                </div>

                {/* Duration Editor */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Duration:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={scene.duration}
                    onChange={(e) =>
                      handleSceneChange(idx, { duration: parseFloat(e.target.value) || 1 })
                    }
                    style={{
                      width: "56px",
                      padding: "4px 6px",
                      background: "rgba(0, 0, 0, 0.4)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>s</span>
                </div>
              </div>

              {/* Editable Headline */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Headline Copy
                </label>
                <textarea
                  rows={2}
                  value={scene.headline}
                  onChange={(e) => handleSceneChange(idx, { headline: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: "600",
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </div>

              {/* Editable Subtext / CTA */}
              {scene.subtext !== undefined && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Subtext / Supporting Line
                  </label>
                  <input
                    type="text"
                    value={scene.subtext}
                    onChange={(e) => handleSceneChange(idx, { subtext: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--text-secondary)",
                      fontSize: "12px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}

              {scene.cta !== undefined && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Call To Action
                  </label>
                  <input
                    type="text"
                    value={scene.cta}
                    onChange={(e) => handleSceneChange(idx, { cta: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "6px",
                      color: "#34d399",
                      fontSize: "12px",
                      fontWeight: "700",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}

              {/* Beats tags if highlight scene */}
              {Array.isArray(scene.beats) && scene.beats.length > 0 && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                    Feature Highlights
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {scene.beats.map((beat, bIdx) => (
                      <input
                        key={bIdx}
                        type="text"
                        value={beat}
                        onChange={(e) => {
                          const nextBeats = [...(scene.beats || [])];
                          nextBeats[bIdx] = e.target.value;
                          handleSceneChange(idx, { beats: nextBeats });
                        }}
                        style={{
                          width: "100%",
                          padding: "4px 8px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "4px",
                          fontSize: "11px",
                          color: "var(--text-primary)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Treatment Badge */}
              <div
                style={{
                  marginTop: "auto",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Motion: </span>
                  <span>{scene.visualEmphasis || "Kinetic punch"}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Cut: </span>
                  <span>{scene.transition || "Impact cut"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audio Direction & Social Share Copy Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Audio Direction Card */}
        <div className="glass-panel" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Music size={16} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Soundtrack & Audio Mood</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>Mood & Tempo</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {storyboard.audioDirection?.musicMood || "High-tempo electronic beat"}
              </span>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>Track Recommendation</span>
              <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                {storyboard.audioDirection?.trackRecommendation || "Punchy phonk bassline with crisp hi-hats"}
              </span>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>SFX Audio Cues</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {storyboard.audioDirection?.sfxCues?.map((cue, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(168, 85, 247, 0.12)",
                      color: "var(--accent-secondary)",
                      fontSize: "11px",
                    }}
                  >
                    🔊 {cue}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Share Copy Card */}
        <div className="glass-panel" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Share2 size={16} color="var(--accent-primary)" />
              <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Social Launch Copy</h3>
            </div>

            {/* Social Platform Tabs */}
            <div style={{ display: "flex", gap: "4px", background: "rgba(0, 0, 0, 0.3)", padding: "2px", borderRadius: "6px" }}>
              {(["twitter", "linkedin", "discord"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveShareTab(tab)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    background: activeShareTab === tab ? "var(--accent-primary)" : "transparent",
                    color: activeShareTab === tab ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {tab === "twitter" ? "X / Twitter" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Social Copy Textarea & Copy Button */}
          {(() => {
            const currentText = storyboard.shareCopy?.[activeShareTab] || "";
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  rows={4}
                  value={currentText}
                  onChange={(e) => {
                    onUpdateStoryboard({
                      ...storyboard,
                      shareCopy: {
                        ...storyboard.shareCopy,
                        [activeShareTab]: e.target.value,
                      },
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    resize: "none",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {currentText.length} characters
                  </span>
                  <button
                    onClick={() => handleCopyText(currentText, activeShareTab)}
                    className="btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 10px" }}
                  >
                    {copiedTab === activeShareTab ? (
                      <>
                        <Check size={12} color="var(--success)" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
