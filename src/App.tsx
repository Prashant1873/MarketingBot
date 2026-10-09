import { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Key, CheckCircle2, ShieldAlert, Loader2, AlertCircle, Film } from "lucide-react";

import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { ImageDropzone } from "./components/ImageDropzone";
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate storyboard");
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

      const renderData = await renderRes.json();
      if (!renderRes.ok || !renderData.success) {
        throw new Error(renderData.error || "Failed to start render job");
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
          const statusData = await statusRes.json();
          const job = statusData.job;

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
            screenMode={screenMode}
            onScreenModeChange={setScreenMode}
            onImageChange={(url, filename, dims) => {
              setImageUrl(url);
              setImageFilename(filename);
              setImageDimensions(dims || null);
            }}
          />
        </div>

        {/* Right Column: Pre-Flight Customization Studio Panel */}
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
            className="glass-panel"
            style={{
              padding: "16px 20px",
              background: "rgba(10, 15, 26, 0.5)",
              border: "1px dashed var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "8px" }}>
              Active Launch Video Recipe
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "11px" }}>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)" }}>
                {aspectRatio} Format
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: "rgba(168, 85, 247, 0.15)", color: "var(--accent-secondary)" }}>
                {duration}s Duration
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", color: "var(--text-primary)" }}>
                Tone: {customTone ? `Custom` : tone}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: "rgba(56, 189, 248, 0.15)", color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: themePalette.primary, display: "inline-block" }} />
                {visualTheme !== "default-dark" ? visualTheme : "Brand Theme"}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: voiceConfig.enabled ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)", color: voiceConfig.enabled ? "var(--success)" : "var(--text-muted)" }}>
                {voiceConfig.enabled ? `Voice: ${voiceConfig.voiceId === "auto" ? "AI Auto" : voiceConfig.voiceId}` : "Voice: Off"}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: preFlightAudio.selectedMusicTrack === "auto" ? "rgba(234, 88, 12, 0.15)" : "rgba(234, 88, 12, 0.15)", color: "#f97316" }}>
                Music: {preFlightAudio.selectedMusicTrack === "auto" ? "AI Smart Select" : preFlightAudio.selectedMusicTrack}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: subtitlesConfig.enabled ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.05)", color: subtitlesConfig.enabled ? "var(--accent-secondary)" : "var(--text-muted)" }}>
                {subtitlesConfig.enabled ? `Captions: ${subtitlesConfig.style}` : "Captions: Off"}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: screenMode === "mockup" ? "rgba(99, 102, 241, 0.15)" : "rgba(56, 189, 248, 0.15)", color: screenMode === "mockup" ? "var(--accent-primary)" : "var(--accent-secondary)" }}>
                {screenMode === "mockup" ? "Synthesized HTML/CSS" : "Direct Screenshot"}
              </span>
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: imageUrl ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)", color: imageUrl ? "var(--success)" : "var(--text-muted)" }}>
                {imageUrl ? "✓ Visual Attached" : "Prompt-Only Mode"}
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

          {storyboard && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
                cursor: "pointer",
              }}
            >
              <Film size={15} />
              <span>Export Local MP4</span>
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
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
              boxShadow: "0 0 24px rgba(99, 102, 241, 0.45)",
              opacity: isGenerating || !prompt.trim() ? 0.7 : 1,
              cursor: isGenerating || !prompt.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Synthesizing Launch Video...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="#fff" />
                <span>{renderedResult ? "Re-generate Finished Video" : "Generate Finished Launch Video"}</span>
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
