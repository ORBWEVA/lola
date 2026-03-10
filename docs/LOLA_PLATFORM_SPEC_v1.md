# LOLA_PLATFORM_SPEC_v1.md

**Version:** 1.0
**Date:** 2026-03-03
**Status:** Active — consolidates platform architecture decisions from design session
**Relationship:** Extends LOLA_MASTER_v1.2 and LOLA_PRODUCT_BUILD_PLAN_v2.md
**Supersedes:** Nothing — this is a new document covering platform-level architecture

---

## Document Purpose

This spec captures LoLA's evolution from "AI coaching layer of Loka" to a **standalone platform** that serves multiple creator segments and use cases. It documents the full architecture including n8n orchestration, Blotato social distribution, commerce integration, and the multi-use-case conversation engine. It also defines the hackathon demo strategy: what gets shown vs. what gets mentioned.

When this document conflicts with LOLA_MASTER_v1.2 on platform-level decisions (standalone model, pricing tiers, use cases beyond coaching), this document wins. LOLA_MASTER_v1.2 remains canonical for the 12-principle coaching framework, technical stack details, and Phase 1 build state.

---

## §1 — Platform Identity

### What LoLA Is (Expanded)

LoLA (Loka Learning Avatar) is an **AI avatar platform** where creators build intelligent avatars that can coach, sell, support, and create content — autonomously.

Three interlocking capabilities:

1. **Adaptive Conversation Engine** — A 12-principle neuroscience framework that powers intelligent, psychologically-aware conversations across any domain. Not just teaching — selling, supporting, engaging. The framework adapts to the conversation's purpose as configured by the creator.

2. **Educator Creator Platform** — Anyone (educators, coaches, trainers, marketers, influencers) builds, owns, and monetizes AI avatars. Tools for avatar generation, knowledge base upload, voice selection, conversation configuration, and product catalog management.

3. **Self-Marketing Pipeline** — Avatars generate their own social media content and build organic audiences via n8n automation → Blotato (or direct posting) → 9+ social platforms. Avatars attract their own users. Creators don't need to manually create content.

### What Changed

LoLA was originally designed as the "AI coaching layer of the Loka Living Textbook platform." It is now a **standalone platform** with its own business model, pricing, and user base. The Loka integration becomes a premium feature for educators, not a dependency.

| Before | After |
|--------|-------|
| Feature of Loka | Standalone platform with own business model |
| Language learning focus | Any domain: teaching, sales, support, UGC, influencer |
| Educator-only creators | Anyone: educators, marketers, trainers, influencers |
| Coaching sessions only | Coaching, sales conversations, support, content-only |
| Credit-based revenue only | Credits + product sales + subscriptions + content-driven passive |
| Loka SSO required | Independent auth + optional Loka bridge |

---

## §2 — Use Cases and Conversation Modes

### The Architecture Is Use-Case Agnostic

The same infrastructure — avatar identity, conversational AI engine, n8n orchestration, social distribution — powers different business models based on creator configuration. What changes between use cases is: conversation rules, monetization trigger, and session end conditions.

### Use Case Matrix

| Use Case | Who Pays | Conversation Goal | Session End Trigger | Revenue Model |
|----------|----------|-------------------|---------------------|---------------|
| **Teaching/Coaching** | Learner (credits) | Deliver knowledge, adapt, correct | Credits exhausted or learner ends | Credit consumption |
| **Sales/Marketing** | Nobody (free) | Qualify, recommend, close | After product recommendation or time limit | Product sales (external checkout) |
| **Customer Service** | Business (subscription) | Resolve issue, de-escalate | Issue resolved or routed to human | B2B subscription |
| **Corporate Training** | Company (enterprise) | Deliver training, assess | Module completion | Enterprise contract |
| **AI Influencer/UGC** | N/A (content-only) | Generate and post content | N/A — no live conversations | Brand deals, affiliate, subscriptions |
| **Hybrid (Coach + Sell)** | Learner (credits) + product | Teach, then naturally recommend products | Credits exhausted or after recommendation | Credits + product sales |

### Creator Configuration (Dashboard Settings)

Creators configure their avatar's behavior through settings, not code:

