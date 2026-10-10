import { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Key, CheckCircle2, ShieldAlert, Loader2, AlertCircle, Film } from "lucide-react";

import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { ImageDropzone } from "./components/ImageDropzone";
import { DirectorViewportStage } from "./components/DirectorViewportStage";
import { PreFlightStudioPanel } from "./components/PreFlightStudioPanel";
import { FinishedVideoHero } from "./components/FinishedVideoHero";
import { OneClickProgressModal, PipelineStage } from "./components/OneClickProgressModal";
import { SettingsModal } from "./components/SettingsModal";
import { StoryboardInspector } from "./components/StoryboardInspector";
import { VideoPlayerPreview, VideoPlayerPreviewHandle } from "./components/VideoPlayerPreview";
import { ExportModal } from "./components/ExportModal";
import { useConfig } from "./hooks/useConfig";
import {
  Tone,
  AspectRatio,
  Duration,
  Storyboard,
  AudioConfig,
  ImageDimensions,
  ScreenMode,
  ThemePalette,
  DeviceFrame,
  PreFlightVoiceConfig,
  PreFlightAudioConfig,
  SubtitlesConfig,
  VisualTheme,
} from "./types";
import { PRESET_THEME_PALETTES, VISUAL_THEME_PALETTES } from "./utils/featureMockups";
import { secondsToFrames } from "./remotion/types";

const STUDIO_PRESETS: Array<{
  icon: string;
  title: string;
  dur: Duration;
  tone: Tone;
  format: AspectRatio;
  visualTheme: VisualTheme;
  prompt: string;
}> = [
  {
    icon: "🚀",
    title: "SaaS Launch",
    dur: 15,
    tone: "polished",
    format: "16:9",
    visualTheme: "aurora-glass",
    prompt:
      "Launch announcement for PulseSync: Real-time distributed state synchronization for modern web apps. Zero backend boilerplate, sub-10ms conflict resolution, and end-to-end encryption by default.",
  },
  {
    icon: "💻",
    title: "DevTool CLI",
    dur: 20,
    tone: "deadpan",
    format: "16:9",
    visualTheme: "default-dark",
    prompt:
      "Introducing BoltDB CLI: The fastest distributed key-value database built in Rust. Instant schema migrations, zero lock overhead, and deterministic replication across edge clusters.",
  },
  {
    icon: "📱",
    title: "Mobile App Drop",
    dur: 15,
    tone: "app-store",
    format: "9:16",
    visualTheme: "neo-brutalist",
    prompt:
      "Introducing FocusPulse: The minimalist iOS and Android habit tracker designed for deep work. Ambient haptic soundscapes, zero streak shame, and biometric focus flow triggers.",
  },
  {
    icon: "⚡",
    title: "AI Platform",
    dur: 25,
    tone: "cinematic",
    format: "16:9",
    visualTheme: "cyberpunk-scanlines",
    prompt:
      "HyperAgent Studio: Autonomous AI software agents that read your Figma designs, write pull requests, run integration test suites, and deploy to production without human handoffs.",
  },
];

