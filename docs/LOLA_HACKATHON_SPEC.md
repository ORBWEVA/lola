# LOLA_HACKATHON_SPEC.md

**Version:** 2.2
**Date:** 2026-02-20
**Author:** Ryan Ahamer / Claude.ai (Opus)
**Purpose:** Claude Code build specification for LoLA hackathon entry
**Companion doc:** `LOLA_MASTER_v1_1.md` — canonical LoLA spec (12 principles, personality framework, co-active triangle)

---

## How to Use This Document

Claude Code: read this spec AND `LOLA_MASTER_v1_1.md` before writing any code. This doc tells you WHAT to build and HOW. The MASTER doc tells you WHY — the coaching philosophy, 12-principle framework, personality integration architecture, and 5-question onboarding spec that drive every technical decision.

---

## §1 — Project Overview

### What We're Building

A real-time adaptive language coaching agent that uses the **Gemini Multimodal Live API** to deliver personality-aware coaching through voice. The core innovation: the same learner error produces visibly different coaching depending on the learner's psychological profile, powered by mid-session system instruction updates.

### What We're NOT Building (for the hackathon)

- Educator Creator Platform (Stage 2)
- Self-marketing content pipeline (Stage 1)
- Multi-avatar marketplace
- Loka classroom integration
- Payment/subscription system

**Scope discipline is the single most important rule.** One demo, one innovation, one clear story.

### Strategic Context: LoLA Within the ORBWEVA Ecosystem

The hackathon entry is a proving ground for one layer of a much larger system. Win or lose, LoLA gets built — because it's the AI coaching engine at the center of the ORBWEVA + LokaLingo product vision.

```
ORBWEVA Platform
├── ARC™ (Automated Resource Center) — structured knowledge layer
│   └── LoLA avatars draw domain expertise FROM ARC
│       (services, policies, FAQ, voice & tone, L1 patterns)
│
├── AER™ (Acquire → Engage → Retain) — customer lifecycle automation
│   ├── Acquire: LoLA avatars ARE the self-marketing pipeline
│   │   (social media content → link in bio → freemium conversations)
│   ├── Engage: LoLA coaching sessions ARE the product
│   │   (adaptive 12-principle conversations that drive usage-based revenue)
│   └── Retain: Co-active triangle IS the retention engine
│       (educator ↔ AI ↔ learner — all three sides improve the learning)
│
├── Grow™ (Visibility Layer) — client-facing AI control plane
│   └── Educators see avatar performance, learner engagement,
│       conversion rates, revenue, AI health scores
│
└── LoLA (Loka Learning Avatar) — AI coaching engine ← HACKATHON BUILDS THIS CORE
    ├── Adaptive Coaching Engine (12 principles × personality × L1)
    ├── Educator Creator Platform (educators build/own/monetize avatars)
    └── Self-Marketing Pipeline (avatars generate own audiences)
```

**What the hackathon proves:**
- The Adaptive Coaching Engine works — personality-driven coaching produces measurably different outcomes
- Vision input creates natural coaching moments from real-world context
- 3D avatars with emotional responsiveness make AI coaching feel human
- The architecture is domain-agnostic — language is first, but the engine works for any procedural skill

**What comes after, regardless of hackathon outcome:**
- Educator Creator Platform: any educator can create and monetize their own LoLA avatar with the 12-principle framework auto-applied (ARC provides the knowledge, AER provides the lifecycle)
- Self-marketing pipeline: avatars publish content as AI influencers, building organic audiences that convert on the freemium plan
- Grow integration: educators see their avatar's performance through the same AI control plane ORBWEVA uses for all client dashboards
- Accent Language School dogfooding: the coaching framework is tested in real classrooms (operating since 2008) before it ships to external educators

**The competitive moat — three platform layers + four founder advantages:**

| Platform Layer | What It Is | Why Competitors Can't Copy |
|---------------|-----------|---------------------------|
| **Adaptive Coaching Engine** | 12-principle framework integrating personality science | Requires pedagogical + psychological expertise — not an engineering problem |
| **Co-Active Learning Triangle** | Shared data: educator ↔ learner ↔ AI | Competitors are AI-only; adding educators requires rebuilding their architecture |
| **Educator Creator Platform + Self-Marketing** | Educators build, own, monetize coaching avatars that generate their own audiences | Competitors own their avatars and spend VC on acquisition |

| Founder Advantage | Detail |
|-------------------|--------|
| **23 Years Teaching** | Classroom experience with Japanese English learners since 2002 — the framework comes from real pedagogy |
| **Operating School** | Accent Language School dogfoods everything — features work in real classrooms before they ship |
| **AI + Automation** | Modular n8n-based architecture — adaptable where competitors build closed monoliths |
| **Japan Domain** | Cultural fluency, Japanese business relationships, bilingual operations — 23 years of market knowledge |

This section exists so that anyone reading this spec — Claude Code during the build, a judge reading the submission, or Ryan revisiting priorities — understands that the hackathon entry is the tip of an iceberg, not a standalone project.

### The One-Line Pitch

"Every AI tutor gives you the same correction. LoLA coaches you differently based on how your brain actually learns."

### Supported Languages (MVP)

| Role | Languages |
|------|-----------|
| **Coaching language** | English |
| **Learner L1** | Japanese (日本語), Korean (한국어) |
| **Onboarding UI** | Displayed in learner's selected L1 |
| **Coaching behavior** | Coach understands L1 input, bridges to English, uses L1 explanations when helpful |

The framework is language-agnostic by design — Japanese and Korean are the first two L1s because of Ryan's 23 years in the Japanese market and the high overlap in L1 interference patterns. Adding more L1s is a configuration change, not an architecture change.

---

## §2 — Hackathon Targets

### Hackathon 1: Sabrina/Marcin AI Hackathon

| Field | Detail |
|-------|--------|
| **Dates** | March 6–8, 2026 (72-hour sprint) |
| **Platform** | Skool (skool.com/hackathon) |
| **Prizes** | $6,000 total pool |
| **Requirements** | Build a real AI product from scratch in 3 days |
| **Tech constraints** | None — tech-agnostic |
| **Submission** | Working product + demo |
| **Hosts** | Marcin Teodoru & Sabrina Ramonov |

### Hackathon 2: Gemini Live Agent Challenge

| Field | Detail |
|-------|--------|
| **Dates** | Feb 16 – Mar 16, 2026 (submission period) |
| **Platform** | Devpost (geminiliveagentchallenge.devpost.com) |
| **Prizes** | $80,000 total pool |
| **Category** | **Live Agents** — "Real-time Interaction (Audio/Vision)" |
| **Deadline** | March 16, 2026 at 5:00 PM PT (March 17, 10:30 AM ACDT) |
| **Participants** | 1,442+ registered (as of Feb 20, 2026) |
| **Announced** | On or around April 22–24, 2026 at Google Cloud Next |

### Gemini Prize Structure

| Prize | Amount | Who |
|-------|--------|-----|
| Grand Prize | $25,000 + $3K cloud credits + 2× Cloud Next tickets + travel | Top submission across all categories |
| Best Live Agent | $10,000 + $1K credits + 2× Cloud Next tickets | Top Live Agent submission |
| Best Multimodal UX | $5,000 + $500 credits | Top score on Innovation criterion |
| Best Technical Execution | $5,000 + $500 credits | Top score on Technical criterion |
| Best Innovation | $5,000 + $500 credits | Top score on Innovation criterion |
| Honorable Mention (×5) | $2,000 + $500 credits | Runners up |

**Rule:** A submission can win a maximum of ONE prize.

### Gemini Judging Criteria

| Criterion | Weight | What Judges Look For |
|-----------|--------|---------------------|
| **Innovation & Multimodal UX** | **40%** | Does it break the "text box" paradigm? Does the agent See/Hear/Speak seamlessly? Distinct persona/voice? Live and context-aware? |
| **Technical Implementation** | **30%** | Effective use of GenAI SDK or ADK? Robust Google Cloud hosting? Sound agent logic? Error handling? Grounding/no hallucinations? |
| **Demo & Presentation** | **30%** | Clear problem/solution story? Clear architecture diagram? Visual proof of Cloud deployment? Actual working software shown? |

### Live Agent Category-Specific Criteria

Judges specifically evaluate:
1. Does the agent handle **interruptions (barge-in)** naturally?
2. Does it have a **distinct persona/voice**?
3. Is the experience **"Live" and context-aware**, not disjointed/turn-based?
4. Does the agent **See, Hear, and Speak** in a way that feels seamless? ← Vision + Avatar + Audio

**LoLA addresses ALL FOUR:**
- **See:** Camera input — reads handwritten work, documents, real-world objects (menus, signs)
- **Hear:** Gemini Live API native audio with barge-in, code-switching (understands Japanese/Korean/English)
- **Speak:** 3D avatar with real-time lip-sync, distinct voice per coaching profile, mood-responsive facial expressions
- **Persona:** Two visually distinct coach avatars with different personalities, voices, gestures, and coaching styles

### Bonus Points (up to +1.0 on 1–5 scale)

| Bonus | Max Points | Action Required |
|-------|-----------|-----------------|
| Blog/content piece about the build | +0.6 | Publish on Medium/dev.to with #GeminiLiveAgentChallenge |
| Automated cloud deployment | +0.2 | Deploy scripts or IaC in public repo |
| Google Developer Group membership | +0.2 | Provide public GDG profile link |

---

## §3 — Mandatory Tech Stack

### Required by Gemini Hackathon