**Conversation Mode:**
- Coaching (metered, credit-based)
- Sales (free, goal-oriented)
- Support (free, resolution-oriented)
- Content-Only (no live conversations, social pipeline only)
- Hybrid (free intro → paid coaching, or coaching with product recommendations)

**Monetization Model:**
- Credit-per-minute (coaching)
- Free with product links (sales)
- Subscription redirect (Fanvue, Patreon, etc.)
- Enterprise flat rate (corporate)
- Content-driven passive only (influencer)

**Conversation Boundaries:**
- Natural cutoff after pitch completion
- Time-limited (X minutes)
- Completion-based (finish the module)
- Credit-limited (runs until credits exhausted)
- Open-ended (no limit)

**Content Rating:**
- General (teaching, coaching, kids-safe)
- Mature (dating advice, suggestive but not explicit)
- Adult (Fanvue/subscription redirect, flagged accordingly)

**Sales Configuration (when mode = Sales or Hybrid):**
- Opening approach (understand needs / hook / custom)
- Qualifying questions (3-5 creator-defined questions)
- Product matching rules (if prospect mentions X → recommend Product Y)
- Closing behavior (share link + ask questions / send link + end / offer discount if hesitation)
- Follow-up (capture email for nurture sequence via n8n)

---

## §3 — Revenue Architecture

### Triple Revenue Stream Per Avatar

A single LoLA avatar can generate three simultaneous revenue streams from one profile page:

**Stream 1 — Session Credits**
Prospect pays to talk. Every minute of conversation earns the creator revenue. Even if prospect never buys a product, creator earns from the conversation.

**Stream 2 — Product Sales**
During or after session, avatar recommends creator's products. Checkout happens externally (Stan Store, Shopify, Gumroad, Amazon, etc.). Creator keeps 100% of product revenue (or affiliate commission if selling others' products).

**Stream 3 — Content-Driven Passive Sales**
Avatar's social content (n8n → Blotato/direct) drives constant traffic to profile page. Some start conversations. Some browse products and buy without talking to avatar. Pipeline runs autonomously.

### Creator Platform Tiers

| Tier | Price | Avatars | Image Gen | Social Content | Revenue Share | Key Features |
|------|-------|---------|-----------|----------------|---------------|-------------|
| **Free** | $0 | 1 avatar (AI face, Gemini voice) | Basic | None | 70% creator / 30% LoLA | 15 free learner credits, basic coaching report |
| **Creator** | $29/mo | Up to 5 | AI-generated (NanaBanaPro/Flux) | 3 videos/month (Hedra) | 80% / 20% | Custom knowledge base (50MB), coaching reports, analytics |
| **Pro** | $99/mo | Unlimited | Clone yourself (real face + voice) | 15 videos/month | 85% / 15% | Advanced analytics, custom domain, API access, embedding |
| **Enterprise** | Custom | Unlimited | White-label | Unlimited | 90% / 10% or flat fee | SSO, compliance logging, on-premise option, SLA |

Learners pay per session via credits (same system across all tiers). Creator subscription covers platform tools and infrastructure.

### Commerce Integration — Product Catalog

LoLA doesn't process product payments. It stores checkout URLs and has the avatar share them during conversations or display them on the profile page.

**Product Catalog Schema:**
```
creator_products table:
├── product_id
├── creator_id
├── name                  (display name)
├── description           (for avatar context — knows what to recommend)
├── price                 (display price)
├── currency
├── checkout_url          (external: Amazon, Shopify, Stan Store, Gumroad, Fanvue, etc.)
├── platform              (amazon | shopify | stan_store | gumroad | stripe | fanvue | custom)
├── commission_type       (own_product | affiliate)
├── commission_rate       (100% for own, variable for affiliate)
├── recommendation_rules  (JSON: when should avatar recommend this?)
├── is_active
└── sort_order
```

The avatar's conversational AI uses this catalog as context. During conversation, when appropriate, it recommends relevant products and shares checkout links. The profile page displays active products as a storefront.

**Phase 1 (Hackathon+):** Checkout URLs only — creator pastes links, avatar shares them.
**Phase 2:** Webhook notifications from Stripe/Stan Store when sales happen → conversion metrics in creator dashboard.
**Phase 3:** Shopify API product sync, Amazon Associates link generation, affiliate tracking.

