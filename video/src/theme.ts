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

// Segment durations in seconds — total 3:30 = 210s
export const SEGMENTS = {
  INTRO: 6,
  PROBLEM: 14,
  DEMO_LANDING: 6,
  DEMO_PRONUNCIATION: 12,
  DEMO_GRAMMAR: 12,
  DEMO_CULTURAL: 12,
  ARCHITECTURE: 10,
  MULTI_DOMAIN: 12,
  CLOSE: 10,
} as const;

// Frame counts (seconds * FPS)
export const FRAMES = {
  INTRO: SEGMENTS.INTRO * VIDEO.FPS,
  PROBLEM: SEGMENTS.PROBLEM * VIDEO.FPS,
  DEMO_LANDING: SEGMENTS.DEMO_LANDING * VIDEO.FPS,
  DEMO_PRONUNCIATION: SEGMENTS.DEMO_PRONUNCIATION * VIDEO.FPS,
  DEMO_GRAMMAR: SEGMENTS.DEMO_GRAMMAR * VIDEO.FPS,
  DEMO_CULTURAL: SEGMENTS.DEMO_CULTURAL * VIDEO.FPS,
  ARCHITECTURE: SEGMENTS.ARCHITECTURE * VIDEO.FPS,
  MULTI_DOMAIN: SEGMENTS.MULTI_DOMAIN * VIDEO.FPS,
  CLOSE: SEGMENTS.CLOSE * VIDEO.FPS,
} as const;

export const TOTAL_FRAMES =
  FRAMES.INTRO +
  FRAMES.PROBLEM +
  FRAMES.DEMO_LANDING +
  FRAMES.DEMO_PRONUNCIATION +
  FRAMES.DEMO_GRAMMAR +
  FRAMES.DEMO_CULTURAL +
  FRAMES.ARCHITECTURE +
  FRAMES.MULTI_DOMAIN +
  FRAMES.CLOSE;
