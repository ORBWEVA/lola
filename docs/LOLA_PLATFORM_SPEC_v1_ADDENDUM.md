# LOLA_PLATFORM_SPEC_v1 — Addendum: Economics, Journeys & Dev Practices

**Version:** 1.1 Addendum
**Date:** 2026-03-03
**Status:** Active — extends LOLA_PLATFORM_SPEC_v1.md with unit economics, user journey maps, subtitle strategy, character consistency architecture, and development methodology.

**Merge Target:** These sections should be appended to LOLA_PLATFORM_SPEC_v1.md as §13–§17.

---

## §13 — Unit Economics & Credit System

### 13.1 Cost Model Per Session

LoLA's primary cost driver is the Gemini Live API, which uses accumulated context billing — every turn re-processes all tokens from the entire session history. Sessions get progressively more expensive the longer they run.

**Gemini 2.5 Flash (current production model):**

| Cost Component | Rate |
|----------------|------|
| Audio input | $1.00 / 1M tokens |
| Text input | $0.30 / 1M tokens |
| Text output | $2.50 / 1M tokens |
| Context caching | Up to 90% reduction on cached content |

**Estimated cost per 10-minute coaching session:**

| Component | Tokens | Cost |
|-----------|--------|------|
| System prompt + 12-principle framework + ARC context (cacheable) | ~3,000 | ~$0.01 (with caching) |
| Audio input — user speaks ~5 min | ~150,000 | $0.15 |
| Audio output — avatar speaks ~5 min | ~150,000 | $0.38 |
| Accumulated context window re-processing (~20 turns) | Variable | $0.50–1.50 |
| Tool calls (product catalog, session logging) | ~2,000 | $0.02 |
| **Total (without caching)** | | **$1.05–2.05** |
| **Total (with aggressive caching)** | | **$0.50–1.20** |

**Cost optimization strategies:**

1. **Context caching** — System prompt, 12-principle framework, and creator's ARC knowledge base rarely change. Caching these across sessions yields up to 90% savings on the ~3K token system context that gets re-processed every turn.
2. **Session length limits** — Cap free sessions at 5 minutes, Creator at 15 minutes, Pro at 30 minutes. This directly controls the accumulated context cost curve.
3. **Smart context pruning** — After 15 turns, summarize early conversation turns into a compressed context rather than carrying full verbatim history. Reduces per-turn re-processing cost by ~40%.
4. **Model routing** — Use Gemini 2.5 Flash-Lite ($0.30/1M audio input) for simple Q&A portions, escalate to full Flash only for adaptive coaching moments requiring the 12-principle framework.
5. **Batch API for content generation** — Social captions and analytics run asynchronously at 50% discount.

### 13.2 Image Generation Costs

**Avatar creation (one-time per avatar):**

| Step | Model | Images | Cost/Image | Total |
|------|-------|--------|------------|-------|
| Initial candidates | FLUX Kontext Pro | 4 | $0.04 | $0.16 |
| Scene variations from anchor | FLUX Kontext Pro | 6 | $0.04 | $0.24 |
| **Total avatar setup** | | **10** | | **$0.40** |

**Social content pipeline (ongoing per creator):**

| Frequency | Images/Day | Cost/Image | Daily | Monthly |
|-----------|------------|------------|-------|---------|
| Standard (3 posts/day) | 3 | $0.04 | $0.12 | $3.60 |
| Standard via SiliconFlow | 3 | $0.015 | $0.045 | $1.35 |
| High-volume (6 posts/day) | 6 | $0.04 | $0.24 | $7.20 |

**Alternative providers for cost optimization:**

| Provider | Kontext Pro | Kontext Dev | Kontext Max |
|----------|-------------|-------------|-------------|
| BFL Direct (official) | $0.04 | — | $0.08 |
| Together AI | $0.04 | Free (limited) | — |
| SiliconFlow | $0.04 | $0.015 | — |
| FluxAPI.ai | $0.025 | — | $0.05 |
| fal.ai | $0.04 | — | — |

**Recommendation:** Use SiliconFlow for bulk social content ($0.015/image), Together AI or BFL for avatar creation where quality matters ($0.04/image), and FluxAPI.ai as fallback.

### 13.3 P&L Per Tier