---

## §4 — Avatar Profile Page

### lola.app/avatar/[slug]

The avatar's profile page is a storefront, coaching portal, content hub, and link-in-bio page — all in one.

**Layout:**
```
┌──────────────────────────────────────────┐
│  [Avatar Portrait — large, hero image]    │
│                                          │
│  Avatar Name                             │
│  Tagline / domain / coaching style       │
│  Session count · Rating · Creator name   │
│                                          │
│  [💬 Talk to Me]  ← primary CTA          │
│  [📱 Free · First 5 minutes]             │
│                                          │
│  ─── Products ───                        │
│  📚 Product 1              $47  [View]   │
│  🎯 Product 2              $197 [View]   │
│  ✨ Product 3              $497 [View]   │
│                                          │
│  ─── Latest Content ───                  │
│  [Embedded Hedra video clip]             │
│  [Grid of recent social posts]           │
│                                          │
│  ─── Connect ───                         │
│  Instagram | TikTok | YouTube | X        │
│                                          │
│  Powered by LoLA · Create your own →     │
└──────────────────────────────────────────┘
```

This page is what all social media bio links point to. It's the hub where content drives traffic, conversations happen, and money is made.

**SEO:** Page includes structured data (JSON-LD) for rich search results. Avatar name, domain, rating, and description are crawlable. Each avatar page is a landing page.

**Customization:** Creators on Pro tier can use custom domains (coach.yourdomain.com) pointing to their avatar page.

---

## §5 — n8n Orchestration Layer

### Principle

n8n handles everything async and swappable. The FastAPI backend handles everything real-time and latency-critical.

**n8n owns:**
- Avatar generation pipeline (image, video, voice, instruction generation)
- Social content creation and distribution
- Loka↔LoLA data bridge
- Email nurture sequences and follow-ups
- Tool swapping (swap NanaBanaPro for Flux, Hedra for VEO 3, etc.)
- Commerce webhook processing

**n8n does NOT touch:**
- Gemini Live API WebSocket (real-time coaching sessions)
- Real-time credit deduction
- Audio streaming
- Live transcript capture

### Workflow Group 1: Avatar Generation Pipeline

Triggered by creator form submission via webhook.

```
Creator submits form → POST n8n.orbweva.cloud/webhook/create-avatar

n8n Pipeline:
├── Step 1: FACE GENERATION
│   ├── Route: AI-generated OR real human clone
│   ├── AI path: NanaBanaPro/Flux/Ideogram (swappable)
│   │   ├── Generate 1 base portrait (1024×1024)
│   │   └── Generate 4-6 expression variants
│   ├── Clone path: Process uploaded photos
│   │   ├── HeyGen/Tavus (with consent video)
│   │   └── Generate expression variants from real photos
│   └── Store: Supabase Storage
│
├── Step 2: SOCIAL VIDEO GENERATION
│   ├── Today: Hedra Character-3 (image + audio → video)
│   ├── Tomorrow: VEO 3, Kling, HeyGen (swappable)
│   ├── Generate: 2-3 intro videos (15-30s each)
│   └── Store: Supabase Storage / CDN
│
├── Step 3: VOICE SELECTION
│   ├── AI voice: Gemini voice picker (30 voices)
│   ├── Clone voice: ElevenLabs Instant/Professional Clone
│   └── Store: voice_id in avatar record
│
├── Step 4: COACHING INSTRUCTION GENERATION
│   ├── Input: domain + personality + knowledge base + conversation mode
│   ├── Merge with: 12-principle framework (weighted by domain)
│   ├── Generate: system instruction for Gemini Live API
│   └── Today: Gemini API / Tomorrow: Claude, GPT (swappable)
│
├── Step 5: ASSET STORAGE
│   ├── Upload all images to Supabase Storage
│   ├── Upload videos to Supabase Storage
│   └── Create avatar record in Supabase DB
│
├── Step 6: LOKA SYNC (if creator has Loka bridge active)
│   ├── Write avatar reference to Loka's PostgreSQL
│   └── Sync curriculum → LoLA knowledge base
│
└── Step 7: NOTIFICATION
    ├── Telegram → platform admin (new avatar created)
    ├── Email → creator (your avatar is ready)
    └── Webhook → LoLA frontend (refresh UI)
```

