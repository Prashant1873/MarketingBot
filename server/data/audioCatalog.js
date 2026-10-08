/**
 * Curated metadata catalog for bundled royalty-free CC0 music tracks and sound effects.
 */

export const musicTracks = [
  {
    id: "pulse-launch-theme",
    name: "Pulse Launch Theme",
    filename: "pulse-launch-theme.wav",
    url: "/assets/music/pulse-launch-theme.wav",
    bpm: 124,
    mood: "Driving Tech Pulse",
    tones: ["default", "polished", "app-store"],
    description: "Punchy electronic percussion and ascending synth chords for fast-paced modern product releases.",
  },
  {
    id: "cyber-synth-groove",
    name: "Cyber Synth Groove",
    filename: "cyber-synth-groove.wav",
    url: "/assets/music/cyber-synth-groove.wav",
    bpm: 128,
    mood: "Cyber Synthwave",
    tones: ["chaotic", "cinematic"],
    description: "Analog basslines and retrofuturistic synth arpeggios delivering high-intensity cinematic momentum.",
  },
  {
    id: "indie-hustle-acoustic",
    name: "Indie Hustle Acoustic",
    filename: "indie-hustle-acoustic.wav",
    url: "/assets/music/indie-hustle-acoustic.wav",
    bpm: 115,
    mood: "Optimistic Indie Pop",
    tones: ["yc-parody"],
    description: "Upbeat organic strums and playful claps ideal for lighthearted startup pitches and founder stories.",
  },
  {
    id: "minimal-dark-sub",
    name: "Minimal Dark Sub",
    filename: "minimal-dark-sub.wav",
    url: "/assets/music/minimal-dark-sub.wav",
    bpm: 100,
    mood: "Deep Minimal Bass",
    tones: ["deadpan"],
    description: "Low-frequency rumble and understated sub-bass textures suited for dry, minimalist, or deadpan launches.",
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