```
FREE TIER (Customer Acquisition):
├── 15 credits = ~15 minutes of conversation
├── Conversation cost: $1.50–2.50
├── 1 avatar creation: $0.40
├── No social pipeline
├── Infrastructure share: $0.10
├── TOTAL COST PER FREE USER: $2.00–3.00
├── Revenue: $0
├── NET: -$2.00 to -$3.00
└── ROLE: Loss leader — conversion target is Creator tier

CREATOR ($29/mo):
├── 120 credits included (~120 min/month)
├── Conversation cost: $6.00–14.40 (with caching + session limits)
├── Social content pipeline (90 images): $1.35–3.60
├── 5 avatars amortized: $0.10/month
├── Infrastructure share: $0.50
├── TOTAL COST: $7.95–18.60/month
├── Revenue: $29/month
├── GROSS MARGIN: $10.40–21.05 (36%–73%)
└── TARGET: 55%+ margin with caching optimization

PRO ($99/mo) — Platform Credits:
├── 500 credits included (~500 min/month)
├── Conversation cost: $25.00–60.00 (with caching + session limits)
├── Social content pipeline (unlimited): $4.05–10.80
├── Unlimited avatars amortized: $2.00/month
├── Clone yourself (ElevenLabs voice): $5.00 one-time
├── Infrastructure share: $2.00
├── TOTAL COST: $33.05–74.80/month
├── Revenue: $99/month
├── GROSS MARGIN: $24.20–65.95 (24%–67%)
└── RISK: Heavy users can push margin below 30%

PRO ($99/mo) — BYOK Mode:
├── Conversation cost: $0 (creator pays own API keys)
├── Social content pipeline: $0 (creator's image gen keys)
├── Platform + infrastructure: $5.00/month
├── Revenue: $99/month
├── GROSS MARGIN: ~$94.00 (95%)
└── IDEAL: Strongly incentivize BYOK adoption on Pro

ENTERPRISE (Custom pricing):
├── BYOK required
├── Custom volume discounts on platform credits
├── White-label fee: $500–2,000/month
├── Revenue: $500+/month
├── GROSS MARGIN: 85%+
└── ROLE: High-margin anchor for overall business health
```

### 13.4 Credit System Architecture

Credits are the abstraction layer between creators and API costs. This decouples pricing from provider changes and enables margin management.

**Credit definitions:**

| Action | Credits Consumed | Approximate API Cost |
|--------|-----------------|---------------------|
| 1 minute voice conversation | 1 credit | $0.05–0.12 |
| Generate 1 social image | 0.5 credits | $0.015–0.04 |
| Generate 1 caption (text only) | 0.1 credits | $0.002 |
| Product catalog lookup (in conversation) | 0 credits | Bundled |
| Session summary / CRM update | 0 credits | Bundled |

**Credit pricing (top-ups when included credits exhausted):**

| Tier | Price Per Credit | Margin vs. Cost |
|------|-----------------|-----------------|
| Free | No top-ups — upgrade required | — |
| Creator | $0.15/credit | ~50–70% margin |
| Pro | $0.10/credit | ~40–60% margin |
| Enterprise | Negotiated volume | 30%+ margin |

**Credit purchase packages:**

| Package | Credits | Price | Per Credit |
|---------|---------|-------|------------|
| Starter Pack | 50 | $7.50 | $0.15 |
| Growth Pack | 200 | $25.00 | $0.125 |
| Scale Pack | 500 | $50.00 | $0.10 |
| Enterprise | 2,000+ | Custom | Negotiated |

**Technical implementation:**

- `creator_credits` Supabase table tracks balance, usage, and top-up history
- n8n webhook deducts credits in real-time during conversations (per-turn billing)
- Dashboard shows credit usage, projected burn rate, and upgrade prompts at 20% remaining
- Stripe handles credit purchases and subscription billing
- When credits hit zero mid-session: graceful session end with upgrade CTA, not hard cutoff

### 13.5 BYOK (Bring Your Own Key) Architecture

BYOK is a feature of Pro and Enterprise tiers, not the default experience.

**How it works:**

1. Creator navigates to Settings → API Keys in the dashboard
2. Enters their Gemini API key (and optionally image gen API key)
3. LoLA validates the key with a test call
4. When BYOK is active, conversations route through the creator's key
5. Creator's included credits apply only to platform features (social pipeline scheduling, CRM, analytics) — not AI compute
6. Dashboard shows API usage against the creator's provider account

**BYOK benefits for creator:** Unlimited conversations without worrying about credit limits. Full control over model selection and costs.

**BYOK benefits for LoLA:** Eliminates the margin risk from heavy users. Pro subscription becomes pure platform revenue at 95% margin.

**BYOK friction mitigation:** Non-technical creators should never see BYOK unless they seek it out. The default experience is credit-based. BYOK is presented as a "power user" option, not a requirement.

