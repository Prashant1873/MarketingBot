import { useState } from "react";
import {
  Download,
  Share2,
  Copy,
  Check,
  Sliders,
  CheckCircle2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Storyboard, ThemePalette } from "../types";

interface FinishedVideoHeroProps {
  jobId: string;
  videoUrl: string;
  posterUrl: string;
  fileSize?: number;
  storyboard: Storyboard;
  onTweakInStudio: () => void;
  onNewVideo: () => void;
}

export function FinishedVideoHero({
  jobId,
  videoUrl,
  posterUrl,
  fileSize,
  storyboard,
  onTweakInStudio,
  onNewVideo,
}: FinishedVideoHeroProps) {
  const [activeShareTab, setActiveShareTab] = useState<"twitter" | "linkedin" | "discord">("twitter");
  const [copiedShare, setCopiedShare] = useState<string | null>(null);

  const theme: ThemePalette = storyboard.themePalette || {
    primary: "#6366f1",
    secondary: "#38bdf8",
    accent: "#10b981",
    background: "#090d16",
    surface: "#131b2e",
    text: "#f8fafc",
    isDark: true,
  };

  const handleCopyShare = (platform: "twitter" | "linkedin" | "discord", text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShare(platform);
    setTimeout(() => setCopiedShare(null), 2000);
  };

  const formattedSize = fileSize
    ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
    : "~4.2 MB";

  const downloadVideoUrl = `/api/render/${jobId}/download`;
  const downloadPosterUrl = `/api/render/${jobId}/poster`;
  const downloadGifUrl = `/api/render/${jobId}/gif/download`;

  const shareText =
    activeShareTab === "twitter"
      ? storyboard.shareCopy?.twitter || `🚀 Check out ${storyboard.title} — generated with Marcutie!`
      : activeShareTab === "linkedin"
      ? storyboard.shareCopy?.linkedin || `Excited to unveil ${storyboard.title}.`
      : storyboard.shareCopy?.discord || `**${storyboard.title}** is live!`;

  return (
    <section
      id="finished-video-hero"
      className="glass-panel"
      style={{
        marginTop: "32px",
        padding: "36px 32px",
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${theme.primary}50`,
        background: `radial-gradient(circle at top right, ${theme.primary}18, transparent 40%), radial-gradient(circle at bottom left, ${theme.accent}12, transparent 50%), rgba(10, 15, 28, 0.85)`,
        boxShadow: `0 20px 60px -15px ${theme.primary}25`,
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      {/* Top Banner & Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "var(--success)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <CheckCircle2 size={14} /> One-Click Product Ready
            </span>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-muted)",
                fontSize: "12px",
              }}
            >
              1080p • 30 FPS • {storyboard.aspectRatio} • {formattedSize}
            </span>
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em", margin: "0 0 6px 0" }}>
            {storyboard.title}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, maxWidth: "600px" }}>
            {storyboard.tagline || "Your professional launch video is rendered locally, synchronized with voiceover and ready to share."}
          </p>
        </div>

        {/* Top Action CTAs */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            id="hero-new-video-btn"
            type="button"
            onClick={onNewVideo}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              fontSize: "13px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Plus size={15} />
            <span>New Video</span>
          </button>

          <button
            id="tweak-in-studio-top-btn"
            type="button"
            onClick={onTweakInStudio}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              fontSize: "13px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Sliders size={15} />
            <span>Tweak in Studio</span>
          </button>

          <a
            id="hero-download-gif-btn"
            href={downloadGifUrl}
            download
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              textDecoration: "none",
            }}
            title="Download lightweight animated GIF loop for READMEs and emails"
          >
            <Download size={15} />
            <span>Download GIF</span>
          </a>

          <a
            id="hero-download-video-btn"
            href={downloadVideoUrl}
            download
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              fontSize: "14px",
              fontWeight: "700",
              borderRadius: "var(--radius-md)",
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
              boxShadow: `0 0 25px ${theme.primary}50`,
              textDecoration: "none",
              color: "#ffffff",
            }}
          >
            <Download size={16} />
            <span>Download MP4</span>
          </a>
        </div>
      </div>

      {/* Main Delivery Grid: Video Player + Share Hub */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "28px", alignItems: "start" }}>
        {/* Left: Rendered MP4 Player View */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              background: "#000000",
              boxShadow: `0 15px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px ${theme.primary}40`,
              aspectRatio: storyboard.aspectRatio === "9:16" ? "9/16" : storyboard.aspectRatio === "1:1" ? "1/1" : "16/9",
              maxHeight: "520px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            <video
              id="rendered-final-video-player"
              src={videoUrl || downloadVideoUrl}
              poster={posterUrl ? `/api/render/${jobId}/poster` : undefined}
              controls
              autoPlay
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Audio Spec & Attribution Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
              <span>🎵 Music: <strong style={{ color: "#f97316" }}>{storyboard.audio?.musicTrack || "Ende.app Happy Beats"}</strong></span>
              {storyboard.voiceoverVoice && (
                <span>🎙️ Narration: <strong style={{ color: "var(--success)" }}>{storyboard.voiceoverVoice}</strong> (Kokoro-82M)</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a
                id="hero-download-gif-link"
                href={downloadGifUrl}
                download
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#38bdf8",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
                title="Download animated GIF loop"
              >
                <Download size={14} />
                <span>Download GIF</span>
              </a>
              <a
                id="hero-download-poster-btn"
                href={downloadPosterUrl}
                download
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "var(--accent-secondary)",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                <ImageIcon size={14} />
                <span>Download Poster.jpg</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Social Copy Hub & Quick Export */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            className="glass-panel"
            style={{
              padding: "20px",
              borderRadius: "var(--radius-md)",
              background: "rgba(13, 19, 33, 0.8)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Share2 size={16} color={theme.primary} />
                <span style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "#ffffff" }}>
                  One-Click Launch Copy
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tailored to video tone</span>
            </div>

            {/* Social Platform Tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {(["twitter", "linkedin", "discord"] as const).map((platform) => (
                <button
                  key={platform}
                  id={`share-tab-${platform}`}
                  type="button"
                  onClick={() => setActiveShareTab(platform)}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: "var(--radius-md)",
                    border: activeShareTab === platform ? `1px solid ${theme.primary}` : "1px solid rgba(255, 255, 255, 0.08)",
                    background: activeShareTab === platform ? `${theme.primary}20` : "transparent",
                    color: activeShareTab === platform ? "#ffffff" : "var(--text-muted)",
                    fontSize: "12px",
                    fontWeight: activeShareTab === platform ? "700" : "500",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {platform === "twitter" ? "𝕏 Twitter" : platform}
                </button>
              ))}
            </div>

            {/* Copy Text Area */}
            <div
              style={{
                position: "relative",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#f8fafc",
                whiteSpace: "pre-wrap",
                minHeight: "110px",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              {shareText}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {shareText.length} characters
              </span>
              <button
                id="copy-share-copy-btn"
                type="button"
                onClick={() => handleCopyShare(activeShareTab, shareText)}
                className="btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  fontSize: "12px",
                  borderRadius: "var(--radius-md)",
                  background: copiedShare === activeShareTab ? "rgba(16, 185, 129, 0.2)" : undefined,
                  color: copiedShare === activeShareTab ? "var(--success)" : undefined,
                }}
              >
                {copiedShare === activeShareTab ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedShare === activeShareTab ? "Copied!" : "Copy Post Text"}</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions Card */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              background: "rgba(10, 15, 26, 0.6)",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border-color)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>Want to customize scenes?</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tweak typography slams, badges, timings or colors</span>
            </div>
            <button
              id="expand-studio-inspector-btn"
              type="button"
              onClick={onTweakInStudio}
              className="btn-secondary"
              style={{
                fontSize: "12px",
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
              }}
            >
              Open Studio Inspector
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
