import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors, gradients } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const DemoShowcase: React.FC<{
  imagePath: string;
  title: string;
  subtitle: string;
  caption?: string;
}> = ({ imagePath, title, subtitle, caption }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns: slow zoom in
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Text animations
  const titleOpacity = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0.3 * fps, 0.8 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const subtitleOpacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const captionOpacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {/* Screenshot with Ken Burns */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
        {/* Darken overlay for text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,26,0.3) 0%, rgba(10,10,26,0.7) 60%, rgba(10,10,26,0.95) 100%)",
          }}
        />
      </div>

      {/* Text overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: colors.sky,
            opacity: titleOpacity,
          }}
        >
          Live Demo
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 48,
            color: colors.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 300,
            fontSize: 24,
            color: colors.textSecondary,
            opacity: subtitleOpacity,
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>

        {/* Caption */}
        {caption && (
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 13,
              color: colors.textMuted,
              opacity: captionOpacity,
              marginTop: 8,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