### Workflow Group 2: Social Content Pipeline

Runs on schedule per avatar (configurable cadence).

```
Cron trigger → n8n.orbweva.cloud

├── Load avatar context (personality, domain, product catalog, recent topics)
├── AI content generation
│   ├── Text: OpenAI/Claude generates platform-specific posts
│   ├── Images: NanaBanaPro/Flux generates avatar images with context
│   └── Video: Hedra generates talking-head clips
│
├── Content approval (optional)
│   ├── Telegram message to creator with preview
│   ├── Creator approves/edits/rejects
│   └── Or: auto-publish if creator has auto-mode enabled
│
├── Distribution
│   ├── IF Blotato connected:
│   │   └── POST Blotato API → 9 platforms (smart scheduling)
│   ├── ELSE direct posting:
│   │   ├── Twitter/X node (built-in)
│   │   ├── LinkedIn node (built-in)
│   │   ├── YouTube node (built-in)
│   │   ├── Facebook Graph API node (built-in)
│   │   └── Instagram/TikTok community nodes
│   └── Both paths share same content, different distribution nodes
│
└── Analytics capture
    ├── Store post URLs and timestamps
    └── Track engagement (future: Blotato analytics API)
```

### Workflow Group 3: Loka↔LoLA Bridge

Activated by one-button toggle in either product's settings.

```
Direction 1: Loka educator → LoLA
POST n8n.orbweva.cloud/webhook/activate-lola
├── Payload: { educator_id, email, school, subjects, curriculum_ids }
├── Create/link LoLA account (Supabase Auth — shared identity)
├── Sync curriculum → LoLA knowledge base
├── Sync student list → LoLA learner profiles
└── Return: { lola_creator_id, dashboard_url }

Direction 2: LoLA creator → Loka
POST n8n.orbweva.cloud/webhook/activate-loka
├── Payload: { creator_id, email, domain, learner_count }
├── Create/link Loka account
├── Import learners as Loka students (optional)
├── Seed curriculum from avatar knowledge bases
└── Return: { loka_educator_id, dashboard_url }

Ongoing sync (post-activation):
├── Cron: New Loka students → LoLA learner profiles
├── Cron: LoLA session data → Loka progress metrics
├── Cron: Loka curriculum updates → LoLA avatar knowledge base
└── Webhook: LoLA coaching reports → Loka educator dashboard
```

### Tool Swapping Architecture

n8n's key value: the webhook contract between LoLA and n8n never changes. Only internal wiring does.

```
LoLA frontend → POST /webhook/create-avatar → n8n
                                                │
                                          Switch node
                                          ├── Image tool:
                                          │   ├── NanaBanaPro (current)
                                          │   ├── Flux (alternative)
                                          │   ├── Ideogram (alternative)
                                          │   └── DALL-E 4 (future)
                                          ├── Video tool:
                                          │   ├── Hedra (current)
                                          │   ├── VEO 3 (alternative)
                                          │   └── Kling (alternative)
                                          ├── Voice tool:
                                          │   ├── Gemini voices (current)
                                          │   └── ElevenLabs (clone)
                                          └── LLM tool:
                                              ├── Gemini (current)
                                              ├── Claude (alternative)
                                              └── GPT-5 (future)
```

Swapping a tool = drag a new node, reconnect wires. No code changes, no redeployment, no frontend changes. A/B testing tools is also possible via Switch node with percentage routing.

---

## §6 — Blotato Integration

### Why Blotato

Blotato publishes to 9 platforms (Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook, Threads, Bluesky, Pinterest) via a single API call. It has a verified n8n community node (@blotato/n8n-nodes-blotato), 30+ pre-built workflow templates, and an LLM-friendly API reference. The founder (Sabrina Ramonov) is running the hackathon LoLA is entering.

### Integration Architecture

