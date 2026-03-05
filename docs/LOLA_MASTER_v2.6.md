# LoLA — Loka Learning Avatar Master Reference (v2.6 — 2026-03-05)

**Status:** CANONICAL — supersedes LOLA_PRD_v1.md and LOLA_PRD_v2.md  
**Scope:** LoLA (Loka Learning Avatar) — the AI coaching layer of the Loka platform  
**Sync:** This document lives in both Claude.ai Project Knowledge and `docs/LOLA_MASTER.md`.

---

## Version History

> **MAINTENANCE RULE:** Every time this document is updated — by Claude.ai, Claude Code, or Ryan — the updater MUST: (1) bump the version and date in the H1 title above, (2) add a new entry to the top of this log, (3) rename the file to match: `v{X.X} — {YYYY-MM-DD} LOLA_MASTER.md`. The filename, title, and changelog must always show the same version and date. Use the format below. Never delete previous entries.

| Version | Timestamp (UTC) | Updated By | Summary of Changes |
|---------|-----------------|------------|-------------------|
| 2.6 | 2026-03-05T16:00:00Z | Claude Code (Opus 4.6) | Post-session coaching reports: new `session_reports` Supabase table (002 migration), `server/report_engine.py` (Gemini 2.5 Flash text-mode analysis with profile/principles/L1-aware prompt), background report generation triggered at session end via `asyncio.create_task`, two new API endpoints (`GET /api/reports/session/{id}`, `GET /api/reports/{device_id}`), dashboard Coaching Reports card activated with report list overlay + structured detail view (progress pills, strengths, improvements, tips). |
| 2.5 | 2026-03-05T14:00:00Z | Claude Code (Opus 4.6) | README update for Devpost submission: live demo URL updated to new Cloud Run service, Supabase added to Mermaid architecture diagram (devices/sessions/transcript_entries + Dashboard node + Supabase Client), project structure updated (db.py, view-dashboard.js, view-educator.js, supabase/migrations/), Supabase row in tech stack table, SUPABASE_URL/SUPABASE_SERVICE_KEY in env vars, Cloud Run Secrets section, third-party disclosure section (hackathon §15 compliance). Branded architecture PNG re-rendered with Supabase layer via Playwright. |
| 2.4 | 2026-03-05T12:00:00Z | Claude Code (Opus 4.6) | Supabase persistence layer (Phase 3): devices/sessions/transcript_entries schema, backend API endpoints (POST /api/devices, POST /api/sessions/start, POST /api/sessions/end, GET /api/sessions/{device_id}, GET /api/transcripts/{session_id}), frontend device_id in localStorage, transcript accumulation during sessions, dashboard wired to real data (credits, session count, total minutes), Transcripts card functional with session list + transcript detail overlay. Graceful fallback when Supabase not configured. |
| 2.3 | 2026-03-05T08:00:00Z | Claude Code (Opus 4.6) | Dashboard view (Screen 03): credits bar, profile/recordings/transcripts/reports cards with glass UI, coming soon section, post-session navigation flow (End Session → dashboard instead of landing), bottom action bar with Start New Session + Back. |
| 2.2 | 2026-03-05T06:00:00Z | Claude Code (Opus 4.6) | Immersive session view redesign: full-screen avatar with gradient overlay, glass speech bubble for live transcript on mobile, desktop side-by-side layout (3fr avatar / 2fr transcript), auto-start on session entry (no Start button), burger menu with End Session + Camera toggle, session timer pill, expression carousel fullbleed mode. |
| 2.1 | 2026-03-05T05:00:00Z | Claude Code (Opus 4.6) | Ported frustration/success detection to split-screen dual-session view. Each panel independently detects frustration (EN/JA phrases, hesitation) and success with per-side 30s cooldown, escalation, and amber glow UI indicator. Context updates sent to each panel's own Gemini session. |
| 2.0 | 2026-03-05T04:00:00Z | Claude Code (Opus 4.6) | Frustration detection + mid-session context updates. Frontend scans input transcription for frustration signals (explicit phrases, hesitation, Japanese markers) with 30s cooldown and escalation. Success detection on output transcription resets frustration state. Backend routes `context_update` messages through existing text pipeline to Gemini as sendClientContent(). Subtle amber glow UI indicator on avatar during frustration mode. Added `sendContextUpdate()` to GeminiLiveAPI. |
| 1.9 | 2026-03-05T02:00:00Z | Claude Code (Opus 4.6) | Added IaC bonus documentation to README (cloudbuild.yaml trigger setup, deploy.sh, Dockerfile). Created Educator Creator Platform mock (`src/components/view-educator.js`) — glassmorphism cards, stats mockup, Q2 2026 badge, routed from landing. Created Devpost submission checklist (`docs/DEVPOST_SUBMISSION_CHECKLIST.md`). |
| 1.8 | 2026-03-05T00:30:00Z | Claude Code (Opus 4.6) | Added hackathon submission deliverables: Devpost text description (`docs/DEVPOST_DESCRIPTION.md`, ~2000 words, all required sections + third-party disclosure), blog post for +0.6 bonus (`docs/BLOG_POST.md`, ~2650 words with mandatory disclosure + hashtag), polished README (ORBWEVA org, live demo link, judge-friendly Quick Start). Updated §7 submission checklist. |
| 1.7 | 2026-03-04T23:30:00Z | Claude Code (Opus 4.6) | Added Remotion demo video scaffold at `video/`. 8 compositions: branded intro/outro, problem statement, architecture overlay with animated callouts, multi-domain vision montage, 3 screen capture placeholders with narration markers and lower-third overlays. Uses LoLA Brand Guide tokens (Exo 2 + Space Mono fonts, indigo/rose/sky palette). Total 6450 frames = 3:35 @ 30fps, under 4:00 limit. Ryno records screen captures separately. |
| 1.6 | 2026-03-04T22:30:00Z | Claude Code (Opus 4.6) | Added branded architecture diagram for Devpost submission (`docs/architecture-diagram.html` → `docs/lola-architecture.png`). Three-tier layout (Browser → Cloud Run → Gemini) at 1600x900, LoLA brand colors, Playwright screenshot. Updated §7 milestone table. |
| 1.5 | 2026-03-04T16:00:00Z | Claude Code (Opus 4.6) | Landing page hero redesign: split layout (text left, phone mockup right on desktop; stacked on mobile), CSS phone mockup with avatar image + glass speech bubble + waveform decoration + ambient glow animations. Avatar image generation pipeline updated (FLUX.1-schnell replaced deprecated schnell-Free, editorial-quality prompts). Demo profile cards now show circular avatar faces. Hidden reCAPTCHA badge. Equal-width CTA buttons. |
| 1.4 | 2026-03-04T14:00:00Z | Claude Code (Opus 4.6) | Rebranded UI to LoLA Brand Guide v1 design system. Replaced Immergo "Mystic Archive" theme (sage green #a3b18a, paper textures, Libre Baskerville + Nunito) with LoLA brand identity: indigo #4361ee / rose #ff4d6d / sky #4cc9f0 on dark blue-black #0a0a1a, Exo 2 + Space Mono + Noto Sans JP fonts. Removed light mode toggle (dark-only per brand guide). Updated all 7 frontend files. Added design system reference to §5. |
| 1.3 | 2026-03-04T12:00:00Z | Claude Code (Opus 4.6) | Completed hackathon build: 5-question onboarding UI, split-screen dual-session demo, Cloud Run deployment (deploy.sh + cloudbuild.yaml), expression carousel with waveform visualizer (replaced TalkingHead 3D avatar), avatar image generation pipeline (FLUX Schnell + Kontext Pro), README with Mermaid architecture diagram. |
| 1.2 | 2026-02-22T14:30:00Z | Claude Code (Opus 4.6) | Updated to reflect actual built state after Phase 1 build sessions. Tech stack updated: Gemini 2.5 Flash Native Audio (not GPT-4o), TalkingHead with AnalyserNode lip sync (not HeadAudio), Kore voice. Added §5 actual project structure matching `server/` + `src/` layout. Updated §4 with 4 demo profiles (A/B/C/D), both-direction language support (EN→JA added), 3 L1 pattern files. Documented actual API architecture: FastAPI WebSocket proxy, API key mode, session token auth. Added implementation status tracking to §7. |
| 1.1 | 2026-02-20T15:00:00Z | Claude.ai (Opus 4.6) | Added §4 Academic Foundations subsection with principle-by-principle source mapping (Dweck, Sweller, Immordino-Yang, Roediger, Flavell, Hammond, Bandler & Grinder, Paling). Created companion doc `LOLA_12_PRINCIPLE_ACADEMIC_FOUNDATIONS.md` with full ISBNs, research findings, and hackathon/investor Q&A guidance. |
| 1.0 | 2026-02-20T14:00:00Z | Claude.ai (Opus 4.6) | Initial master doc. Consolidated from LOLA_PRD_v1.md, LOLA_PRD_v2.md, lola_shizuku_strategic_scope.md, LOKALINGO_MASTER §9, and competitive research update brief v3. Strategic repositioning: adaptive coaching engine + educator creator platform + self-marketing pipeline. Co-active triangle architecture (Educator ↔ AI ↔ Learner). Personality framework integration roadmap (MBTI, Enneagram, Big Five, DISC, StrengthsFinder, EQ). 12-principle coaching framework as §4. Hackathon MVP demo spec. Japan market crisis context. Praktika competitive analysis. CIP as internal architecture shorthand only — natural language in all positioning. |

---

## Document Purpose

This is the single source of truth for LoLA (Loka Learning Avatar) — the AI coaching layer of the Loka platform. It consolidates specifications from multiple documents into one reference that both Claude Code and Claude.ai can use. When this document conflicts with older docs, this document wins.

### Relationship to Other Master Docs

| Document | Scope | Relationship |
|----------|-------|-------------|
| `PROJECT_MASTER_TEMPLATE.md` | Standard section structure for all project masters | This document follows the template — §8 is always Dev & Deployment, §3 is always API, etc. |
| `LOKALINGO_MASTER.md` | Loka The Living Textbook — core EdTech SaaS platform | Sibling product — LoLA integrates with Loka via §9 boundary and shared learning data loop |
| `ORBWEVA_MASTER.md` | ORBWEVA product stack (ARC, AER, Grow, Labs) | Parent business — methodology, positioning, operational standards |
| This document | LoLA — AI coaching layer with adaptive methodology, creator platform, and content pipeline | The AI coaching companion to Loka's classroom tools |

### Superseded Documents

| Document | What It Covered | Status |
|----------|----------------|--------|
| `LOLA_PRD_v1.md` | Initial PRD — basic architecture, market domains, acquisition funnel | Archived — content merged here |
| `LOLA_PRD_v2.md` | Stage 1 workflows, tool stack, Google Sheets schema, reference packs | Archived — content merged here |
| `lola_shizuku_strategic_scope.md` | Shizuku AI market validation + Praktika competitive analysis | Archived — content merged into §10 |

### Documents That Remain Separate

| Document | Why It Stays |
|----------|-------------|
| `LOKALINGO_MASTER.md` | Separate platform with its own architecture, codebase, and roadmap |
| `lokalingo_dual_value_positioning_guide.md` | Sales collateral — downstream of positioning changes here |

---

## Product Overview

### What LoLA Is

LoLA (Loka Learning Avatar) is the AI coaching layer of the Loka Living Textbook platform. It is an adaptive coaching platform — not a chatbot — with three interlocking capabilities:

**Adaptive Coaching Engine** — A 12-principle neuroscience framework (neuroscience + neurolanguage coaching + NLP) that serves as the foundation for integrating personality frameworks (MBTI, Enneagram, Big Five, DISC, StrengthsFinder, EQ) and learning science models. Every learner gets coaching adapted to their psychological profile, not just their skill level. "No two brains are alike" made technical.

**Educator Creator Platform** — Educators, coaches, and subject matter experts build, own, and monetize their own AI coaching avatars across any knowledge domain. Language learning is the first vertical; the architecture supports any discipline where humans learn through co-active conversation.

**Self-Marketing Pipeline** — LoLA avatars generate their own social media content and build organic audiences, converting followers into paying learners. Competitors spend VC money on app store acquisition. LoLA avatars attract their own learners.

No competitor has any of these three capabilities. No competitor has two.

### The Co-Active Triangle

Every AI language learning competitor offers a single line: AI ↔ Learner. The educator doesn't exist in their model.

Loka + LoLA creates a triangle:

```
         EDUCATOR
        ↗        ↖
  Learning data   Live teaching
  & insights      & human connection
      ↗                ↖
  AI (LoLA) ←————————→ LEARNER
        Adaptive coaching
     powered by shared data
```

- **Educator ↔ Learner** — classroom, live teaching, human connection
- **AI ↔ Learner** — LoLA adaptive coaching, personality-informed practice, always available
- **AI ↔ Educator** — learning data, progress insights, generated curriculum suggestions

Shared learning data flows through all three sides. The educator's classroom captures feed the AI. The AI's coaching sessions feed the educator's dashboard. The learner benefits from both and generates data for both. **Co-active** means all three participants actively contribute to the learning.

A learner without an educator still gets the AI ↔ Learner side — it works standalone. An educator without LoLA still gets Loka classroom tools — they work standalone. But together, the co-active triangle is where the Living Textbook philosophy reaches full power. That's the natural upsell/cross-sell.

### The Capture → Generate → Deliver Loop (Internal Architecture)

> **Naming note:** "CIP" is internal shorthand for this loop. In all positioning, pitch, and learner-facing language, describe the loop naturally or use "Where Conversations Become Curriculum." Never expose the acronym externally.

**Capture** — Every interaction (Loka exercise, LoLA conversation, classroom session) produces learning data: what the learner was trying to express, what went wrong, what patterns repeat, when they hesitate, what they self-correct, how they respond emotionally to errors. With personality profiling, capture also includes the learner's psychological response patterns.

**Generate** — AI transforms captured data into personalized material adapted to the learner's psychological profile. An analytical learner gets pattern explanations. A social learner gets conversation scenarios. Same error, different coaching approach.

**Deliver** — Generated material reaches the learner at the right time, difficulty, and modality — through whichever mode they're in (Loka exercise, LoLA conversation, or educator suggestion for next class).

The loop repeats: delivery creates new interactions → new captures → new generation → new delivery. The textbook rewrites itself with every session.

**Example — The Co-Active Loop in Practice:**

*Monday — Yuki does a Loka grammar exercise. The system captures that she consistently drops articles. Her profile says she's analytical and structure-first.*

*Tuesday — Yuki has a LoLA conversation. The avatar already knows about the article pattern. It proactively scaffolds scenarios where articles matter and coaches through her analytical profile.*

*Wednesday — Yuki's teacher opens her Loka dashboard. Sees data from both the exercise and LoLA session. Knows Yuki is improving in structured contexts but still drops articles in free conversation. Focuses classroom time on exactly that gap.*

*Thursday — LoLA references Yuki's progress: "Remember our restaurant conversation? You nailed the articles there. Let's try a new context." Anchoring using data from across the triangle.*

### Key Distinction: Loka vs. LoLA

| | Loka The Living Textbook | LoLA |
|---|---|---|
| **Focus** | Teacher-led education management | AI-led adaptive coaching through conversation |
| **Users** | Teachers (primary), students (secondary) | Learners (primary), educators/creators (secondary) |
| **Revenue** | Per-seat subscription ($6/seat) | Usage-based (pay for engagement) + marketplace fee (20%) |
| **Domain** | Language learning (LokaLingo) | Any domain where humans learn through co-active conversation |
| **AI Role** | Augments teacher workflow (canvas, assessment) | IS the coach — adaptive, personality-informed, methodology-driven |
| **Tech Stack** | Laravel + PostgreSQL + AWS | n8n + Vercel + Next.js + Supabase (MVP) |
| **Status** | Production (running Accent Language School) | Pre-MVP — hackathon build imminent |

---

## §0 — Mission, Philosophy & Brand Framework

### Founding Statement

> "No two brains are alike."

This is the operating principle behind everything LoLA builds. Every competitor treats learners as a difficulty level — beginner, intermediate, advanced. LoLA treats learners as psychological profiles. The same error gets coached completely differently depending on who's making it and why.

### The Living Textbook Philosophy

"Where Conversations Become Curriculum" — every conversation a learner has, whether with an AI avatar, in a Loka exercise, or in a classroom, becomes the raw material for the next piece of personalized curriculum. The textbook isn't written by a publisher. It's written by the learner's own journey.

### Three Pillars

| Pillar | What It Means | How LoLA Applies It |
|--------|--------------|-------------------|
| **Nurture** | A co-active learning environment where mistakes are celebrated, not feared | 12-principle framework: emotional regulation, growth mindset, reframing errors as progress |
| **Guide** | CEFR-aligned adaptive assessment giving clear paths forward | Personality profiling + learning data → coaching adapted to individual progression |
| **Accelerate** | AI-powered tools that make practice efficient, targeted, engaging | Adaptive coaching, spaced repetition from captured data, personality-optimized delivery |

### Brand Language Rules

| Use | Don't Use |
|-----|-----------|
| "Adaptive coaching" | "AI-powered avatars" (as differentiator) |
| "Coaching that adapts to who you are" | "Available 24/7, no judgment" |
| "Personality-adaptive — same error, different approach" | "Personalized learning experiences" |
| "Co-active conversations with AI and human educators" | "Scalable, personalized learning" |
| "Where Conversations Become Curriculum" | "CIP" (externally) |
| Describe capabilities directly | "Stage 1/2/3" labels (externally) |

---

## §1 — Product Architecture

### Three-Stage Build Sequence

> **Internal roadmap labels only.** Do not use "Stage 1/2/3" in positioning or pitch. Describe what each capability does.

**Content Pipeline (formerly Stage 1):** One-click character creation → image generation → voice selection → script generation → video production → multi-platform publishing. Avatars generate their own social media content and build organic audiences.

**SaaS Platform (formerly Stage 2):** User registration, subscription, self-service character creation, voice/text chat with coaching avatars, private transcripts, learning data tracking.

**Marketplace (formerly Stage 3):** Educators create and monetize AI coaching avatars. Learners subscribe to multiple coaches. Spaced repetition and quiz systems. Learning analytics and progress tracking. Revenue sharing.

### Content Pipeline Architecture (Current Build)

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT PIPELINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Character Creation (S1-W01 — ✅ BUILT)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Form UI → Prepare Data → Save Initial Record       │   │
│  │                              ↓                      │   │
│  │         ┌──────────────────┼──────────────────┐     │   │
│  │         ↓                  ↓                  ↓     │   │
│  │    🖼️ Image Gen      🎤 Voice Select    📝 Script  │   │
│  │    (Kie.ai)          (ElevenLabs)       (Claude)   │   │
│  │    30-60 sec         2-3 sec            5-10 sec   │   │
│  │         ↓                  ↓                  ↓     │   │
│  │         └──────────────────┼──────────────────┘     │   │
│  │                            ↓                        │   │
│  │                    Merge → Sheet → Success          │   │
│  │                            ↓                        │   │
│  │              (Async) Reference Pack Generator       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Reference Pack (S1-W01b — ✅ BUILT)                       │
│  9 image variations for visual consistency                  │
│                                                             │
│  Video Generator (S1-W02 — 🔲 TO BUILD)                   │
│  Character + Script → TTS → Video → Captions → Queue       │
│                                                             │
│  Content Publisher (S1-W03 — 🔲 TO BUILD)                  │
│  Queue → Format → Post (IG, TikTok, YT Shorts, FB)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Adaptive Coaching Platform Architecture (Hackathon MVP — ACTUAL)

```
┌─────────────────────────────────────────────────────────────┐
│                 ADAPTIVE COACHING MVP (BUILT)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Demo Profile Picker (4 profiles)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Profile A: JA→EN Analyst  │  Profile B: JA→EN Explorer│
│  │  Profile C: EN→JA Analyst  │  Profile D: EN→JA Explorer│
│  │          ↓                                          │   │
│  │  GET /api/demo-profiles → selects profile           │   │
│  │  POST /api/profile → generates system instruction   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  Profile-Adaptive Voice Session                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  System prompt = 12-principle framework (weighted)   │   │
│  │                + personality profile injection       │   │
│  │                + L1 patterns (JA/KO/EN)             │   │
│  │                + both-direction language support     │   │
│  │          ↓                                          │   │
│  │  Browser mic → PCM → WebSocket → FastAPI →          │   │
│  │  Gemini Live API (native audio, speech-to-speech)   │   │
│  │          ↓                                          │   │
│  │  Gemini audio response → WebSocket → Browser →      │   │
│  │  AudioWorklet playback → AnalyserNode → TalkingHead │   │
│  │  3D avatar with real-time lip sync + idle anims     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Educator Creator View (Dashboard) — NOT YET BUILT         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## §2 — Pricing

### Revenue Model

| Stream | Model | Target |
|--------|-------|--------|
| **Learner direct (B2C)** | Usage-based — pay per engagement minutes or subscription | Individual learners entering through LoLA |
| **Educator tools (B2B)** | Subscription — per-seat via Loka platform | Educators using Loka classroom tools |
| **Creator marketplace** | Revenue share — 80% educator / 20% platform | Educators monetizing LoLA coaching avatars |

### LoLA Acquisition Funnel

The avatar is both the marketing and the product. The same coaching techniques that make social media content engaging make the free trial conversations sticky enough to convert.

**Social Media Hook** → Avatars published across YouTube, TikTok, Instagram, LINE as content creators. The viewer connects with a character before signing up.

**Free Trial** → Viewer chats with the same avatar they already feel rapport with. Free allocation (20-40 minutes per avatar, 120-180 minutes account-level cap) is enough for the coaching methodology to demonstrate value.

**Transparent Paywall** → Learner informed upfront of free allocation. No surprise, no dark pattern. Transition from free to paid feels like natural progression.

**Multi-Avatar Sampling** → Single account gets free allocations with multiple avatars. Learner finds their match before committing.

### Anti-Abuse

Layered identity verification: email + phone + device fingerprinting + IP clustering + behavioral fingerprinting + payment method linking + learning profile matching. Learning profiles (error patterns, hesitation patterns, self-correction habits) are nearly impossible to spoof — the learner would have to intentionally make different mistakes, defeating the purpose.

---

## §3 — API Architecture

### External APIs (Current)

| Service | Purpose | Auth | Cost |
|---------|---------|------|------|
| **Kie.ai** | Character image generation (nano-banana-pro) | Bearer token | ~$0.05/image |
| **ElevenLabs** | Voice selection + TTS | `xi-api-key` header | $5-22/mo |
| **OpenAI** | GPT-4o for coaching chat + Whisper for STT | API key | Pay-per-use |
| **Anthropic** | Claude for script generation | API key | Pay-per-use |
| **Blotato** | Multi-platform social media publishing | OAuth | ~$19/mo |

### Kie.ai API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `api.kie.ai/api/v1/jobs/createTask` | POST | Submit image generation job |
| `api.kie.ai/api/v1/jobs/recordInfo` | GET | Poll job status until complete |

### ElevenLabs Voice Matching

Priority scoring algorithm:
1. Gender match: +10 points
2. Age match: +5 points
3. Accent match: +5 points
4. Use case (educational): +3 points
5. Premade (not cloned): +2 points

### Future API Needs (MVP)

| Service | Purpose | Notes |
|---------|---------|-------|
| Supabase | Learner profiles, session data, coaching history | PostgreSQL + real-time subscriptions |
| Vercel | Next.js hosting for chat interface | Edge functions for API routes |

---

## §4 — AI & Automation Standards

### The 12-Principle Coaching Framework

This is the foundation layer of LoLA's adaptive coaching architecture. These 12 principles are prepended to ALL AI interactions. The `{TASK_CONTEXT}` section adapts for specific use cases, but the principles are never removed or weakened.

**Neuroscience Principles (WHY the brain learns):**

1. **GROWTH MINDSET** — Frame every correction as progress, not deficit. Use "yet" language ("You haven't mastered this yet" not "You got this wrong"). Praise effort and strategy, not innate ability. Mistakes are the raw material of learning.

2. **COGNITIVE LOAD MANAGEMENT** — Present information in small, digestible chunks. Connect new concepts to what the learner already knows. Do not overwhelm — if extracting many items, prioritize by impact and group related concepts. Quality over quantity.

3. **EMOTIONAL REGULATION** — Acknowledge difficulty without judgment. Normalize struggle as part of the learning process. Celebrate incremental progress. Never use language that could shame, discourage, or create anxiety about mistakes.

4. **RETRIEVAL PRACTICE** — Design outputs that require active recall, not passive recognition. Questions should prompt the learner to retrieve from memory. Use the teach-back principle where possible.

5. **METACOGNITION** — Where appropriate, prompt reflection — "What strategy helped here?" or "Notice how this connects to..." Help learners see patterns in their own learning.

6. **CULTURAL SENSITIVITY** — Respect the learner's cultural and linguistic background. A Japanese learner's path looks different from a Brazilian learner's — and that is by design. Frame corrections in context of the learner's world, not against a single cultural norm.

**NLP Communication Patterns (WHAT language patterns to use):**

7. **REFRAMING** — Transform negative self-perception into growth narrative. "I made a mistake" → "You found a growth edge." "I can't do this" → "You haven't unlocked this yet."

8. **PRESUPPOSITIONS** — Embed assumed success in all language. "When you use this in your next conversation..." not "If you remember this..." The learner's subconscious absorbs the assumption of competence.

9. **ANCHORING** — Associate positive emotional states with learning milestones. Reference previous wins when introducing new challenges: "You mastered [previous concept] — this builds on exactly that foundation."

10. **PACING AND LEADING** — Match the learner's emotional state before guiding them forward. If frustrated → acknowledge → validate → redirect. Never jump to instruction without establishing rapport.

11. **VAK ADAPTATION** — Rotate across Visual, Auditory, and Kinesthetic modalities. Some learners see patterns (visual), some hear rhythm (auditory), some need to do/feel (kinesthetic). Adapt output format to the learner's preference.

12. **META-MODEL QUESTIONING** — Challenge limiting beliefs by surfacing the specific structure of the belief. "I always forget this" → "Can you remember a time you didn't forget?" Break generalizations that create learned helplessness.

### Personality Framework Integration Architecture

The 12 principles above are the **foundation layer**. They are designed to integrate established personality and learning science frameworks progressively:

| Framework | What It Tells LoLA | How Coaching Adapts |
|-----------|-------------------|-------------------|
| **MBTI** | Cognitive processing style | INTJ gets structured analysis; ESFP gets experiential social scenarios |
| **Enneagram** | Core motivations and fears | Type 3 gets progress metrics; Type 9 gets gentle encouragement without pressure |
| **Big Five (OCEAN)** | Trait spectrum | High neuroticism → more emotional regulation; High openness → more exploratory exercises |
| **DISC** | Behavioral style | High D gets direct challenge; High S gets patient structured progression |
| **StrengthsFinder** | Natural talents | Coaching leverages existing strengths as bridges rather than focusing on deficits |
| **EQ** | Emotional awareness level | Low EQ → explicit emotional scaffolding; High EQ → deeper self-reflection |
| **VAK** | Sensory preference | Visual → written/diagrammatic; Auditory → spoken/rhythm; Kinesthetic → action-oriented |

**Integration Roadmap:**

| Phase | What | Technical Approach |
|-------|------|-------------------|
| **MVP (Hackathon)** | 5-question onboarding → coaching dimensions | JS mapping function; no framework labels exposed to learner |
| **v1** | Big Five mapping (most empirically validated) | Dynamic system prompt adjusts emotional regulation, pacing, social framing |
| **v2** | MBTI + DISC + Enneagram integration | Multi-framework profile synthesis; richer coaching adaptation |
| **v3** | Optional self-assessment ("I know my MBTI type") | Direct input for faster calibration; educator dashboard showing patterns |

**Design principle:** Learners never need to know about personality frameworks. The system infers and adapts silently. Learners who know their type can optionally input it for faster calibration. The 5-question onboarding is the universal entry point.

### 5-Question Learner Onboarding (MVP)

```
Q1: When you make a mistake in English, what's your first reaction?
   (a) I want to understand WHY I made it → Analytical coaching mode
   (b) I feel embarrassed and want to move on → Emotional safety mode
   (c) I laugh it off and try again → Challenge-forward mode

Q2: How do you prefer to learn new things?
   (a) Show me the rules and patterns → Structure-first
   (b) Let me try and figure it out → Experience-first
   (c) Show me real examples of people using it → Social-contextual

Q3: What motivates you most?
   (a) Seeing measurable progress → Metrics-driven
   (b) Feeling more confident → Emotion-driven
   (c) Being able to use it in real situations → Application-driven

Q4: When practicing English, I prefer:
   (a) Taking my time to think before speaking → Reflective pace
   (b) Jumping right in, even if imperfect → Action pace

Q5: I learn best when the teacher:
   (a) Explains things thoroughly → Depth-first
   (b) Keeps things moving and fun → Flow-first
   (c) Connects to things I already know → Bridge-building
```

These five answers generate a **Learner Coaching Profile** that maps to relevant dimensions across personality frameworks without requiring learners to know or care about any of them.

### Four Demo Profiles (BUILT)

The current build uses 4 pre-built demo profiles instead of the full onboarding flow. Profiles are selectable from a card picker in the UI:

| Profile | L1 | Direction | Style | Label |
|---------|-----|-----------|-------|-------|
| **A** | Japanese | JA→EN | Analytical, structure-first, reflective | "The Analyst" |
| **B** | Japanese | JA→EN | Social, action-paced, challenge-forward | "The Explorer" |
| **C** | English | EN→JA | Analytical, structure-first, reflective | "JP Beginner (Analyst)" |
| **D** | English | EN→JA | Social, experience-first, challenge-forward | "JP Beginner (Explorer)" |

**Both-direction support:** The instruction engine dynamically generates "You are LoLA, a warm and adaptive {target_lang} language coach for {l1_name} speakers" based on the `target_language` field in each L1 pattern file. Adding new L1→target combinations is a config change (new pattern file + profile).

### L1 Pattern Files (BUILT)

| File | L1 | Target | Key Patterns |
|------|-----|--------|-------------|
| `server/l1_patterns/japanese.py` | Japanese | English | Articles, tense, pro-drop, plurals, agreement, SOV, L/R |
| `server/l1_patterns/korean.py` | Korean | English | Articles, tense, pro-drop, plurals, agreement, SOV, honorific transfer |
| `server/l1_patterns/english.py` | English | Japanese | Pronoun overuse, SVO→SOV, particles, politeness mixing, counters, te-form |

### Academic Foundations — Source Reference

> **Full reference doc:** `LOLA_12_PRINCIPLE_ACADEMIC_FOUNDATIONS.md` — detailed academic grounding with ISBNs, key findings, competitive implications, and guidance for hackathon/investor Q&A.

The 12 principles were designed by synthesizing three complementary disciplines:

| Discipline | Layer | Core Question | Key Source |
|-----------|-------|--------------|-----------|
| **Neuroscience** | WHY the brain learns | What cognitive structures enable learning? | Dweck, Sweller, Immordino-Yang, Roediger |
| **Neurolanguage Coaching** | HOW to create conditions for learning | How do coaching + brain science accelerate acquisition? | Rachel Paling (ICF-accredited, 2,000+ certified coaches, 70+ countries) |
| **NLP Communication** | WHAT language patterns to use | What patterns shape perception and retention? | Bandler & Grinder, applied coaching techniques |

**Principle-by-principle source mapping:**

| # | Principle | Primary Author | Key Work | Year |
|---|-----------|---------------|----------|------|
| 1 | Growth Mindset | Carol S. Dweck (Stanford) | *Mindset: The New Psychology of Success* | 2006 |
| 2 | Cognitive Load | John Sweller (UNSW) | *Cognitive Load Theory* | 2011 |
| 3 | Emotional Regulation | Mary Helen Immordino-Yang (USC) | *Emotions, Learning, and the Brain* | 2016 |
| 4 | Retrieval Practice | Brown, Roediger & McDaniel (WashU) | *Make It Stick* | 2014 |
| 5 | Metacognition | John H. Flavell (Stanford) | "Metacognition and cognitive monitoring" | 1979 |
| 6 | Cultural Sensitivity | Zaretta Hammond | *Culturally Responsive Teaching and the Brain* | 2015 |
| 7–12 | NLP Patterns | Bandler & Grinder | *The Structure of Magic* | 1975 |
| — | Bridging discipline | Rachel Paling | *Neurolanguage Coaching: Brain Friendly Language Learning* (2nd ed.) | 2017 |

**Competitive significance:** No AI language learning company — not Speak, Praktika, ELSA, or Duolingo — references any structured coaching methodology, let alone one grounded in ICF-accredited practice with 2,000+ certified practitioners. This is an architectural advantage, not a feature.

### n8n Workflows

| ID | Name | Status | Trigger | Purpose |
|----|------|--------|---------|---------|
| S1-W01 | AI Influencer Creator v3 | ✅ BUILT | n8n Form | Character creation: image + voice + scripts |
| S1-W01b | Reference Pack Generator | ✅ BUILT | Webhook | 9 image variations for visual consistency |
| S1-W02 | Video Generator | 🔲 TO BUILD | Manual/Form | Character + Script → Audio → Video → Captions |
| S1-W03 | Content Publisher | 🔲 TO BUILD | Manual/Scheduled | Queue → Format → Post across platforms |

---

## §5 — Technical Infrastructure

### Current Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Automation** | n8n (n8n.orbweva.cloud) | Workflow orchestration for content pipeline |
| **Storage** | Google Sheets | Character database (current) |
| **Image Gen** | Kie.ai (nano-banana-pro) | Character images, 4:5 portrait, 2K PNG |
| **Voice** | ElevenLabs | Voice library matching + TTS |
| **LLM** | Claude / GPT-4o | Script generation, coaching chat |
| **STT** | OpenAI Whisper | Speech-to-text for voice input |
| **Publishing** | Blotato | Multi-platform social media posting |

### MVP Stack (Hackathon Build — ACTUAL)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **LLM** | Gemini 2.5 Flash Native Audio (`gemini-2.5-flash-native-audio-preview-12-2025`) | Speech-to-speech coaching via Live API — no separate STT/TTS needed |
| **Backend** | Python 3.10+ / FastAPI / `google-genai` SDK | WebSocket proxy between browser and Gemini Live API |
| **Frontend** | Vanilla JS / Vite / Web Components / Web Audio API | Voice chat interface, profile picker, avatar rendering |
| **Design System** | LoLA Brand Guide v1 (Exo 2 + Space Mono + Noto Sans JP, dark-only) | Indigo/rose/sky color palette on #0a0a1a — see `docs/LOLA_BRAND_GUIDE_v1.md` |
| **Avatar** | Pre-rendered FLUX expressions (8 per profile) | Expression carousel with keyword-based detection from output transcription |
| **Avatar Generation** | FLUX Schnell Free (anchors) + FLUX Kontext Pro (expressions) via Together AI | `scripts/generate-expressions.js` — automated pipeline for character-consistent expression images |
| **Audio Visualization** | AnalyserNode (Web Audio API) | Guitar-string waveform visualizer — shows activity even when session is muted |
| **Audio** | AudioWorklets (capture + playback) | PCM streaming, VAD for barge-in |
| **Database** | Supabase (PostgreSQL) | Device tracking, session history, transcript storage, credit management |
| **Session State** | In-memory (FastAPI) | Session tokens, rate limiting |
| **Deployment** | Google Cloud Run | Containerized FastAPI + built frontend, deployed via `scripts/deploy.sh` or `cloudbuild.yaml` CI/CD |

**Key deviation from original spec:** The original plan called for GPT-4o + Whisper + ElevenLabs (text pipeline). The actual build uses Gemini Live API with native audio (speech-to-speech), which eliminates the need for separate STT and TTS services. This is a significant improvement — lower latency, native barge-in, and deeper Gemini integration for the hackathon.

**Avatar pivot:** The original plan used TalkingHead v1.7 (3D WebGL avatar with lip sync via AnalyserNode → viseme blend shapes). This was replaced with an expression carousel approach: pre-rendered 2D character images (8 expressions per profile) generated via FLUX Schnell (anchor portraits) + FLUX Kontext Pro (expression variants). Expression detection scans Gemini's output transcription for keywords (laugh, question, think, etc.) and crossfades between expression images. This approach is lighter-weight, more visually distinctive, and avoids WebGL compatibility issues. Audio visualization uses an AnalyserNode-driven waveform display instead of lip sync.

---

## §6 — Data & Schema

### Characters Tab (Google Sheets — Current)

| Column | Type | Description |
|--------|------|-------------|
| character_id | string | Unique ID (LOLA-YYYYMMDD-HHMMSS) |
| character_name | string | Display name |
| role | string | Primary Role |
| target_audience | string | Target Audience |
| gender | string | Gender |
| age_range | string | Age Range |
| ethnicity | string | Ethnicity/Appearance |
| personality | string | Personality Traits |
| speaking_style | string | Speaking Style |
| voice_accent | string | Voice Accent |
| backstory | text | Background Story |
| primary_language | string | Primary Language |
| content_niche | string | Content Niche |
| image_prompt | text | Generated image prompt |
| negative_prompt | text | Negative prompt |
| image_url | url | Hero image URL |
| voice_id | string | ElevenLabs voice ID |
| voice_name | string | Voice name |
| reference_images | json | Array of reference image URLs |
| scripts | json | Array of starter scripts |
| created_at | datetime | Creation timestamp |
| status | string | pending_image → generating → ready → ready_for_content |

### Persistence Layer (Supabase — Phase 3)

**Device tracking:** Anonymous visitors identified by UUID stored in `localStorage`. No auth required.

| Table | Purpose |
|-------|---------|
| `devices` | Anonymous visitors — UUID primary key, credits balance (default 15), created_at |
| `sessions` | Session records — links to device, stores profile_key/label/data (JSONB), voice, duration, frustration_count, timestamps |
| `transcript_entries` | Conversation log — role (user/model), content text, seq ordering, bulk-inserted at session end |
| `session_reports` | Coaching reports generated by Gemini 2.5 Flash text analysis — status lifecycle (pending/generating/complete/failed), report_data JSONB, one per session (UNIQUE on session_id) |

**Credit model:** 1 credit per 60 seconds of session time (rounded up, minimum 1). New devices start with 15 credits.

**API endpoints:**
- `POST /api/devices` — register/retrieve device by UUID
- `POST /api/sessions/start` — create session row, returns session_id
- `POST /api/sessions/end` — finalize session (duration, transcript, credit deduction, queues report generation)
- `GET /api/sessions/{device_id}` — session history (newest first)
- `GET /api/transcripts/{session_id}` — transcript entries ordered by seq
- `GET /api/reports/session/{session_id}` — single coaching report by session
- `GET /api/reports/{device_id}` — all reports for a device (joins sessions → session_reports)

**Report generation:** Triggered as a non-blocking background task (`asyncio.create_task`) when a session ends with transcript data. Uses Gemini 2.5 Flash (text mode, temp 0.3, `response_mime_type: application/json`). Sessions with < 4 transcript entries get a "too short" placeholder. Report includes summary, strengths with examples, improvements with L1 patterns and tips, progress indicators (fluency/accuracy/confidence/engagement), and session stats.

**Graceful degradation:** All endpoints return mock/empty data if `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are not set. App works fully without Supabase — dashboard shows defaults.

Migrations:
- `supabase/migrations/001_create_persistence_tables.sql`
- `supabase/migrations/002_create_session_reports.sql`

### Learner Coaching Profile (Supabase — Future)

| Column | Type | Description |
|--------|------|-------------|
| learner_id | uuid | Primary key |
| onboarding_answers | jsonb | Raw 5-question responses |
| coaching_dimensions | jsonb | Mapped dimensions (error_response, learning_pref, motivation, pacing, instruction_depth) |
| personality_overrides | jsonb | Optional: self-reported MBTI, Enneagram, etc. |
| session_history | jsonb[] | Array of session summaries with captured errors and coaching adaptations |
| error_patterns | jsonb | Aggregated error patterns across sessions |
| created_at | timestamptz | Profile creation |
| updated_at | timestamptz | Last session |

---

## §7 — Roadmap & Milestones

### Immediate (Feb 2026 — Hackathon)

| Task | Status | Notes |
|------|--------|-------|
| Fork Immergo, get running locally | DONE | Forked, adapted to API key mode |
| Gemini Live API with native audio | DONE | `gemini-2.5-flash-native-audio-preview-12-2025` via `google-genai` SDK |
| Profile generation logic (answers → coaching dimensions) | DONE | `server/profile_engine.py` — 4 demo profiles + dynamic generator |
| Dynamic system prompt (12 principles + profile injection) | DONE | `server/instruction_engine.py` — weighted principles, L1 patterns, both-direction |
| L1 interference patterns (JA, KO, EN) | DONE | 3 pattern files in `server/l1_patterns/` |
| Voice chat session via Gemini Live | DONE | WebSocket proxy, PCM streaming, barge-in works |
| 3D avatar with TalkingHead | DONE | Ready Player Me avatar, idle animations, gestures |
| Avatar lip sync (AnalyserNode) | DONE | Real-time volume → viseme blend shapes. Mouth moves but sync quality needs polish. |
| Demo profile picker (4 cards) | DONE | Card-based UI with language direction labels |
| Camera/vision input to Gemini | DONE | VideoStreamer sends JPEG frames at 1fps via WebSocket; PiP camera preview in session view |
| Expression carousel + waveform visualizer | DONE | Replaced TalkingHead 3D avatar. 8 expressions per profile, keyword detection from transcription. |
| Avatar image generation pipeline | DONE | `scripts/generate-expressions.js` — FLUX Schnell anchors + Kontext Pro expressions via Together AI |
| 5-question onboarding UI (L1 selection + questions) | DONE | `view-lola.js` — L1 picker → 5 adaptive questions → profile generation |
| Split-screen demo view (dual sessions) | DONE | `split-screen.js` — shared mic, dual WebSockets, click-to-listen, independent waveforms + transcripts |
| Cloud Run deployment | DONE | `scripts/deploy.sh` (one-command) + `cloudbuild.yaml` (CI/CD). Multi-stage Dockerfile. |
| README + architecture diagram | DONE | Mermaid diagram in README (includes Supabase layer) + branded PNG (`docs/lola-architecture.png`) for Devpost upload. Source: `docs/lola-architecture.html`. Live demo URL, env vars, Cloud Run secrets, third-party disclosure all documented. |
| Educator dashboard mock | DONE | `src/components/view-educator.js` — glassmorphism cards (Build Avatar, 12-Principle Auto-Apply, Monetize), stats mockup, Q2 2026 badge. Routed from landing "Educator Preview" link. |
| User dashboard (Screen 03) | DONE | `src/components/view-dashboard.js` — credits bar (8 credits), profile/recordings/transcripts/reports cards (glass UI), coming soon section, post-session navigation (End Session → dashboard), Start New Session + Back buttons. |
| Demo video — Remotion scaffold | DONE | `video/` — Remotion 4.0 project. Branded intro/outro, problem, architecture, multi-domain, close sequences. 3 screen capture placeholders. |
| Demo video — screen recordings | NOT STARTED | Onboarding (25s), split-screen coaching (70s), vision demo (30s). Record at 1920x1080 → `video/public/captures/`. |
| Devpost text description | DONE | `docs/DEVPOST_DESCRIPTION.md` — ~2000 words. All required sections: Inspiration, What it does, How we built it, Challenges, Accomplishments, What we learned, What's next, third-party disclosure (verbatim). |
| Blog post (+0.6 bonus) | DONE | `docs/BLOG_POST.md` — ~2650 words. Includes mandatory disclosure language + `#GeminiLiveAgentChallenge`. Publishable on Medium/dev.to. |
| README polish for judges | DONE | Fixed `YOUR_ORG` → `ORBWEVA`, added live demo link, judge-friendly 3-command Quick Start callout, clearer GCP placeholder. |

### Q1 2026 (Post-Hackathon)

- [ ] Video generator workflow (S1-W02)
- [ ] Content publisher workflow (S1-W03)
- [ ] First AI influencer live on social media
- [x] Learning data persistence (Supabase) — DONE (v2.4)
- [ ] Big Five mapping (v1 personality integration)

### Q2 2026

- [ ] SaaS platform MVP: registration, subscription, chat
- [ ] Voice chat integration (production quality)
- [ ] Multi-avatar support
- [ ] Educator creator onboarding flow

### Q3 2026

- [ ] Full chat system with session history
- [ ] Learning data sync with Loka platform (bidirectional)
- [ ] Marketplace beta
- [ ] MBTI + DISC + Enneagram integration (v2)

### Q4 2026

- [ ] Marketplace public launch
- [ ] Unified analytics (educator sees LoLA + Loka data)
- [ ] Full personality framework integration (v3)

---

## §8 — Development & Deployment

### Build Environment

| Tool | Purpose |
|------|---------|
| **Claude Code** | Primary development agent |
| **Claude.ai (this project)** | Architecture, specs, strategic planning |
| **Trev (OpenClaw)** | Autonomous task delegation for parallel work |
| **GitHub** | Source control (github.com/ORBWEVA/lola) |
| **Google Cloud Run** | Production deployment |
| **n8n.orbweva.cloud** | Workflow hosting |

### Deployment

| Tool | File | Purpose |
|------|------|---------|
| `scripts/deploy.sh` | Shell script | One-command deploy via `gcloud run deploy --source .` |
| `cloudbuild.yaml` | Cloud Build config | CI/CD pipeline: build → push to Artifact Registry → deploy to Cloud Run |
| `Dockerfile` | Multi-stage | Stage 1: Node.js frontend build. Stage 2: Python backend + dist/ |
| `.dockerignore` | Exclusions | Prevents .git, node_modules, venv, docs from entering container |

### Commit Practices

Follow ORBWEVA standard: conventional commits, descriptive messages, no force-pushing to main.

### Hackathon Build Strategy

Build the adaptive coaching demo first — it's the differentiator. The content pipeline (S1-W01/W01b) already works. The demo must show personality-adaptive coaching producing visibly different outcomes from the same scenario.

---

## §9 — Integration Boundaries

### Loka ↔ LoLA Integration

When both Loka and LoLA are in use, shared learning data flows between classroom sessions, AI coaching conversations, and self-study exercises — creating the co-active learning triangle.

**Entry Points:** Learners can enter from either door:

- **Through LoLA** — wants conversation practice → gets personality-adaptive AI coaching → captured data builds personal curriculum → over time, structured lessons from their own patterns → that's Loka
- **Through Loka** — wants structured curriculum and classroom tools → captured data in exercises and assessments → wants more speaking practice → that's LoLA
- **Through an educator** — teacher uses Loka in classroom, assigns LoLA practice between classes → both feed the same data loop → educator sees unified progress

### Integration Timeline

| Integration | Description | Target |
|---|---|---|
| Shared learner identity | LoLA users linked to Living Textbook student profiles | Q3 2026 |
| Bidirectional data sync | LoLA conversations generate data that flows to educator Canvas; Canvas data informs LoLA coaching | Q3 2026 |
| Progress sync | LoLA conversation data feeds Living Textbook progress tracking | Q4 2026 |
| Avatar knowledge base | Living Textbook curriculum available to LoLA avatars via ARC format | Q4 2026 |
| Unified analytics | Educator sees student's LoLA practice alongside live session data | 2027+ |

### LoLA Market Domains (Beyond Language)

LoLA is not limited to language learning. The coaching framework and data loop work for any domain where knowledge transfers through co-active conversation:

| Domain | Avatar Role | What Gets Coached |
|---|---|---|
| **Language learning** | Conversation partner | English conversation, grammar, vocabulary |
| **Sales training** | Prospect simulator | Objection handling, closing, discovery |
| **Job interview prep** | Interviewer simulator | Storytelling, answering under pressure |
| **Public speaking** | Audience simulator | Delivery, persuasion, structure |
| **Executive coaching** | Leadership mirror | Difficult conversations, feedback, delegation |
| **Negotiation** | Counterpart simulator | Anchoring positions, concessions, rapport |
| **Customer service** | Customer simulator | Empathy, de-escalation, script adherence |

English for Japanese learners is the first vertical. The architecture supports all of these with the same coaching framework.

---

## §10 — Market Context

### Japan's English Learning Crisis — The $8.76 Billion Failure

Japan ranks 96th of 123 countries in the EF English Proficiency Index (2025), declining for 11 consecutive years. Younger cohorts (18-25) now score worse than older generations. Over 50% of students scored zero on speaking sections of standardized tests. The market spends ¥1.3 trillion ($8.76B) annually with worsening results.

**The problem is psychological, not linguistic.** Cultural face-saving norms (面子/メンツ) create paralyzing speaking anxiety. 60% of Japanese learners have tried AI conversation apps seeking less stressful alternatives — but existing apps offer AI ↔ Learner conversation without coaching methodology or educator involvement, reproducing anxiety patterns in digital form.

**This is why the co-active architecture matters:** Every competitor addresses the symptom (lack of practice) with one relationship (AI ↔ Learner). Loka + LoLA addresses the cause (psychological barriers that vary by individual) with three relationships connected by shared learning data. The educator provides human trust. The AI provides personality-adaptive coaching. The data loop ensures both sides inform each other.

### Competitive Landscape

$260M+ in VC funding has produced AI language tools that are technically impressive but structurally identical — consumer apps with a single line: AI ↔ Learner.

| | Speak | Praktika | ELSA | Duolingo | LoLA |
|---|---|---|---|---|---|
| **Funding** | $162M / $1B val | $38M Series A | $60M | Public ($8B+) | Bootstrapped |
| **Users** | 10M+ | 14M+ | 90M+ | 800M+ | Pre-launch |
| **Structured methodology** | ✗ | ✗ | ✗ | ✗ | 12-principle framework |
| **Personality-adaptive** | ✗ | ✗ | ✗ | ✗ | MBTI/Big Five/DISC/Enneagram integration |
| **Co-active triangle** | ✗ | ✗ | ✗ | ✗ | Educator ↔ AI ↔ Learner |
| **Educator creator platform** | ✗ | ✗ | ✗ | ✗ | Educators own & monetize avatars |
| **Self-marketing pipeline** | ✗ | ✗ | ✗ | ✗ | Avatars generate own audiences |
| **Japan depth** | Some JP content | JP launched May 2025 | Pronunciation focus | Gamified, generic | 23 years classroom experience |

### The Praktika Comparison

Praktika ($38M, 3D lip-syncing avatars, 14M downloads, Japanese launched May 2025) is the closest conceptual match but structurally different:

| | Praktika | LoLA |
|---|---|---|
| **Architecture** | AI ↔ Learner (line) | Educator ↔ AI ↔ Learner (co-active triangle) |
| **Model** | Consumer app — Praktika owns all avatars | Creator platform — educators own their avatars |
| **Methodology** | Claims "psychological support" — cites no framework | 12-principle framework integrating personality science |
| **Personalization** | Difficulty level (beginner/intermediate/advanced) | Psychological profile (personality type, learning style, motivation) |
| **Educator role** | None | Central — data flows between AI coaching and classroom |
| **User acquisition** | VC-funded app store marketing | Avatars generate own social media content and audiences |

**Praktika is Netflix** — it creates content, users consume it. **LoLA is YouTube** — educators create their own coaching avatars, build their own audiences, earn their own revenue. LoLA provides the coaching engine and the platform.

### Market Validation: Shizuku AI

a16z invested $15M seed ($75M post-money valuation) in Shizuku AI — an AI-native virtual character startup targeting the companion space. This validates the thesis that AI characters can build meaningful, monetizable relationships with users. LoLA rides the same wave into education — a larger, more defensible market with clearer monetization and lower regulatory risk.

### The Competitive Moat — Three Platform Layers + Four Founder Advantages

**Platform Layers (product moat):**

| Layer | What It Is | Why Competitors Can't Copy |
|-------|-----------|---------------------------|
| **Adaptive Coaching Engine** | 12-principle framework integrating personality science to adapt coaching to each learner's psychological profile | Requires pedagogical + psychological expertise — not an engineering problem |
| **Co-Active Learning Triangle** | Shared data connects educator ↔ learner ↔ AI; classroom data feeds AI, AI data feeds educator | Competitors are AI-only; adding educators would require rebuilding their architecture |
| **Educator Creator Platform + Self-Marketing Pipeline** | Educators build, own, and monetize coaching avatars that generate their own audiences | Competitors own their avatars and spend VC on acquisition |

**Founder Advantages (execution moat):**

| Advantage | Detail |
|-----------|--------|
| **23 Years Teaching** | Hands-on classroom experience with Japanese English learners since 2002 — the coaching framework comes from real pedagogy |
| **Operating School** | Accent Language School dogfoods everything — features work in real classrooms before they ship |
| **AI + Automation** | Modular n8n-based architecture — adaptable and extensible where competitors build closed monoliths |
| **Japan Domain** | Cultural fluency, Japanese business relationships, bilingual operations — 23 years of market knowledge |

---

## §11 — Hackathon MVP Demo Specification

### Principle

One fully functional adaptive coaching interaction beats five half-baked features. The demo must show personality-adaptive coaching producing visibly different outcomes — and flash the creator platform to show this isn't just an app.

### Demo Flow (3 minutes)

**[0:00–0:30] — The Problem**
"Japan spends $8.76 billion on English learning and ranks 96th — declining 11 consecutive years. Every AI app gives you conversation. None of them coach. And none of them include the educator."

**[0:30–1:00] — Learner Onboarding**
5-question intake. Two profiles created side by side:
- Profile A: Analytical, reflective, structure-first, metrics-driven
- Profile B: Social, action-paced, emotion-driven, flow-first

**[1:00–2:15] — Split-Screen Coaching (THE WOW MOMENT)**
Same scenario: Japanese learner produces "I go to the restaurant yesterday"

*Profile A coaching (left screen):*
"Interesting — you used the right vocabulary and word order. Let me show you something about how English handles time differently from Japanese. In Japanese, 昨日 carries the tense. In English, the verb itself changes. 'Go' becomes 'went.' You already know the pattern — we saw it last session with 'eat/ate.' Same principle. When you're ready, try again."

*Profile B coaching (right screen):*
"You're so close! And honestly, everyone understood exactly what you meant — that's real communication! Let's just polish one thing. Picture this: you're telling your friend about last night's amazing ramen. 'I went to the restaurant' — past tense 'went.' Try it! ... Perfect! That sounded completely natural."

Both correct pedagogy. Both address the same error. Adapted to different psychological profiles. No competitor does this.

**[2:15–2:45] — Educator Creator View + Data Dashboard (30 seconds)**
Quick flash: educator defining avatar → 12-principle framework auto-applied → learning data showing progress across both Loka exercises and LoLA sessions → unified picture
"This isn't just an app. It's a platform educators build on — and the data flows between AI coaching and the classroom."

**[2:45–3:00] — Close**
"No two brains are alike. We finally have the technology to teach that way. Today it's language learning. The architecture works for any domain where humans learn through co-active conversations."

### What NOT to Demo

- Avatar visual quality (loses to Praktika's $38M 3D lip-sync)
- Voice quality comparisons (commodity)
- "Available 24/7" messaging (every app says this)
- Generic AI conversation (ChatGPT does this for free)
- Multiple domains beyond English (plant the seed verbally, don't demo it)

---

---

## §12 — Actual Project Structure (as of v1.2)

```
lola/
├── README.md                           # Immergo README (needs update for LoLA)
├── GEMINI.md                           # AI coding agent guide (from Immergo)
├── CONTRIBUTING.md                     # Contribution guidelines
├── Dockerfile                          # Cloud Run container definition
├── package.json                        # Vite + frontend dependencies
├── vite.config.js                      # Vite build config
├── index.html                          # SPA entry point
├── app.json                            # App metadata
├── docs/
│   ├── LOLA_HACKATHON_SPEC.md          # Build specification v2.2
│   └── LOLA_MASTER_v1.1.md            # This document (canonical master)
├── scripts/
│   ├── dev.sh                          # Local development startup
│   ├── deploy.sh                       # Cloud Run deploy script
│   ├── generate-expressions.js         # Interactive avatar generation (FLUX Schnell + Kontext Pro)
│   └── install.sh                      # Dependency installation
├── server/                             # Python backend (FastAPI)
│   ├── main.py                         # FastAPI app — routes, WebSocket, auth
│   ├── gemini_live.py                  # Gemini Live API session manager
│   ├── config_utils.py                 # API key / Vertex AI mode detection
│   ├── profile_engine.py              # 5-question → coaching profile + 4 demo profiles
│   ├── instruction_engine.py          # Profile + L1 → system instruction generator
│   ├── principles.py                  # 12 principles as weighted structured data
│   ├── report_engine.py              # Post-session coaching report generator (Gemini 2.5 Flash text)
│   ├── l1_patterns/
│   │   ├── __init__.py                # L1 registry (JA, KO, EN)
│   │   ├── japanese.py                # JA interference patterns + bridges (→EN)
│   │   ├── korean.py                  # KO interference patterns + bridges (→EN)
│   │   └── english.py                 # EN interference patterns + bridges (→JA)
│   ├── recaptcha_validator.py         # ReCAPTCHA v3 validation
│   ├── fingerprint.py                 # Device fingerprinting for rate limiting
│   └── simple_tracker.py             # Analytics event tracking
├── src/                               # Frontend (Vanilla JS + Vite)
│   ├── main.js                        # App entry point
│   ├── style.css                      # Global styles
│   ├── components/
│   │   ├── app-root.js               # Root component / router
│   │   ├── view-lola.js              # Main LoLA session — avatar, voice, profile picker
│   │   ├── view-chat.js              # Text chat view (from Immergo)
│   │   ├── view-splash.js            # Landing/splash screen (unused — landing now in view-lola.js)
│   │   ├── view-missions.js          # Missions view (from Immergo)
│   │   ├── view-summary.js           # Session summary view
│   │   ├── audio-visualizer.js       # Audio visualization component
│   │   ├── live-transcript.js        # Live transcription display
│   │   └── text-cycler.js            # Text animation component
│   ├── lib/gemini-live/
│   │   ├── geminilive.js             # Frontend Gemini Live API client (WebSocket)
│   │   └── mediaUtils.js             # AudioPlayer, AudioRecorder, camera utils
│   └── data/
│       └── missions.json              # Mission scenarios (from Immergo)
└── public/
    ├── avatars/                        # Generated avatar expression images
    │   ├── profile-{a,b,c,d}/         # Per-profile directories
    │   │   ├── anchor.png             # Approved anchor image
    │   │   ├── {expression}.png       # 8 expressions: neutral, thinking, smiling, etc.
    │   │   └── candidates/            # Stage 1 candidates + prompts.json
    │   └── expression-prompts.json    # Stage 2 prompt definitions
    ├── audio-processors/
    │   ├── capture.worklet.js         # Mic capture AudioWorklet
    │   └── playback.worklet.js        # Audio playback AudioWorklet
    └── talkinghead/
        └── playback-worklet.js        # TalkingHead audio worklet
```

## §13 — Implementation Notes & Known Issues

### Gemini Live API Configuration (ACTUAL)

```javascript
// Frontend setup (geminilive.js)
{
  responseModalities: ["AUDIO"],
  temperature: 0.7,          // Lowered from 1.0 for consistent instruction-following
  voiceName: "Kore",         // Female voice (changed from Puck/male)
  enableAffectiveDialog: false,  // NOT supported on native audio models
  proactivity: null,             // NOT supported on native audio models
  inputAudioTranscription: true,
  outputAudioTranscription: true,
  automaticActivityDetection: {
    disabled: false,
    silence_duration_ms: 2000,
    prefix_padding_ms: 500,
  }
}
```

### Known Issues (as of v1.2)

| Issue | Severity | Notes |
|-------|----------|-------|
| Lip sync is volume-based, not phoneme-based | Medium | AnalyserNode maps overall volume to mouth openness. Not true viseme detection. Acceptable for demo but not production quality. |
| Avatar model is generic RPM | Low | Single default avatar. Spec calls for 2 distinct coaches (analyst vs explorer). |
| `enable_affective_dialog` not available on native audio | Mitigated (v2.0) | Original spec relies on affective dialog for emotion detection. Native audio models don't support it. Replaced with frontend frustration detection scanning input transcription for signals (explicit phrases, hesitation patterns, Japanese frustration markers). |
| `sendClientContent()` mid-session updates | Resolved (v2.0) | Implemented via `context_update` message type routed through text_input_queue → session.send(). Frustration detection triggers context updates. Tested in dev. |
| Vision (camera) not fully wired in frontend | Medium | Backend supports video input queue; frontend camera capture UI not connected to LoLA view. |
| 5-question onboarding not built | Low (demo) | Using 4 pre-built demo profiles. Full onboarding is Phase 2. |
| No session persistence | Low | Each session starts fresh. No cross-session memory. |

### Voice Configuration

| Voice | Gender | Used For | Notes |
|-------|--------|----------|-------|
| Kore | Female | All profiles (current) | Warm, clear. Set in `view-lola.js` |
| Puck | Male | Not used (was default) | Changed to Kore for better coaching persona |

Spec calls for distinct voices per coach avatar (Profile A calm/measured, Profile B warm/energetic). Not yet implemented — currently all profiles use Kore.

---

*This document is updated as LoLA progresses through development. When this document conflicts with older docs (LOLA_PRD_v1, LOLA_PRD_v2, lola_shizuku_strategic_scope), this document wins.*
