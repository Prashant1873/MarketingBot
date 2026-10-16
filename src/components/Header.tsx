import React from "react";
import { Sparkles, Server, AlertCircle, Settings, Command, Sun, Moon } from "lucide-react";

interface HeaderProps {
  serverStatus: "checking" | "online" | "offline";
  serverVersion?: string;
  onOpenSettings: () => void;
  hasApiKeys: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  serverStatus,
  serverVersion = "1.0",
  onOpenSettings,
  hasApiKeys,
  theme,
  onToggleTheme,
}) => {
  return (
    <header
      className="studio-panel"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        marginBottom: "28px",
        background: "var(--bg-surface-1)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Brand Mark & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(79, 70, 229, 0.35)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1 style={{ fontSize: "19px", fontWeight: "800", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
              Marcutie
            </h1>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
              / Creative Director Studio
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Local-first motion graphics & launch video generation engine
          </p>
        </div>
      </div>

      {/* Right Telemetry Controls: Status + Shortcut Hint + API Keys */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Render shortcut chip */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border-subtle)",
            fontSize: "11px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
          className="desktop-shortcut-hint"
        >
          <Command size={12} />
          <span>Enter to compile</span>
        </div>

        {/* Server status telemetry readout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-subtle)",
            fontSize: "12px",
            fontWeight: "500",
            minHeight: "36px",
          }}
          role="status"
          aria-live="polite"
        >
          <Server size={14} color="var(--text-muted)" />
          {serverStatus === "checking" && (
            <span style={{ color: "var(--text-muted)" }}>Checking :3001</span>
          )}
          {serverStatus === "online" && (
            <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--success)",
                  boxShadow: "0 0 8px var(--success)",
                  display: "inline-block",
                }}
              />
              Engine v{serverVersion}
            </span>
          )}
          {serverStatus === "offline" && (
            <span style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "5px" }}>
              <AlertCircle size={14} /> Server Offline
            </span>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          id="header-theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          className="btn-secondary"
          style={{
            minHeight: "44px",
            padding: "8px 14px",
            fontSize: "13px",
            borderRadius: "var(--radius-sm)",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
          }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? (
            <Sun size={15} className="theme-toggle-icon" color="var(--warning)" />
          ) : (
            <Moon size={15} className="theme-toggle-icon" color="var(--accent-primary)" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Settings button */}
        <button
          id="header-settings-btn"
          onClick={onOpenSettings}
          className="btn-secondary"
          style={{
            minHeight: "44px",
            padding: "8px 16px",
            position: "relative",
            fontSize: "13px",
            borderRadius: "var(--radius-sm)",
          }}
          title="Configure API Keys"
          aria-label="Configure API Keys and AI Models"
        >
          <Settings size={15} />
          <span>Settings</span>
          {!hasApiKeys ? (
            <span
              style={{
                position: "absolute",
                top: "-3px",
                right: "-3px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "var(--warning)",
                boxShadow: "0 0 8px var(--warning)",
              }}
              title="API Key required for cloud models (Offline mock active)"
            />
          ) : (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--success)",
              }}
            />
          )}
        </button>
      </div>
    </header>
  );
};
