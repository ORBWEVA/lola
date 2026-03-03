import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceMono";
import { colors, gradients } from "../theme";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

type Callout = {
  text: string;
  x: number;
  y: number;
  delay: number;
  align?: "left" | "right";
};

const CALLOUTS: Callout[] = [
  {
    text: "Gemini 2.5 Flash\nNative Audio + Vision",
    x: 960,
    y: 160,
    delay: 2,
  },
  {
    text: "sendClientContent()\nMid-session personality switching",
    x: 300,
    y: 820,
    delay: 4,
    align: "left",
  },
  {
    text: "12-Principle\nCoaching Framework",
    x: 1620,
    y: 820,
    delay: 6,
    align: "right",
  },
];

const CalloutLabel: React.FC<{ callout: Callout }> = ({ callout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = callout.delay * fps;

  const scaleSpring = spring({
    frame,
    fps,
    delay: delayFrames,
    config: { damping: 20, stiffness: 200 },
  });

  const opacity = interpolate(
    frame,
    [delayFrames, delayFrames + 0.3 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: callout.x,
        top: callout.y,
        transform: `translate(-50%, -50%) scale(${scaleSpring})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: callout.align === "right" ? "flex-end" : callout.align === "left" ? "flex-start" : "center",
        gap: 6,
      }}
    >
      {/* Dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: colors.sky,
          boxShadow: `0 0 12px ${colors.sky}80`,
          alignSelf: "center",
        }}
      />
      {/* Label */}
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "rgba(10, 10, 26, 0.85)",
          border: `1px solid ${colors.glassBorder}`,
          borderRadius: 8,
          fontFamily: monoFont,
          fontSize: 15,
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          textAlign: callout.align || "center",
        }}
      >
        {callout.text}
      </div>
    </div>
  );
};

export const Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const imgScale = interpolate(frame, [0, 1 * fps], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const imgOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Architecture diagram */}
      <Img
        src={staticFile("architecture.png")}
        style={{
          width: 1600,
          height: "auto",
          transform: `scale(${imgScale})`,
          opacity: imgOpacity,
          borderRadius: 12,
        }}
      />

      {/* Animated callouts */}
      {CALLOUTS.map((callout, i) => (
        <CalloutLabel key={i} callout={callout} />
      ))}
    </AbsoluteFill>
  );
};