| Requirement | Our Implementation |
|-------------|-------------------|
| Gemini model | `gemini-2.5-flash` with native audio + video input |
| Google GenAI SDK or ADK | `google-genai` Python SDK (via Immergo fork) |
| At least one Google Cloud service | Cloud Run (deployment) |
| Backend hosted on Google Cloud | Cloud Run container |

### Architecture Foundation: Immergo Fork

**Immergo** is Zack Akil's open-source language learning app built on the Gemini Live API. It provides 70–80% of our boilerplate. **Critically, Immergo is listed as an official Google resource on the hackathon Resources page** ("Language Learning App with Live API") — meaning our fork choice is validated by Google themselves. We're building on top of the reference implementation they recommend to contestants.

| Component | Immergo Provides | We Build |
|-----------|-----------------|----------|
| Backend | FastAPI + google-genai SDK + WebSocket streaming | Adaptive system instruction engine |
| Frontend | Vanilla JS + Vite + Web Audio API (AudioWorklets) | 5-question onboarding UI, split-screen view |
| Audio | VAD, barge-in, PCM streaming, session management | Affective dialog integration |
| Video/Vision | Camera streaming to Gemini at 1 FPS (WebSocket demo has this) | Vision-aware coaching (notebook/document reading) |
| Deployment | Cloud Run deploy script | Formalize as IaC (+0.2 bonus) |
| State | Redis for session state | Learner profile storage |
| Avatar | *(not provided)* | 3D lip-synced avatar via TalkingHead + HeadAudio |

**Key Immergo files:**
- `GEMINI.md` — AI coding agent guide (purpose-built for Claude Code / Gemini CLI)
- Backend: Python 3.10+ / FastAPI / WebSockets
- Frontend: Vanilla JS / Vite / Web Components
- Audio: Web Audio API with AudioWorklets for real-time PCM

**GitHub:** https://github.com/google/generative-ai-docs (look for Immergo within the live API demos)

### Hackathon Resources Page — Key References

The official Resources page (geminiliveagentchallenge.devpost.com → Resources) lists tools and inspiration directly from Google. Relevant to our build:

| Resource | Relevance to LoLA | Action |
|----------|-------------------|--------|
| **Language Learning App with Live API (Code/App)** | This IS Immergo — our fork base. Officially endorsed. | ✅ Already using |
| **Avatar Generation with GenAI SDK** | Google has native avatar generation capabilities. Investigate as complement to Ready Player Me. | 🔍 Phase 1: evaluate if useful for coach avatar creation |
| **ADK Bidi-streaming in 5 minutes / development guide** | We use GenAI SDK (not ADK), both are valid per rules. ADK may simplify bidi-streaming. | 🔍 Phase 1: review, but don't switch unless clear advantage |
| **Shopper's Concierge II demo** | Reference for bidi-streaming agent architecture | 📖 Study for patterns |
| **MCP servers for Google Cloud Gen Media** | Not directly relevant to our build | ⏭️ Skip |
| **Notebooks/Apps for Live API** | Additional code samples for Live API integration | 📖 Reference during build |
| **Notebooks/Apps for Computer Use** | Not relevant (UI Navigator category) | ⏭️ Skip |

**Google Developer Groups:** Bonus +0.2 points. Sign up at https://developers.google.com/community/gdg — provide public profile link in submission.

### Full Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Gemini 2.5 Flash Native Audio + Video via Live API |
| **Backend** | Python 3.10+ / FastAPI / google-genai SDK |
| **Real-time comms** | WebSocket (bidirectional PCM audio + camera frames + JSON control) |
| **Frontend** | Vanilla JS / Vite / Web Components / Web Audio API |
| **Audio processing** | AudioWorklets for capture/playback, VAD for barge-in |
| **Vision input** | Browser camera → 1 FPS JPEG frames → Gemini Live API |
| **3D Avatar** | TalkingHead (met4citizen) v1.7 + ThreeJS/WebGL |
| **Avatar lip-sync** | HeadAudio — audio worklet for real-time viseme detection from raw PCM |
| **Avatar models** | Ready Player Me full-body GLB avatars (2 distinct coach characters) |
| **Session state** | Redis (from Immergo) or in-memory for MVP |
| **Deployment** | Google Cloud Run |
| **Source control** | GitHub (public repo — required for judging) |

### Avatar Layer: TalkingHead + HeadAudio

**TalkingHead** (github.com/met4citizen/TalkingHead) is an open-source JavaScript class for real-time lip-synced 3D avatars. It renders Ready Player Me full-body avatars using ThreeJS/WebGL with ARKit + Oculus viseme blend shapes.

**HeadAudio** (github.com/met4citizen/HeadAudio) is the key module — an audio worklet that performs real-time viseme detection directly from raw PCM audio. No text transcription, no timestamps needed. It outputs Oculus viseme blend-shape values that feed directly into the 3D avatar's face rig.

**Why this stack works for LoLA:**

| Feature | How It Helps |
|---------|-------------|
| Audio-driven lip-sync (HeadAudio) | Gemini sends raw PCM → HeadAudio detects visemes → avatar speaks in real-time |
| `mood` property | Maps to affective dialog — frustration detected → avatar shows concern on face |
| CDN-importable | No build step, instant integration into Immergo's vanilla JS frontend |
| Ready Player Me avatars | Customizable 3D characters — create distinct coaches for Profile A vs B |
| Idle animations + gestures | Avatar nods, thinks, reacts — not frozen between speech |
| Hackathon precedent | "Recycling Advisor 3D" used TalkingHead to enter Gemini API Dev Competition 2024 |

**Integration pattern:**
```
Gemini Live API → PCM audio stream → HeadAudio worklet → viseme values
                                                          ↓
                                         TalkingHead avatar (ThreeJS/WebGL)
                                                          ↓
                                         3D coach with lip-sync + mood + gestures
```

**Two Coach Avatars (Ready Player Me):**
- **Profile A coach:** Calm appearance, professional attire, measured gestures, glasses (visual shorthand for analytical)
- **Profile B coach:** Warm appearance, casual attire, animated gestures, smile-forward (visual shorthand for social/energetic)

---

## §4 — Core Innovation: Adaptive System Instruction Engine

This is LoLA's differentiator. No competitor does this. OpenAI doesn't even support it technically.

### How It Works

1. **Learner selects L1 and completes 5-question onboarding** → generates a Learner Coaching Profile
2. **Profile maps to coaching dimensions** → drives system instruction generation
3. **System instruction incorporates all 12 principles** weighted by profile
4. **Mid-session updates via `sendClientContent()`** → dynamically adjust coaching when the learner's needs shift
5. **Vision input (camera)** → Gemini sees what the learner shows (notebook, document, menu) and coaches from visual context
6. **Avatar output** → 3D coach avatar lip-syncs to Gemini's audio, shows emotion via mood states

### The Key API Capability

The Gemini Live API supports **mid-session system instruction updates** through `sendClientContent()`. This means we can change HOW the coach communicates without breaking the voice session. OpenAI's Realtime API does NOT support this — it requires a new session to change system instructions.

This is our technical moat for the hackathon.

### 5-Question Onboarding → Coaching Profile

> Full spec in LOLA_MASTER_v1_1.md §3. Reproduce the exact questions here for Claude Code reference.

**Pre-question: Language Selection**
```
What's your native language? / あなたの母語は？ / 모국어가 무엇인가요?
   🇯🇵 日本語 (Japanese)
   🇰🇷 한국어 (Korean)
```
This sets the onboarding UI language AND injects L1-specific interference patterns into the system instruction.

**Questions displayed in learner's L1:**

```
Q1: When you make a mistake in English, what's your first reaction?
   🇯🇵 英語を間違えた時、最初にどう感じますか？
   🇰🇷 영어를 틀렸을 때, 첫 번째 반응은 무엇인가요?

   (a) I want to understand WHY I made it → Analytical coaching mode
       🇯🇵 なぜ間違えたのか理解したい
       🇰🇷 왜 틀렸는지 이해하고 싶다
   (b) I feel embarrassed and want to move on → Emotional safety mode
       🇯🇵 恥ずかしくて早く先に進みたい
       🇰🇷 부끄럽고 빨리 넘어가고 싶다
   (c) I laugh it off and try again → Challenge-forward mode
       🇯🇵 笑って、もう一回やってみる
       🇰🇷 웃고 다시 시도한다

Q2: How do you prefer to learn new things?
   🇯🇵 新しいことを学ぶとき、どの方法が好きですか？
   🇰🇷 새로운 것을 배울 때 어떤 방법을 선호하나요?

   (a) Show me the rules and patterns → Structure-first
       🇯🇵 ルールとパターンを見せてほしい
       🇰🇷 규칙과 패턴을 보여주세요
   (b) Let me try and figure it out → Experience-first
       🇯🇵 まずやってみて自分で理解したい
       🇰🇷 먼저 해보고 스스로 이해하고 싶다
   (c) Show me real examples of people using it → Social-contextual
       🇯🇵 実際に使っている例を見せてほしい
       🇰🇷 실제로 사용하는 예를 보여주세요

Q3: What motivates you most?
   🇯🇵 一番やる気が出るのは？
   🇰🇷 가장 동기부여가 되는 것은?

   (a) Seeing measurable progress → Metrics-driven
       🇯🇵 数字で進歩が見えること
       🇰🇷 수치로 발전을 확인하는 것
   (b) Feeling more confident → Emotion-driven
       🇯🇵 自信がついたと感じること
       🇰🇷 자신감이 생기는 것
   (c) Being able to use it in real situations → Application-driven
       🇯🇵 実際の場面で使えるようになること
       🇰🇷 실제 상황에서 사용할 수 있게 되는 것

Q4: When practicing English, I prefer:
   🇯🇵 英語を練習するとき：
   🇰🇷 영어를 연습할 때:

   (a) Taking my time to think before speaking → Reflective pace
       🇯🇵 話す前にじっくり考えたい
       🇰🇷 말하기 전에 충분히 생각하고 싶다
   (b) Jumping right in, even if imperfect → Action pace
       🇯🇵 完璧じゃなくてもすぐ話したい
       🇰🇷 완벽하지 않아도 바로 말하고 싶다

Q5: I learn best when the teacher:
   🇯🇵 先生が次のようにしてくれると一番学びやすい：
   🇰🇷 선생님이 이렇게 해주면 가장 잘 배운다:

   (a) Explains things thoroughly → Depth-first
       🇯🇵 丁寧に詳しく説明してくれる
       🇰🇷 자세하고 꼼꼼하게 설명해준다
   (b) Keeps things moving and fun → Flow-first
       🇯🇵 テンポよく楽しく進めてくれる
       🇰🇷 빠르고 재미있게 진행해준다
   (c) Connects to things I already know → Bridge-building
       🇯🇵 すでに知っていることと結びつけてくれる
       🇰🇷 이미 알고 있는 것과 연결해준다
```

