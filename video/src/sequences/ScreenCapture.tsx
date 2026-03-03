import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Exo2";
import { colors, gradients } from "../theme";
import { BrandedOverlay } from "../components/BrandedOverlay";
import { NarrationMarker } from "../components/NarrationMarker";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: displayFont } = loadDisplay("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

type NarrationCue = {
  atFrame: number;
  text: string;
};

export const ScreenCapture: React.FC<{
  sectionLabel: string;
  startTime: string;
  videoFile?: string;
  narrationCues?: NarrationCue[];
}> = ({ sectionLabel, startTime, videoFile, narrationCues = [] }) => {
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

  const hasVideo = !!videoFile;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      {hasVideo ? (
        <OffthreadVideo
          src={staticFile(videoFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      ) : (
        /* Placeholder when no video file exists */
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Decorative frame border */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 160,
              right: 160,
              bottom: 120,
              border: `2px dashed ${colors.textMuted}`,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {/* Play icon placeholder */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: `2px solid ${colors.indigo}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "16px solid transparent",
                  borderBottom: "16px solid transparent",
                  borderLeft: `28px solid ${colors.indigo}`,
                  marginLeft: 6,
                }}
              />
            </div>

            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 600,
                fontSize: 28,
                color: colors.textMuted,
              }}
            >
              DROP SCREEN RECORDING HERE
            </div>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 14,
                color: colors.textMuted,
                letterSpacing: 2,
              }}
            >
              captures/{sectionLabel.toLowerCase().replace(/\s+/g, "-")}.mp4
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Lower-third overlay */}
      <BrandedOverlay sectionLabel={sectionLabel} startTime={startTime} />

      {/* Narration markers (dev guide) */}
      {!hasVideo && narrationCues.length > 0 && (
        <NarrationMarker markers={narrationCues} />
      )}
    </AbsoluteFill>
  );
};
