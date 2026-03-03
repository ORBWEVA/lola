import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { colors, gradients } from "../theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

export const LolaLogo: React.FC<{
  size?: number;
  showSubtitle?: boolean;
  subtitle?: string;
  delay?: number;
}> = ({ size = 120, showSubtitle = false, subtitle, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 80 },
  });

  const shimmerX = interpolate(frame, [delay, delay + 2 * fps], [-200, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [delay + 0.5 * fps, delay + 1 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `scale(${scaleSpring})`,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: size,
            letterSpacing: -2,
            lineHeight: 1,
            background: gradients.brand,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          LoLA
        </div>
        {/* Shimmer overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: shimmerX,
            width: 80,
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>
      {showSubtitle && subtitle && (
        <div
          style={{
            fontFamily,
            fontWeight: 300,
            fontSize: size * 0.2,
            color: colors.textSecondary,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