**For creators who have Blotato:**
- Creator enters Blotato API key in LoLA settings
- n8n content pipeline routes through Blotato node
- Smart scheduling (useNextFreeSlot), cross-platform formatting, AI content enhancement
- 9 platforms from one pipeline

**For creators who don't have Blotato (free path):**
- Creator connects platforms directly via OAuth in LoLA settings
- n8n routes through built-in nodes (Twitter/X, LinkedIn, YouTube, Facebook) + community nodes (Instagram, TikTok)
- Manual scheduling, basic formatting
- 4-6 platforms, rougher experience, but functional at zero additional cost

**Upgrade path:** Creator starts with direct posting → sees results → upgrades to Blotato ($29/mo) for smart scheduling, more platforms, AI content tools.

### Blotato API Reference

```
Base URL: https://backend.blotato.com/v2/
Auth: X-API-KEY header
Rate limit: 30 requests/minute

POST /v2/posts       → Publish or schedule to any platform
POST /v2/media       → Upload images/videos
POST /v2/visuals     → AI-generated content from templates
GET  /v2/visuals/:id → Check generation status
```

Key features for LoLA:
- `scheduledTime` (ISO 8601) for explicit scheduling
- `useNextFreeSlot: true` for smart auto-scheduling
- Per-platform customization within single API call
- Webhook target support for custom integrations

### Strategic Relationship

LoLA + Blotato demo at hackathon = showcase integration that validates Blotato's vision of AI-powered autonomous content systems. An AI coaching avatar that generates and publishes its own social content via Blotato's API is exactly the use case Sabrina is building toward. This is a natural partnership opportunity.

**Open invitation to Blotato users:** LoLA's Self-Marketing Pipeline upgrades their existing Blotato workflow from "AI-generated content" to "AI avatar with personality, coaching capability, and conversational sales" — their content gets a face, a voice, and a brain.

---

## §7 — AI Influencer / UGC Use Case

### Market Context

The AI influencer market is valued at $6-8 billion (2024), growing at 37-42% CAGR. Existing platforms (SynthLife, Glambase, The Influencer AI) handle content creation but lack conversational AI capabilities. LoLA's unique proposition: an avatar that both creates content AND has real conversations with prospects.

### How LoLA Serves AI Influencer/UGC Creators

**Content-Only Mode:** Avatar generates images, videos, and text content via n8n pipeline → posts to social platforms via Blotato/direct. No live conversations. Revenue from brand deals, affiliate links, subscription platforms.

**Hybrid Mode:** Avatar posts content AND handles conversations. Prospect finds avatar on Instagram → clicks bio link → starts conversation → avatar qualifies, recommends, closes. Revenue from product sales + affiliate + subscriptions.

### The AICA Model on LoLA

The AICA blueprint (Madi Kobru) demonstrates: create AI avatar → generate content → sell digital product → earn while sleeping. Revenue: $440K+ in 6 months from one digital product.

