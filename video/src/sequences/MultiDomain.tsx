import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { colors, gradients } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

type Slide = {
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
};

const SLIDES: Slide[] = [
  {
    title: "Today",
    subtitle: "English notebooks & conversation",
    icon: "📓",
    accentColor: colors.sky,
  },
  {
    title: "Tomorrow",
    subtitle: "Restaurant service training",
    icon: "🍽️",
    accentColor: colors.indigo,
  },
  {
    title: "Next",
    subtitle: "Surgical technique coaching",
    icon: "🏥",
    accentColor: colors.success,
  },
  {
    title: "Beyond",
    subtitle: "Golf swing analysis",
    icon: "⛳",
    accentColor: colors.rose,
  },
];

export const MultiDomain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideCount = SLIDES.length;
  const framesPerSlide = Math.floor(durationInFrames / slideCount);

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
        opacity: fadeOut,
      }}
    >
      {SLIDES.map((slide, i) => {
        const slideStart = i * framesPerSlide;
        const slideEnd = slideStart + framesPerSlide;

        const opacity = interpolate(
          frame,
          [
            slideStart,
            slideStart + 0.4 * fps,
            slideEnd - 0.4 * fps,
            slideEnd,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const scale = interpolate(
          frame,
          [slideStart, slideStart + 0.5 * fps],
          [1.05, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }
        );

        const barWidth = interpolate(
          frame,
          [slideStart + 0.3 * fps, slideStart + 0.8 * fps],
          [0, 120],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
              transform: `scale(${scale})`,
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: 80 }}>{slide.icon}</div>

            {/* Accent bar */}
            <div
              style={{
                width: barWidth,
                height: 3,
                background: slide.accentColor,
                borderRadius: 2,
              }}
            />

            {/* Title */}
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: 72,
                color: colors.text,
                letterSpacing: -1,
              }}
            >
              {slide.title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 300,
                fontSize: 32,
                color: colors.textSecondary,
              }}
            >
              {slide.subtitle}
            </div>
          </AbsoluteFill>
        );
      })}

      {/* "One platform, any coaching domain" at the end */}
      {(() => {
        const taglineStart = durationInFrames - 3 * fps;
        const taglineOpacity = interpolate(
          frame,
          [taglineStart, taglineStart + 0.5 * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            style={{
              position: "absolute",
              bottom: 120,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: displayFont,
              fontWeight: 300,
              fontSize: 24,
              color: colors.textMuted,
              letterSpacing: 2,
              opacity: taglineOpacity,
            }}
          >
            One platform. Any coaching domain.
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
