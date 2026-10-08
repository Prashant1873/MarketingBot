import { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Key, CheckCircle2, ShieldAlert, Loader2, AlertCircle } from "lucide-react";

import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { ImageDropzone } from "./components/ImageDropzone";
import { ToneSelector } from "./components/ToneSelector";
import { FormatControls } from "./components/FormatControls";
import { SettingsModal } from "./components/SettingsModal";
import { StoryboardInspector } from "./components/StoryboardInspector";
import { VideoPlayerPreview, VideoPlayerPreviewHandle } from "./components/VideoPlayerPreview";
import { useConfig } from "./hooks/useConfig";
import { Tone, AspectRatio, Duration, Storyboard } from "./types";
import { secondsToFrames } from "./remotion/types";

export default function App() {
  const { config, hasKey, hasAnyKey, saveConfig } = useConfig();

  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [serverVersion, setServerVersion] = useState("1.0.0");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Project Input State
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFilename, setImageFilename] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("default");
  const [customTone, setCustomTone] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [duration, setDuration] = useState<Duration>(20);

  // Storyboard Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [providerUsed, setProviderUsed] = useState("gemini");
  const [isMock, setIsMock] = useState(false);

  const inspectorRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoPlayerPreviewHandle>(null);

  // Check backend server status
  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setServerStatus("online");
        if (data.version) setServerVersion(data.version);
      })
      .catch(() => {
        setServerStatus("offline");
      });
  }, []);

  // Update default preferences from config once loaded
  useEffect(() => {
    if (config?.preferences) {
      if (config.preferences.defaultTone) setTone(config.preferences.defaultTone);
      if (config.preferences.defaultFormat) setAspectRatio(config.preferences.defaultFormat);
      if (config.preferences.defaultDuration) setDuration(config.preferences.defaultDuration);
    }
  }, [config]);

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger generation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (prompt.trim() && !isGenerating) {
          handleGenerate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrl,
          tone,
          customTone,
          aspectRatio,
          duration,
          provider: config?.preferences?.preferredProvider,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate storyboard");
      }

      setStoryboard(data.storyboard);
      setProviderUsed(data.providerUsed);
      setIsMock(Boolean(data.isMock));

      // Smooth scroll to storyboard inspector
      setTimeout(() => {
        inspectorRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setGenerationError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 120px" }}>
      {/* Header Navigation */}
      <Header
        serverStatus={serverStatus}
        serverVersion={serverVersion}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKeys={hasAnyKey}
      />

      {/* Main Studio Grid */}
      <main style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "24px", alignItems: "start" }}>
        {/* Left Column: Prompt Input & Visual Upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <PromptInput value={prompt} onChange={setPrompt} />
          <ImageDropzone
            imageUrl={imageUrl}
            imageFilename={imageFilename}
            onImageChange={(url, filename) => {
              setImageUrl(url);
              setImageFilename(filename);
            }}
          />
        </div>

        {/* Right Column: Tone Selector & Video Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ToneSelector
            selectedTone={tone}
            customTone={customTone}
            onToneChange={setTone}
            onCustomToneChange={setCustomTone}
          />
          <FormatControls
            aspectRatio={aspectRatio}
            duration={duration}
            onAspectRatioChange={setAspectRatio}
            onDurationChange={setDuration}
          />

          {/* Configuration Summary Card */}
          <div
            className="glass-panel"
            style={{
              padding: "20px 24px",
              background: "rgba(10, 15, 26, 0.5)",
              border: "1px dashed var(--border-color)",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              Project Composition Recipe
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "12px" }}>
              <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)" }}>
                {aspectRatio} Format
              </span>
              <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(168, 85, 247, 0.15)", color: "var(--accent-secondary)" }}>
                {duration}s Duration
              </span>
              <span style={{ padding: "4px 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", color: "var(--text-primary)" }}>
                Tone: {customTone ? `Custom (${customTone})` : tone}
              </span>
              <span style={{ padding: "4px 10px", borderRadius: "999px", background: imageUrl ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)", color: imageUrl ? "var(--success)" : "var(--text-muted)" }}>
                {imageUrl ? "✓ Product Visual Attached" : "Prompt-Only Mode"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Generation Error Alert */}
      {generationError && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px 20px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#fca5a5",
            fontSize: "13px",
          }}
        >
          <AlertCircle size={18} color="#ef4444" />
          <div style={{ flex: 1 }}>{generationError}</div>
          <button
            onClick={() => setGenerationError(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Video Preview & Storyboard Inspector Section */}
      {storyboard && (
        <div ref={inspectorRef} style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ height: "1px", background: "var(--border-color)", margin: "8px 0" }} />

          {/* Real-Time Live Remotion Player */}
          <VideoPlayerPreview
            ref={playerRef}
            storyboard={storyboard}
            onAspectRatioChange={(ratio) => {
              setAspectRatio(ratio);
              setStoryboard((prev) => (prev ? { ...prev, aspectRatio: ratio } : null));
            }}
          />

          {/* Interactive Storyboard Inspector & Scene Tweaker */}
          <StoryboardInspector
            storyboard={storyboard}
            providerUsed={providerUsed}
            isMock={isMock}
            onUpdateStoryboard={setStoryboard}
            onRegenerate={handleGenerate}
            onProceedToPreview={() => {
              inspectorRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            onSeekToScene={(sceneIndex) => {
              let frameOffset = 0;
              for (let i = 0; i < sceneIndex && i < storyboard.scenes.length; i++) {
                frameOffset += secondsToFrames(storyboard.scenes[i].duration, 30);
              }
              playerRef.current?.seekToFrame(frameOffset);
            }}
          />
        </div>
      )}

      {/* Floating Action Bar */}
      <footer
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: "960px",
          padding: "14px 24px",
          background: "rgba(13, 19, 34, 0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border-highlight)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isGenerating ? (
              <Loader2 size={16} color="#fff" className="animate-spin" />
            ) : (
              <Sparkles size={16} color="#fff" />
            )}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700" }}>
              {isGenerating
                ? "Synthesizing marketing storyboard with AI..."
                : storyboard
                ? "Storyboard generated • Ready to preview & render"
                : prompt.trim()
                ? "Ready to compose video"
                : "Enter prompt to start"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {!hasAnyKey ? (
                <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldAlert size={12} /> No API key saved (will run offline mock mode)
                </span>
              ) : (
                <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} /> Local AI Engine Configured
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!hasAnyKey && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn-secondary"
              style={{ fontSize: "12px", padding: "8px 14px" }}
            >
              <Key size={14} /> Add API Key
            </button>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary"
            style={{
              padding: "10px 24px",
              fontSize: "14px",
              borderRadius: "var(--radius-md)",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting Scenes...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="#fff" />
                <span>{storyboard ? "Re-generate Storyboard" : "Generate Storyboard & Video"}</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* BYOK Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hasKey={hasKey}
        currentPreferences={config?.preferences}
        onSave={saveConfig}
      />
    </div>
  );
}