export default function App() {
  const { config, hasKey, localKeys, hasAnyKey, saveConfig } = useConfig();

  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [serverVersion, setServerVersion] = useState("1.0.0");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Project Input State
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFilename, setImageFilename] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [screenMode, setScreenMode] = useState<ScreenMode>("mockup");
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame | undefined>(undefined);
  const [tone, setTone] = useState<Tone>("default");
  const [customTone, setCustomTone] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [duration, setDuration] = useState<Duration>(20);

  // Pre-Flight Brand Theming State
  const [visualTheme, setVisualTheme] = useState<VisualTheme>("default-dark");
  const [themePalette, setThemePalette] = useState<ThemePalette>(PRESET_THEME_PALETTES.indigo);

  // Pre-Flight Voiceover Configuration
  const [voiceConfig, setVoiceConfig] = useState<PreFlightVoiceConfig>({
    enabled: true,
    voiceId: "auto",
    speed: 1.0,
    customNotes: "",
  });

  // Pre-Flight Music & Sound Configuration
  const [preFlightAudio, setPreFlightAudio] = useState<PreFlightAudioConfig>({
    selectedMusicTrack: "auto",
    musicVolume: 0.8,
    sfxVolume: 0.9,
    duckingDepth: 0.25,
  });

  // Subtitles & Kinetic Captions Configuration
  const [subtitlesConfig, setSubtitlesConfig] = useState<SubtitlesConfig>({
    enabled: true,
    style: "karaoke-bounce",
    position: "bottom",
  });

  // Player & Composition Audio State
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    selectedMusicTrack: "happy-beats-vol-1",
    musicVolume: 0.8,
    sfxVolume: 0.9,
    isMuted: false,
    voiceoverEnabled: true,
  });

  // Storyboard Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [providerUsed, setProviderUsed] = useState("gemini");
  const [isMock, setIsMock] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // One-Click Rendered Product State
  const [renderedResult, setRenderedResult] = useState<{
    jobId: string;
    videoUrl: string;
    posterUrl: string;
    fileSize?: number;
  } | null>(null);
  const [isOneClickActive, setIsOneClickActive] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("storyboard");
  const [pipelineStepMessage, setPipelineStepMessage] = useState("");
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [showStudioInspector, setShowStudioInspector] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
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
        if (prompt.trim() && !isGenerating && !isOneClickActive) {
          handleGenerateAndRender();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, isGenerating, isOneClickActive]);

  const handleGenerateAndRender = async () => {
    if (!prompt.trim() || isGenerating || isOneClickActive) return;

    setIsGenerating(true);
    setIsOneClickActive(true);
    setPipelineStage("storyboard");
    setPipelineStepMessage("Analyzing marketing prompt & target audience...");
    setPipelineProgress(15);
    setGenerationError(null);

    // Active micro-step ticker during AI generation so UI feels fluid and alive
    const storyboardSteps = [
      { msg: "Analyzing marketing prompt & audience hook...", pct: 15 },
      { msg: "Multimodal AI drafting 4-scene narrative & script...", pct: 22 },
      { msg: "Extracting brand theme palette & motion typography...", pct: 28 },
      { msg: "Synthesizing neural voiceover narration with Kokoro-82M...", pct: 33 },
    ];
    let stepIdx = 0;
    const ticker = setInterval(() => {
      stepIdx++;
      if (stepIdx < storyboardSteps.length) {
        setPipelineStepMessage(storyboardSteps[stepIdx].msg);
        setPipelineProgress(storyboardSteps[stepIdx].pct);
      }
    }, 1300);

    try {
      // Step 1: Generate Storyboard, assign optimal upbeat music, and synthesize voiceover upfront
      const res = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrl,
          imageDimensions,
          screenMode,
          deviceFrame,
          tone,
          customTone,
          aspectRatio,
          duration,
          themePalette: { ...themePalette, visualTheme },
          voiceConfig,
          audioConfig: preFlightAudio,
          subtitlesConfig,
          visualTheme,
          provider: config?.preferences?.preferredProvider,
          apiKeys: localKeys,
        }),
      });

      clearInterval(ticker);

      let data: any;
      const resText = await res.text();
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch {
        throw new Error(
          `Backend connection issue (HTTP ${res.status}): ${
            resText.slice(0, 140) || "Empty response received. Ensure the local backend is running on port 3001."
          }`
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to generate storyboard (HTTP ${res.status})`);
      }

      const activeStoryboard: Storyboard = data.storyboard;
      activeStoryboard.subtitlesConfig = activeStoryboard.subtitlesConfig || subtitlesConfig;
      activeStoryboard.visualTheme = activeStoryboard.visualTheme || visualTheme;
      setStoryboard(activeStoryboard);
      setProviderUsed(data.providerUsed);
      setIsMock(Boolean(data.isMock));

      if (activeStoryboard.themePalette) {
        setThemePalette(activeStoryboard.themePalette);
      }

      if (activeStoryboard.audioDirection?.trackRecommendation) {
        const trackRec = activeStoryboard.audioDirection.trackRecommendation.replace(/\.wav$/i, "");
        setAudioConfig((prev) => ({
          ...prev,
          selectedMusicTrack: trackRec,
          voiceoverUrl: activeStoryboard.voiceoverUrl || prev.voiceoverUrl,
          voiceoverVoice: activeStoryboard.voiceoverVoice || prev.voiceoverVoice,
        }));
      }

      setPipelineStage("voiceover");
      setPipelineStepMessage(
        voiceConfig.enabled
          ? `Kokoro-82M Voiceover ready (${activeStoryboard.voiceoverVoice || "af_heart"}). Starting video render...`
          : "Voiceover configured. Starting video render..."
      );
      setPipelineProgress(38);

      // Step 2: Queue headless Remotion MP4 render with synchronized audio
      const renderRes = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyboard: activeStoryboard,
          options: {},
        }),
      });

      let renderData: any;
      const renderText = await renderRes.text();
      try {
        renderData = renderText ? JSON.parse(renderText) : {};
      } catch {
        throw new Error(
          `Render service connection issue (HTTP ${renderRes.status}): ${
            renderText.slice(0, 140) || "Empty response from render pipeline."
          }`
        );
      }

      if (!renderRes.ok || !renderData.success) {
        throw new Error(renderData.error || `Failed to start render job (HTTP ${renderRes.status})`);
      }

      const jobId = renderData.jobId;
      setPipelineStage("rendering");
      setPipelineStepMessage("Initializing Remotion rendering environment...");
      setPipelineProgress(42);

      // Step 3: Poll status until completion
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/render/${jobId}/status`);
          if (!statusRes.ok) return;
          const statusText = await statusRes.text();
          let statusData: any;
          try {
            statusData = JSON.parse(statusText);
          } catch {
            return;
          }
          const job = statusData.job;
          if (!job) return;

          if (job.status === "rendering") {
            const rawPct = job.progress || 10;
            const mappedProgress = Math.min(94, Math.max(40, Math.round(38 + rawPct * 0.56)));
            setPipelineProgress(mappedProgress);
            if (job.currentStep) {
              setPipelineStepMessage(job.currentStep);
            }
            if (job.progress >= 78) {
              setPipelineStage("poster");
            }
          } else if (job.status === "completed") {
            clearInterval(pollInterval);
            setPipelineStage("complete");
            setPipelineStepMessage("Launch video ready!");
            setPipelineProgress(100);

            setRenderedResult({
              jobId: job.id,
              videoUrl: job.videoUrl,
              posterUrl: job.posterUrl,
              fileSize: job.fileSize,
            });

            setTimeout(() => {
              setIsOneClickActive(false);
              setIsGenerating(false);
              heroRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 600);
          } else if (job.status === "error") {
            clearInterval(pollInterval);
            setPipelineStage("error");
            setGenerationError(job.error || "Video rendering encountered an error");
            setIsGenerating(false);
          }
        } catch (pollErr) {
          console.warn("[OneClick] Status polling error:", pollErr);
        }
      }, 700);
    } catch (err: unknown) {
      clearInterval(ticker);
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setGenerationError(errorMsg);
      setPipelineStage("error");
      setIsGenerating(false);
    }
  };

  const applyStudioPreset = (preset: (typeof STUDIO_PRESETS)[number]) => {
    setPrompt(preset.prompt);
    setDuration(preset.dur);
    setTone(preset.tone);
    setAspectRatio(preset.format);
    setVisualTheme(preset.visualTheme);
    if (VISUAL_THEME_PALETTES[preset.visualTheme]) {
      setThemePalette(VISUAL_THEME_PALETTES[preset.visualTheme]);
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

      {/* Studio Mission Control Banner */}
      <section
        className="studio-hero-banner"
        style={{ marginBottom: "28px" }}
        aria-label="Studio Quick Start"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ maxWidth: "660px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: "1.2", marginBottom: "10px" }}>
              Compose cinematic product launch videos in seconds.
            </h2>
            <p className="editorial-lead">
              Write your pitch or drop screenshots. Marcutie orchestrates multi-track 3D motion choreography, Kokoro AI voiceover, and synchronized kinetic captions with frame-accurate timing.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "300px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
              Starter Templates
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {STUDIO_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => applyStudioPreset(preset)}
                  className="studio-preset-chip"
                >
                  <span style={{ fontSize: "15px" }}>{preset.icon}</span>
                  <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: "1.2" }}>
                    <span style={{ fontWeight: "600", fontSize: "12px", color: "var(--text-primary)" }}>{preset.title}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {preset.dur}s • {preset.format}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Creative Director Studio */}
      <main style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Top Director Stage: Script & Asset Deck (Left) + Interactive Live Viewport Stage (Right) */}
        <div className="director-cockpit-grid">
          {/* Left Column: Script Pitch & Visual Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <PromptInput value={prompt} onChange={setPrompt} />
            <ImageDropzone
              imageUrl={imageUrl}
              imageFilename={imageFilename}
              screenMode={screenMode}
              onScreenModeChange={setScreenMode}
              onImageChange={(url, filename, dims) => {
                setImageUrl(url);
                setImageFilename(filename);
                setImageDimensions(dims || null);
              }}
            />
          </div>

          {/* Right Column: Live Viewport Stage & Camera Preview */}
          <DirectorViewportStage
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            duration={duration}
            onDurationChange={setDuration}
            imageUrl={imageUrl}
            imageFilename={imageFilename}
            screenMode={screenMode}
            deviceFrame={deviceFrame}
            onDeviceFrameChange={setDeviceFrame}
            themePalette={themePalette}
            visualTheme={visualTheme}
            tone={tone}
            prompt={prompt}
          />
        </div>

        {/* Lower Studio Synthesis Rack: Brand, Voiceover & Soundscape */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <PreFlightStudioPanel
            tone={tone}
            customTone={customTone}
            onToneChange={setTone}
            onCustomToneChange={setCustomTone}
            aspectRatio={aspectRatio}
            duration={duration}
            onAspectRatioChange={setAspectRatio}
            onDurationChange={setDuration}
            themePalette={themePalette}
            onThemePaletteChange={setThemePalette}
            screenMode={screenMode}
            onScreenModeChange={setScreenMode}
            deviceFrame={deviceFrame}
            onDeviceFrameChange={setDeviceFrame}
            voiceConfig={voiceConfig}
            onVoiceConfigChange={setVoiceConfig}
            audioConfig={preFlightAudio}
            onAudioConfigChange={setPreFlightAudio}
            subtitlesConfig={subtitlesConfig}
            onSubtitlesConfigChange={setSubtitlesConfig}
            visualTheme={visualTheme}
            onVisualThemeChange={(vt) => {
              setVisualTheme(vt);
              if (VISUAL_THEME_PALETTES[vt]) {
                setThemePalette(VISUAL_THEME_PALETTES[vt]);
              }
            }}
          />

          {/* Active Recipe Summary Card */}
          <div
            className="studio-panel"
            style={{
              padding: "16px 20px",
              background: "var(--bg-surface-1)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>
                Launch Blueprint Telemetry
              </span>
              <span className="editorial-meta">
                <span className="editorial-meta-index">04</span>
                <span className="editorial-meta-divider">/</span>
                <span>Active State</span>
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "11px" }}>
              <span className="studio-badge" style={{ color: "var(--accent-primary)" }}>
                {aspectRatio} Format
              </span>
              <span className="studio-badge" style={{ color: "var(--accent-secondary)" }}>
                {duration}s Duration
              </span>
              <span className="studio-badge" style={{ color: "var(--text-primary)" }}>
                Tone: {customTone ? "Custom" : tone}
              </span>
              <span className="studio-badge" style={{ color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "1px", background: themePalette.primary, display: "inline-block" }} />
                {visualTheme !== "default-dark" ? visualTheme : "Brand Palette"}
              </span>
              <span className="studio-badge" style={{ color: voiceConfig.enabled ? "var(--success)" : "var(--text-muted)" }}>
                {voiceConfig.enabled ? `Voice: ${voiceConfig.voiceId === "auto" ? "AI Auto" : voiceConfig.voiceId}` : "Voice: Off"}
              </span>
              <span className="studio-badge" style={{ color: "var(--text-secondary)" }}>
                Music: {preFlightAudio.selectedMusicTrack === "auto" ? "AI Smart Select" : preFlightAudio.selectedMusicTrack}
              </span>
              <span className="studio-badge" style={{ color: subtitlesConfig.enabled ? "var(--accent-secondary)" : "var(--text-muted)" }}>
                {subtitlesConfig.enabled ? `Captions: ${subtitlesConfig.style}` : "Captions: Off"}
              </span>
              <span className="studio-badge" style={{ color: screenMode === "mockup" ? "var(--accent-primary)" : "var(--accent-secondary)" }}>
                {screenMode === "mockup" ? "Synthesized UI" : "Direct Screenshot"}
              </span>
              <span className="studio-badge" style={{ color: imageUrl ? "var(--success)" : "var(--text-muted)" }}>
                {imageUrl ? "Visual Attached" : "Prompt-Only Mode"}
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
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "var(--danger)",
            fontSize: "13px",
          }}
          role="alert"
        >
          <AlertCircle size={18} color="var(--danger)" />
          <div style={{ flex: 1, fontWeight: "500" }}>{generationError}</div>
          <button
            onClick={() => setGenerationError(null)}
            className="btn-ghost"
            style={{
              minHeight: "36px",
              padding: "4px 10px",
              color: "var(--danger)",
              fontSize: "12px",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Finished Product Hero View (One-Click Deliverable) */}
      {renderedResult && storyboard && (
        <div ref={heroRef}>
          <FinishedVideoHero
            jobId={renderedResult.jobId}
            videoUrl={renderedResult.videoUrl}
            posterUrl={renderedResult.posterUrl}
            fileSize={renderedResult.fileSize}
            storyboard={storyboard}
            onTweakInStudio={() => {
              setShowStudioInspector(true);
              setTimeout(() => {
                inspectorRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            onNewVideo={() => {
              setRenderedResult(null);
              setStoryboard(null);
              setShowStudioInspector(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* Live Video Preview & Storyboard Inspector Section */}
      {storyboard && (!renderedResult || showStudioInspector) && (
        <div ref={inspectorRef} style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ height: "1px", background: "var(--border-color)", margin: "8px 0" }} />

          {/* Real-Time Live Remotion Player with Audio Controls */}
          <VideoPlayerPreview
            ref={playerRef}
            storyboard={storyboard}
            audioConfig={audioConfig}
            onAudioConfigChange={setAudioConfig}
            onUpdateStoryboard={setStoryboard}
            onAspectRatioChange={(ratio) => {
              setAspectRatio(ratio);
              setStoryboard((prev) => (prev ? { ...prev, aspectRatio: ratio } : null));
            }}
            onProceedToExport={() => setIsExportModalOpen(true)}
          />

          {/* Interactive Storyboard Inspector & Scene Tweaker */}
          <StoryboardInspector
            storyboard={storyboard}
            providerUsed={providerUsed}
            isMock={isMock}
            onUpdateStoryboard={setStoryboard}
            onRegenerate={handleGenerateAndRender}
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

      {/* One-Click Pipeline Stepper Modal */}
      <OneClickProgressModal
        isOpen={isOneClickActive}
        currentStage={pipelineStage}
        currentStepMessage={pipelineStepMessage}
        progressPercent={pipelineProgress}
        errorMessage={generationError}
        onClose={() => {
          setIsOneClickActive(false);
          setIsGenerating(false);
        }}
      />

      {/* Docked Director Command Strip */}
      <footer
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "980px",
          padding: "12px 20px",
          background: "rgba(14, 17, 24, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
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
              flexShrink: 0,
            }}
          >
            {isGenerating ? (
              <Loader2 size={18} color="#ffffff" className="animate-spin" />
            ) : (
              <Sparkles size={18} color="#ffffff" />
            )}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
              {isGenerating
                ? "Synthesizing marketing storyboard with multimodal AI..."
                : storyboard
                ? "Storyboard active • Ready to inspect & export"
                : prompt.trim()
                ? "Prompt ready • Ready to generate"
                : "Enter marketing prompt to compose"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {!hasAnyKey ? (
                <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldAlert size={12} /> Offline mock mode (Add API key in settings for live models)
                </span>
              ) : (
                <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={12} /> Local AI Engine Configured
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!hasAnyKey && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn-secondary"
              style={{ fontSize: "12px", minHeight: "44px", padding: "8px 14px" }}
            >
              <Key size={14} /> Add API Key
            </button>
          )}

          {storyboard && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                fontSize: "13px",
                minHeight: "44px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-medium)",
              }}
            >
              <Film size={15} color="var(--accent-secondary)" />
              <span>Export MP4</span>
            </button>
          )}

          <button
            id="generate-launch-video-btn"
            onClick={handleGenerateAndRender}
            disabled={!prompt.trim() || isGenerating}
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              fontSize: "13px",
              fontWeight: "700",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Synthesizing Video...</span>
              </>
            ) : (
              <>
                <Play size={15} fill="#ffffff" />
                <span>{renderedResult ? "Re-generate Video" : "Generate Launch Video"}</span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.2)",
                    fontFamily: "var(--font-mono)",
                    marginLeft: "2px",
                  }}
                >
                  ⌘↵
                </span>
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

      {/* Export & Render Delivery Modal */}
      {storyboard && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          storyboard={storyboard}
        />
      )}
    </div>
  );
}
