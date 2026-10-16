import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Film,
  Image as ImageIcon,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Share2,
} from "lucide-react";
import { Storyboard } from "../types";
import { getAllShareCopy, FormattedShareCopy } from "../utils/shareCopy";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyboard: Storyboard;
}

type RenderStatus = "idle" | "rendering" | "completed" | "error";

interface RenderJobState {
  id: string;
  status: string;
  progress: number;
  currentStep: string;
  videoUrl?: string;
  posterUrl?: string;
  gifUrl?: string;
  gifFileSize?: number;
  fileSize?: number;
  etaSec?: number;
  etaText?: string;
  error?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, storyboard }) => {
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [jobState, setJobState] = useState<RenderJobState | null>(null);
  const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "discord">("twitter");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const shareCopy: FormattedShareCopy = getAllShareCopy(storyboard);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && renderStatus !== "rendering") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, renderStatus]);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    try {
      setRenderStatus("rendering");
      setJobState({
        id: "",
        status: "queued",
        progress: 5,
        currentStep: "Submitting render job to local server...",
      });

      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyboard,
          options: {},
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to initiate render (HTTP ${res.status})`);
      }

      const data = await res.json();
      const jobId = data.jobId;

      pollJobStatus(jobId);
    } catch (err: unknown) {
      console.error("Render initiation error:", err);
      setRenderStatus("error");
      setJobState((prev) => ({
        id: prev?.id || "",
        status: "error",
        progress: 0,
        currentStep: "Render initiation failed",
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  };

  const pollJobStatus = (jobId: string) => {
    let failureCount = 0;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/render/${jobId}/status`);
        if (!res.ok) {
          failureCount++;
          if (failureCount >= 4) {
            clearInterval(interval);
            setRenderStatus("error");
            setJobState((prev) => ({
              ...(prev || { id: jobId, progress: 0, currentStep: "" }),
              status: "error",
              error: "Render job lost due to server restart. Please try again.",
            }));
          }
          return;
        }
        failureCount = 0;

        const data = await res.json();
        const job: RenderJobState = data.job;

        setJobState(job);

        if (job.status === "completed") {
          clearInterval(interval);
          setRenderStatus("completed");
        } else if (job.status === "error") {
          clearInterval(interval);
          setRenderStatus("error");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 600);
  };

  const handleCopy = (text: string, tabKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabKey);
    setTimeout(() => {
      setCopiedTab(null);
    }, 2000);
  };

  const resolutionMap = {
    "16:9": "1920 × 1080 (Landscape)",
    "9:16": "1080 × 1920 (Vertical)",
    "1:1": "1080 × 1080 (Square)",
  };

  return (
    <div className="modal-backdrop" onClick={renderStatus !== "rendering" ? onClose : undefined}>
      <div
        className="modal-content animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "740px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-medium)",
            background: "var(--bg-surface-1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)",
              }}
            >
              <Film size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                Export & Delivery Studio
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                100% Local 1080p MP4 Render with Frame-0 Poster Baking
              </p>
            </div>
          </div>
          {renderStatus !== "rendering" && (
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: "8px", minHeight: "36px", color: "var(--text-secondary)" }}
              aria-label="Close export modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Pre-render State */}
          {renderStatus === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-medium)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                    Video Specifications
                  </span>
                  <span
                    className="studio-badge"
                    style={{
                      background: "rgba(99, 102, 241, 0.15)",
                      color: "var(--accent-primary)",
                      fontWeight: "700",
                    }}
                  >
                    H.264 / AAC 30 FPS
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-surface-1)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Resolution</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", display: "block" }}>
                      {resolutionMap[storyboard.aspectRatio] || "1920 × 1080"}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-surface-1)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Duration</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", display: "block" }}>
                      {storyboard.targetDuration || 15} Seconds
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-surface-1)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Soundtrack</span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        marginTop: "4px",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {storyboard.audioDirection?.trackRecommendation || "Tech Pulse"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Poster Frame Notice */}
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <Sparkles size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  <strong style={{ color: "var(--text-primary)", fontWeight: "700" }}>Frame-0 Poster Baking Active: </strong>
                  Marcutie automatically extracts a high-resolution settled poster frame at the product reveal moment and bakes it into frame 0 of the exported MP4 so Twitter/X, Discord, and LinkedIn display it as the cover thumbnail.
                </div>
              </div>

              {/* Start Render Button */}
              <button
                id="start-export-render-btn"
                type="button"
                onClick={handleStartRender}
                className="btn-primary"
                style={{
                  width: "100%",
                  minHeight: "48px",
                  fontSize: "14px",
                  borderRadius: "var(--radius-md)",
                  gap: "8px",
                }}
              >
                <Sparkles size={16} />
                <span>Start Local Render</span>
              </button>
            </div>
          )}

          {/* Rendering Progress State */}
          {renderStatus === "rendering" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "28px 12px", textAlign: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "2px solid var(--accent-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  className="radar-spinner"
                  style={{
                    position: "absolute",
                    inset: "-6px",
                    borderRadius: "50%",
                    border: "3px solid transparent",
                    borderTopColor: "var(--accent-secondary)",
                  }}
                />
                <Film size={28} color="var(--accent-primary)" />
              </div>

              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px" }}>
                  Rendering Launch Video...
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", margin: 0 }}>
                  {jobState?.currentStep || "Processing video frames on local machine..."}
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-surface-2)",
                    overflow: "hidden",
                    padding: "2px",
                    border: "1px solid var(--border-medium)",
                  }}
                >
                  <div
                    className="progress-rotating-bar"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "var(--radius-full)",
                      transform: `scaleX(${Math.max(0.05, (jobState?.progress || 0) / 100)})`,
                      transformOrigin: "left center",
                      transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  <span>{jobState?.etaText ? `ETA: ${jobState.etaText}` : "Rendering locally"}</span>
                  <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{jobState?.progress || 0}%</span>
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                <Clock size={13} color="var(--accent-primary)" />
                <span>Zero cloud fees • Processing directly on your local CPU/GPU</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {renderStatus === "error" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "20px 0", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--danger-bg)",
                  border: "1px solid var(--danger-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--danger)",
                }}
              >
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px" }}>
                  Rendering Encountered an Issue
                </h3>
                <p style={{ fontSize: "12px", color: "var(--danger)", margin: 0, maxWidth: "440px" }}>
                  {jobState?.error || "An unexpected error occurred during video rendering."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartRender}
                className="btn-secondary"
                style={{ minHeight: "40px", padding: "8px 18px", fontSize: "12px", gap: "6px" }}
              >
                <RotateCcw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Completed State */}
          {renderStatus === "completed" && jobState && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Success Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--success-bg)",
                  border: "1px solid var(--success-border)",
                  color: "var(--success)",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} />
                  <span style={{ fontWeight: "700" }}>Video Rendered Successfully with Frame-0 Poster Baked!</span>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                  {jobState.fileSize ? `${(jobState.fileSize / (1024 * 1024)).toFixed(2)} MB` : "Ready"}
                </span>
              </div>

              {/* Delivery Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {/* MP4 Player */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Film size={14} color="var(--accent-primary)" />
                    <span>Rendered MP4</span>
                  </span>
                  <div
                    style={{
                      aspectRatio: "16/9",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "#000000",
                      border: "1px solid var(--border-medium)",
                    }}
                  >
                    <video src={jobState.videoUrl} controls autoPlay muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/download`}
                    download
                    className="btn-primary"
                    style={{ minHeight: "38px", padding: "8px 12px", fontSize: "12px", textDecoration: "none" }}
                  >
                    <Download size={14} />
                    <span>Download MP4</span>
                  </a>
                </div>

                {/* Animated GIF */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={14} color="var(--accent-secondary)" />
                    <span>Animated GIF</span>
                  </span>
                  <div
                    style={{
                      aspectRatio: "16/9",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "#000000",
                      border: "1px solid var(--border-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={jobState.gifUrl || `/renders/${jobState.id}/marcutie_preview.gif`}
                      alt="Animated GIF loop"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/gif/download`}
                    download
                    className="btn-secondary"
                    style={{ minHeight: "38px", padding: "8px 12px", fontSize: "12px", textDecoration: "none" }}
                  >
                    <Download size={14} />
                    <span>Download GIF</span>
                  </a>
                </div>

                {/* Cover Poster */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <ImageIcon size={14} color="var(--success)" />
                    <span>Cover Poster Frame</span>
                  </span>
                  <div
                    style={{
                      aspectRatio: "16/9",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "#000000",
                      border: "1px solid var(--border-medium)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={jobState.posterUrl} alt="Cover poster" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/poster`}
                    download
                    className="btn-secondary"
                    style={{ minHeight: "38px", padding: "8px 12px", fontSize: "12px", textDecoration: "none" }}
                  >
                    <Download size={14} />
                    <span>Download Poster</span>
                  </a>
                </div>
              </div>

              {/* Social Launch Captions Card */}
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-medium)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Share2 size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Social Launch Captions</span>
                  </div>

                  {/* Platform Tabs */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "var(--bg-surface-1)",
                      padding: "3px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {(["twitter", "linkedin", "discord"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: activeTab === tab ? "700" : "500",
                          border: "none",
                          background: activeTab === tab ? "var(--accent-primary)" : "transparent",
                          color: activeTab === tab ? "#ffffff" : "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        {tab === "twitter" ? "𝕏 Twitter" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-surface-1)",
                    border: "1px solid var(--border-medium)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    maxHeight: "140px",
                    overflowY: "auto",
                  }}
                >
                  {activeTab === "twitter" && shareCopy.twitter.text}
                  {activeTab === "linkedin" && shareCopy.linkedin}
                  {activeTab === "discord" && shareCopy.discord}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {activeTab === "twitter" && `${shareCopy.twitter.charCount} / 280 Characters ${shareCopy.twitter.isUnderLimit ? "✓" : "(Thread Recommended)"}`}
                    {activeTab === "linkedin" && "Story-driven mobile feed format"}
                    {activeTab === "discord" && "Markdown community announcement"}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const text =
                        activeTab === "twitter"
                          ? shareCopy.twitter.text
                          : activeTab === "linkedin"
                          ? shareCopy.linkedin
                          : shareCopy.discord;
                      handleCopy(text, activeTab);
                    }}
                    className="btn-secondary"
                    style={{ minHeight: "34px", padding: "6px 14px", fontSize: "12px", gap: "6px" }}
                  >
                    {copiedTab === activeTab ? (
                      <>
                        <Check size={14} color="var(--success)" />
                        <span style={{ color: "var(--success)", fontWeight: "700" }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border-medium)",
            background: "var(--bg-surface-1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
            <Layers size={14} />
            <span>Marcutie v1.0 • Local Render Engine</span>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ minHeight: "36px", padding: "6px 16px", fontSize: "12px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
