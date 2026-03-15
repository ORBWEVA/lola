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

// Segment durations — sized to fit voiceover durations + 1s buffer
// VO durations: intro=4.4, hook=10.9, same=4.6, problem=16.9, insight=6.5,
// landing=7.0, pronunciation=8.9, grammar=9.3, cultural=11.6, research=5.7,
// architecture=11.6, multidomain=5.7
export const SEGMENTS = {
  INTRO: 6,              // VO 4.4s — fits
  VEO_HOOK: 12,          // VO 10.9s — was 8, extended
  VEO_SAME: 6,           // VO 4.6s — fits
  PROBLEM: 18,           // VO 16.9s — was 12, extended
  VEO_INSIGHT: 8,        // VO 6.5s — fits
  DEMO_LANDING: 8,       // VO 7.0s — was 5, extended
  DEMO_PRONUNCIATION: 10, // VO 8.9s — fits
  DEMO_GRAMMAR: 11,      // VO 9.3s — was 10, extended
  DEMO_CULTURAL: 13,     // VO 11.6s — was 10, extended
  VEO_RESEARCH: 7,       // VO 5.7s — was 4, extended
  ARCHITECTURE: 13,      // VO 11.6s — was 10, extended
  VEO_DOMAINS: 8,        // no VO — keep
  VEO_CREATOR: 8,        // no VO — keep
  MULTI_DOMAIN: 7,       // VO 5.7s — trimmed from 10
  VEO_CLOSE: 8,          // no VO — keep
  CLOSE: 8,              // no VO — keep
} as const;

export const FRAMES = Object.fromEntries(
  Object.entries(SEGMENTS).map(([k, v]) => [k, v * VIDEO.FPS])
) as Record<keyof typeof SEGMENTS, number>;

export const TOTAL_FRAMES = Object.values(SEGMENTS).reduce((a, b) => a + b, 0) * VIDEO.FPS;
