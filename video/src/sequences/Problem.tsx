import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const AnimatedLine: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
  size?: number;
  weight?: number;
  isStat?: boolean;
  statValue?: number;
  statSuffix?: string;
}> = ({
  text,
  startFrame,
  color = colors.text,
  size = 48,
  weight = 700,
  isStat,
  statValue,
  statSuffix = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 0.4 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  const slideUp = interpolate(
    frame,
    [startFrame, startFrame + 0.4 * fps],
    [40, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Count-up animation for stats
  let displayText = text;
  if (isStat && statValue !== undefined) {
    const countProgress = interpolate(
      frame,
      [startFrame, startFrame + 1 * fps],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );
    const currentValue = Math.round(statValue * countProgress);
    displayText = text.replace(
      `$${statValue}`,
      `$${currentValue}`
    );
  }

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideUp}px)`,
        fontFamily: isStat ? monoFont : displayFont,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.3,
        maxWidth: 1400,
        textAlign: "center",
      }}
    >
      {displayText}
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 120px",
        opacity: fadeOut,
      }}
    >
      <AnimatedLine
        text="Japan & South Korea spend $20B+ on English learning"
        startFrame={0}
        size={44}
        weight={300}
      />
      <AnimatedLine
        text="Yet rank near the bottom in global proficiency"
        startFrame={Math.round(3 * fps)}
        color={colors.rose}
        size={52}
      />
      <AnimatedLine
        text="Every AI tutor gives the same correction to every learner"
        startFrame={Math.round(7 * fps)}
        size={40}
        weight={300}
        color={colors.textSecondary}
      />

      {/* Divider line */}
      <div
        style={{
          width: interpolate(
            frame,
            [10 * fps, 11 * fps],
            [0, 200],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ),
          height: 2,
          background: colors.indigo,
          opacity: interpolate(
            frame,
            [10 * fps, 11 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ),
        }}
      />

      <AnimatedLine
        text="That's not coaching. That's a chatbot."
        startFrame={Math.round(12 * fps)}
        color={colors.sky}
        size={56}
      />
    </AbsoluteFill>
  );
};