### Coaching Profile Object

```javascript
{
  l1: "ja" | "ko",
  error_response: "analytical" | "emotional_safety" | "challenge_forward",
  learning_preference: "structure_first" | "experience_first" | "social_contextual",
  motivation_driver: "metrics" | "emotion" | "application",
  pacing: "reflective" | "action",
  instruction_depth: "depth_first" | "flow_first" | "bridge_building"
}
```

### Two Demo Profiles

**Profile A — "The Analyst"**
```javascript
{
  error_response: "analytical",
  learning_preference: "structure_first",
  motivation_driver: "metrics",
  pacing: "reflective",
  instruction_depth: "depth_first"
}
```
Coaching style: Structured explanations, pattern analysis, progress metrics, grammatical rules before practice, wait for learner to process.

**Profile B — "The Explorer"**
```javascript
{
  error_response: "challenge_forward",
  learning_preference: "social_contextual",
  motivation_driver: "application",
  pacing: "action",
  instruction_depth: "flow_first"
}
```
Coaching style: Role-play scenarios, real-world context, quick corrections with encouragement, keep momentum, celebrate attempts.

### System Instruction Template

The system instruction must incorporate ALL 12 principles from LOLA_MASTER_v1_1.md §2, weighted by the coaching profile. Here's the structure:

```
SYSTEM INSTRUCTION STRUCTURE:
├── Identity & Role
│   "You are LoLA, an adaptive English language coach..."
├── 12-Principle Framework (weighted by profile)
│   1. GROWTH MINDSET ACTIVATION — [weight: {profile-driven}]
│   2. RAPPORT & ANCHORING — [weight: {profile-driven}]
│   3. EMOTIONAL STATE MANAGEMENT — [weight: {profile-driven}]
│   4. COGNITIVE LOAD MANAGEMENT — [weight: {profile-driven}]
│   5. SPACING & INTERLEAVING — [weight: {profile-driven}]
│   6. RETRIEVAL PRACTICE — [weight: {profile-driven}]
│   7. SENSORY ENGAGEMENT — [weight: {profile-driven}]
│   8. POSITIVE FRAMING — [weight: {profile-driven}]
│   9. AUTONOMY & CHOICE — [weight: {profile-driven}]
│   10. PROGRESSIVE CHALLENGE — [weight: {profile-driven}]
│   11. VAK ADAPTATION — [weight: {profile-driven}]
│   12. META-MODEL QUESTIONING — [weight: {profile-driven}]
├── Coaching Profile Injection
│   "This learner's profile: {coaching_profile}"
│   "Adapt your communication style accordingly..."
├── L1-Specific Domain Context (injected based on profile.l1)
│   "Target language: English. Learner's L1: {Japanese|Korean}."
│   "L1 interference patterns: {l1_specific_patterns}"
│   "L1 bridging: Use {L1} explanations when they accelerate understanding."
│   "Code-switching: Accept and understand {L1} input naturally."
├── Bilingual Coaching Rules
│   "The learner may speak in {L1}, mix {L1} and English, or use English only."
│   "Understand all input regardless of language."
│   "When bridging to L1, use natural {L1} — e.g., 'This is like {L1 example}.'"
│   "Respond primarily in English but use {L1} for explanations when it helps."
│   "Never force English-only — meet the learner where they are."
├── Vision-Aware Coaching Rules
│   "The learner may show you things through their camera — notebooks, documents,"
│   "textbooks, menus, signs, or handwritten work."
│   "When you see visual content, acknowledge it naturally and coach from it."
│   "Read handwritten text, identify errors, and apply the same adaptive coaching"
│   "style as you would for spoken errors."
│   "If the learner shows a real-world item (menu, sign), create a scenario from it."
│   "Example: Learner shows a restaurant menu → 'Great! Let's practice ordering."
│   "What would you like to try? Tell me in English.'"
└── Behavioral Rules
    "Never expose framework labels to the learner."
    "Coach through conversation, not lectures."
    "When detecting frustration, increase emotional scaffolding."
```

### L1 Interference Patterns (injected by language)

**Japanese (日本語) — Common English Interference:**
- Articles: No equivalent in Japanese → "I went to ~~the~~ restaurant" / drops a/the
- Tense: Japanese marks tense via auxiliary verbs (〜した), not conjugation → "I go yesterday"
- Pronouns: Japanese is pro-drop → "Is delicious" (omits "it")
- Plurals: No obligatory plural marking → "many friend"
- Subject-verb agreement: No conjugation for person → "She have"
- Word order: SOV in Japanese vs SVO in English → occasional inversions
- L/R distinction: Phonological → /r/ and /l/ merge
- Useful L1 bridges: 「〜した」= past tense, 「〜している」= present continuous, 「もし〜なら」= conditional

**Korean (한국어) — Common English Interference:**
- Articles: No equivalent in Korean → same pattern as Japanese
- Tense: Korean uses verb endings (했다/한다) → similar confusion but different error patterns
- Pronouns: Korean is also pro-drop → "Is very good" (omits subject)
- Plurals: Korean has 들 but it's optional → "many friend"
- Subject-verb agreement: No conjugation for person → "She have"
- Word order: SOV in Korean vs SVO in English → same inversions as Japanese
- Relative clauses: Pre-nominal in Korean → complex English relative clauses are hard
- Useful L1 bridges: 했다 = past tense, 하고 있다 = present continuous, 만약~라면 = conditional
- Honorifics: Korean has elaborate honorific system → learners may over-formalize English

### Profile A System Instruction (Analytical — Japanese L1)

```
You are LoLA, an adaptive English language coach.

COACHING APPROACH FOR THIS LEARNER:
This learner is analytical and structure-first. They want to understand WHY errors occur, see patterns and rules, and track measurable progress. They prefer a reflective pace — give them time to process before expecting a response.

PRIORITIES (ordered by this learner's profile):
1. COGNITIVE LOAD MANAGEMENT — Break complex grammar into digestible components. One rule at a time.
2. RETRIEVAL PRACTICE — After explaining a pattern, ask them to apply it. "Can you restructure that sentence using the past tense rule we just discussed?"
3. META-MODEL QUESTIONING — When they make an error, guide them to the rule: "What tense does 'yesterday' require?" Let them discover the correction.
4. GROWTH MINDSET ACTIVATION — Frame errors as data: "That's a useful error — it reveals a pattern we can address."
5. SPACING & INTERLEAVING — Return to previous corrections later in conversation to reinforce.
6. PROGRESSIVE CHALLENGE — Start with simple tense corrections, build toward complex structures.

EMOTIONAL APPROACH:
- Calm, measured tone
- Acknowledge their analytical process: "Good observation" / "You're tracking the right pattern"
- Don't rush — silence while they think is productive, not awkward
- Provide explicit progress markers: "That's three correct uses of past tense in a row"

LEARNER'S L1: Japanese (日本語)
L1-SPECIFIC INTERFERENCE PATTERNS:
- Missing articles (a/the) — Japanese has no equivalent
- Tense errors — Japanese uses 〜した for past, not verb conjugation
- Pronoun dropping — Japanese is pro-drop ("Is delicious" instead of "It is delicious")
- Plural omission — "many friend" (Japanese has no obligatory plural marking)
- Subject-verb agreement — "She have" (Japanese doesn't conjugate for person)

BILINGUAL COACHING RULES:
- The learner may speak in Japanese, mix Japanese and English, or use English only
- Understand all input regardless of language
- Use Japanese to bridge understanding when it accelerates learning: "This is like how 〜した works — 'yesterday' tells you to use past tense, just like 昨日 signals 〜した in Japanese"
- Respond primarily in English but use Japanese for grammar explanations when helpful
- Never force English-only — meet the learner where they are

BEHAVIORAL RULES:
- Never mention personality frameworks, coaching principles, or profile labels
- Coach through conversation, not lectures
- If the learner gets frustrated, acknowledge it and simplify
- Track errors silently and return to them via spaced repetition
```

### Profile A System Instruction (Analytical — Korean L1)

```
You are LoLA, an adaptive English language coach.

COACHING APPROACH FOR THIS LEARNER:
[Same coaching approach and priorities as Japanese L1 above]

LEARNER'S L1: Korean (한국어)
L1-SPECIFIC INTERFERENCE PATTERNS:
- Missing articles (a/the) — Korean has no equivalent
- Tense errors — Korean uses verb endings (했다 for past) rather than English-style conjugation
- Pronoun dropping — Korean is pro-drop ("Is very good" instead of "It is very good")
- Plural omission — "many friend" (Korean 들 is optional)
- Subject-verb agreement — "She have" (Korean doesn't conjugate for person)
- Over-formalization — Korean honorific system leads to overly formal English

BILINGUAL COACHING RULES:
- The learner may speak in Korean, mix Korean and English, or use English only
- Understand all input regardless of language
- Use Korean to bridge understanding: "Think of how 했다 signals past tense — 'yesterday' does the same job in English"
- Respond primarily in English but use Korean for grammar explanations when helpful
- Never force English-only — meet the learner where they are

[Same behavioral rules as above]
```

