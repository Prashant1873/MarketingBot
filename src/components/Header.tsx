import React from "react";
import { Sparkles, Server, CheckCircle2, AlertCircle, Settings } from "lucide-react";

interface HeaderProps {
  serverStatus: "checking" | "online" | "offline";
  serverVersion?: string;
  onOpenSettings: () => void;
  hasApiKeys: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  serverStatus,
  serverVersion = "1.0",
  onOpenSettings,
  hasApiKeys,
}) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 24px",
        marginBottom: "32px",
        background: "rgba(13, 19, 34, 0.65)",
        backdropFilter: "blur(16px)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Brand logo & title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
          }}
        >
          <Sparkles size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>Marcutie</h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "2px 8px",
                borderRadius: "999px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--accent-primary)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
              }}
            >
              Local Studio
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Turn prompts & product images into viral marketing videos
          </p>
        </div>
      </div>

      {/* Right controls: Server status pill + Settings trigger */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Server status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 14px",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid var(--border-color)",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          <Server size={14} color="var(--text-secondary)" />
          {serverStatus === "checking" && <span style={{ color: "var(--text-muted)" }}>Checking :3001</span>}
          {serverStatus === "online" && (
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={14} /> Server Online ({serverVersion})
            </span>
          )}
          {serverStatus === "offline" && (
            <span style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "4px" }}>
              <AlertCircle size={14} /> Server Offline
            </span>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="btn-secondary"
          style={{
            padding: "8px 14px",
            position: "relative",
            fontSize: "13px",
          }}
          title="Configure API Keys"
        >
          <Settings size={15} />
          <span>API Keys</span>
          {!hasApiKeys && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "var(--warning)",
                boxShadow: "0 0 8px var(--warning)",
              }}
            />
          )}
        </button>
      </div>
    </header>
  );
};
