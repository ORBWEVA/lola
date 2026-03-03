import { Series } from "remotion";
import { FRAMES } from "./theme";
import { Intro } from "./sequences/Intro";
import { Problem } from "./sequences/Problem";
import { ScreenCapture } from "./sequences/ScreenCapture";
import { Architecture } from "./sequences/Architecture";
import { MultiDomain } from "./sequences/MultiDomain";
import { Close } from "./sequences/Close";

export const DemoVideo: React.FC = () => {
  return (
    <Series>
      {/* 0:00–0:08 — Branded intro */}
      <Series.Sequence durationInFrames={FRAMES.INTRO}>
        <Intro />
      </Series.Sequence>

      {/* 0:08–0:25 — Problem statement */}
      <Series.Sequence durationInFrames={FRAMES.PROBLEM}>
        <Problem />
      </Series.Sequence>

      {/* 0:25–0:50 — Onboarding (screen capture) */}
      <Series.Sequence durationInFrames={FRAMES.ONBOARDING}>
        <ScreenCapture
          sectionLabel="Live Demo — Onboarding"
          startTime="0:25"
          narrationCues={[
            { atFrame: 0, text: "Let me show you how LoLA works. First, you pick your native language..." },
            { atFrame: 300, text: "...answer five quick questions about your learning style..." },
            { atFrame: 525, text: "...and LoLA builds a coaching profile adapted to how your brain processes English." },
          ]}
        />
      </Series.Sequence>

      {/* 0:50–2:00 — Split-screen coaching (screen capture) */}
      <Series.Sequence durationInFrames={FRAMES.SPLIT_SCREEN}>
        <ScreenCapture
          sectionLabel="Live Demo — Two Coaches, Same Error"
          startTime="0:50"
          narrationCues={[
            { atFrame: 0, text: "Now watch what happens when two different learners make the same mistake..." },
            { atFrame: 600, text: "Coach A focuses on grammar patterns — because this learner responds to structure." },
            { atFrame: 1200, text: "Coach B uses conversation flow — because this learner needs contextual reinforcement." },
            { atFrame: 1800, text: "Same error. Completely different coaching. That's the difference." },
          ]}
        />
      </Series.Sequence>

      {/* 2:00–2:30 — Vision demo (screen capture) */}
      <Series.Sequence durationInFrames={FRAMES.VISION}>
        <ScreenCapture
          sectionLabel="Live Demo — Vision Mode"
          startTime="2:00"
          narrationCues={[
            { atFrame: 0, text: "LoLA can also see. Hold up a notebook with English writing..." },
            { atFrame: 450, text: "...and the coach reads your handwriting and gives real-time feedback." },
          ]}
        />
      </Series.Sequence>

      {/* 2:30–2:55 — Architecture diagram */}
      <Series.Sequence durationInFrames={FRAMES.ARCHITECTURE}>
        <Architecture />
      </Series.Sequence>

      {/* 2:55–3:15 — Multi-domain vision */}
      <Series.Sequence durationInFrames={FRAMES.MULTI_DOMAIN}>
        <MultiDomain />
      </Series.Sequence>

      {/* 3:15–3:35 — Closing */}
      <Series.Sequence durationInFrames={FRAMES.CLOSE}>
        <Close />
      </Series.Sequence>
    </Series>
  );
};
