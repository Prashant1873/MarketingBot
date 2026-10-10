import React from "react";
import { Loader2, CheckCircle2, Film, Mic, Sparkles, Image as ImageIcon, Rocket, AlertCircle, X, CloudDownload } from "lucide-react";

export type PipelineStage = "storyboard" | "voiceover" | "rendering" | "poster" | "complete" | "error";

interface OneClickProgressModalProps {
  isOpen: boolean;
  currentStage: PipelineStage;
  currentStepMessage: string;
  progressPercent: number;
  errorMessage?: string | null;
  onClose?: () => void;
}

const STAGES: Array<{ id: PipelineStage; label: string; icon: React.ReactNode }> = [
  { id: "storyboard", label: "Marketing Storyboard & Scenes", icon: <Sparkles size={16} /> },
  { id: "voiceover", label: "Kokoro-82M AI Voiceover & Ducking", icon: <Mic size={16} /> },
  { id: "rendering", label: "Remotion Local MP4 Video Render", icon: <Film size={16} /> },
  { id: "poster", label: "Peak Poster Extraction & Frame-0 Bake", icon: <ImageIcon size={16} /> },
  { id: "complete", label: "Delivering Finished Product", icon: <Rocket size={16} /> },
];

export function OneClickProgressModal({
  isOpen,
  currentStage,
  currentStepMessage,
  progressPercent,
  errorMessage,
  onClose,
}: OneClickProgressModalProps) {
  if (!isOpen) return null;

  const stageOrder: PipelineStage[] = ["storyboard", "voiceover", "rendering", "poster", "complete"];
  const currentIdx = stageOrder.indexOf(currentStage);

  const isChromeDownload =
    (currentStepMessage || "").toLowerCase().includes("chrome headless shell") ||
    (currentStepMessage || "").toLowerCase().includes("downloading chrome");

  return (
    <div
      id="one-click-progress-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(5, 8, 15, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        className="modal-content"
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "var(--bg-surface-1)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 28px 64px -12px rgba(0, 0, 0, 0.8)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
              {currentStage === "error" ? "Generation Paused" : "Synthesizing Finished Launch Video"}
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
              Automated multi-stage synthesis pipeline
            </p>
          </div>

          {currentStage === "error" && onClose && (
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{
                minHeight: "36px",
                padding: "6px",
                color: "var(--text-muted)",
              }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dedicated Chrome Headless Shell Download Visual */}
        {isChromeDownload && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              color: "var(--accent-secondary)",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(6, 182, 212, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CloudDownload size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", color: "#ffffff", fontSize: "13px" }}>
                Installing Chrome Headless Shell Engine
              </div>
              <div style={{ fontSize: "11px", color: "#93c5fd", marginTop: "2px" }}>
                One-time local Remotion renderer installation • Zero cloud fees
              </div>
              <div style={{ fontSize: "11px", color: "#38bdf8", fontFamily: "var(--font-mono)", marginTop: "4px", fontWeight: "600" }}>
                {currentStepMessage}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert if applicable */}
        {currentStage === "error" ? (
          <div
            style={{
              padding: "16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              color: "#fca5a5",
              fontSize: "13px",
            }}
          >
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ display: "block", marginBottom: "4px" }}>Execution Error</strong>
              <span>{errorMessage || "An unexpected error occurred during synthesis."}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-Stage Stepper List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {STAGES.map((s, idx) => {
                const isPassed = currentIdx > idx;
                const isCurrent = currentIdx === idx;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      background: isCurrent
                        ? "rgba(99, 102, 241, 0.15)"
                        : isPassed
                        ? "rgba(16, 185, 129, 0.08)"
                        : "rgba(255, 255, 255, 0.02)",
                      border: isCurrent
                        ? "1px solid rgba(99, 102, 241, 0.4)"
                        : isPassed
                        ? "1px solid rgba(16, 185, 129, 0.2)"
                        : "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isCurrent
                          ? "rgba(99, 102, 241, 0.3)"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(255, 255, 255, 0.05)",
                        color: isCurrent
                          ? "var(--accent-primary)"
                          : isPassed
                          ? "var(--success)"
                          : "var(--text-muted)",
                      }}
                    >
                      {isPassed ? (
                        <CheckCircle2 size={16} color="var(--success)" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="animate-spin" color="var(--accent-primary)" />
                      ) : (
                        s.icon
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: isCurrent ? "700" : "500",
                          color: isCurrent ? "#ffffff" : isPassed ? "var(--text-primary)" : "var(--text-muted)",
                        }}
                      >
                        {s.label}
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: "11px", color: "var(--accent-secondary)", marginTop: "2px" }}>
                          {currentStepMessage || "Processing..."}
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent-primary)" }}>
                        {Math.round(progressPercent)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rotating Left-to-Right Animated Progress Bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  height: "10px",
                  borderRadius: "999px",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "2px",
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div
                  className="progress-rotating-bar"
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(5, progressPercent))}%`,
                    borderRadius: "999px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                      display: "inline-block",
                    }}
                  />
                  Live local synthesis engine
                </span>
                <span style={{ fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(progressPercent)}% Completed
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
