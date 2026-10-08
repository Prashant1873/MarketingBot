import { useState, useEffect } from "react";
import { Play, Sparkles, Key, CheckCircle2, ShieldAlert } from "lucide-react";

import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { ImageDropzone } from "./components/ImageDropzone";
import { ToneSelector } from "./components/ToneSelector";
import { FormatControls } from "./components/FormatControls";
import { SettingsModal } from "./components/SettingsModal";
import { useConfig } from "./hooks/useConfig";
import { Tone, AspectRatio, Duration } from "./types";

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
        if (prompt.trim()) {
          handleGenerate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    if (!hasAnyKey) {
      setIsSettingsOpen(true);
      return;
    }

    alert(
      `⚡ Ready for Phase 3! Storyboard Engine will parse:\n• Prompt: ${prompt.slice(0, 60)}...\n• Visual: ${imageFilename || "Prompt-only"}\n• Tone: ${customTone || tone}\n• Format: ${aspectRatio} (${duration}s)`
    );
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 100px" }}>
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
          background: "rgba(13, 19, 34, 0.9)",
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
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700" }}>
              {prompt.trim() ? "Ready to compose video" : "Enter prompt to start"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {!hasAnyKey ? (
                <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldAlert size={12} /> BYOK key required before AI generation
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
            disabled={!prompt.trim()}
            className="btn-primary"
            style={{
              padding: "10px 24px",
              fontSize: "14px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Play size={16} fill="#fff" />
            <span>Generate Storyboard & Video</span>
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