**Key storage:** Creator API keys stored encrypted in Supabase with row-level security. Keys are never logged, never included in analytics, and deleted immediately on account closure.

---

## §14 — User Journey Maps

### 14.1 Creator Journey (Onboarding → Revenue)

```
STAGE 1: DISCOVERY
│
├── Touchpoint: Social media ad / hackathon demo / word-of-mouth / search
├── Landing: lola.app → "Create your AI avatar in 5 minutes"
├── Action: Click "Start Free" → email signup
└── System: Account created, onboarding wizard launches

    ┌─────────────────────────────────┐
    │     STAGE 2: AVATAR CREATION    │
    │         (5-10 minutes)          │
    └─────────────────────────────────┘
    │
    ├── Step 1: Choose domain
    │   ├── "What will your avatar do?"
    │   ├── Options: Teach / Coach / Sell / Entertain / All of the above
    │   └── Sets default conversation mode + UI templates
    │
    ├── Step 2: Define avatar identity
    │   ├── Name, bio, personality traits
    │   ├── Upload reference photo OR describe appearance
    │   ├── Select voice (library) or clone your own (Pro)
    │   └── System pre-fills 12-principle coaching config based on domain
    │
    ├── Step 3: Generate avatar
    │   ├── FLUX Kontext Pro generates 4 candidates (~3 sec each)
    │   ├── Creator picks favorite → becomes "anchor image"
    │   ├── System generates 6 scene variations for profile + social
    │   ├── Creator approves set → character identity locked
    │   └── COST: ~$0.40 (platform absorbs on Free)
    │
    ├── Step 4: Configure knowledge base
    │   ├── Option A: Connect to Loka (educators — auto-syncs curriculum)
    │   ├── Option B: Upload documents (PDF, DOCX) → AI extracts ARC entries
    │   ├── Option C: Answer guided Q&A → AI builds knowledge base from answers
    │   └── Creates ARC-format knowledge base powering all avatar responses
    │
    └── Step 5: Test conversation
        ├── Creator talks to their own avatar for 2 minutes
        ├── Avatar demonstrates adaptive coaching using their knowledge base
        ├── Creator sees the 12-principle framework in action
        └── "Your avatar is ready. Share it with the world."

    ┌─────────────────────────────────┐
    │    STAGE 3: PROFILE LAUNCH      │
    │       (2-5 minutes)             │
    └─────────────────────────────────┘
    │
    ├── Profile page auto-generated: lola.app/avatar/[slug]
    ├── Contains: avatar images, bio, conversation CTA, product catalog (if any)
    ├── Creator shares link on social media / adds to link-in-bio
    └── First end users arrive

    ┌─────────────────────────────────┐
    │  STAGE 4: CONTENT AUTOMATION    │
    │     (Creator tier and up)       │
    └─────────────────────────────────┘
    │
    ├── Dashboard: Content Calendar view
    ├── Creator sets preferences:
    │   ├── Posting frequency (1-6x/day)
    │   ├── Content themes (tips, quotes, behind-the-scenes, product promo)
    │   ├── Tone and style guidelines
    │   └── Platform selection (via Blotato or direct API)
    │
    ├── n8n runs daily:
    │   ├── Generates images with character-consistent avatar (FLUX Kontext)
    │   ├── Writes captions using creator's voice/brand from ARC
    │   ├── Optionally generates subtitles (see §15)
    │   ├── Queues to Blotato for multi-platform distribution
    │   └── Creator gets Telegram/email preview → approve/edit/skip
    │
    └── Creator reviews analytics in dashboard

    ┌─────────────────────────────────┐
    │   STAGE 5: REVENUE GENERATION   │
    │      (Ongoing)                  │
    └─────────────────────────────────┘
    │
    ├── Stream 1 — Session Credits: End users consume credits talking to avatar
    ├── Stream 2 — Product Sales: Avatar recommends products → checkout URLs
    ├── Stream 3 — Content Passive: Social content drives profile visits → sessions
    │
    ├── Creator CRM (§6.5) captures every interaction:
    │   ├── Contact auto-created on first session
    │   ├── Pipeline: New → Engaged → Qualified → Converted → Active
    │   ├── n8n nurture workflows run in background
    │   └── Creator sees conversion funnel in dashboard
    │
    └── Revenue share: Creator keeps 70-80% of session revenue + 100% of product sales

    ┌─────────────────────────────────┐
    │    STAGE 6: SCALE & OPTIMIZE    │
    │      (Month 2+)                 │
    └─────────────────────────────────┘
    │
    ├── Upgrade triggers:
    │   ├── Free → Creator: Hits 15-credit limit, wants social automation
    │   ├── Creator → Pro: Needs more avatars, wants BYOK, wants clone yourself
    │   └── Pro → Enterprise: Needs white-label, team access, custom workflows
    │
    ├── Optimization loop:
    │   ├── Dashboard analytics show which content drives most sessions
    │   ├── AI suggests knowledge base improvements from session transcripts
    │   ├── Creator refines avatar personality and conversation style
    │   └── System tracks and surfaces conversion improvements
    │
    └── Community: Creator marketplace, template sharing, success stories
```

