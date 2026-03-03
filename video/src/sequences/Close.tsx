import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors, gradients } from "../theme";
import { LolaLogo } from "../components/LolaLogo";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line1Y = interpolate(frame, [0, 0.5 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const line2Opacity = interpolate(
    frame,
    [2 * fps, 2.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const line2Y = interpolate(
    frame,
    [2 * fps, 2.5 * fps],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const logoDelay = Math.round(4 * fps);
  const footerOpacity = interpolate(
    frame,
    [5 * fps, 5.5 * fps],
    [0, 1],
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
        gap: 48,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.indigo}20, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Statement line 1 */}
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 300,
          fontSize: 48,
          color: colors.textSecondary,
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          textAlign: "center",
        }}
      >
        No two brains learn the same way.
      </div>

      {/* Statement line 2 */}
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 56,
          background: gradients.brand,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          textAlign: "center",
        }}
      >
        LoLA finally coaches both.
      </div>

      {/* Logo */}
      <div style={{ marginTop: 32 }}>
        <LolaLogo size={80} delay={logoDelay} />
      </div>

      {/* Footer links */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: footerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 16,
            color: colors.textSecondary,
            letterSpacing: 1,
          }}
        >
          github.com/orbweva/lola
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 300,
            fontSize: 16,
            color: colors.textMuted,
          }}
        >
          Built by Ryan Ahamer &middot; LoLA by LokaLingo
        </div>
      </div>
    </AbsoluteFill>
  );
};