What AICA does manually, LoLA automates:
- Avatar creation: LoLA's generation pipeline (vs. manual OpenArt)
- Content creation: n8n automated pipeline (vs. manual generation and posting)
- Social distribution: Blotato/direct (vs. manual scheduling)
- Sales conversations: Avatar actually talks to prospects (AICA can't do this)

### Revenue Models for AI Influencer Creators

| Revenue Stream | How LoLA Enables It |
|---------------|---------------------|
| Brand sponsorships | Avatar builds audience via content pipeline; creator negotiates deals |
| Affiliate marketing | Product catalog with affiliate URLs; avatar recommends in conversations |
| Digital product sales | Product catalog with checkout URLs; avatar sells in conversations |
| Subscription platforms | Fanvue/Patreon links in product catalog and profile page |
| AI UGC services | Creator sells avatar-generated content to brands |
| Course/education sales | Avatar teaches AND sells deeper courses |

### Content Rating and Platform Boundaries

**General:** Teaching, coaching, professional content. All platforms.
**Mature:** Dating, lifestyle, suggestive. Most platforms.
**Adult:** Fanvue/subscription redirect. Content on LoLA stays SFW; explicit content hosted externally. LoLA handles top-of-funnel engagement and relationship building. Age verification and payment handled by external platform (Fanvue, etc.).

Architecture supports adult use case without LoLA hosting or processing adult content. LoLA stores a URL; the rest happens elsewhere.

---

## §8 — Loka↔LoLA Bridge

### One-Button Activation

Both products share Supabase Auth. Same email = same identity. Activation flips a role flag + provisions resources via n8n webhook.

**In Loka dashboard:**
```
🤖 AI Coaching Avatars
Create AI coaches that know your curriculum and your students.
Powered by LoLA.
[Activate →]
```

**In LoLA dashboard (education domain creators only):**
```
📚 Classroom Management
Manage classes, track attendance, and sync student progress.
Powered by Loka.
[Explore →]
```

### What Gets Synced

| Data | Direction | Mechanism |
|------|-----------|-----------|
| Educator profile | Loka → LoLA | Activation webhook |
| Curriculum/knowledge base | Loka → LoLA | n8n cron sync |
| Student/learner profiles | Bidirectional | n8n cron sync |
| Session transcripts + reports | LoLA → Loka | n8n webhook |
| Progress metrics | LoLA → Loka | n8n cron sync |
| Avatar status + session counts | LoLA → Loka | n8n webhook |

### Non-Education Creators

Corporate trainers, sales coaches, influencers using LoLA standalone never see the Loka option. The "Explore Loka" card only appears when creator's domain signals classroom relevance.

### Competitive Moat

No AI avatar platform connects to a classroom management system. No EdTech platform lets educators create autonomous AI coaching avatars. The one-button bridge is the physical manifestation of the Co-Active Learning Triangle — educator, AI, learner, all connected through shared data.

---

## §9 — Hackathon Demo Strategy

### Principle

**Demo what's real. Narrate the vision. Build the rest with momentum.**

### What Gets Demoed (Built and Working)

| Component | State | Demo Action |
|-----------|-------|-------------|
| Avatar coaching session (mobile) | Built — UX screens artifact | Show full-screen avatar + waveform + speech bubble + credit pill |
| Avatar coaching session (desktop) | Built — UX screens artifact | Show split-panel with live transcript |
| Social discovery (Instagram mockup) | Built — UX screens artifact | Show avatar social post → bio link → session |
| User dashboard | Built — UX screens artifact | Show home page with credit balance, session recordings |
| Audio coaching via Gemini Live API | Built — Phase 1 complete | Live demo of voice conversation with avatar |
| 12-principle adaptive framework | Built — 4 demo profiles | Show how coaching adapts to learner profile |
| Expression carousel | Planned for build sprint | Avatar portrait with 4-6 expression variants + crossfade |
| Brand identity (LoLA Brand Guide v1) | Defined | All screens use LoLA design system |

### What Gets Mentioned (Vision / Roadmap)

| Capability | Status | How to Present |
|------------|--------|----------------|
| Standalone platform (not just Loka) | Architected | "LoLA works standalone — anyone can create an avatar" |
| Multi-domain (sales, support, training) | Architected | "Same engine, different conversation modes" |
| Product catalog + sales conversations | Designed | "Avatars can recommend and sell products mid-conversation" |
| n8n orchestration + tool swapping | Designed | "Tools change monthly — our orchestration layer lets us swap without code changes" |
| Blotato integration | Designed | "Avatars publish to 9 platforms via Blotato" — strong hackathon tie to Sabrina |
| AI influencer/UGC use case | Designed | "Not just coaching — AI influencers, UGC creators, faceless brands" |
| Clone yourself (real face + voice) | Designed | "Pro tier: clone yourself — your avatar looks and sounds like you" |
| Loka↔LoLA bridge | Designed | "One button to connect your classroom to your AI coach" |
| Creator platform tiers | Designed | Show pricing slide — Free / Creator / Pro / Enterprise |
| Triple revenue stream | Designed | "Credits + product sales + content-driven passive — three streams from one avatar" |
| Educator Creator form | Planned for Days 10-11 | May be buildable for demo if time allows |

### Hackathon-Specific Messaging

**For Sabrina's hackathon (March 6-8):**
Lead with the Blotato integration angle. Emphasize autonomous content creation → social distribution → conversational sales funnel. Position LoLA as the "brain behind the avatar" that makes Blotato content come alive with real conversations.

**For Gemini Live Agent Challenge (March 16):**
Lead with the adaptive coaching engine. Emphasize Gemini Live API native audio, 12-principle framework, real-time voice coaching. Show desktop split-panel with live transcript. Position LoLA as the most sophisticated coaching agent built on Gemini.

### Demo Flow (Recommended)

1. **Hook** (30s): Show social media post by avatar → prospect clicks bio link → lands on avatar profile page
2. **Session demo** (2-3 min): Live voice conversation with avatar demonstrating adaptive coaching, error correction, encouragement
3. **Platform vision** (1-2 min): Walk through creator dashboard, conversation modes, product catalog, content pipeline, Blotato distribution
4. **Business model** (30s): Three revenue streams, creator tiers, market size
5. **Roadmap** (30s): What's next — clone yourself, marketplace, AI influencer tools, Loka bridge

---

## §10 — Post-Hackathon Roadmap

### Phase 2: Platform Foundation (March-April 2026)

- Standalone auth (email/password without Loka)
- Creator onboarding flow (form → avatar generation pipeline via n8n)
- Product catalog CRUD in creator dashboard
- Sales conversation mode (qualifying questions, product recommendations, checkout links)
- Blotato integration (API key entry, content pipeline)
- Direct posting path (OAuth per platform, n8n routing)

### Phase 3: Marketplace & Growth (May-June 2026)

- Avatar marketplace (browse, filter, try)
- Creator analytics dashboard (sessions, revenue, content performance)
- Clone yourself (real face + voice pipeline)
- Webhook-based conversion tracking (Stripe, Stan Store)
- Email nurture sequences via n8n
- Custom domain support (Pro tier)

### Phase 4: Enterprise & Expansion (Q3 2026)

- Loka↔LoLA one-button bridge
- Enterprise tier (SSO, compliance, white-label)
- Embedding SDK (avatar as widget on external sites)
- Shopify product sync
- Advanced analytics (learning curves, sales funnels, engagement patterns)
- Multi-domain templates (sales training, customer service, compliance)

### Phase 5: AI Influencer Ecosystem (Q4 2026)

- Content-only mode (no conversations, pure content pipeline)
- Fanvue/subscription platform integration
- Brand deal facilitation tools
- Affiliate tracking and reporting
- Creator-to-creator product cross-selling marketplace
- AI UGC service delivery tools

---

## §11 — Data Model Updates

### New/Modified Tables

```sql
-- Extends existing avatars table
ALTER TABLE avatars ADD COLUMN conversation_mode TEXT DEFAULT 'coaching';
  -- 'coaching' | 'sales' | 'support' | 'content_only' | 'hybrid'
ALTER TABLE avatars ADD COLUMN content_rating TEXT DEFAULT 'general';
  -- 'general' | 'mature' | 'adult'
ALTER TABLE avatars ADD COLUMN monetization_model TEXT DEFAULT 'credits';
  -- 'credits' | 'free_with_products' | 'subscription_redirect' | 'enterprise'
ALTER TABLE avatars ADD COLUMN session_limit_minutes INTEGER;
  -- NULL = no limit
ALTER TABLE avatars ADD COLUMN sales_config JSONB;
  -- { opening_approach, qualifying_questions[], product_matching_rules[], closing_behavior }
ALTER TABLE avatars ADD COLUMN social_config JSONB;
  -- { blotato_enabled, blotato_api_key, connected_platforms[], posting_cadence, auto_publish }

-- New: Product catalog
CREATE TABLE creator_products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id),
  avatar_id UUID REFERENCES avatars(avatar_id),  -- NULL = available to all creator's avatars
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  checkout_url TEXT NOT NULL,
  platform TEXT,  -- 'amazon' | 'shopify' | 'stan_store' | 'gumroad' | 'stripe' | 'fanvue' | 'custom'
  commission_type TEXT DEFAULT 'own_product',  -- 'own_product' | 'affiliate'
  commission_rate DECIMAL(5,2) DEFAULT 100.00,
  recommendation_rules JSONB,  -- when should avatar recommend this?
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- New: Creator subscriptions (platform tiers)
CREATE TABLE creator_subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id),
  tier TEXT NOT NULL,  -- 'free' | 'creator' | 'pro' | 'enterprise'
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- New: Loka bridge status
CREATE TABLE loka_bridge (
  bridge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lola_user_id UUID REFERENCES auth.users(id),
  loka_user_id TEXT,  -- ID in Loka's system
  bridge_status TEXT DEFAULT 'active',  -- 'active' | 'paused' | 'disconnected'
  activated_from TEXT,  -- 'loka' | 'lola'
  last_sync_at TIMESTAMPTZ,
  sync_config JSONB,  -- what data flows where
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## §12 — Technical Dependencies

### Existing (from LOLA_MASTER_v1.2)
- Gemini 2.5 Flash Native Audio (coaching engine)
- Next.js 14 on Vercel (frontend)
- Cloud Run (Gemini session backend — hackathon)
- Supabase (auth, database, storage)
- PostgreSQL (data)

### New (this spec)
- n8n at n8n.orbweva.cloud (orchestration — already running)
- Blotato API (social distribution — $29/mo Creator tier minimum)
- Stripe Billing (creator subscriptions + learner credits)
- NanaBanaPro / Kie.ai (image generation — already integrated)
- Hedra Character-3 (video generation — $8/mo)
- ElevenLabs (voice cloning — Pro tier, future)

### Integration Points

| System | Protocol | Purpose |
|--------|----------|---------|
| n8n ↔ LoLA | Webhooks (HTTPS) | Avatar generation, content pipeline triggers |
| n8n ↔ Blotato | REST API + n8n node | Social content publishing |
| n8n ↔ Loka | Direct DB + webhooks | Bidirectional data sync |
| n8n ↔ NanaBanaPro | REST API | Image generation |
| n8n ↔ Hedra | REST API | Video generation |
| n8n ↔ ElevenLabs | REST API | Voice cloning |
| n8n ↔ Supabase | REST API | Data storage |
| n8n ↔ Telegram | Built-in node | Creator notifications, content approval |
| Stripe ↔ LoLA | Webhooks | Payment events, subscription management |

---

## Appendix A — Blotato Technical Reference

### Supported Platforms
Instagram (posts, Reels, Stories, carousels), TikTok (including slideshows), YouTube, Twitter/X (including threads), LinkedIn (personal + company), Facebook Pages, Threads, Bluesky, Pinterest

### API Rate Limits
30 requests/minute per user

### Platform Posting Limits (external)
- Instagram: 100 posts/24hr via API
- TikTok: ~15 uploads/24hr
- Twitter/X: 1,500 tweets/month (free tier)
- YouTube: ~6 uploads/day
- LinkedIn: 100 requests/day

### n8n Node
Package: @blotato/n8n-nodes-blotato (verified community node)
Resources: Visual, Media, Post, Get Visual
GitHub: github.com/Blotato-Inc/n8n-nodes-blotato

### Sabrina Ramonov
Founder of Blotato. UC Berkeley CS + Physics. Forbes 30 Under 30. Sold Qurious to Pegasystems. Running the Sabrina/Marcin AI Hackathon (March 6-8). Mission: teach 10M people AI. 1.5M+ followers. Builds Blotato solo with Claude Code.

---

## Appendix B — AI Influencer Market Data

### Market Size
$6-8 billion (2024), 37-42% CAGR, projections to $45-298B by 2030-2035

### Revenue Benchmarks
- Lil Miquela: up to $100K/sponsored post, $10M+/year
- Lu do Magalu: ~$16.2M/year
- Aitana López: €3K-€10K/month (Stable Diffusion-generated)
- Madi Kobru (AICA creator): $440K+ in 6 months (1 digital product)

### Competitor Platforms
- SynthLife: all-in-one AI influencer (image + video + distribution)
- Glambase: autonomous interaction + financial tracking
- The Influencer AI: batch Reels creation
- Creatify AI: avatar design + bring-your-own

### LoLA's Differentiator
No existing platform combines conversational AI coaching with autonomous content generation and distribution. LoLA avatars don't just post — they talk, teach, sell, and support.

---

*End of LOLA_PLATFORM_SPEC_v1.md*
