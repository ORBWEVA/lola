export const colors = {
  bg: "#0a0a1a",
  surface: "#12122a",
  surface2: "#1a1a3a",
  surface3: "#22224a",
  indigo: "#4361ee",
  rose: "#ff4d6d",
  sky: "#4cc9f0",
  success: "#06d6a0",
  warning: "#ffd166",
  error: "#ef476f",
  text: "#f0f0f8",
  textSecondary: "#9595b0",
  textMuted: "#555575",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glass: "rgba(18, 18, 42, 0.65)",
  border: "rgba(255, 255, 255, 0.06)",
} as const;

export const gradients = {
  brand: "linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)",
  rose: "linear-gradient(135deg, #ff4d6d 0%, #ff6b9d 100%)",
  bgTop: "linear-gradient(180deg, rgba(10,10,26,0.8) 0%, transparent 100%)",
  bgBottom: "linear-gradient(0deg, rgba(10,10,26,0.9) 0%, transparent 100%)",
} as const;

export const fonts = {
  display: "'Exo 2', system-ui, sans-serif",
  mono: "'Space Mono', monospace",
  jp: "'Noto Sans JP', 'Exo 2', sans-serif",
} as const;

export const VIDEO = {
  WIDTH: 1920,
  HEIGHT: 1080,
  FPS: 30,
} as const;

// Segment durations — total ~3:30
export const SEGMENTS = {
  INTRO: 6,           // LoLA logo + glow
  VEO_HOOK: 8,        // 1A classroom + 1B frustrated learner
  VEO_SAME: 6,        // 1C same tutors
  PROBLEM: 12,        // Text: problem statement
  VEO_INSIGHT: 8,     // 2A two learners + 2B brand reveal
  DEMO_LANDING: 5,    // Landing screenshot
  DEMO_PRONUNCIATION: 10, // Demo page screenshot
  DEMO_GRAMMAR: 10,   // Demo page screenshot
  DEMO_CULTURAL: 10,  // Demo page screenshot
  VEO_RESEARCH: 4,    // 7T research books transition
  ARCHITECTURE: 10,   // Architecture diagram
  VEO_DOMAINS: 8,     // 8A domain expansion
  VEO_CREATOR: 8,     // 8B creator platform
  MULTI_DOMAIN: 10,   // Text slides
  VEO_CLOSE: 8,       // 9A Adelaide dawn
  CLOSE: 8,           // Logo + tagline
} as const;

export const FRAMES = Object.fromEntries(
  Object.entries(SEGMENTS).map(([k, v]) => [k, v * VIDEO.FPS])
) as Record<keyof typeof SEGMENTS, number>;

export const TOTAL_FRAMES = Object.values(SEGMENTS).reduce((a, b) => a + b, 0) * VIDEO.FPS;
