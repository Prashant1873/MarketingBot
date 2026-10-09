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
  slate: {
    primary: "#38bdf8",
    secondary: "#818cf8",
    accent: "#34d399",
    background: "#0b0f19",
    surface: "#111827",
    text: "#f9fafb",
    isDark: true,
  },
  midnight: {
    primary: "#60a5fa",
    secondary: "#a78bfa",
    accent: "#f472b6",
    background: "#030712",
    surface: "#0f172a",
    text: "#f8fafc",
    isDark: true,
  },
  "apple-clean": {
    primary: "#0071e3",
    secondary: "#1d1d1f",
    accent: "#34c759",
    background: "#fbfbfd",
    surface: "#f5f5f7",
    text: "#1d1d1f",
    isDark: false,
    visualTheme: "apple-clean",
  },
  "neo-brutalist": {
    primary: "#ffe600",
    secondary: "#00f0ff",
    accent: "#ff0055",
    background: "#fffdf9",
    surface: "#ffffff",
    text: "#000000",
    isDark: false,
    visualTheme: "neo-brutalist",
  },
  "cyberpunk-scanlines": {
    primary: "#00f0ff",
    secondary: "#ff0055",
    accent: "#00ff66",
    background: "#080014",
    surface: "#12002b",
    text: "#ffffff",
    isDark: true,
    visualTheme: "cyberpunk-scanlines",
  },
  "aurora-glass": {
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#10b981",
    background: "#060918",
    surface: "#0e1530",
    text: "#f8fafc",
    isDark: true,
    visualTheme: "aurora-glass",
  },
};

export const VISUAL_THEME_PALETTES: Record<string, ThemePalette> = {
  "default-dark": {
    primary: "#6366f1",
    secondary: "#38bdf8",
    accent: "#a855f7",
    background: "#070a13",
    surface: "#101628",
    text: "#ffffff",
    isDark: true,
    visualTheme: "default-dark",
  },
  "apple-clean": PRESET_THEME_PALETTES["apple-clean"],
  "neo-brutalist": PRESET_THEME_PALETTES["neo-brutalist"],
  "cyberpunk-scanlines": PRESET_THEME_PALETTES["cyberpunk-scanlines"],
  "aurora-glass": PRESET_THEME_PALETTES["aurora-glass"],
};

export const VISUAL_THEME_OPTIONS = [
  {
    id: "default-dark",
    label: "Modern Dark Mesh",
    desc: "Sleek deep tech canvas with brand-tinted ambient glow",
    badge: "Default",
    paletteKey: "indigo",
  },
  {
    id: "apple-clean",
    label: "Apple Clean Light",
    desc: "Crisp alabaster keynote canvas, pristine typography & subtle borders",
    badge: "Light Mode",
    paletteKey: "apple-clean",
  },
  {
    id: "neo-brutalist",
    label: "Neo-Brutalist Pop",
    desc: "Bold 3px solid borders, thick 6px shadows & punchy color blocks",
    badge: "High-Contrast",
    paletteKey: "neo-brutalist",
  },
  {
    id: "cyberpunk-scanlines",
    label: "Cyberpunk CRT",
    desc: "Retro-futuristic CRT scanline shader, chromatic flicker & neon glow",
    badge: "Shader VFX",
    paletteKey: "cyberpunk-scanlines",
  },
  {
    id: "aurora-glass",
    label: "Aurora Glassmorphism",
    desc: "Ethereal northern lights gradient mesh with frosted specular rims",
    badge: "Glass Specular",
    paletteKey: "aurora-glass",
  },
] as const;

