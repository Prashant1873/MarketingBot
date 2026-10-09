/**
 * Curated metadata catalog for bundled royalty-free CC0 music tracks and sound effects.
 * Featuring high-energy "Happy Beats / Business Moves" tracks by Ende.app.
 */

export const musicTracks = [
  {
    id: "happy-beats-vol-1",
    name: "Happy Beats: Business Moves (Vol 1)",
    filename: "happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    bpm: 125,
    mood: "Driving Upbeat Energy",
    tones: ["default", "polished", "app-store"],
    description: "High-energy modern tech beat by Ende.app with driving bass and crisp percussion.",
  },
  {
    id: "happy-beats-vol-10",
    name: "Happy Beats: Compact Pulse (Vol 10)",
    filename: "happy-beats-business-moves-vol-10-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3",
    bpm: 130,
    mood: "Fast & Punchy",
    tones: ["chaotic"],
    description: "Compact high-tempo loop delivering rapid momentum.",
  },
  {
    id: "happy-beats-vol-9",
    name: "Happy Beats: Founder Hustle (Vol 9)",
    filename: "happy-beats-business-moves-vol-9-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3",
    bpm: 118,
    mood: "Optimistic Founder Groove",
    tones: ["yc-parody"],
    description: "Playful, confident bounce ideal for startup launches.",
  },
  {
    id: "happy-beats-vol-11",
    name: "Happy Beats: Clean Corporate (Vol 11)",
    filename: "happy-beats-business-moves-vol-11-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3",
    bpm: 112,
    mood: "Warm & Elegant",
    tones: ["polished"],
    description: "Smooth, warm, and sophisticated production.",
  },
  {
    id: "happy-beats-vol-12",
    name: "Happy Beats: Cinematic Focus (Vol 12)",
    filename: "happy-beats-business-moves-vol-12-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3",
    bpm: 105,
    mood: "Cinematic & Deep",
    tones: ["cinematic", "deadpan"],
    description: "Steady, understated, cinematic presence.",
  },
  {
    id: "pulse-launch-theme",
    name: "Pulse Launch Theme (Upbeat)",
    filename: "happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    url: "/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3",
    bpm: 125,
    mood: "Driving Tech Pulse",
    tones: ["default"],
    description: "Upbeat high-energy launch soundtrack.",
  },
];

export const sfxLibrary = [
  {
    id: "heavy_slam",
    name: "Heavy Impact Slam",
    category: "impact",
    filename: "heavy_slam.wav",
    url: "/assets/sfx/impact/heavy_slam.wav",
    cue: "hook_slam",
    mood: "High Impact",
  },
  {
    id: "whoosh",
    name: "Air Riser Whoosh",
    category: "interface",
    filename: "whoosh.wav",
    url: "/assets/sfx/interface/whoosh.wav",
    cue: "card_entrance",
    mood: "Smooth Transition",
  },
  {
    id: "pop",
    name: "Soft Element Pop",
    category: "ui",
    filename: "pop.wav",
    url: "/assets/sfx/ui/pop.wav",
    cue: "feature_badge",
    mood: "Playful Accent",
  },
  {
    id: "click",
    name: "Snappy Tactile Click",
    category: "ui",
    filename: "click.wav",
    url: "/assets/sfx/ui/click.wav",
    cue: "cta_arrival",
    mood: "Mechanical Confirmation",
  },
];

/**
 * Returns the best recommended music track matching the given creative tone.
 * @param {string} tone
 * @returns {object} musicTrack
 */
export function getRecommendedTrack(tone = "default") {
  const normalizedTone = String(tone || "").toLowerCase().trim();
  const matched = musicTracks.find((track) => track.tones.includes(normalizedTone));
  return matched || musicTracks[0];
}
