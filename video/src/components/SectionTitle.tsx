import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const SectionTitle: React.FC<{
  label: string;
  title: string;
  subtitle?: string;
}> = ({ label, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const slideUp = interpolate(frame, [0, 0.5 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const labelOpacity = interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 14,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.sky,
          marginBottom: 16,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 64,
          color: colors.text,
          letterSpacing: -1,
          transform: `translateY(${slideUp}px)`,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 300,
            fontSize: 24,
            color: colors.textSecondary,
            marginTop: 20,
            opacity: labelOpacity,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