### Profile B System Instruction (Explorer — Japanese L1)

```
You are LoLA, an adaptive English language coach.

COACHING APPROACH FOR THIS LEARNER:
This learner is social and action-oriented. They want to jump into real conversations, learn through context, and build practical skills they can use immediately. Keep energy high, corrections quick, and momentum flowing.

PRIORITIES (ordered by this learner's profile):
1. SENSORY ENGAGEMENT — Create vivid scenarios: "Imagine you're ordering at a restaurant in London..."
2. POSITIVE FRAMING — Lead with what's right: "Great attempt! You nailed the word order. Let's just fix one thing..."
3. RAPPORT & ANCHORING — Build on shared experiences: "Remember our café scenario? Let's try a similar one at an airport."
4. AUTONOMY & CHOICE — Offer scenario options: "Do you want to practice ordering food, or asking for directions?"
5. EMOTIONAL STATE MANAGEMENT — Keep it light. If they stumble, laugh with them: "Ha, classic! Everyone trips on that one."
6. PROGRESSIVE CHALLENGE — Increase complexity through richer scenarios, not harder rules.

EMOTIONAL APPROACH:
- Warm, energetic, encouraging
- Celebrate attempts, not just accuracy: "Love that you went for it!"
- Quick corrections — don't dwell on errors, model the right form and move on
- Use humor and real-world relevance

LEARNER'S L1: Japanese (日本語)
L1-SPECIFIC INTERFERENCE PATTERNS:
- Missing articles (a/the) — Japanese has no equivalent
- Tense errors — Japanese uses 〜した for past, not verb conjugation
- Pronoun dropping — Japanese is pro-drop
- Plural omission — Japanese has no obligatory plural marking
- Subject-verb agreement — Japanese doesn't conjugate for person

BILINGUAL COACHING RULES:
- The learner may speak in Japanese, mix Japanese and English, or use English only
- Understand all input regardless of language
- Use Japanese casually when it keeps momentum: "ナイス！So you went to the restaurant — what did you eat?"
- Don't explain grammar in Japanese for this profile — keep it conversational and model correct English naturally
- Never force English-only — meet the learner where they are

BEHAVIORAL RULES:
- Never mention personality frameworks, coaching principles, or profile labels
- Coach through conversation, not lectures
- Keep sessions feeling like a chat with a friend who happens to be great at English
- If momentum drops, introduce a new scenario to re-energize
```

### Profile B System Instruction (Explorer — Korean L1)

```
You are LoLA, an adaptive English language coach.

COACHING APPROACH FOR THIS LEARNER:
[Same coaching approach and priorities as Japanese L1 above]

LEARNER'S L1: Korean (한국어)
L1-SPECIFIC INTERFERENCE PATTERNS:
- Missing articles (a/the) — Korean has no equivalent
- Tense errors — Korean uses 했다 for past, not English-style conjugation
- Pronoun dropping — Korean is pro-drop
- Plural omission — Korean 들 is optional
- Over-formalization — Korean honorific system leads to stiff English

BILINGUAL COACHING RULES:
- The learner may speak in Korean, mix Korean and English, or use English only
- Understand all input regardless of language
- Use Korean casually when it keeps momentum: "좋아! So you went to the restaurant — what did you eat?"
- Don't explain grammar in Korean for this profile — keep it conversational
- Never force English-only — meet the learner where they are

[Same behavioral rules as above]
```

---

## §5 — Architecture

