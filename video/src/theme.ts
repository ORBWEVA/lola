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

// Segment durations in seconds
export const SEGMENTS = {
  INTRO: 8,
  PROBLEM: 17,
  ONBOARDING: 25,
  SPLIT_SCREEN: 70,
  VISION: 30,
  ARCHITECTURE: 25,
  MULTI_DOMAIN: 20,
  CLOSE: 20,
} as const;

// Frame counts (seconds * FPS)
export const FRAMES = {
  INTRO: SEGMENTS.INTRO * VIDEO.FPS,         // 240
  PROBLEM: SEGMENTS.PROBLEM * VIDEO.FPS,     // 510
  ONBOARDING: SEGMENTS.ONBOARDING * VIDEO.FPS, // 750
  SPLIT_SCREEN: SEGMENTS.SPLIT_SCREEN * VIDEO.FPS, // 2100
  VISION: SEGMENTS.VISION * VIDEO.FPS,       // 900
  ARCHITECTURE: SEGMENTS.ARCHITECTURE * VIDEO.FPS, // 750
  MULTI_DOMAIN: SEGMENTS.MULTI_DOMAIN * VIDEO.FPS, // 600
  CLOSE: SEGMENTS.CLOSE * VIDEO.FPS,         // 600
} as const;

export const TOTAL_FRAMES =
  FRAMES.INTRO +
  FRAMES.PROBLEM +
  FRAMES.ONBOARDING +
  FRAMES.SPLIT_SCREEN +
  FRAMES.VISION +
  FRAMES.ARCHITECTURE +
  FRAMES.MULTI_DOMAIN +
  FRAMES.CLOSE; // 6450
