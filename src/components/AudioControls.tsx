import { useState, useEffect, useRef } from "react";
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Mic,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { AudioConfig, MusicTrack, Tone, Storyboard } from "../types";

interface AudioControlsProps {
  audioConfig: AudioConfig;
  onAudioConfigChange: (config: AudioConfig) => void;
  storyboardTone?: Tone;
  storyboard?: Storyboard;
  onUpdateStoryboard?: (updated: Storyboard) => void;
}

const KOKORO_VOICES = [
  { id: "af_heart", name: "Heart (Warm & Conversational)", gender: "Female" },
  { id: "af_nova", name: "Nova (High Energy & Upbeat)", gender: "Female" },
  { id: "af_sky", name: "Sky (Crisp & Articulate)", gender: "Female" },
  { id: "am_adam", name: "Adam (Confident Founder)", gender: "Male" },
  { id: "am_michael", name: "Michael (Deep & Cinematic)", gender: "Male" },
  { id: "bf_emma", name: "Emma (Polished British)", gender: "Female" },
  { id: "bm_george", name: "George (Sophisticated Storyteller)", gender: "Male" },
];

export function AudioControls({
  audioConfig,
  onAudioConfigChange,
  storyboardTone = "default",
  storyboard,
  onUpdateStoryboard,
}: AudioControlsProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Voiceover state
  const [voiceoverVoice, setVoiceoverVoice] = useState(
    audioConfig.voiceoverVoice || storyboard?.voiceoverVoice || "af_heart"
  );
  const [isGeneratingVo, setIsGeneratingVo] = useState(false);
  const [voError, setVoError] = useState<string | null>(null);
  const [voSuccess, setVoSuccess] = useState(false);
  const [isPlayingVo, setIsPlayingVo] = useState(false);
  const voAudioRef = useRef<HTMLAudioElement | null>(null);

  // Build default narration script from storyboard if not already present
  const defaultScript =
    storyboard?.voiceoverScript ||
    (storyboard?.scenes || [])
      .map((s) => `${s.headline}. ${s.subtext || ""}`)
      .join(" ")
      .trim() ||
    "Introducing the fastest way to turn your ideas into high converting launch videos.";

  const [narrationScript, setNarrationScript] = useState(defaultScript);

  // Sync script when storyboard changes
  useEffect(() => {
    if (storyboard?.voiceoverScript) {
      setNarrationScript(storyboard.voiceoverScript);
    } else if (storyboard?.scenes && storyboard.scenes.length > 0) {
      const compiled = storyboard.scenes
        .map((s) => `${s.headline}. ${s.subtext || ""}`.trim())
        .filter(Boolean)
        .join(" ");
      if (compiled) setNarrationScript(compiled);
    }
  }, [storyboard?.title]);

  // Fetch audio catalog from server
  useEffect(() => {
    fetch(`/api/assets/audio?tone=${storyboardTone}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.music)) {
          setTracks(data.music);
          if (!audioConfig.selectedMusicTrack && data.recommendedTrack) {
            onAudioConfigChange({
              ...audioConfig,
              selectedMusicTrack: data.recommendedTrack.id,
            });
          }
        }
      })
      .catch((err) => {
        console.warn("[AudioControls] Failed to fetch audio catalog:", err);
      });
  }, [storyboardTone]);

  // Handle live audition playback in browser
  const toggleAudition = (track: MusicTrack) => {
    if (previewingTrackId === track.id) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewingTrackId(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const audio = new Audio(track.url);
      audio.volume = audioConfig.isMuted ? 0 : audioConfig.musicVolume;
      audio.play().catch(() => {});
      audio.onended = () => setPreviewingTrackId(null);
      audioPreviewRef.current = audio;
      setPreviewingTrackId(track.id);
    }
  };

  // Generate voiceover audio via backend Kokoro route
  const handleGenerateVoiceover = async () => {
    if (!narrationScript.trim() || isGeneratingVo) return;

    setIsGeneratingVo(true);
    setVoError(null);
    setVoSuccess(false);

    try {
      const res = await fetch("/api/generate-voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: narrationScript.trim(),
          voice: voiceoverVoice,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate voiceover.");
      }

      onAudioConfigChange({
        ...audioConfig,
        voiceoverUrl: data.voiceoverUrl,
        voiceoverVoice: data.voice,
        voiceoverEnabled: true,
      });

      if (onUpdateStoryboard && storyboard) {
        onUpdateStoryboard({
          ...storyboard,
          voiceoverUrl: data.voiceoverUrl,
          voiceoverVoice: data.voice,
          voiceoverScript: narrationScript.trim(),
        });
      }

      setVoSuccess(true);
      setTimeout(() => setVoSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Voiceover generation error";
      setVoError(msg);
    } finally {
      setIsGeneratingVo(false);
    }
  };

  const toggleVoPlayback = () => {
    const url = audioConfig.voiceoverUrl || storyboard?.voiceoverUrl;
    if (!url) return;

    if (isPlayingVo) {
      if (voAudioRef.current) voAudioRef.current.pause();
      setIsPlayingVo(false);
    } else {
      if (voAudioRef.current) voAudioRef.current.pause();
      const audio = new Audio(url);
      audio.volume = audioConfig.isMuted ? 0 : (audioConfig.voiceoverVolume ?? 1.0);
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingVo(false);
      voAudioRef.current = audio;
      setIsPlayingVo(true);
    }
  };

  // Stop audition when unmounted
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      if (voAudioRef.current) voAudioRef.current.pause();
    };
  }, []);

  const activeVoUrl = audioConfig.voiceoverUrl || storyboard?.voiceoverUrl;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(168, 85, 247, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-secondary)",
            }}
          >
            <Music size={15} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Audio & Voiceover Studio</h3>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>
              High-energy Ende.app beats + 100% local Kokoro AI voiceover narration
            </p>
          </div>
        </div>

        {/* Global Mute Toggle */}
        <button
          type="button"
          onClick={() =>
            onAudioConfigChange({
              ...audioConfig,
              isMuted: !audioConfig.isMuted,
            })
          }
          className="btn-ghost"
          style={{
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: audioConfig.isMuted ? "var(--danger)" : "var(--text-secondary)",
          }}
          title={audioConfig.isMuted ? "Unmute all audio" : "Mute all audio"}
        >
          {audioConfig.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{audioConfig.isMuted ? "Muted" : "Active"}</span>
        </button>
      </div>

      {/* --- VOICEOVER NARRATION SECTION --- */}
      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(99, 102, 241, 0.06)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "700",
                background: "rgba(99, 102, 241, 0.25)",
                color: "#a5b4fc",
                textTransform: "uppercase",
              }}
            >
              <Mic size={12} /> Kokoro TTS
            </span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
              Voiceover Narration
            </span>
          </div>

          {/* Voice Selector Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Voice:</span>
            <select
              value={voiceoverVoice}
              onChange={(e) => setVoiceoverVoice(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              {KOKORO_VOICES.map((v) => (
                <option key={v.id} value={v.id} style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)" }}>
                  {v.name} ({v.gender})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Script Editor Textarea */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <FileText size={11} /> Narration Script (Auto-synced to video timing):
            </span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              {narrationScript.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={3}
            value={narrationScript}
            onChange={(e) => setNarrationScript(e.target.value)}
            placeholder="Enter the voiceover script for your video..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              fontSize: "12px",
              lineHeight: 1.5,
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Voiceover Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <button
            type="button"
            onClick={handleGenerateVoiceover}
            disabled={isGeneratingVo || !narrationScript.trim()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 16px",
              borderRadius: "8px",
              background: isGeneratingVo ? "rgba(99, 102, 241, 0.3)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              cursor: isGeneratingVo ? "wait" : "pointer",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
            }}
          >
            {isGeneratingVo ? (
              <>
                <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                <span>Synthesizing Voiceover...</span>
              </>
            ) : (
              <>
                <Mic size={13} />
                <span>Generate Voiceover</span>
              </>
            )}
          </button>

          {activeVoUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={toggleVoPlayback}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: isPlayingVo ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
                  border: isPlayingVo ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(34, 197, 94, 0.4)",
                  color: isPlayingVo ? "#f87171" : "#4ade80",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {isPlayingVo ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlayingVo ? "Pause Audition" : "Audition Voiceover"}</span>
              </button>
              <span
                style={{
                  fontSize: "11px",
                  color: "#34d399",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: "600",
                }}
              >
                <CheckCircle2 size={13} /> Ready & Linked
              </span>
            </div>
          )}
        </div>

        {voSuccess && (
          <div style={{ fontSize: "11px", color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={13} /> Voiceover synthesized successfully and synchronized with Remotion timeline!
          </div>
        )}

        {voError && (
          <div style={{ fontSize: "11px", color: "var(--danger)", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertCircle size={13} /> {voError}
          </div>
        )}

        {/* Ducking notification notice */}
        <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4, borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "8px" }}>
          💡 <strong>Smart Ducking:</strong> When voiceover narration is active, background music automatically ducks down to 25% volume for crystal-clear vocal prominence.
        </div>
      </div>

      {/* --- UPBEAT MUSIC TRACKS GRID --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>
            Upbeat Background Music Tracks:
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Royalty-free CC0 by Ende.app
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
          {tracks.map((track) => {
            const isSelected = (audioConfig.selectedMusicTrack || "happy-beats-vol-1") === track.id;
            const isPlaying = previewingTrackId === track.id;

            return (
              <div
                key={track.id}
                onClick={() =>
                  onAudioConfigChange({
                    ...audioConfig,
                    selectedMusicTrack: track.id,
                  })
                }
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: isSelected
                    ? "1px solid var(--accent-primary)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: isSelected
                    ? "rgba(99, 102, 241, 0.12)"
                    : "rgba(255, 255, 255, 0.02)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: isSelected ? "#fff" : "var(--text-primary)" }}>
                    {track.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudition(track);
                    }}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "1px solid var(--border-medium)",
                      background: isPlaying ? "var(--accent-primary)" : "var(--bg-surface-3)",
                      color: isPlaying ? "#ffffff" : "var(--text-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    title={isPlaying ? "Pause preview" : "Audition track"}
                  >
                    {isPlaying ? <Pause size={11} /> : <Play size={11} />}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)" }}>
                  <span>{track.mood}</span>
                  <span style={{ fontWeight: "600", color: "#a5b4fc" }}>{track.bpm} BPM</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- VOLUME SLIDERS GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "14px",
          padding: "14px 18px",
          borderRadius: "10px",
          background: "rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Voiceover Volume */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Mic size={12} /> Voice Volume
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round((audioConfig.voiceoverVolume ?? 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.voiceoverVolume ?? 1.0}
            onChange={(e) =>
              onAudioConfigChange({
                ...audioConfig,
                voiceoverVolume: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
          />
        </div>

        {/* Background Music Volume */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Music size={12} /> Music Bed
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round(audioConfig.musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.musicVolume}
            onChange={(e) =>
              onAudioConfigChange({
                ...audioConfig,
                musicVolume: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "var(--accent-secondary)", cursor: "pointer" }}
          />
        </div>

        {/* SFX Volume */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sliders size={12} /> SFX Impacts
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-primary)" }}>
              {Math.round(audioConfig.sfxVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.sfxVolume}
            onChange={(e) =>
              onAudioConfigChange({
                ...audioConfig,
                sfxVolume: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
