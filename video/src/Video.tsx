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

  const fadeIn = interpolate(frame, [0, 2 * fps], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 3 * fps, TOTAL_FRAMES],
    [0.12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("nastelbom-ambient-495893.mp3")}
      volume={Math.min(fadeIn, fadeOut)}
    />
  );
};

// Voiceover segments with corrected frame offsets
const VOICEOVER_MAP: { file: string; fromFrame: number }[] = [
  { file: "voiceover/01_intro.wav", fromFrame: 0 },       // INTRO 0s
  { file: "voiceover/02_hook.wav", fromFrame: 180 },      // VEO_HOOK 6s
  { file: "voiceover/03_same_tutors.wav", fromFrame: 540 }, // VEO_SAME 18s
  { file: "voiceover/04_problem.wav", fromFrame: 720 },   // PROBLEM 24s
  { file: "voiceover/05_insight.wav", fromFrame: 1260 },   // VEO_INSIGHT 42s
  { file: "voiceover/06_landing.wav", fromFrame: 1500 },   // DEMO_LANDING 50s
  { file: "voiceover/07_pronunciation.wav", fromFrame: 1740 }, // DEMO_PRONUNCIATION 58s
  { file: "voiceover/08_grammar.wav", fromFrame: 2040 },  // DEMO_GRAMMAR 68s
  { file: "voiceover/09_cultural.wav", fromFrame: 2370 }, // DEMO_CULTURAL 79s
  { file: "voiceover/10_research.wav", fromFrame: 2760 }, // VEO_RESEARCH 92s
  { file: "voiceover/11_architecture.wav", fromFrame: 2970 }, // ARCHITECTURE 99s
  // 12_domains missing — no VO for VEO_DOMAINS
  // 13_creator missing — no VO for VEO_CREATOR
  { file: "voiceover/14_multidomain.wav", fromFrame: 3840 }, // MULTI_DOMAIN 128s
  // 15_close missing — no VO for VEO_CLOSE
  // 16_tagline missing — no VO for CLOSE
];

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music */}
      <BackgroundMusic />

      {/* Voiceover segments */}
      {VOICEOVER_MAP.map(({ file, fromFrame }) => (
        <Sequence key={file} from={fromFrame} layout="none">
          <Audio src={staticFile(file)} volume={0.9} />
        </Sequence>
      ))}

      {/* Video content */}
      <Series>
        {/* 1. INTRO (0-6s) — VO: "LoLA. Adaptive language coaching powered by Gemini." */}
        <Series.Sequence durationInFrames={FRAMES.INTRO}>
          <Intro />
        </Series.Sequence>

        {/* 2. VEO_HOOK (6-18s) — VO: "Japan ranks 87th...spend billions..." */}
        <Series.Sequence durationInFrames={FRAMES.VEO_HOOK}>
          <VeoClip
            videoFile="veo3/1A_classroom.mp4"
            subtitleLines={[
              { text: "Japan ranks 87th in English proficiency.", startSec: 0, size: 40, weight: 300 },
              { text: "They spend billions on English education every year.", startSec: 5 },
            ]}
          />
        </Series.Sequence>

        {/* 3. VEO_SAME (18-24s) — VO: "Every AI tutor teaches everyone the same way." */}
        <Series.Sequence durationInFrames={FRAMES.VEO_SAME}>
          <VeoClip
            videoFile="veo3/1C_same_tutors.mp4"
            subtitleLines={[
              { text: "Every AI tutor teaches everyone the same way.", startSec: 0 },
            ]}
          />
        </Series.Sequence>

        {/* 4. PROBLEM (24-42s) — VO: "A shy, analytical learner...That's not coaching. That's a chatbot." */}
        <Series.Sequence durationInFrames={FRAMES.PROBLEM}>
          <Problem />
        </Series.Sequence>

        {/* 5. VEO_INSIGHT (42-50s) — VO: "Two learners...different coaching...This is LoLA." */}
        <Series.Sequence durationInFrames={FRAMES.VEO_INSIGHT}>
          <VeoClip
            videoFile="veo3/2A_two_learners.mp4"
            subtitleLines={[
              { text: "Two learners. Same mistake.", startSec: 0, size: 40, weight: 300 },
              { text: "Different brains. Different coaching.", startSec: 2.5 },
              { text: "This is LoLA.", startSec: 5, color: "#4cc9f0" },
            ]}
          />
        </Series.Sequence>

        {/* 6. DEMO_LANDING (50-58s) — VO: "Five unique coaching personalities..." */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_LANDING}>
          <DemoShowcase
            imagePath="captures/landing.png"
            title="Meet Your AI Coach"
            subtitle="Five unique coaching personalities. Each adapts to how your brain learns, not just what you say."
            caption="Powered by Gemini 2.5 Flash Native Audio"
          />
        </Series.Sequence>

        {/* 7. DEMO_PRONUNCIATION (58-68s) — VO: "Same error, different coaching..." */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_PRONUNCIATION}>
          <DemoShowcase
            imagePath="captures/demo-pronunciation.png"
            title="Same Error, Different Coaching"
            subtitle="The Analyst gets phoneme rules and minimal pair drills. The Explorer gets a guessing game and encouragement."
            caption="12 neurolinguistic principles × 5 coaching dimensions"
          />
        </Series.Sequence>

        {/* 8. DEMO_GRAMMAR (68-79s) — VO: "Profile A breaks down three error patterns..." */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_GRAMMAR}>
          <DemoShowcase
            imagePath="captures/demo-grammar.png"
            title="Grammar: Rules vs. Flow"
            subtitle="Profile A breaks down three error patterns with numbered rules. Profile B recasts naturally and keeps momentum. Both correct the same mistake."
            caption="L1 interference: articles, irregular past, plurals"
          />
        </Series.Sequence>

        {/* 9. DEMO_CULTURAL (79-92s) — VO: "Japanese learners get face-saving...36 cultural norms..." */}
        <Series.Sequence durationInFrames={FRAMES.DEMO_CULTURAL}>
          <DemoShowcase
            imagePath="captures/demo-cultural.png"
            title="Culture-Aware Coaching"
            subtitle="Japanese learners get face-saving, indirect correction. Spanish learners get warm, direct encouragement. 36 cultural norms across six languages."
            caption="Hofstede, Trompenaars, Meyer"
          />
        </Series.Sequence>

        {/* 10. VEO_RESEARCH (92-99s) — VO: "Grounded...Dweck. Sweller. Vygotsky." */}
        <Series.Sequence durationInFrames={FRAMES.VEO_RESEARCH}>
          <VeoClip
            videoFile="veo3/7T_research_books.mp4"
            subtitleLines={[
              { text: "Grounded in peer-reviewed research.", startSec: 0, size: 36, weight: 300 },
              { text: "Dweck. Sweller. Vygotsky.", startSec: 3, color: "#4cc9f0", size: 32 },
            ]}
          />
        </Series.Sequence>

        {/* 11. ARCHITECTURE (99-112s) — VO: "Built on Google Cloud Run..." */}
        <Series.Sequence durationInFrames={FRAMES.ARCHITECTURE}>
          <Architecture />
        </Series.Sequence>

        {/* 12. VEO_DOMAINS (112-120s) — NO VO, subtitles only */}
        <Series.Sequence durationInFrames={FRAMES.VEO_DOMAINS}>
          <VeoClip
            videoFile="veo3/8A_domain_expansion.mp4"
            subtitleLines={[
              { text: "Language coaching is the first domain.", startSec: 0, size: 36, weight: 300 },
              { text: "Adaptive coaching works everywhere.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        {/* 13. VEO_CREATOR (120-128s) — NO VO, subtitles only */}
        <Series.Sequence durationInFrames={FRAMES.VEO_CREATOR}>
          <VeoClip
            videoFile="veo3/8B_creator_platform.mp4"
            subtitleLines={[
              { text: "Any coach can build, own, and monetize", startSec: 0, size: 36, weight: 300 },
              { text: "their own AI coaching avatar.", startSec: 3.5 },
            ]}
          />
        </Series.Sequence>

        {/* 14. MULTI_DOMAIN (128-135s) — VO: "One platform. Any coaching domain..." */}
        <Series.Sequence durationInFrames={FRAMES.MULTI_DOMAIN}>
          <MultiDomain />
        </Series.Sequence>

        {/* 15. VEO_CLOSE (135-143s) — NO VO, subtitles only */}
        <Series.Sequence durationInFrames={FRAMES.VEO_CLOSE}>
          <VeoClip
            videoFile="veo3/9A_adelaide_dawn.mp4"
            subtitleLines={[
              { text: "Built solo in Adelaide, Australia.", startSec: 0, size: 36, weight: 300 },
              { text: "Powered by Gemini Live API.", startSec: 4 },
            ]}
          />
        </Series.Sequence>

        {/* 16. CLOSE (143-151s) — NO VO */}
        <Series.Sequence durationInFrames={FRAMES.CLOSE}>
          <Close />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
