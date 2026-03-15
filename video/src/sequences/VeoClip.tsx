import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Exo2";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { colors } from "../theme";

const { fontFamily: displayFont } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const VeoClip: React.FC<{
  videoFile: string;
  subtitleLines?: { text: string; startSec: number; color?: string; size?: number; weight?: number }[];
}> = ({ videoFile, subtitleLines = [] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Find current subtitle
  const currentSec = frame / fps;
  let activeSubtitle: typeof subtitleLines[0] | null = null;
  for (let i = subtitleLines.length - 1; i >= 0; i--) {
    if (currentSec >= subtitleLines[i].startSec) {
      activeSubtitle = subtitleLines[i];
      break;
    }
  }

  const subtitleFrame = activeSubtitle
    ? (currentSec - activeSubtitle.startSec) * fps
    : 0;
  const subtitleOpacity = activeSubtitle
    ? interpolate(subtitleFrame, [0, 0.3 * fps], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      <OffthreadVideo
        src={staticFile(videoFile)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
      />

      {/* Gradient overlay for subtitle readability */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(0deg, rgba(10,10,26,0.85) 0%, transparent 100%)",
        }}
      />

      {/* Subtitle */}
      {activeSubtitle && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 120,
            right: 120,
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: activeSubtitle.weight || 700,
              fontSize: activeSubtitle.size || 44,
              color: activeSubtitle.color || colors.text,
              lineHeight: 1.3,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            {activeSubtitle.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
