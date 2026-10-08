import React from "react";
import { FileText, Sparkles, X } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SAMPLE_PROMPTS = [
  {
    label: "SaaS Devtool",
    prompt:
      "Automated zero-downtime database migrations for Postgres. Runs in CI/CD, tests rollbacks automatically on ephemeral replicas, and guarantees zero lock contention on production tables. Built for engineering teams that ship 20 times a day without fear.",
  },
  {
    label: "Ridiculous Startup",
    prompt:
      "Taxi for Taxis: The world's first on-demand flatbed ride-hailing app for ride-hailing vehicles. Every day, taxis carry passengers across 12 metros. But when a taxi gets tired, who carries the taxi? We do. Available now in Series A beta.",
  },
  {
    label: "Minimal Hardware",
    prompt:
      "Monolith 01: A titanium desk clock with no numbers, no apps, and no notifications. Just a mechanical bar that gently fills as the sun crosses your horizon. Reclaim your focus with pure analog tranquility.",
  },
  {
    label: "AI Workflow",
    prompt:
      "DeepLens: An AI agent that watches your Figma designs and writes production-ready React components with pixel-perfect CSS tokens, responsive flexbox layout, and full WCAG AAA accessibility. Ship frontends at the speed of thought.",
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="glass-panel" style={{ padding: "24px", position: "relative" }}>
      {/* Header with Title and Clear button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={18} color="var(--accent-primary)" />
          <h2 style={{ fontSize: "15px", fontWeight: "700" }}>Product Concept & Marketing Pitch</h2>
        </div>
        {value && (
          <button
            onClick={() => onChange("")}
            className="btn-ghost"
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
        Paste a detailed marketing prompt, landing page hero copy, or product description. The AI extracts the visual hook, core value, and feature beats.
      </p>

      {/* Textarea */}
      <div style={{ position: "relative" }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your product, its best claim, target audience, and key highlights..."
          className="glass-input"
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "14px 16px",
            fontSize: "14px",
            lineHeight: "1.6",
            resize: "vertical",
            display: "block",
          }}
        />

        {/* Counter footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "8px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Sample Templates */}
      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <Sparkles size={13} color="var(--accent-secondary)" />
          <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
            Quick Launch Inspiration:
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => onChange(sample.prompt)}
              className="btn-secondary"
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.04)",
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