### 14.2 End User Journey (Discovery → Engagement → Conversion)

```
STAGE 1: DISCOVERY
│
├── Touchpoint A: Social media (avatar's auto-posted content)
│   ├── User sees engaging post from avatar account
│   ├── Clicks through to profile or bio link
│   └── Lands on: lola.app/avatar/[slug]
│
├── Touchpoint B: Direct link (shared by creator, in email, on website)
│   └── Lands on: lola.app/avatar/[slug]
│
├── Touchpoint C: LoLA marketplace / search (future)
│   ├── User browses avatars by domain (fitness, language, coaching)
│   └── Discovers relevant avatar
│
└── Touchpoint D: Embedded widget (Enterprise)
    └── Avatar conversation embedded on creator's own website

    ┌─────────────────────────────────┐
    │   STAGE 2: PROFILE & TRUST      │
    └─────────────────────────────────┘
    │
    ├── User sees avatar profile page:
    │   ├── Photorealistic avatar image + scene variations
    │   ├── Bio, credentials, domain expertise
    │   ├── Social proof (session count, ratings, testimonials)
    │   ├── Product catalog (if creator has products)
    │   └── Primary CTA: "Start a Conversation" / "Try a Free Session"
    │
    ├── Trust signals:
    │   ├── "Powered by LoLA" badge
    │   ├── Creator verification (if Loka educator — shows credentials)
    │   ├── Star rating from previous sessions
    │   └── Session count ("5,000+ conversations")
    │
    └── Decision: User clicks CTA

    ┌─────────────────────────────────┐
    │    STAGE 3: FIRST SESSION       │
    │      (The magic moment)         │
    └─────────────────────────────────┘
    │
    ├── Minimal friction entry:
    │   ├── No signup required for first session (guest mode)
    │   ├── Email capture after 2 minutes ("Save your progress?")
    │   └── If creator's avatar is on Free: user gets 5-min trial
    │
    ├── Voice conversation begins:
    │   ├── Avatar greets user by context (teaching, coaching, selling)
    │   ├── 12-principle adaptive framework activates:
    │   │   ├── Assesses user's level (Sweller — cognitive load theory)
    │   │   ├── Builds rapport (Hammond — culturally responsive)
    │   │   ├── Adapts difficulty (Vygotsky — zone of proximal development)
    │   │   ├── Uses spaced repetition (Roediger — retrieval practice)
    │   │   └── Encourages growth mindset (Dweck — mindset theory)
    │   │
    │   ├── Expression carousel shows avatar reactions matching conversation
    │   ├── Waveform visualizer shows who's speaking
    │   └── User experiences a personalized, adaptive conversation
    │
    ├── Mid-session product recommendation (if sales mode):
    │   ├── Avatar naturally suggests relevant product from catalog
    │   ├── Product card appears in UI with image, price, description
    │   ├── User clicks → external checkout URL (creator's Stripe/Gumroad/etc.)
    │   └── Conversion tracked in creator CRM
    │
    └── Session ends:
        ├── Summary card: key takeaways, recommendations, next steps
        ├── CTA: "Book another session" / "Explore products" / "Share with a friend"
        └── Email capture (if guest): "Get session notes sent to your inbox"

    ┌─────────────────────────────────┐
    │    STAGE 4: RETENTION LOOP      │
    └─────────────────────────────────┘
    │
    ├── Post-session (automated via n8n):
    │   ├── Session summary email with key insights
    │   ├── Personalized content recommendation
    │   ├── Next session prompt based on learning path
    │   └── Product follow-up if viewed but not purchased
    │
    ├── Re-engagement triggers:
    │   ├── New content from avatar's social feed
    │   ├── "Your learning streak" notifications (education domain)
    │   ├── Progress milestones ("You've completed 10 sessions!")
    │   └── Creator-configured nurture sequences (from creator CRM)
    │
    ├── Deepening engagement:
    │   ├── User creates account (saves session history across devices)
    │   ├── Builds relationship with avatar over multiple sessions
    │   ├── Avatar remembers previous conversations (context carries forward)
    │   └── Adaptive framework tracks progress across sessions
    │
    └── Conversion paths:
        ├── Free sessions → Paid session credits
        ├── Session engagement → Product purchase
        ├── Positive experience → Refer friends (share link)
        └── Power user → Subscribe to creator's premium tier (future)

    ┌─────────────────────────────────┐
    │    STAGE 5: ADVOCACY            │
    └─────────────────────────────────┘
    │
    ├── User shares avatar with friends / colleagues
    ├── User leaves rating / testimonial (displayed on profile)
    ├── User follows avatar's social accounts
    └── Viral loop: user engagement → better analytics for creator → 
        better content → more users
```