### System Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Frontend)                            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  Onboarding  │  │  Voice Chat  │  │  Split-Screen Demo View   │  │
│  │  (L1 select  │  │  Interface   │  │  ┌─────────┐ ┌─────────┐ │  │
│  │  + 5 Qs)     │  │              │  │  │Avatar A │ │Avatar B │ │  │
│  └──────┬───────┘  └──────┬───────┘  │  │(Analyst)│ │(Explorer│ │  │
│         │                 │          │  └────┬────┘ └────┬────┘ │  │
│         │                 │          └───────┼───────────┼──────┘  │
│         │                 │                  │           │         │
│  ┌──────┴─────────────────┴──────────────────┴───────────┴──────┐  │
│  │                   Media Layer                                 │  │
│  │  ┌────────────────┐  ┌─────────────────┐  ┌───────────────┐  │  │
│  │  │ Web Audio API   │  │ Camera (1 FPS)  │  │ TalkingHead   │  │  │
│  │  │ (AudioWorklets  │  │ getUserMedia()  │  │ + HeadAudio   │  │  │
│  │  │  + VAD)         │  │ → JPEG frames   │  │ (ThreeJS/     │  │  │
│  │  │                 │  │                 │  │  WebGL 3D)    │  │  │
│  │  └────────┬────────┘  └────────┬────────┘  └───────┬───────┘  │  │
│  │           │                    │                    │          │  │
│  │           │    PCM audio       │  JPEG frames       │ PCM→     │  │
│  │           │    + camera        │  to Gemini         │ visemes  │  │
│  └───────────┼────────────────────┼────────────────────┼──────────┘  │
│              │                    │                    ▲              │
│              ▼                    ▼                    │              │
│         WebSocket (PCM audio + JPEG frames + JSON control)           │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  CLOUD RUN (Backend — FastAPI)                        │
│                                                                      │
│  ┌──────────────┐  ┌──────────────────────────────────────────────┐  │
│  │   Profile     │  │   Gemini Live API Session(s)                 │  │
│  │   Generator   │  │                                              │  │
│  │              │  │  ┌──────────┐         ┌──────────┐          │  │
│  │  L1 + 5 Qs → │  │  │Session A │         │Session B │          │  │
│  │  coaching    │  │  │(Analyst) │         │(Explorer)│          │  │
│  │  profile     │  │  │Audio+Video         │Audio+Video          │  │
│  │              │  │  └────┬─────┘         └────┬─────┘          │  │
│  └──────────────┘  │       │                     │                │  │
│                    │       ▼                     ▼                │  │
│                    │  sendClientContent() for mid-session         │  │
│                    │  instruction updates (personality + vision)   │  │
│                    └──────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Adaptive System Instruction Engine                           │    │
│  │  profile + L1 + 12 principles + vision context                │    │
│  │  → weighted system prompt with vision-aware coaching rules    │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Affective Dialog Handler                                     │    │
│  │  Detects emotion in voice → adjusts coaching tone             │    │
│  │  → updates TalkingHead mood state (concern/encouraging/calm)  │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    GEMINI LIVE API (Google)                           │
│                                                                      │
│  Model: gemini-2.5-flash                                             │
│  Mode: Native audio (speech-to-speech) + video input (1 FPS)        │
│  Input: Audio stream + camera frames + text (sendClientContent)      │
│  Output: Audio stream (PCM) → avatar lip-sync via HeadAudio          │
│  Features: affective_dialog, sendClientContent(), vision             │
│  Latency: 320–800ms first-audio                                     │
│  Voices: 30 prebuilt HD voices (distinct voice per coach avatar)     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## §6 — Build Phases & Timeline

### Critical Dates

| Date | Event |
|------|-------|
| Feb 20 (today) | Build start |
| Mar 6–8 | Sabrina/Marcin Hackathon (72h sprint) — submit working prototype |
| Mar 13 | GCP credits request deadline (12:00 PM PT) |
| Mar 14 | Devpost submission (self-imposed deadline — 2 day buffer) |
| Mar 16 5:00 PM PT | Gemini hackathon deadline |
| Apr 22–24 | Winners announced at Google Cloud Next |

### Phase 1: Foundation (Feb 20–24) — 5 days

**Goal:** Immergo running locally, Live API talking with audio + camera, avatar rendering, two system instructions tested.

| Task | Est. | Priority |
|------|------|----------|
| Fork Immergo repo, read GEMINI.md, get it running locally | 3–4h | Critical |
| Get Gemini API key, verify Live API access with `gemini-2.5-flash` + native audio | 1h | Critical |
| Test `sendClientContent()` for mid-session system instruction updates | 2h | Critical |
| Enable camera streaming to Gemini (1 FPS JPEG via WebSocket) — confirm vision works | 1–2h | Critical |
| Enable `affective_dialog` and confirm it works | 1h | High |
| Import TalkingHead + HeadAudio from CDN, render a test avatar with PCM lip-sync | 2–3h | High |
| Write Profile A system instruction (analytical) — test against canonical error | 2h | Critical |
| Write Profile B system instruction (explorer) — test against same error | 2h | Critical |
| Request $100 Google Cloud credits: https://forms.gle/rKNPXA1o6XADvQGb7 | 5min | Critical |
| Join a Google Developer Group, get public profile link | 15min | Medium |
| Create two Ready Player Me avatars (Profile A: professional/analytical, Profile B: warm/energetic) | 30min | Medium |

**Canonical test error (Japanese L1):** "I go to the restaurant yesterday"

**Expected Profile A response (JA):** Guides learner to identify tense mismatch with L1 bridge — "What time marker do you see? 昨日...行った — 'yesterday' works the same way in English."

**Expected Profile B response (JA):** Models correct form casually — "Oh nice, you went to a restaurant yesterday! What did you eat? ナイス！"

**Canonical test error (Korean L1):** "Teacher, I am very sorry but could you please kindly tell me where is the station?"

**Expected Profile A response (KO):** Addresses over-formalization and word order — "Great politeness! But casual English is simpler. Also, embedded questions keep normal word order: 'where the station is.'"

**Expected Profile B response (KO):** Keeps it light — "Haha, you're so polite! Just say 'Hey, where's the station?' 편하게!"

### Phase 2: Core Innovation (Feb 25–Mar 5) — 9 days

**Workstream A — Onboarding UI (2 days)**

Build the L1 selection + 5-question intake flow. Clean, simple UI displayed in learner's chosen language. Each question is a card with 2–3 options. After question 5, show the generated coaching profile (visually, not as raw JSON — something like "Your coach will focus on: structured explanations, pattern recognition, and measurable progress"). Load the corresponding coach avatar.

Output: `coaching_profile` object that feeds the system instruction engine + avatar selection.

**Workstream B — Adaptive System Instruction Engine (3–4 days)**

This is the core IP. Build the logic that:
1. Takes a `coaching_profile` object (including L1 and vision capability flag)
2. Weights the 12 principles according to profile dimensions
3. Generates a complete Gemini system instruction with L1 patterns + vision-aware coaching rules
4. Delivers it via `sendClientContent()` at session start and mid-session when adaptation is needed

The engine must produce *meaningfully different* coaching for Profile A vs Profile B on the same error. This is what judges will evaluate and what the split-screen demo makes visible.

**Workstream C — Split-Screen Demo View (2–3 days)**

Two parallel Live API sessions running simultaneously in the browser. Same audio input scenario, different coaching profiles, visibly different responses — now with distinct 3D coach avatars. This means:
- Two concurrent WebSocket connections to the backend
- Two Gemini Live API sessions
- Two TalkingHead avatar instances (Profile A coach + Profile B coach)
- Side-by-side UI with avatar, profile labels, and real-time audio/visual display
- Synchronized scenario input (learner says the same thing to both coaches)
- Each avatar lip-syncs independently via HeadAudio from its own PCM stream

This is the "wow moment" for judges. Two distinct 3D coaches responding differently to the same error, with different facial expressions, different gestures, different voices.

**Workstream D — Vision Input (1 day)**

Enable camera streaming to Gemini Live API alongside audio. The WebSocket demo already has this pattern — enable `getUserMedia()` for camera, capture frames at 1 FPS as JPEG, send alongside audio stream. Update system instruction to include vision-aware coaching rules.

Test scenario: hold up a notebook with "I go to the restaurant yesterday" handwritten → LoLA reads it, identifies the error, coaches adaptively.

**Workstream E — Avatar Integration (2–3 days)**

Integrate TalkingHead + HeadAudio into the Immergo frontend:
1. Import TalkingHead from CDN, initialize ThreeJS canvas
2. Load Ready Player Me GLB avatar (Profile A or B based on onboarding)
3. Route Gemini's PCM audio output through HeadAudio worklet → viseme detection → avatar lip-sync
4. Map affective dialog signals to TalkingHead mood states:
   - Neutral → calm idle animations
   - Learner frustrated → avatar shows concern (slight frown, slower gestures)
   - Learner succeeds → avatar shows encouragement (smile, nod)
5. For split-screen: two TalkingHead instances side by side, each with distinct avatar and independent lip-sync

**Workstream parallelization:** B (engine) and D+E (vision+avatar) are independent and can run concurrently. A (onboarding) feeds into B and E but can start immediately.

### Phase 3a: Sabrina Hackathon Sprint (Mar 6–8) — 3 days

**Goal:** Submit a working LoLA prototype to skool.com/hackathon.

By March 6, we should have: onboarding, adaptive engine, single-session voice chat with 3D avatar lip-sync, and camera input working. The split-screen with dual avatars may or may not be complete — that's OK for the Sabrina hackathon since it's a "real product" competition, not specifically about the demo view.

**Minimum for Sabrina submission:** Single avatar coaching session with vision + voice + personality adaptation.

**Submission:** Working demo URL + short walkthrough video.

### Phase 3b: Gemini Polish & Submission (Mar 9–14) — 6 days

| Day | Task |
|-----|------|
| Mar 9–10 | Complete split-screen demo if not done. Integrate affective dialog. End-to-end testing with 2–3 Japanese-English error scenarios. |
| Mar 11 | Create **architecture diagram** (clean visual of system — see §5). Create **README with spin-up instructions**. Formalize Cloud Run deploy script as automated IaC (+0.2 bonus). |
| Mar 12 | Record **demo video** (~3:30, max 4:00). Record **Cloud deployment proof** (separate short screencast of GCP console showing Cloud Run). |
| Mar 13 | Write and publish **blog post** on Medium/dev.to about building adaptive coaching with Gemini Live API (+0.6 bonus). Include #GeminiLiveAgentChallenge. Include statement: "I created this piece of content for the purposes of entering the Gemini Live Agent Challenge hackathon." |
| Mar 14 | **Devpost submission** — all deliverables uploaded, category = Live Agents. |
| Mar 15–16 | Buffer. |

---

## §7 — Gemini Submission Checklist

All items required unless marked (optional):

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Select ONE category: **Live Agents** | ☐ |
| 2 | Text description: features, functionality, tech used, data sources, findings/learnings | ☐ |
| 3 | URL to public code repository (GitHub) | ☐ |
| 4 | Spin-up instructions in README.md | ☐ |
| 5 | Proof of Google Cloud Deployment (separate recording — NOT part of demo video) | ☐ |
| 6 | Architecture diagram (uploaded as image to Devpost) | ☐ |
| 7 | Demo video (<4 minutes, uploaded to YouTube/Vimeo, English or English subtitles) | ☐ |
| 8 | (Optional) Blog/content piece about the build (+0.6 bonus) | ☐ |
| 9 | (Optional) Automated cloud deployment scripts in repo (+0.2 bonus) | ☐ |
| 10 | (Optional) GDG membership with public profile link (+0.2 bonus) | ☐ |

---

## §8 — Demo Video Script (~3:45)

### [0:00–0:25] The Problem

"Japan and Korea spend billions on English learning — and rank near the bottom globally in proficiency. The market is full of AI tutors. But every one of them gives the same correction to every learner, in English only, regardless of how that person's brain processes language. A Japanese analytical thinker and a Korean social learner get identical coaching. That's not coaching. That's a chatbot."

### [0:25–0:50] The Onboarding

Show language selection: 🇯🇵 日本語 / 🇰🇷 한국어. Pick Japanese.
Show 5-question intake UI displayed in Japanese. Walk through quickly. Two profiles created — two distinct 3D coach avatars appear:
- Left: **Profile A coach** (professional, glasses, calm posture) — "Analytical, structure-first, reflective pace"
- Right: **Profile B coach** (warm, casual, smiling) — "Social, action-oriented, flow pace"

"Five questions. Thirty seconds. In your own language. Two completely different coaches — different personality, different voice, different face."

### [0:50–2:00] Split-Screen Coaching (70 seconds)

Same scenario: Japanese learner says "I go to the restaurant yesterday."

**Left (Profile A avatar — The Analyst):**
Avatar nods thoughtfully, pauses: "Good sentence structure. I notice a time marker — 'yesterday.' What tense do you think that requires? 昨日...行った — same idea in English." Avatar waits patiently while learner thinks. Shows progress: "That's three correct past tense uses now." Avatar nods approvingly.

**Right (Profile B avatar — The Explorer):**
Avatar smiles, leans forward: "Oh, you went to a restaurant yesterday! What did you eat? ナイス！" Avatar gestures enthusiastically. Recasts the error within a new question. Keeps momentum.

Quick second error: Korean learner says "Teacher, I am very sorry but could you please kindly tell me where is the station?" — demonstrates L1-specific coaching (honorific transfer). Profile B avatar laughs warmly: "편하게! Just say 'Hey, where's the station?'"

### [2:00–2:30] Vision: "Show Me Your Notebook"

**The killer moment.** Learner holds up a notebook with handwritten English sentences. LoLA's avatar looks at it (camera feed → Gemini at 1 FPS), reads the handwriting, identifies errors:

"I can see your notebook! Let me take a look... Your second sentence — 'She have many friend' — let's work on two things there."

The coach then adapts its correction style to the learner's profile, just as it would for spoken errors. The avatar points, nods, responds to what it *sees*.

"A tutor that can See, Hear, and Speak — adapting not just to what you say, but to who you are."

### [2:30–2:55] Affective Dialog + Barge-in

Demonstrate the Live Agent criteria:
- Learner interrupts mid-correction → coach avatar pauses naturally, listens (barge-in)
- Learner sounds frustrated → avatar's face shifts to concern, coach adjusts tone (affective dialog)

"The Live API's affective dialog detects frustration in the learner's voice. The coach's expression changes. Its tone softens. It shifts from analytical to supportive — mid-session, mid-sentence — using sendClientContent() to update system instructions in real time. A coach that doesn't just hear your words, but feels your struggle."

### [2:55–3:25] Architecture + Multi-Domain Vision

Flash the architecture diagram. Quick tech callout:
"Built on Gemini 2.5 Flash with the Google GenAI SDK. Deployed on Cloud Run. Two L1s, two coach avatars, real-time lip-sync via HeadAudio, vision input at 1 FPS — all through a single Live API WebSocket connection. The adaptive engine uses sendClientContent() for mid-session personality switching — a capability unique to Gemini."

**Multi-domain closer (10 seconds):**
Quick montage concept — flash 3 images while narrating:
"Today LoLA sees your English notebook. Tomorrow it watches a trainee set a restaurant table. Coaches a surgical technique. Reviews a golf swing. Any skill where a coach who can see, hear, and adapt to your personality makes you better. The 12-principle framework is domain-agnostic. Language learning is just the first vertical."

### [3:25–3:35] Close

"No two brains learn the same way. No two languages interfere the same way. LoLA finally coaches both — and it can see what you're working on."

---

## §9 — The 12 Principles Quick Reference

> Full academic grounding in LOLA_12_PRINCIPLE_ACADEMIC_FOUNDATIONS.md

| # | Principle | Source | Key Technique |
|---|-----------|--------|---------------|
| 1 | Growth Mindset Activation | Dweck (2006) | Frame errors as learning signals, not failures |
| 2 | Rapport & Anchoring | Paling (2017) | Establish trust before correction |
| 3 | Emotional State Management | Immordino-Yang (2016) | Emotions drive learning — manage, don't suppress |
| 4 | Cognitive Load Management | Sweller (2011) | One concept at a time, reduce extraneous load |
| 5 | Spacing & Interleaving | Roediger & Butler (2011) | Return to errors across sessions |
| 6 | Retrieval Practice | Roediger & Butler (2011) | Ask learner to produce, not just recognize |
| 7 | Sensory Engagement | Paling (2017) | Engage multiple senses for deeper encoding |
| 8 | Positive Framing | Fredrickson (2001) | Lead with what's right, then build |
| 9 | Autonomy & Choice | Deci & Ryan (1985) | Let learners choose topics and pace |
| 10 | Progressive Challenge | Vygotsky (1978) | Stay in the zone of proximal development |
| 11 | VAK Adaptation | Fleming (2001) | Match visual/auditory/kinesthetic preference |
| 12 | Meta-Model Questioning | Bandler & Grinder (1975) | Challenge limiting beliefs about ability |

---

## §10 — Error Scenarios for Testing

### Primary (Demo — Japanese L1)

**Error:** "I go to the restaurant yesterday"
**Issue:** Present tense + past time marker (common Japanese L1 interference — Japanese marks tense with 〜した, not verb conjugation)
**Profile A coaching:** Guide to rule discovery via meta-model questioning. L1 bridge: "What would you use in Japanese? 昨日...行った, right? 'Yesterday' works the same way — it signals past tense."
**Profile B coaching:** Natural recast within conversational flow — "Oh, you went to a restaurant yesterday! What did you eat?"

### Primary (Demo — Korean L1)

**Error:** "I go to restaurant yesterday"
**Issue:** Present tense + past time marker + missing article (Korean L1 interference — Korean uses 했다 for past, has no articles)
**Profile A coaching:** Guide to both issues systematically. L1 bridge: "In Korean you'd say 어제 갔다 — 갔다 is past tense. In English, 'yesterday' tells us to use 'went.' And in English we need 'the' before 'restaurant' — Korean doesn't have articles, so this is a new concept."
**Profile B coaching:** Natural recast — "Oh, you went to the restaurant yesterday! 좋아! What did you order?"

### Secondary (Testing / Backup Demo)

**Error:** "She have many friend"
**Issues:** Subject-verb agreement + pluralization (shared across Japanese and Korean — neither conjugates verbs for person, neither requires obligatory plurals)
**Profile A (JA):** "Let's look at two things here. First, when the subject is 'she', what form does 'have' take? In Japanese you'd use 持っている for everyone, but English changes the verb."
**Profile A (KO):** "Let's look at two things. In Korean, 가지다 stays the same for everyone, but English changes — 'she has', not 'she have.' And 친구 can be one or many in Korean, but English needs 'friends' with an s."
**Profile B:** "She has a lot of friends, right? Tell me about them! What do they do together?"

### Tertiary (Testing)

**Error:** "I am agree with you"
**Issue:** Unnecessary auxiliary (Japanese influence: 賛成です → "am agree" / Korean influence: 동의합니다 → formal copula transfer)
**Profile A:** "Interesting construction. In English, 'agree' is already a verb — it doesn't need 'am.' This is because 賛成です / 동의합니다 uses a copula, but English 'agree' stands alone."
**Profile B:** "Oh you agree? Me too! What specifically do you agree with?"

### Korean-Specific Scenario (Testing)

**Error:** "Teacher, I am very sorry but could you please kindly tell me where is the station?"
**Issue:** Over-formalization from Korean honorific system (존댓말 transfer) + embedded question word order
**Profile A:** "Great politeness! But English casual speech is much simpler. Also, in embedded questions, the word order stays normal: 'where the station is', not 'where is the station.' In Korean, 역이 어디인지 keeps the same order — English does too in embedded form."
**Profile B:** "Haha, you're so polite! In casual English you can just say 'Hey, where's the station?' Much easier, right? 편하게!

### Vision Scenario (Demo — "Show Me Your Notebook")

**Setup:** Learner holds up a notebook with handwritten English sentences to the camera. Gemini reads the handwriting at 1 FPS.

**Notebook contains:**
1. "I go to the restaurant yesterday" ← tense error
2. "She have many friend" ← agreement + plural
3. "I am agree with you" ← unnecessary auxiliary

**Profile A response (Japanese L1):**
"I can see your notebook! Let me take a look... [reads] Great, you've written three sentences. Let's start with the second one — 'She have many friend.' There are two things to look at here. First, when the subject is 'she', English changes the verb — it becomes 'has', not 'have.' In Japanese, 持っている stays the same for everyone, but English is different. Second, 'friend' needs to be plural — 'friends' with an s. Japanese doesn't mark this, so it's a new pattern to practice."

**Profile B response (Japanese L1):**
"Oh, I can see your writing! ナイス！Let me check it out... Your sentences are really good — you're getting the meaning across perfectly. In the second one, we'd say 'She has many friends' — but honestly, people would totally understand you! Let's try using that in conversation — tell me about one of your friends. What do they like to do?"

**Vision + Real-World Object Scenario (Testing — Restaurant Menu)**

**Setup:** Learner holds up a Japanese restaurant menu with some English descriptions.

**Coach response:** "I can see the menu! There are some English descriptions here. Let's practice ordering — which dish looks good to you? Try telling me what you want to order in English. I'll help if you get stuck."

This scenario demonstrates that vision input creates natural, contextual coaching moments — the coach doesn't just read text, it creates a learning scenario from what it sees.

---

## §11 — Gemini Live API Technical Notes

### Key Capabilities We Use

| Feature | What It Does | Why We Need It |
|---------|-------------|----------------|
| Native audio mode | Speech-to-speech, no intermediate text | 320–800ms latency, natural conversation |
| Video input (1 FPS) | Camera frames streamed to Gemini alongside audio | "Show me your notebook" — vision-aware coaching |
| `sendClientContent()` | Update system instructions mid-session | Personality switching without session restart |
| `affective_dialog` | Detect emotion in voice | Adjust coaching tone + avatar mood when learner is frustrated |
| VAD (Voice Activity Detection) | Detect when user starts/stops speaking | Natural barge-in handling |
| 30 HD voices | Prebuilt voice options | Distinct voices for Profile A vs B coach avatars |

### Limitations to Manage

| Limitation | Impact | Mitigation |
|-----------|--------|------------|
| ~10 min session cap | Demo is <4 min, so fine | Use session resumption if needed for testing |
| 30 voice limit | Can't create custom educator voices | Pick two distinct prebuilt voices for coach avatars |
| No cross-session memory | Each session starts fresh | Profile is injected at session start via system instruction |
| `affective_dialog` in preview (v1alpha) | May produce unexpected results | Test extensively, have fallback behavior |
| Video input at 1 FPS | Not real-time video — snapshots | Perfect for notebooks, documents, menus. Not for fast motion. |
| Two concurrent sessions (split-screen) | Double API cost + browser resources | Acceptable for demo; production would be sequential |
| TalkingHead avatar loading | GLB model + ThreeJS can be 2-5s initial load | Preload during onboarding questions; show loading spinner |

### API Configuration

```python
from google import genai

client = genai.Client()

config = {
    "model": "gemini-2.5-flash",
    "generation_config": {
        "response_modalities": ["AUDIO"],
        "speech_config": {
            "voice_config": {
                "prebuilt_voice_config": {
                    "voice_name": "Aoede"  # Profile A voice (calm, measured)
                    # Profile B uses "Kore" or similar (warm, energetic)
                }
            }
        }
    },
    "system_instruction": generated_system_instruction,
    "tools": [],  # Add function calling if needed
}

# Enable affective dialog
config["generation_config"]["enable_affective_dialog"] = True

# Mid-session update (personality adjustment or vision context)
session.send_client_content(
    turns=[{
        "role": "user",
        "parts": [{"text": updated_system_instruction}]
    }],
    turn_complete=True
)
```

### Vision Input (Camera → Gemini)

```javascript
// Frontend: capture camera frame and send via WebSocket
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const video = document.querySelector('#camera-feed');

// Capture at 1 FPS
setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const jpegData = canvas.toDataURL('image/jpeg', 0.8);
    // Send base64 JPEG frame alongside audio via WebSocket
    ws.send(JSON.stringify({
        type: 'video_frame',
        data: jpegData.split(',')[1]  // base64 without prefix
    }));
}, 1000);  // 1 FPS
```

```python
# Backend: forward camera frame to Gemini Live API session
# Gemini receives video frames as inline_data parts
session.send_realtime_input(
    video=types.Blob(
        data=base64.b64decode(frame_data),
        mime_type="image/jpeg"
    )
)
```

### Avatar Integration (HeadAudio → TalkingHead)

```javascript
// Frontend: TalkingHead + HeadAudio setup
import { TalkingHead } from "talkinghead";

// Initialize avatar
const head = new TalkingHead(avatarContainer, {
    ttsEndpoint: null,  // We provide audio directly from Gemini
    cameraView: 'upper',
    avatarMood: 'neutral'
});

// Load coach avatar (Profile A or B)
await head.showAvatar({
    url: profileA ? 'avatars/coach-analyst.glb' : 'avatars/coach-explorer.glb',
    body: 'F',  // Full body
    lipsyncLang: 'en'
});

// Route Gemini PCM audio through HeadAudio for lip-sync
// HeadAudio detects visemes from raw audio — no transcription needed
head.speakAudio(geminiPcmAudioData, {
    lipsync: 'headaudio',  // Use audio-driven viseme detection
    mood: currentMood       // 'neutral', 'happy', 'concerned'
});

// Map affective dialog signals to avatar mood
function onAffectiveSignal(signal) {
    if (signal === 'frustration_detected') {
        head.setMood('concerned');
    } else if (signal === 'success') {
        head.setMood('happy');
    } else {
        head.setMood('neutral');
    }
}
```

---

## §12 — Repository Structure

```
lola-hackathon/
├── README.md                    # Spin-up instructions (required)
├── ARCHITECTURE.md              # System design (for judges)
├── deploy/
│   ├── Dockerfile              # Container definition
│   ├── deploy.sh               # Cloud Run deploy script
│   └── cloudbuild.yaml         # (optional) Cloud Build IaC
├── backend/
│   ├── main.py                 # FastAPI app entry
│   ├── session_manager.py      # Gemini Live API session handling (audio + video)
│   ├── profile_engine.py       # 5-question → coaching profile (with L1)
│   ├── instruction_engine.py   # Profile + L1 → system instruction generator
│   ├── vision_handler.py       # Camera frame routing to Gemini + vision context
│   ├── affective_handler.py    # Emotion detection → mood state → avatar mood mapping
│   ├── principles.py           # 12 principles as structured data
│   ├── l1_patterns/
│   │   ├── __init__.py
│   │   ├── japanese.py         # JA interference patterns + L1 bridges
│   │   └── korean.py           # KO interference patterns + L1 bridges
│   └── requirements.txt
├── frontend/
│   ├── index.html              # Main page
│   ├── src/
│   │   ├── onboarding.js       # Language select + 5-question intake UI
│   │   ├── voice-chat.js       # Single-session voice + vision interface
│   │   ├── split-screen.js     # Dual-session demo view (two avatars)
│   │   ├── audio-worklet.js    # PCM audio processing
│   │   ├── camera.js           # Camera capture + 1 FPS JPEG extraction
│   │   ├── avatar.js           # TalkingHead + HeadAudio integration
│   │   │                       #   - Avatar initialization + loading
│   │   │                       #   - PCM → HeadAudio → viseme → lip-sync
│   │   │                       #   - Mood state management
│   │   │                       #   - Split-screen dual avatar orchestration
│   │   ├── i18n/
│   │   │   ├── ja.json         # Japanese UI strings (onboarding, labels)
│   │   │   └── ko.json         # Korean UI strings (onboarding, labels)
│   │   └── styles.css
│   ├── avatars/
│   │   ├── coach-analyst.glb   # Ready Player Me avatar (Profile A — professional)
│   │   └── coach-explorer.glb  # Ready Player Me avatar (Profile B — warm/casual)
│   └── vite.config.js
├── docs/
│   ├── architecture-diagram.png # For Devpost upload
│   └── gcp-deployment-proof.md  # Link to recording
└── blog/
    └── building-adaptive-coaching-with-gemini.md  # For +0.6 bonus
```

---

## §13 — Success Criteria

### Minimum Viable Demo (Mar 6 — Sabrina Hackathon)

- [ ] Language selection (Japanese / Korean) sets onboarding UI language
- [ ] 5-question onboarding in selected L1 generates coaching profile
- [ ] Single voice chat session with Gemini Live API works
- [ ] System instruction adapts based on profile AND L1
- [ ] Coach understands L1 input (code-switching)
- [ ] Camera streaming to Gemini works (vision input at 1 FPS)
- [ ] Learner can show notebook/document → coach reads and coaches from it
- [ ] Single 3D coach avatar renders with real-time lip-sync (HeadAudio → TalkingHead)
- [ ] Barge-in (interruption) works naturally
- [ ] At least one error scenario per L1 produces different coaching for different profiles

### Full Demo (Mar 14 — Gemini Submission)

- [ ] Split-screen view: two parallel sessions, two distinct 3D coach avatars, same error, different coaching
- [ ] Both avatars lip-sync independently via HeadAudio from their own PCM streams
- [ ] Avatar mood states respond to affective dialog signals (frustration → concern, success → encouragement)
- [ ] Both Japanese and Korean L1s demonstrated in demo
- [ ] L1 bridging visible in coaching (Japanese/Korean explanations used naturally)
- [ ] Vision demo: learner holds up notebook → coach reads handwritten errors and coaches adaptively
- [ ] Affective dialog: detects frustration, adjusts tone AND avatar expression
- [ ] Mid-session instruction update via sendClientContent() visible in demo
- [ ] 2–3 error scenarios per L1 tested and working
- [ ] Architecture diagram created (showing vision + avatar + L1 config layers)
- [ ] Demo video recorded (<4 min) — includes split-screen avatars, vision notebook, multi-domain closer
- [ ] Cloud deployment proof recorded (separate)
- [ ] README with spin-up instructions
- [ ] Blog post published
- [ ] GDG membership linked
- [ ] Deployed on Cloud Run
- [ ] Public GitHub repo

### Fallback Tiers (if timeline pressure)

| Tier | What Ships | What Drops |
|------|-----------|------------|
| **Full build** | Dual 3D avatars + vision + bilingual + affective dialog + split-screen | Nothing |
| **Tier 1 cut** | Single 3D avatar + vision + bilingual + split-screen (audio-only for 2nd session) | Dual avatar in split-screen |
| **Tier 2 cut** | Single 3D avatar + vision + bilingual (no split-screen) | Split-screen demo |
| **Tier 3 cut** | Voice-only (no avatar) + vision + bilingual + split-screen | Avatar layer entirely |
| **Emergency** | Voice-only + bilingual + single session | Vision, avatar, split-screen |

Priority order for cuts: avatar polish → dual avatar → split-screen → vision. The adaptive engine + bilingual coaching + L1 bridging are the non-negotiable core.

---

## §14 — Competitive Advantages

Why LoLA should win:

1. **23 years of domain expertise.** Not a weekend project — built on 2,000+ certified neurolanguage coaches across 70+ countries, ICF-accredited methodology, and real classroom experience since 2002.

2. **Academically grounded framework.** 12 principles with peer-reviewed sources (Dweck, Sweller, Immordino-Yang, Paling, Roediger). Judges can verify every claim.

3. **Technical moat.** `sendClientContent()` for mid-session personality switching is a capability no other voice AI platform offers. We demonstrate deep, meaningful Gemini integration — not a chat wrapper.

4. **Multilingual from day one.** Two L1s (Japanese + Korean) with L1-specific interference patterns, bilingual coaching, and L1 bridging. The onboarding is in the learner's language. The coach understands code-switching. Adding a new L1 is config, not code. Most hackathon language entries are English-only.

5. **Vision-enabled coaching.** "Show me your notebook" — the learner holds up handwritten work and LoLA reads it, identifies errors, and coaches adaptively. This is the exact use case the Live Agent category description calls out: "a vision-enabled customized tutor that 'sees' your homework." Directly addresses the judging criterion: "Does the agent See, Hear, and Speak in a way that feels seamless?"

6. **3D avatar coaches with personality.** Two distinct Ready Player Me avatars with real-time lip-sync via HeadAudio. Mood states map to facial expressions — frustration detected → avatar shows concern. Judges remember faces. This is what separates a "voice app" from a "live agent."

7. **Multi-domain vision potential.** The demo closer shows: "Today LoLA sees your English notebook. Tomorrow it watches your table setting. Coaches a surgical technique. Reviews a golf swing." The 12-principle framework + vision input + adaptive personality engine = any procedural skill domain. Judges score this under "Potential Impact" (within the 40% Innovation weight).

8. **Self-marketing flywheel (beyond the hackathon).** In the full product vision, LoLA avatars are their own marketing — they publish educational content across YouTube, TikTok, Instagram, LINE as AI influencers. Learners connect with a character through social media, click the link in bio, and chat with the same avatar on a freemium plan (20-40 min free per avatar). The avatar is both the marketing and the product. This is NOT built for the hackathon, but it belongs in the submission text description because it answers the "Potential Impact" question and differentiates from every competitor who needs VC to acquire users.

9. **Building on Google's own reference app.** Immergo is listed as an official resource on the hackathon Resources page. We're not using some obscure library — we're extending Google's recommended starting point with original coaching IP. Judges can trace every line of original code vs. base.

10. **Pre-designed demo.** Most hackathon teams scramble to build a demo in the final hours. We have a scripted 3:45 video with a clear narrative arc, visual "aha moments" (split-screen with two distinct avatars + vision notebook reading + multi-domain closer), and every second planned.

11. **Precedent.** Prospera (AI sales coaching) won "Most Useful App" + "Best Use of Flutter" at Google's 2024 Gemini API Developer Competition. A TalkingHead-based project ("Recycling Advisor 3D") was also entered. Coaching apps with avatars win these competitions.

### Submission Text Description Guidance

The Devpost text description should cover: features/functionality, technologies used, data sources, and findings/learnings. Key points to include:

**Features/Functionality:**
- 5-question personality onboarding in learner's L1 (Japanese/Korean)
- Adaptive coaching engine: 12 peer-reviewed principles × personality profile × L1 interference patterns → unique system instruction per learner
- Mid-session personality switching via sendClientContent() — unique to Gemini
- Vision input: camera reads handwritten work, documents, menus → coaches from what it sees
- 3D avatar coaches with real-time lip-sync (HeadAudio/TalkingHead) and mood-responsive expressions
- Split-screen demo: two learner profiles, same error, visibly different coaching from two distinct avatars
- Bilingual coaching: coach understands Japanese/Korean input, bridges to English using L1 explanations

**Technologies:**
- Gemini 2.5 Flash (Native Audio + Video) via Live API
- Google GenAI SDK (google-genai Python)
- Cloud Run deployment
- Immergo fork (Google's official Live API language learning demo)
- TalkingHead v1.7 + HeadAudio (MIT license, met4citizen)
- Ready Player Me (avatar models)

**Beyond the hackathon (potential impact — key for Innovation 40% weight):**
- Self-marketing pipeline: LoLA avatars generate their own social media audiences → learners enter through link-in-bio on freemium plan → avatar is both marketing and product
- Educator Creator Platform: any educator can build, own, and monetize their own AI coaching avatar with the 12-principle framework auto-applied
- Domain-agnostic: language is first vertical, but vision + adaptive coaching + personality engine works for any procedural skill (restaurant training, medical, sports)
- Co-active learning triangle: educator ↔ AI ↔ learner — three sides continuously improve the learning

---

## §15 — Rules Compliance Checklist

### Gemini Live Agent Challenge — Full Timeline

| Date | Milestone |
|------|-----------|
| Feb 16 (9:00 AM PT) | Contest opens — submission period begins |
| **Mar 13 (12:00 PM PT)** | **Deadline to request $100 Google Cloud credits** |
| **Mar 16 (5:00 PM PT)** | **Submission deadline** (= Mar 17, 10:30 AM ACDT) |
| Mar 17 – Apr 3 | Judging period (Stage 1 pass/fail → Stage 2 scoring → Stage 3 bonuses) |
| ~Apr 8 | Potential winners notified by email (2-day response window — miss it and you're disqualified) |
| Apr 22–24 | Public winner announcement at Google Cloud Next 2026 (Las Vegas) |

### Judging Stages (from Official Rules)

**Stage 1 — Pass/Fail:** Does the submission include all required materials? Does it reasonably address the Live Agent challenge? Basic viability check.

**Stage 2 — Scoring (1–5 per criterion, averaged):**

| Criterion | Weight | What Judges Score |
|-----------|--------|-------------------|
| **Innovation & Multimodal UX** | **40%** | "Beyond text box"? See/Hear/Speak seamlessly? Distinct persona? Live and context-aware? For Live Agents specifically: barge-in? distinct voice? |
| **Technical Implementation** | **30%** | GenAI SDK/ADK usage? Robust Cloud hosting? Sound agent logic? Error handling? No hallucinations? Grounding? |
| **Demo & Presentation** | **30%** | Clear problem/solution? Clear architecture diagram? Visual proof of Cloud deployment? Actual working software? |

**Stage 3 — Bonus Points (added to Stage 2 score):**

| Bonus | Max Points | Our Plan |
|-------|-----------|----------|
| Blog/content piece | +0.6 | Publish on Medium/dev.to with #GeminiLiveAgentChallenge — include "created for this hackathon" language |
| Automated cloud deployment | +0.2 | IaC scripts in public repo |
| GDG membership | +0.2 | Sign up + link public profile |

**Maximum possible score: 6.0** (5.0 from judging + 1.0 from bonuses)

### Prize Rules — Critical Details

| Rule | Detail | Impact |
|------|--------|--------|
| **One prize max per submission** | If a project qualifies for both a category prize AND a subcategory prize, the subcategory goes to the next highest-scoring project | We should aim for Best Live Agent ($10K) or Grand Prize ($25K) — subcategory prizes ($5K each) are backup |
| **Subcategory prizes use individual criterion scores** | Best Multimodal UX = highest Innovation criterion score. Best Technical Execution = highest Technical criterion score. Best Innovation & Thought Leadership = highest Innovation criterion score. | Our 40% Innovation score drives TWO potential prizes |
| **Multiple submissions allowed** | Must be "unique and substantially different" | Could enter a Creative Storyteller version if time permits (unlikely — scope discipline) |
| **New projects only** | "Newly created by the entrant during the Contest Period" — not a modification of existing work | Immergo fork is fine — we're creating original work on top of open-source base, disclosed in submission |
| **1,442+ participants** | As of Feb 20, 2026 | High competition — quality of demo/polish matters |

### Full Prize Structure (for reference)

| Prize | Amount | Additional | Who Wins |
|-------|--------|------------|----------|
| **Grand Prize** | $25,000 | $3K credits + 2× Cloud Next tickets + 2× travel ($3K each) + demo opportunity | Highest score across ALL categories |
| **Best Live Agent** | $10,000 | $1K credits + 2× Cloud Next tickets | Highest score in Live Agents category |
| Best Creative Storyteller | $10,000 | $1K credits + 2× Cloud Next tickets | (not our category) |
| Best UI Navigator | $10,000 | $1K credits + 2× Cloud Next tickets | (not our category) |
| Best Multimodal UX | $5,000 | $500 credits | Highest Innovation criterion score |
| Best Technical Execution | $5,000 | $500 credits | Highest Technical criterion score |
| Best Innovation & Thought Leadership | $5,000 | $500 credits | Highest Innovation criterion score |
| Honorable Mention (×5) | $2,000 each | $500 credits each | Runners up from all eligible submissions |

**Best case:** Grand Prize ($25K) — highest total score across all three categories.
**Strong case:** Best Live Agent ($10K) — highest score within our category.
**Backup case:** Best Multimodal UX ($5K) or Best Innovation ($5K) — our 40% Innovation score.
**Floor case:** Honorable Mention ($2K) — top ~10 but not top 3 in any criterion.

### Compliance Checklist

- [ ] Project newly created during contest period (Feb 16 – Mar 16)
- [ ] Uses a Gemini model (gemini-2.5-flash)
- [ ] Built with Google GenAI SDK or ADK (google-genai Python SDK)
- [ ] Uses at least one Google Cloud service (Cloud Run)
- [ ] Backend hosted on Google Cloud (Cloud Run container)
- [ ] All materials in English (or with English subtitles)
- [ ] Demo video <4 minutes (planned: ~3:45)
- [ ] Video uploaded to YouTube or Vimeo (public)
- [ ] Code repo is public (GitHub)
- [ ] Third-party integrations disclosed (Immergo fork + TalkingHead + Ready Player Me)
- [ ] Spin-up instructions in README.md
- [ ] Proof of Google Cloud deployment (separate recording, NOT in demo video)
- [ ] Architecture diagram uploaded as image to Devpost
- [ ] Complies with Google Cloud Acceptable Use Policy
- [ ] No content from excluded countries (Italy, Quebec, Crimea, Cuba, Iran, Syria, North Korea, Sudan, Belarus, Russia)
- [ ] Ryan is above age of majority in Australia ✓
- [ ] Not employed by government agency ✓
- [ ] Submission text description includes: features, functionality, tech used, data sources, findings/learnings
- [ ] Category selected: Live Agents
- [ ] Blog post includes "created for this hackathon" language + #GeminiLiveAgentChallenge hashtag

### Third-Party Disclosure (required in submission)

> "This project is built on a fork of Google's Immergo language learning demo (open-source, Apache 2.0 license, listed as an official hackathon resource) by Zack Akil. The 3D avatar rendering uses the TalkingHead library (MIT license) by Mika Suominen (met4citizen) with the HeadAudio module for real-time lip-sync. Avatar models are created via Ready Player Me. The adaptive coaching engine, personality profiling system, 12-principle coaching framework, multilingual L1 interference patterns, bilingual coaching logic, vision-aware coaching rules, avatar mood mapping, split-screen demonstration view, and all system instruction generation logic are original work created during the contest period."

---

## §16 — Quick Start for Claude Code

```bash
# 1. Fork Immergo and set up
git clone [immergo-repo-url] lola-hackathon
cd lola-hackathon

# 2. Read the AI coding guide
cat GEMINI.md

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up Gemini API key
export GEMINI_API_KEY=your_key_here

# 5. Run locally
python backend/main.py

# 6. Open frontend
cd frontend && npm run dev
```

### First Claude Code Session Prompt

```
Read these documents in order:
1. LOLA_MASTER_v1_1.md — The product brain (12 principles, personality framework, onboarding spec)
2. LOLA_HACKATHON_SPEC.md — The build guide (architecture, timeline, submission requirements)

Start with Phase 1: Foundation.
- Fork Immergo, get it running locally
- Verify Gemini Live API access with native audio + video input
- Test sendClientContent() for mid-session system instruction updates
- Enable camera streaming (1 FPS JPEG to Gemini) — confirm vision works
- Import TalkingHead + HeadAudio from CDN, render a test avatar with PCM lip-sync
- Write and test Profile A (analytical, Japanese L1) system instruction against "I go to the restaurant yesterday"
- Write and test Profile B (explorer, Japanese L1) against the same error — confirm meaningfully different coaching
```

---

*End of LOLA_HACKATHON_SPEC.md v2.2 — Complete build specification including Korean L1, vision input, 3D avatar (TalkingHead), multi-domain framing, fallback tiers, ORBWEVA ecosystem context (ARC/AER/Grow), self-marketing pipeline, Google Resources page references, full judging timeline, and comprehensive rules compliance.*
