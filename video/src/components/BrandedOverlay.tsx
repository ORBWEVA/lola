import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors, gradients } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const BrandedOverlay: React.FC<{
  sectionLabel: string;
  startTime: string;
}> = ({ sectionLabel, startTime }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideIn = interpolate(frame, [0, 0.5 * fps], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const seconds = Math.floor(frame / fps);
  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        opacity: fadeOut,
      }}
    >
      {/* Gradient fade */}
      <div
        style={{
          height: 120,
          background: gradients.bgBottom,
        }}
      />
      {/* Lower third bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 48px",
          backgroundColor: "rgba(10, 10, 26, 0.9)",
          borderTop: `1px solid ${colors.glassBorder}`,
          transform: `translateY(${slideIn}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Accent bar */}
          <div
            style={{
              width: 4,
              height: 32,
              borderRadius: 2,
              background: gradients.brand,
            }}
          />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: 20,
              color: colors.text,
            }}
          >
            {sectionLabel}
          </div>
        </div>
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 14,
            color: colors.textMuted,
            letterSpacing: 2,
          }}
        >
          {startTime} + {mm}:{ss}
        </div>
      </div>
    </div>
  );
};
