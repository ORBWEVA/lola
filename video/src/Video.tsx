import { Series } from "remotion";
import { FRAMES } from "./theme";
import { Intro } from "./sequences/Intro";
import { Problem } from "./sequences/Problem";
import { DemoShowcase } from "./sequences/DemoShowcase";
import { Architecture } from "./sequences/Architecture";
import { MultiDomain } from "./sequences/MultiDomain";
import { Close } from "./sequences/Close";

export const DemoVideo: React.FC = () => {
  return (
    <Series>
      {/* 0:00–0:06 — Branded intro */}
      <Series.Sequence durationInFrames={FRAMES.INTRO}>
        <Intro />
      </Series.Sequence>

      {/* 0:06–0:20 — Problem statement */}
      <Series.Sequence durationInFrames={FRAMES.PROBLEM}>
        <Problem />
      </Series.Sequence>

      {/* 0:20–0:26 — Landing page showcase */}
      <Series.Sequence durationInFrames={FRAMES.DEMO_LANDING}>
        <DemoShowcase
          imagePath="captures/landing.png"
          title="Meet Your AI Coach"
          subtitle="5 unique coaching personalities. Each adapts to how your brain learns — not just what you say."
          caption="Powered by Gemini 2.5 Flash Native Audio"
        />
      </Series.Sequence>

      {/* 0:26–0:38 — Pronunciation coaching demo */}
      <Series.Sequence durationInFrames={FRAMES.DEMO_PRONUNCIATION}>
        <DemoShowcase
          imagePath="captures/demo-pronunciation.png"
          title="Same Error, Different Coaching"
          subtitle="The Analytical Learner gets phoneme rules and minimal pair drills. The Explorer gets a guessing game and encouragement. Same R/L question — two completely different approaches."
          caption="12 neurolinguistic principles × 5 coaching dimensions = unique instruction per learner"
        />
      </Series.Sequence>

      {/* 0:38–0:50 — Grammar correction demo */}
      <Series.Sequence durationInFrames={FRAMES.DEMO_GRAMMAR}>
        <DemoShowcase
          imagePath="captures/demo-grammar.png"
          title="Grammar: Rules vs. Flow"
          subtitle="Profile A breaks down three error patterns with numbered rules. Profile B recasts naturally and keeps momentum. Both correct the same mistake — both are valid coaching."
          caption="L1 interference patterns: articles, irregular past, plurals — detected from native language"
        />
      </Series.Sequence>

      {/* 0:50–1:02 — Cultural adaptation demo */}
      <Series.Sequence durationInFrames={FRAMES.DEMO_CULTURAL}>
        <DemoShowcase
          imagePath="captures/demo-cultural.png"
          title="Culture-Aware Coaching"
          subtitle="A Japanese learner gets face-saving indirect correction. A Spanish learner gets warm direct encouragement. 36 cultural norms across 6 languages, informed by Hofstede and Erin Meyer."
          caption="Same learner. Different culture. Different coaching."
        />
      </Series.Sequence>

      {/* 1:02–1:12 — Architecture diagram */}
      <Series.Sequence durationInFrames={FRAMES.ARCHITECTURE}>
        <Architecture />
      </Series.Sequence>

      {/* 1:12–1:24 — Multi-domain vision */}
      <Series.Sequence durationInFrames={FRAMES.MULTI_DOMAIN}>
        <MultiDomain />
      </Series.Sequence>

      {/* 1:24–1:34 — Closing */}
      <Series.Sequence durationInFrames={FRAMES.CLOSE}>
        <Close />
      </Series.Sequence>
    </Series>
  );
};
