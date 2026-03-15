import {
  Series,
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { FRAMES, TOTAL_FRAMES } from "./theme";
import { Intro } from "./sequences/Intro";
import { Problem } from "./sequences/Problem";
import { DemoShowcase } from "./sequences/DemoShowcase";
import { VeoClip } from "./sequences/VeoClip";
import { Architecture } from "./sequences/Architecture";
import { MultiDomain } from "./sequences/MultiDomain";
import { Close } from "./sequences/Close";

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 2 * fps], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 3 * fps, TOTAL_FRAMES],
    [0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const volume = Math.min(fadeIn, fadeOut);

  return (
    <Audio
      src={staticFile("nastelbom-ambient-495893.mp3")}
      volume={volume}
    />
  );
};

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music layer */}
      <BackgroundMusic />

      {/* Video content layer */}
      <Series>
        {/* 1. Branded intro */}
        <Series.Sequence durationInFrames={FRAMES.INTRO}>
          <Intro />
        </Series.Sequence>

        {/* 2. VEO3: Classroom */}
        <Series.Sequence durationInFrames={FRAMES.VEO_HOOK}>
          <VeoClip
            videoFile="veo3/1A_classroom.mp4"
            subtitleLines={[
              { text: "Japan ranks 87th in English proficiency.", startSec: 0, size: 40, weight: 300 },
              { text: "They spend billions on English education every year.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        {/* 3. VEO3: Same tutors */}
        <Series.Sequence durationInFrames={FRAMES.VEO_SAME}>
          <VeoClip
            videoFile="veo3/1C_same_tutors.mp4"
            subtitleLines={[
              { text: "Every AI tutor teaches everyone the same way.", startSec: 0 },
            ]}
          />
        </Series.Sequence>

        {/* 4. Problem statement */}
        <Series.Sequence durationInFrames={FRAMES.PROBLEM}>
          <Problem />
        </Series.Sequence>

        {/* 5. VEO3: Two learners */}
        <Series.Sequence durationInFrames={FRAMES.VEO_INSIGHT}>
          <VeoClip
            videoFile="veo3/2A_two_learners.mp4"
            subtitleLines={[
              { text: "Two learners. Same mistake.", startSec: 0, size: 40, weight: 300 },
              { text: "Different brains. Different coaching.", startSec: 3.5 },
            ]}
          />
        </Series.Sequence>

        {/* 6. Landing page */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_LANDING}>
          <DemoShowcase
            imagePath="captures/landing.png"
            title="Meet Your AI Coach"
            subtitle="5 coaching personalities, each adapting to how your brain learns."
            caption="Powered by Gemini 2.5 Flash Native Audio"
          />
        </Series.Sequence>

        {/* 7. Pronunciation demo */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_PRONUNCIATION}>
          <DemoShowcase
            imagePath="captures/demo-pronunciation.png"
            title="Same Error, Different Coaching"
            subtitle="The Analyst gets phoneme rules. The Explorer gets a guessing game. Same R/L question — two different approaches."
            caption="12 neurolinguistic principles × 5 coaching dimensions"
          />
        </Series.Sequence>

        {/* 8. Grammar demo */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_GRAMMAR}>
          <DemoShowcase
            imagePath="captures/demo-grammar.png"
            title="Grammar: Rules vs. Flow"
            subtitle="Profile A breaks down three patterns. Profile B recasts naturally. Both correct the same mistake."
            caption="L1 interference: articles, irregular past, plurals"
          />
        </Series.Sequence>

        {/* 9. Cultural demo */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_CULTURAL}>
          <DemoShowcase
            imagePath="captures/demo-cultural.png"
            title="Culture-Aware Coaching"
            subtitle="Japanese learners get face-saving indirect correction. Spanish learners get warm direct encouragement."
            caption="36 cultural norms × 6 languages — Hofstede, Trompenaars, Meyer"
          />
        </Series.Sequence>

        {/* 10. VEO3: Research books */}
        <Series.Sequence durationInFrames={FRAMES.VEO_RESEARCH}>
          <VeoClip
            videoFile="veo3/7T_research_books.mp4"
            subtitleLines={[
              { text: "Grounded in peer-reviewed research.", startSec: 0, size: 36, weight: 300 },
            ]}
          />
        </Series.Sequence>

        {/* 11. Architecture */}
        <Series.Sequence durationInFrames={FRAMES.ARCHITECTURE}>
          <Architecture />
        </Series.Sequence>

        {/* 12. VEO3: Domain expansion */}
        <Series.Sequence durationInFrames={FRAMES.VEO_DOMAINS}>
          <VeoClip
            videoFile="veo3/8A_domain_expansion.mp4"
            subtitleLines={[
              { text: "Language coaching is the first domain.", startSec: 0, size: 36, weight: 300 },
              { text: "Adaptive coaching works everywhere.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        {/* 13. VEO3: Creator platform */}
        <Series.Sequence durationInFrames={FRAMES.VEO_CREATOR}>
          <VeoClip
            videoFile="veo3/8B_creator_platform.mp4"
            subtitleLines={[
              { text: "Any coach can build, own, and monetize", startSec: 0, size: 36, weight: 300 },
              { text: "their own AI coaching avatar.", startSec: 3.5 },
            ]}
          />
        </Series.Sequence>

        {/* 14. Multi-domain slides */}
        <Series.Sequence durationInFrames={FRAMES.MULTI_DOMAIN}>
          <MultiDomain />
        </Series.Sequence>

        {/* 15. VEO3: Adelaide dawn */}
        <Series.Sequence durationInFrames={FRAMES.VEO_CLOSE}>
          <VeoClip
            videoFile="veo3/9A_adelaide_dawn.mp4"
            subtitleLines={[
              { text: "Built solo in Adelaide, Australia.", startSec: 0, size: 36, weight: 300 },
              { text: "Powered by Gemini Live API.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        {/* 16. Closing */}
        <Series.Sequence durationInFrames={FRAMES.CLOSE}>
          <Close />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
