import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceMono";
import { colors } from "../theme";
import { LolaLogo } from "../components/LolaLogo";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const GlowBlob: React.FC<{
  color: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}> = ({ color, x, y, size, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [delay, delay + 1 * fps], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drift = interpolate(
    frame,
    [0, 8 * fps],
    [0, 20],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + drift,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40, transparent 70%)`,
        filter: "blur(60px)",
        opacity,
      }}
    />
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const badgeOpacity = interpolate(
    frame,
    [2 * fps, 2.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      {/* Ambient glow blobs */}
      <GlowBlob color={colors.indigo} x={500} y={400} size={500} delay={0} />
      <GlowBlob color={colors.sky} x={1400} y={600} size={400} delay={5} />
      <GlowBlob color={colors.rose} x={960} y={300} size={300} delay={10} />

      {/* Logo */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LolaLogo
            size={140}
            showSubtitle
            subtitle="Adaptive Language Coaching"
            delay={10}
          />
        </div>
      </Sequence>

      {/* Hackathon badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 48,
          opacity: badgeOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 20px",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: colors.sky,
            boxShadow: `0 0 8px ${colors.sky}60`,
          }}
        />
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: colors.textSecondary,
          }}
        >
          Gemini API Developer Competition 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};