---

## §15 — Subtitle & Caption Strategy

### 15.1 The Problem

Many social media consumers watch content with sound off. Posts with subtitles / text overlays get significantly higher engagement. LoLA's social content pipeline needs a subtitle capability, but the current n8n subtitle workflow has reliability issues.

### 15.2 Current State

The Persona Video Pipeline (§4 changelog entries v3.3–3.5 of ORBWEVA_MASTER) already has subtitle infrastructure:

- **ffmpeg caption burning** via SSH node on Hostinger KVM2 (replaced Shotstack, saving ~$25/month)
- Pipeline verified end-to-end (execution 7375) with 31 nodes
- Issues: subtitle timing accuracy, edge cases with longer text, Japanese text rendering

### 15.3 Recommendation: Hybrid Approach

**For the hackathon (March 16):** Use pre-written subtitles from the content generation step. When n8n generates social captions via GPT/Gemini, it simultaneously generates subtitle text as structured data (timed segments). This is deterministic and reliable because the AI is writing both the spoken content and the subtitle timing in one pass — no transcription needed.

**For production (post-hackathon):** Two-tier subtitle system.

**Tier 1 — Automated (Default for Creator tier):**

```
n8n Content Generation Workflow:
├── GPT-4o generates social post content
├── Same prompt generates subtitle segments as structured JSON:
│   ├── [{start: 0, end: 2.5, text: "Want to learn Japanese?"}, ...]
│   └── Timing calculated from estimated speech rate (~150 words/min)
├── ffmpeg burns subtitles onto image/video
├── Creator gets preview in Telegram → approve/edit/skip
└── If creator edits: updated subtitles stored for future style learning
```

This approach sidesteps the transcription reliability problem entirely. The AI generates the subtitles at creation time, so there's no speech-to-text step to fail.

**Tier 2 — Dashboard Editor (Pro tier, post-hackathon):**

```
Creator Dashboard → Content Calendar → [Post] → Edit Subtitles:
├── Visual subtitle editor (timeline + text)
├── Preview with subtitles overlaid on image/video
├── Adjust timing, font, position, style
├── Save as creator's subtitle template (future posts auto-match style)
└── Publish with refined subtitles
```

The dashboard editor is a Pro feature that gives creators precise control. It's not needed for the hackathon but should be on the Phase 2 roadmap.

**Why this hybrid wins:**

| Approach | Reliability | Creator Effort | Quality | Best For |
|----------|-------------|---------------|---------|----------|
| n8n auto-transcription (current) | Low — timing/accuracy issues | Zero | Variable | Deprecated |
| AI-generated at creation time | High — deterministic | Zero (auto) or low (Telegram approve) | Good | Creator tier default |
| Dashboard editor | N/A — manual | Medium | Excellent | Pro tier refinement |

### 15.4 Subtitle Styling

Default subtitle style for LoLA-branded content:

| Property | Value |
|----------|-------|
| Font | Bold sans-serif (Inter Bold or similar) |
| Size | 48px on 1080×1080 images |
| Color | White with black outline (2px stroke) |
| Position | Bottom 20% of frame |
| Background | Semi-transparent black bar (optional, togglable) |
| Max characters per line | 40 |
| Animation | Word-by-word highlight (for video content) |

---

## §16 — Character Consistency Architecture

### 16.1 Confidence Assessment

**Character consistency confidence: 85-90% (High)**

This is achievable with current technology. Here's why:

FLUX Kontext's core architectural feature is in-context image generation — it accepts both text and a reference image as input, and outputs a new image that preserves the character identity from the reference while applying the text instruction (new scene, outfit, pose, etc.). This is fundamentally different from text-to-image models where consistency requires careful seed/prompt management.

The key factors driving confidence:

1. **Anchor image architecture** — LoLA's pipeline starts with a creator-approved "anchor image" that becomes the reference for all subsequent generations. Every social image feeds the anchor as input context, not just a text description.

