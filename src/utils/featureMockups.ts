import { FeatureType, FeatureMockup, ThemePalette } from "../types";

export function createDefaultFeatureMockup(
  archetype: FeatureType,
  title: string = "Core Feature"
): FeatureMockup {
  switch (archetype) {
    case "kanban":
      return {
        featureType: "kanban",
        title: `${title} Board`,
        subtitle: "Real-time task synchronization",
        items: [
          { label: "Design system audit", badge: "High Priority", status: "In Progress", color: "#f59e0b" },
          { label: "API endpoint caching", badge: "Backend", status: "Done", color: "#10b981" },
          { label: "Dark mode animations", badge: "UI / UX", status: "Review", color: "#6366f1" },
        ],
      };
    case "chat":
      return {
        featureType: "chat",
        title: `${title} AI Assistant`,
        subtitle: "Instant intelligent reasoning",
        items: [
          { label: "User", value: "How do I accelerate our launch workflow?" },
          { label: "Assistant", value: "Generate high-converting videos locally in 10 seconds with Marcutie." },
          { label: "User", value: "Show me the real-time analytics for today." },
        ],
      };
    case "checkout":
      return {
        featureType: "checkout",
        title: `${title} Checkout`,
        subtitle: "Instant 1-click conversion",
        items: [
          { label: "Pro Annual License", value: "$199/yr", badge: "Best Value" },
          { label: "Instant Cloud Sync", value: "Free", badge: "Included" },
          { label: "Priority Support 24/7", value: "Free", badge: "VIP" },
        ],
      };
    case "feed":
      return {
        featureType: "feed",
        title: `${title} Community`,
        subtitle: "Live activity & member engagement",
        items: [
          { label: "Sarah Founder", value: "Just launched our new product on Product Hunt! 🚀", badge: "2m ago" },
          { label: "Alex Engineer", value: "Performance improved by 40% with the latest update.", badge: "12m ago" },
          { label: "Elena Designer", value: "New motion graphics components are live in repo.", badge: "1h ago" },
        ],
      };
    case "settings":
      return {
        featureType: "settings",
        title: `${title} Preferences`,
        subtitle: "Manage keys and workspace settings",
        items: [
          { label: "Local GPU Acceleration", badge: "Enabled", status: "Active" },
          { label: "High-Res Poster Baking", badge: "Automated", status: "Active" },
          { label: "BYOK Encryption", badge: "AES-256", status: "Active" },
        ],
      };
    case "analytics":
    default:
      return {
        featureType: "analytics",
        title: `${title} Analytics`,
        subtitle: "Live execution metrics & telemetry",
        items: [
          { label: "Active Bandwidth", value: "148,290 req/s", badge: "+28.4% ↑" },
          { label: "Average Latency", value: "12.4 ms", badge: "-38.2% ↓" },
          { label: "System Uptime", value: "99.99%", badge: "Optimal" },
        ],
      };
  }
}

export const PRESET_THEME_PALETTES: Record<string, ThemePalette> = {
  indigo: {
    primary: "#6366f1",
    secondary: "#38bdf8",
    accent: "#10b981",
    background: "#090d16",
    surface: "#131b2e",
    text: "#f8fafc",
    isDark: true,
  },
  crimson: {
    primary: "#e11d48",
    secondary: "#fb7185",
    accent: "#f43f5e",
    background: "#050505",
    surface: "#18181b",
    text: "#ffffff",
    isDark: true,
  },
  emerald: {
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#059669",
    background: "#022c22",
    surface: "#064e3b",
    text: "#ecfdf5",
    isDark: true,
  },
  amber: {
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#fb923c",
    background: "#0c0a09",
    surface: "#1c1917",
    text: "#fbfbfe",
    isDark: true,
  },
  neon: {
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#06b6d4",
    background: "#0f0728",
    surface: "#1f103d",
    text: "#ffffff",
    isDark: true,
  },
};
