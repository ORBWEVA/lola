import {
  Series,
  AbsoluteFill,
  Audio,
  Sequence,
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

  const fadeIn = interpolate(frame, [0, 2 * fps], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 3 * fps, TOTAL_FRAMES],
    [0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("nastelbom-ambient-495893.mp3")}
      volume={Math.min(fadeIn, fadeOut)}
    />
  );
};

// Voiceover segments mapped to frame offsets
const VOICEOVER_MAP: { file: string; fromFrame: number }[] = [
  { file: "voiceover/01_intro.wav", fromFrame: 0 },
  { file: "voiceover/02_hook.wav", fromFrame: 180 },
  { file: "voiceover/03_same_tutors.wav", fromFrame: 420 },
  { file: "voiceover/04_problem.wav", fromFrame: 600 },
  { file: "voiceover/05_insight.wav", fromFrame: 960 },
  { file: "voiceover/06_landing.wav", fromFrame: 1200 },
  { file: "voiceover/07_pronunciation.wav", fromFrame: 1350 },
  { file: "voiceover/08_grammar.wav", fromFrame: 1650 },
  { file: "voiceover/09_cultural.wav", fromFrame: 1950 },
  { file: "voiceover/10_research.wav", fromFrame: 2250 },
  { file: "voiceover/11_architecture.wav", fromFrame: 2370 },
  // 12_domains missing (rate limited)
  // 13_creator missing (rate limited)
  { file: "voiceover/14_multidomain.wav", fromFrame: 3150 },
  // 15_close missing (rate limited)
  // 16_tagline missing (rate limited)
];

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music — lower volume to not compete with voiceover */}
      <BackgroundMusic />

      {/* Voiceover segments */}
      {VOICEOVER_MAP.map(({ file, fromFrame }) => (
        <Sequence key={file} from={fromFrame} layout="none">
          <Audio src={staticFile(file)} volume={0.9} />
        </Sequence>
      ))}

      {/* Video content */}
      <Series>
        <Series.Sequence durationInFrames={FRAMES.INTRO}>
          <Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_HOOK}>
          <VeoClip
            videoFile="veo3/1A_classroom.mp4"
            subtitleLines={[
              { text: "Japan ranks 87th in English proficiency.", startSec: 0, size: 40, weight: 300 },
              { text: "They spend billions on English education every year.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_SAME}>
          <VeoClip
            videoFile="veo3/1C_same_tutors.mp4"
            subtitleLines={[
              { text: "Every AI tutor teaches everyone the same way.", startSec: 0 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.PROBLEM}>
          <Problem />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_INSIGHT}>
          <VeoClip
            videoFile="veo3/2A_two_learners.mp4"
            subtitleLines={[
              { text: "Two learners. Same mistake.", startSec: 0, size: 40, weight: 300 },
              { text: "Different brains. Different coaching.", startSec: 3.5 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.DEMO_LANDING}>
          <DemoShowcase
            imagePath="captures/landing.png"
            title="Meet Your AI Coach"
            subtitle="5 coaching personalities, each adapting to how your brain learns."
            caption="Powered by Gemini 2.5 Flash Native Audio"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.DEMO_PRONUNCIATION}>
          <DemoShowcase
            imagePath="captures/demo-pronunciation.png"
            title="Same Error, Different Coaching"
            subtitle="The Analyst gets phoneme rules. The Explorer gets a guessing game. Same R/L question — two different approaches."
            caption="12 neurolinguistic principles × 5 coaching dimensions"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.DEMO_GRAMMAR}>
          <DemoShowcase
            imagePath="captures/demo-grammar.png"
            title="Grammar: Rules vs. Flow"
            subtitle="Profile A breaks down three patterns. Profile B recasts naturally. Both correct the same mistake."
            caption="L1 interference: articles, irregular past, plurals"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.DEMO_CULTURAL}>
          <DemoShowcase
            imagePath="captures/demo-cultural.png"
            title="Culture-Aware Coaching"
            subtitle="Japanese learners get face-saving indirect correction. Spanish learners get warm direct encouragement."
            caption="36 cultural norms × 6 languages — Hofstede, Trompenaars, Meyer"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_RESEARCH}>
          <VeoClip
            videoFile="veo3/7T_research_books.mp4"
            subtitleLines={[
              { text: "Grounded in peer-reviewed research.", startSec: 0, size: 36, weight: 300 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.ARCHITECTURE}>
          <Architecture />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_DOMAINS}>
          <VeoClip
            videoFile="veo3/8A_domain_expansion.mp4"
            subtitleLines={[
              { text: "Language coaching is the first domain.", startSec: 0, size: 36, weight: 300 },
              { text: "Adaptive coaching works everywhere.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_CREATOR}>
          <VeoClip
            videoFile="veo3/8B_creator_platform.mp4"
            subtitleLines={[
              { text: "Any coach can build, own, and monetize", startSec: 0, size: 36, weight: 300 },
              { text: "their own AI coaching avatar.", startSec: 3.5 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.MULTI_DOMAIN}>
          <MultiDomain />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.VEO_CLOSE}>
          <VeoClip
            videoFile="veo3/9A_adelaide_dawn.mp4"
            subtitleLines={[
              { text: "Built solo in Adelaide, Australia.", startSec: 0, size: 36, weight: 300 },
              { text: "Powered by Gemini Live API.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FRAMES.CLOSE}>
          <Close />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