2. **Iterative context building** — Each generation uses the previous output as context input for the next, creating a chain of visual continuity. The existing n8n template (n8n.io workflow #4798) demonstrates this pattern with multi-scene storytelling.

3. **PuLID identity preservation** — For "Clone Yourself" avatars using real face references, Flux Kontext + PuLID modules provide precise identity control with weight and timeline parameters, ensuring facial consistency across different styles and poses.

4. **No fine-tuning required** — Unlike LoRA-based approaches that require training a custom model per character (expensive, slow), Kontext achieves consistency through reference-image prompting at inference time. This means instant avatar creation, not hours of training.

### 16.2 What Could Reduce Confidence

| Risk | Mitigation |
|------|------------|
| Extreme pose changes (front → profile) | Constrain generation prompts to 3/4 view and front-facing |
| Style mixing (photorealistic anchor → cartoon request) | Lock style per avatar, warn if creator tries to switch |
| Background complexity bleeding into character | Use specific prompting: "Keep the character identical, change only the background to..." |
| Provider API changes | Abstract behind LoLA's generation service; swap providers without creator impact |
| Rate of generation (many images daily) | Reference anchor periodically, don't let drift accumulate over long chains |

### 16.3 n8n Character Consistency Pipeline

```
Workflow: Avatar Content Generator (daily cron)
│
├── Node 1: Schedule Trigger (daily at creator's preferred time)
│
├── Node 2: Read Creator Config (Supabase)
│   ├── anchor_image_url
│   ├── character_description
│   ├── brand_style_guidelines
│   ├── content_themes (array, rotates)
│   └── posting_schedule
│
├── Node 3: Generate Content Brief (GPT-4o)
│   ├── Input: today's theme, character_description, brand guidelines
│   ├── Output: {scene_description, caption, subtitle_segments[], hashtags}
│   └── Prompt includes: "The character MUST match: [character_description]"
│
├── Node 4: Generate Image (FLUX Kontext Pro via HTTP Request)
│   ├── Input: anchor_image_url + scene_description prompt
│   ├── Key param: image_url = anchor image (THIS is what ensures consistency)
│   ├── Prompt: "Keep the person identical. [scene_description]"
│   └── Output: generated_image_url
│
├── Node 5: Quality Check (optional, GPT-4o Vision)
│   ├── Compare generated image to anchor
│   ├── Check: "Does the person in image B look like the person in image A?"
│   ├── If confidence < 0.8: regenerate with tighter prompt
│   └── Max 2 retries, then flag for human review
│
├── Node 6: Burn Subtitles (ffmpeg via SSH, if video/carousel)
│   ├── Input: image + subtitle_segments from Node 3
│   └── Output: image_with_subtitles
│
├── Node 7: Creator Approval (Telegram)
│   ├── Send preview image + caption to creator
│   ├── Inline buttons: ✅ Approve | ✏️ Edit | ⏭️ Skip
│   └── Wait for response (timeout: 4 hours → auto-approve if enabled)
│
├── Node 8: Distribute (Blotato or direct API)
│   ├── Post to configured platforms with platform-specific formatting
│   └── Track post_id for engagement analytics
│
└── Node 9: Log & Update (Supabase)
    ├── Store post in content_library
    ├── Update creator's content calendar
    └── Feed engagement data back to content optimization
```

### 16.4 Comparison: Manual (AICA/Madi Kobru) vs. LoLA Pipeline

| Aspect | AICA Manual Approach | LoLA Automated Pipeline |
|--------|---------------------|------------------------|
| Avatar creation | Manual OpenArt prompting, trial-and-error | Guided wizard, 4 candidates in 12 seconds |
| Character consistency | Creator manages seeds, prompts, reference images manually | Anchor image + Kontext reference input — automated |
| Content generation | Creator writes each caption, crafts each prompt | AI generates from brand guidelines + theme rotation |
| Posting | Manual upload to each platform | Blotato multi-platform or direct API — automated |
| Conversation capability | None — static images only | Real-time adaptive voice conversation |
| Revenue from conversations | None | Session credits + in-conversation product sales |
| Scale ceiling | Creator's time (2-4 posts/day max) | Unlimited (n8n cron, limited only by credits) |
| Cost to creator | OpenArt subscription ($7-120/mo) + time | LoLA subscription ($0-99/mo), time near zero |

---

## §17 — Development Practices

### 17.1 Methodology: Specification Engineering for LoLA

Adapted from the Nate B Jones Four-Discipline Framework and Anthropic's Complete Developer Playbook, applied to LoLA's multi-system architecture.

**Core principle:** The problem is human clarity, not AI capability. Every feature starts with a specification before any code is written.

### 17.2 The Five Specification Primitives

Every LoLA feature spec (whether for Claude Code, n8n workflow, or Gemini prompt) MUST include:

1. **Problem Statement** — What specific problem does this solve? Who experiences it? What's the cost of not solving it?

2. **Acceptance Criteria** — What does "done" look like? Measurable, testable outcomes. Not "works well" but "avatar maintains >80% facial similarity across 10 consecutive generations as measured by GPT-4o Vision comparison."

3. **Failure Examples** — What does "wrong" look like? This is the most important primitive and the one most often skipped. For LoLA: "The avatar's hair color changes between generations" or "Subtitles extend beyond the image boundary" or "Session costs exceed $3 for a 10-minute conversation."

4. **Constraint Architecture** (Four Quadrants):

| Quadrant | Examples |
|----------|---------|
| **Musts** | Avatar must use anchor image as Kontext reference. Session must end gracefully when credits depleted. CRM contact must be created on every first session. |
| **Must-Nots** | Must not store creator API keys in plaintext. Must not auto-post without creator approval on first 5 posts. Must not exceed $0.20/credit in API costs. |
| **Preferences** | Prefer SiliconFlow for bulk image gen (cost). Prefer Telegram for creator notifications. Prefer Gemini 2.5 Flash over Flash-Lite for coaching sessions. |
| **Escalation Triggers** | If image quality check fails 2x consecutively → alert creator + flag for human review. If session cost exceeds $2 → warn and offer session wrap-up. If credit balance <20% → dashboard notification + email. |

5. **Evaluation Criteria** — How do we test this? Automated where possible.

### 17.3 Eval-Driven Development

Adapted from Anthropic's practice of defining capabilities via evaluations before building features.

**For each LoLA subsystem, maintain an eval harness:**

**Conversation Engine Evals (5-7 test cases):**

| Test | Input | Expected | Metric |
|------|-------|----------|--------|
| Coaching adaptation | User says "I'm a complete beginner" | Avatar reduces complexity, uses simpler language | Flesch-Kincaid drops by 2+ grade levels |
| Product recommendation | User expresses pain point matching a catalog product | Avatar naturally introduces product within 3 turns | Product card shown: Y/N |
| Session cost control | 15-minute session with chatty user | Total API cost < $2.50 | Cost from token counter |
| Credit depletion | User hits 0 credits mid-session | Graceful wrap-up, not hard cutoff | Session ends with summary + upgrade CTA |
| Knowledge base accuracy | Question about creator's specific expertise | Answer sourced from ARC, not hallucinated | Citation check against ARC entries |

**Image Generation Evals (5-7 test cases):**

| Test | Input | Expected | Metric |
|------|-------|----------|--------|
| Character consistency | Anchor + 5 scene prompts | All 5 images recognizably same character | GPT-4o Vision similarity >0.8 |
| Brand alignment | Brand guidelines + generic scene | Image matches color palette and style | Manual review checklist |
| Subtitle rendering | Image + 3-line subtitle | Text readable, positioned correctly, no overflow | Visual inspection + OCR verification |
| Generation speed | Single image request | Complete in <5 seconds | API response time |
| Cost per image | 10 images via SiliconFlow | Total cost <$0.20 | Invoice verification |

**Run evals on every model update** (Gemini version bump, FLUX model update) to catch regressions before they reach creators.

### 17.4 Build Process: 11-Phase Methodology

Adapted from the ORBWEVA Web App Build Methodology for LoLA's specific needs.

| Phase | Activity | Deliverable |
|-------|----------|-------------|
| 0 | Prompt 0 Pre-Flight: pen-and-paper thinking before engaging Claude Code | Problem statement + constraint quadrants on paper |
| 1 | Project setup (Next.js 15 + TypeScript + Tailwind + Supabase) | Running dev environment |
| 2 | Design system + brand tokens | Components library |
| 3 | Database schema + migrations | Supabase tables + RLS policies |
| 4 | Core pages (dashboard, profile, onboarding wizard) | Navigable UI shell |
| 5 | API integration (Gemini Live, FLUX Kontext, Blotato) | Working API connections |
| 6 | n8n workflow suite (avatar gen, content pipeline, CRM) | Deployed + validated workflows |
| 7 | Conversation engine (WebSocket proxy, session management) | Voice conversation working |
| 8 | Credit system + billing (Stripe) | Credits deducting, top-ups working |
| 9 | Testing + eval harness | All evals passing |
| 10 | Deployment (Vercel + Supabase production) | Live at lola.app |
| 11 | GSD Init for ongoing development | Context preservation active |

### 17.5 Session Continuity: Handoff Documents

Every Claude Code session produces a handoff document following this template:

```markdown
# LoLA — Claude Code Handoff

**Date:** [date]
**Session focus:** [what was built]
**Status:** [Phase X, step Y]

## What Was Built
- [Concrete deliverables with file paths]

## What Was Decided
| Decision | Choice | Reasoning |
|----------|--------|-----------|

## What's Next
- [Ordered list of next actions]

## Known Issues
- [Anything broken or incomplete]

## Resume Command
cd lola-platform && claude
Read docs/HANDOFF.md for context. Continue from [specific point].
```

### 17.6 n8n Workflow Standards for LoLA

All LoLA n8n workflows follow the project's established practices:

1. **Descriptive node names** — "Generate Avatar Image via Kontext" not "HTTP Request 3"
2. **Sticky notes on complex logic** — Explain WHY, not just WHAT
3. **Standard nodes over code nodes** — Code only when no standard alternative exists
4. **Error handling on every external API call** — Retry 2x with exponential backoff, then Telegram alert
5. **Validate before deploy** — Use n8n-MCP validation tools
6. **Template attribution** — When using community templates, credit the author
7. **Buffer.from() in Code nodes, never expressions** — Known n8n limitation
8. **Telegram HTML mode for Japanese text** — Markdown parser breaks Japanese characters
9. **Supabase order-based queries over date equality** — More reliable for time-based filtering
10. **Minimal modes** — `mode='minimal'`, `mode='structure'`, `mode='error'` to preserve context window

### 17.7 Prompt Architecture for AI Nodes

Every AI node in an n8n workflow is a micro-specification. Apply the constraint architecture:

```
System prompt template for LoLA AI nodes:

You are [role] for the LoLA platform.

TASK: [specific task]

MUSTS:
- [non-negotiable requirements]

MUST-NOTS:
- [explicit boundaries]

PREFERENCES:
- [soft guidelines]

OUTPUT FORMAT:
[exact JSON schema or text format expected]

ESCALATION:
- If [condition]: return {error: true, reason: "..."}
- If [condition]: flag for human review
```

This prevents the "smart-but-wrong" failure mode where the AI produces technically correct but contextually wrong output — the exact problem that compounds across multi-step n8n workflows.

---

## Appendix C — Cost Optimization Roadmap

### Phase 1: Launch (Hackathon + Month 1)

| Strategy | Savings | Effort |
|----------|---------|--------|
| Context caching on system prompts | 30-50% on session costs | Low — Gemini API parameter |
| SiliconFlow for bulk image gen | 60% on social images | Low — swap API endpoint |
| Session length limits by tier | Caps worst-case costs | Low — n8n timer logic |

### Phase 2: Optimization (Month 2-3)

| Strategy | Savings | Effort |
|----------|---------|--------|
| Smart context pruning (summarize old turns) | 30-40% on long sessions | Medium — custom logic |
| Model routing (Flash-Lite for simple, Flash for coaching) | 20-30% on session costs | Medium — classifier needed |
| BYOK adoption drive on Pro tier | 95% margin on BYOK users | Low — marketing + UX |

### Phase 3: Scale (Month 4+)

| Strategy | Savings | Effort |
|----------|---------|--------|
| Batch API for async content gen | 50% on content pipeline | Low — scheduling change |
| Dedicated endpoints (Together AI) for high-volume | Volume discounts | Medium — contract negotiation |
| Self-hosted FLUX (Kontext Dev is open-weight) | 80%+ on image gen | High — GPU infrastructure |
| Gemini context caching with sliding window | 60-70% on sessions | Medium — architecture change |

### Break-Even Analysis

| Scenario | Monthly Users | Revenue | API Costs | Margin |
|----------|--------------|---------|-----------|--------|
| 100 Creators (80% Creator, 20% Pro) | 100 | $3,300 | $1,400 | 58% |
| 500 Creators (70/20/10 C/P/E) | 500 | $19,300 | $7,200 | 63% |
| 1,000 Creators (60/25/15 C/P/E) | 1,000 | $43,500 | $14,800 | 66% |
| 5,000 Creators (50/30/20 C/P/E + BYOK) | 5,000 | $239,500 | $48,000 | 80% |

Note: Margins improve at scale because (a) BYOK adoption increases on Pro/Enterprise, (b) infrastructure costs are largely fixed, and (c) bulk API purchasing power increases.

---

*End of Addendum — merge into LOLA_PLATFORM_SPEC_v1.md as §13-§17 + Appendix C*
