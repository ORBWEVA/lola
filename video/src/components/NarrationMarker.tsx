import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceMono";
import { colors } from "../theme";

const { fontFamily: monoFont } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

type Marker = {
  /** Frame offset within this sequence when narration should start */
  atFrame: number;
  /** The narration text to read */
  text: string;
};

export const NarrationMarker: React.FC<{
  markers: Marker[];
}> = ({ markers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the currently active marker
  const active = [...markers]
    .reverse()
    .find((m) => frame >= m.atFrame);

  if (!active) return null;

  const localFrame = frame - active.atFrame;
  const opacity = interpolate(localFrame, [0, 0.3 * fps], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 48,
        right: 48,
        opacity,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 16px",
        backgroundColor: "rgba(67, 97, 238, 0.15)",
        border: `1px solid rgba(67, 97, 238, 0.3)`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 10,
          color: colors.sky,
          letterSpacing: 2,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          paddingTop: 2,
        }}
      >
        NARRATE
      </div>
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
