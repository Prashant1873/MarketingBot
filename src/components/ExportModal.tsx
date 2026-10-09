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
  error?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, storyboard }) => {
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [jobState, setJobState] = useState<RenderJobState | null>(null);
  const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "discord">("twitter");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const shareCopy: FormattedShareCopy = getAllShareCopy(storyboard);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen && renderStatus === "idle") {
      // Keep idle so user can click start, or auto-start if desired
    }
  }, [isOpen]);

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
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/render/${jobId}/status`);
        if (!res.ok) return;

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

  if (!isOpen) return null;

  const resolutionMap = {
    "16:9": "1920 × 1080 (Landscape)",
    "9:16": "1080 × 1920 (Vertical)",
    "1:1": "1080 × 1080 (Square)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0e0e12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Export & Delivery Studio</h2>
              <p className="text-xs text-white/50">100% Local 1080p MP4 Render with Frame-0 Poster Baking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Pre-render State */}
          {renderStatus === "idle" && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Video Specifications</span>
                  <span className="text-xs text-violet-400 font-medium">H.264 / AAC 30 FPS</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[11px] text-white/40 block">Resolution</span>
                    <span className="text-xs font-semibold text-white mt-1 block">
                      {resolutionMap[storyboard.aspectRatio] || "1920 × 1080"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[11px] text-white/40 block">Duration</span>
                    <span className="text-xs font-semibold text-white mt-1 block">
                      {storyboard.targetDuration || 15} Seconds
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[11px] text-white/40 block">Soundtrack</span>
                    <span className="text-xs font-semibold text-white mt-1 block truncate">
                      {storyboard.audioDirection?.trackRecommendation || "Tech Pulse"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Poster info pill */}
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="text-xs text-violet-200/80 leading-relaxed">
                  <strong className="text-violet-300 font-medium">Frame-0 Poster Baking Active:</strong> Marcutie will automatically extract a high-resolution settled poster frame at the product reveal moment and bake it into frame 0 of the exported MP4 so Twitter/X, Discord, and LinkedIn display it as the cover thumbnail.
                </div>
              </div>

              {/* Start Render Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartRender}
                  className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Start Local Render</span>
                </button>
              </div>
            </div>
          )}

          {/* Rendering Progress State */}
          {renderStatus === "rendering" && (
            <div className="space-y-6 py-6 text-center">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
                <Film className="w-8 h-8 text-violet-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">Rendering Launch Video...</h3>
                <p className="text-xs text-white/60 font-mono">
                  {jobState?.currentStep || "Processing video frames on local machine..."}
                </p>
              </div>

              {/* Rotating Left-to-Right Progress Bar */}
              <div className="w-full max-w-md mx-auto space-y-2">
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative p-[2px] border border-white/5">
                  <div
                    className="h-full progress-rotating-bar rounded-full"
                    style={{ width: `${Math.max(5, jobState?.progress || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-white/40">
                  <span>Rendering locally</span>
                  <span>{jobState?.progress || 0}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 inline-flex items-center gap-2 text-xs text-white/50">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                <span>Zero cloud fees • Processing directly on your CPU/GPU</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {renderStatus === "error" && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Rendering Encountered an Issue</h3>
                <p className="text-xs text-red-300/80 max-w-md mx-auto">
                  {jobState?.error || "An unexpected error occurred during video rendering."}
                </p>
              </div>
              <button
                onClick={handleStartRender}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Completed Delivery State */}
          {renderStatus === "completed" && jobState && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">Video Rendered Successfully with Frame-0 Poster Baked!</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/80">
                  {jobState.fileSize ? `${(jobState.fileSize / (1024 * 1024)).toFixed(2)} MB` : "Ready"}
                </span>
              </div>

              {/* Video Player, Animated GIF & Poster Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Final MP4 Video Player */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-violet-400" />
                    <span>Rendered MP4 Preview</span>
                  </span>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                    <video
                      src={jobState.videoUrl}
                      controls
                      autoPlay
                      muted
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/download`}
                    download
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4</span>
                  </a>
                </div>

                {/* Animated GIF Loop */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Animated GIF Loop (15 FPS)</span>
                  </span>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg flex items-center justify-center">
                    <img
                      src={jobState.gifUrl || `/renders/${jobState.id}/marcutie_preview.gif`}
                      alt="Animated GIF loop"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/gif/download`}
                    download
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download GIF Loop</span>
                  </a>
                </div>

                {/* Settled Poster Frame */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cover Poster Frame</span>
                  </span>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg flex items-center justify-center">
                    <img
                      src={jobState.posterUrl}
                      alt="Settled cover poster"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <a
                    href={`/api/render/${jobState.id}/poster`}
                    download
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Poster</span>
                  </a>
                </div>
              </div>

              {/* Social Launch Copy Section */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold text-white">Social Launch Captions</span>
                  </div>
                  {/* Platform Tabs */}
                  <div className="flex items-center p-1 rounded-lg bg-black/40 border border-white/5">
                    <button
                      onClick={() => setActiveTab("twitter")}
                      className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                        activeTab === "twitter"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      𝕏 Twitter
                    </button>
                    <button
                      onClick={() => setActiveTab("linkedin")}
                      className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                        activeTab === "linkedin"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => setActiveTab("discord")}
                      className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                        activeTab === "discord"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Discord
                    </button>
                  </div>
                </div>

                {/* Tab Copy Box */}
                <div className="relative">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-white/80 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {activeTab === "twitter" && shareCopy.twitter.text}
                    {activeTab === "linkedin" && shareCopy.linkedin}
                    {activeTab === "discord" && shareCopy.discord}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[11px] text-white/40">
                      {activeTab === "twitter" && (
                        <span>
                          {shareCopy.twitter.charCount} / 280 Characters{" "}
                          {shareCopy.twitter.isUnderLimit ? "✓" : "(Thread Recommended)"}
                        </span>
                      )}
                      {activeTab === "linkedin" && <span>Story-driven mobile feed format</span>}
                      {activeTab === "discord" && <span>Markdown community announcement</span>}
                    </div>

                    <button
                      onClick={() => {
                        const text =
                          activeTab === "twitter"
                            ? shareCopy.twitter.text
                            : activeTab === "linkedin"
                            ? shareCopy.linkedin
                            : shareCopy.discord;
                        handleCopy(text, activeTab);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedTab === activeTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Layers className="w-3.5 h-3.5" />
            <span>Marcutie v1.0 • Local Render Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
