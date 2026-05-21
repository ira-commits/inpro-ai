# InPro.ai — Claude Code Context

> Read this file at the start of every session. It contains the full project context,
> architecture decisions, conventions, and current build status.

---

## What We're Building

**InPro.ai 2.0** — an AI agent platform for consultants.

Every consultant gets a personalized AI agent that:
- Chats with clients 24/7, answers questions, qualifies leads, books sessions
- Transcribes and summarizes live sessions, sends automated follow-ups
- Handles back-office automation: scheduling, proposals, cancellations, rescheduling

The core value proposition: **the AI runs the business, the consultant delivers the expertise.**

---

## The Three Pillars (Every Feature Maps to One)

| Pillar | What it does |
|--------|-------------|
| 🤖 Consultant AI Agent | Client-facing chat proxy, trained on consultant's knowledge, books sessions via tool calls |
| 🎙 Live Session Intel | Real-time transcription → AI summary → auto follow-up email after every session |
| ⚡ Back-Office Automation | Scheduling, payment flows, proposals, no-show re-booking, escalation handling |

If a feature doesn't serve one of these three pillars, defer it.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, RSC)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (UI) + TanStack Query (server state)
- **Real-time:** Supabase Realtime (websockets)
- **Chat widget:** Custom embeddable iframe at `/widget/[consultantId]`

### Backend
- **API:** tRPC (end-to-end type safety, no separate REST layer)
- **Database:** Supabase (Postgres)
- **ORM:** Drizzle ORM
- **Auth:** Supabase Auth (Google OAuth + magic link)
- **Storage:** Supabase Storage (session recordings, transcripts, assets)
- **Background jobs:** Inngest (durable async, retries built-in)

### AI / Agent Layer
- **LLM:** Anthropic Claude via Vercel AI SDK (`claude-sonnet-4-6`)
- **Agent framework:** Vercel AI SDK (streaming, tool calls, multi-step)
- **Vector DB:** pgvector extension on Supabase Postgres
- **Embeddings:** OpenAI `text-embedding-3-small`
- **Transcription:** AssemblyAI (real-time + async, speaker diarization)

### Payments & Scheduling
- **Payments:** Stripe Connect (marketplace payouts)
- **Scheduling:** Cal.com API + Cal Atoms (embeddable components)
- **Video:** Daily.co (sessions + automatic recording via webhook)
- **Email:** Resend + React Email (all transactional + automated emails)

### Infrastructure
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + PostHog (analytics, funnels, feature flags, session replay)

---

## Project Structure

```
inpro-ai/
├── CLAUDE.md                        ← you are here
├── .env.local                       ← secrets (never commit)
├── .env.example                     ← committed, no real values
│
├── src/
│   ├── app/                         ← Next.js App Router
│   │   ├── (auth)/                  ← login, signup, onboarding
│   │   ├── (consultant)/            ← consultant dashboard (authenticated)
│   │   │   ├── dashboard/
│   │   │   ├── agent/               ← agent setup, training, persona
│   │   │   ├── sessions/            ← schedule, past sessions, summaries
│   │   │   ├── inbox/               ← agent-handled + needs-review messages
│   │   │   ├── automations/         ← toggle automations, configure workflows
│   │   │   ├── clients/
│   │   │   └── earnings/
│   │   ├── (client)/                ← client-facing pages
│   │   │   └── [consultantSlug]/    ← public consultant profile
│   │   ├── widget/
│   │   │   └── [consultantId]/      ← embeddable chat widget (iframe)
│   │   └── api/
│   │       ├── trpc/[trpc]/         ← tRPC handler
│   │       ├── agent/chat/          ← streaming agent chat endpoint
│   │       ├── webhooks/
│   │       │   ├── stripe/
│   │       │   ├── daily/           ← session recording ready
│   │       │   └── assemblyai/      ← transcription complete
│   │       └── inngest/             ← Inngest function handler
│   │
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts            ← Drizzle schema (source of truth)
│   │   │   └── index.ts             ← db client
│   │   ├── trpc/
│   │   │   ├── router.ts            ← root router
│   │   │   └── routers/             ← one file per domain
│   │   ├── agent/
│   │   │   ├── system-prompt.ts     ← builds consultant system prompt
│   │   │   ├── tools.ts             ← agent tool definitions
│   │   │   └── rag.ts               ← vector search / context injection
│   │   └── inngest/
│   │       ├── client.ts
│   │       └── functions/           ← one file per background job
│   │
│   ├── components/
│   │   ├── ui/                      ← shadcn/ui primitives (never edit directly)
│   │   ├── consultant/              ← consultant dashboard components
│   │   ├── agent/                   ← agent chat components
│   │   └── shared/                  ← shared across roles
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            ← browser client
│   │   │   └── server.ts            ← server client (cookies)
│   │   ├── stripe.ts
│   │   ├── cal.ts                   ← Cal.com API wrapper
│   │   ├── daily.ts                 ← Daily.co API wrapper
│   │   ├── resend.ts
│   │   └── embeddings.ts            ← OpenAI embedding helper
│   │
│   └── types/
│       └── index.ts                 ← shared TypeScript types
│
├── emails/                          ← React Email templates
│   ├── session-summary.tsx
│   ├── booking-confirmation.tsx
│   └── follow-up.tsx
│
└── supabase/
    └── migrations/                  ← SQL migration files
```

---

## Database Schema (Drizzle — source of truth)

```typescript
// Core entities — expand as needed, never delete columns in MVP

users                // Supabase auth users (synced via trigger)
  id uuid PK
  email text
  full_name text
  avatar_url text
  role enum('consultant', 'client')
  created_at timestamp

consultants          // Consultant profile (1:1 with users where role=consultant)
  id uuid PK
  user_id uuid FK users
  slug text UNIQUE     -- used for public profile URL
  bio text
  headline text
  timezone text
  stripe_account_id text
  cal_username text
  is_published boolean

services             // What a consultant offers
  id uuid PK
  consultant_id uuid FK consultants
  name text            -- e.g. "Strategy Session", "Deep Dive"
  description text
  duration_minutes int
  price_cents int
  currency text DEFAULT 'usd'
  is_active boolean

agents               // The AI agent config per consultant
  id uuid PK
  consultant_id uuid FK consultants
  name text            -- e.g. "SarahAI"
  persona text         -- tone, style instructions
  greeting text        -- first message shown to clients
  is_active boolean
  escalation_threshold float  -- confidence below this = escalate to human

knowledge_chunks     -- RAG: consultant's knowledge base
  id uuid PK
  consultant_id uuid FK consultants
  content text
  source enum('manual', 'session_transcript', 'document')
  source_id uuid nullable
  embedding vector(1536)   -- pgvector
  created_at timestamp

sessions             // Booked consulting sessions
  id uuid PK
  consultant_id uuid FK consultants
  client_id uuid FK users
  service_id uuid FK services
  status enum('scheduled', 'live', 'completed', 'cancelled', 'no_show')
  scheduled_at timestamp
  duration_minutes int
  daily_room_url text
  daily_recording_id text
  stripe_payment_intent_id text
  amount_cents int
  created_at timestamp

transcripts          // Post-session transcript + AI analysis
  id uuid PK
  session_id uuid FK sessions UNIQUE
  assemblyai_id text
  raw_transcript text
  summary text
  action_items jsonb    -- array of {text, owner, due_date}
  open_questions jsonb  -- array of strings
  follow_up_sent_at timestamp
  indexed_at timestamp  -- when embedded into knowledge_chunks

conversations        // Agent chat conversations (client ↔ agent)
  id uuid PK
  consultant_id uuid FK consultants
  client_id uuid FK users nullable  -- null if anonymous
  client_email text nullable
  status enum('active', 'booked', 'escalated', 'closed')
  created_at timestamp

messages             // Individual messages in a conversation
  id uuid PK
  conversation_id uuid FK conversations
  role enum('user', 'assistant', 'system')
  content text
  tool_calls jsonb nullable
  created_at timestamp

automations          -- Per-consultant automation toggles
  id uuid PK
  consultant_id uuid FK consultants
  type enum('auto_confirm_booking', 'post_session_followup',
            'proposal_generator', 'no_show_rebooking')
  is_enabled boolean
  config jsonb         -- automation-specific settings
```

---

## Agent Architecture

The agent is **stateless per request**. All context is assembled at inference time:

```
Client message
    ↓
GET /api/agent/chat
    ↓
1. Load consultant profile + agent config from DB
2. Load recent conversation history (last 20 messages)
3. Vector search knowledge_chunks for relevant context (top 5)
4. Build system prompt (see below)
5. Stream response via Vercel AI SDK
6. If tool call → execute → continue
7. Save assistant message to messages table
    ↓
Streaming response to client
```

### System Prompt Structure

```
You are [agent.name], the AI assistant for [consultant.name], a [consultant.headline].

ABOUT [consultant.name]:
[consultant.bio]

YOUR PERSONA:
[agent.persona]

SERVICES OFFERED:
[formatted list of services with prices and durations]

RELEVANT KNOWLEDGE:
[top 5 RAG chunks from vector search]

CONVERSATION HISTORY:
[last 20 messages]

INSTRUCTIONS:
- You represent [consultant.name] professionally and accurately
- Only discuss topics within their expertise
- When asked to book → use the check_availability and create_booking tools
- If confidence is low or topic is sensitive → use escalate_to_consultant tool
- Never invent information not in the knowledge base
- Tone: [agent.persona tone instructions]
```

### Agent Tools

```typescript
check_availability(date?: string, duration_minutes?: number)
  → returns available slots from Cal.com API

create_booking(slot_id, client_name, client_email, service_id, notes?)
  → creates booking in Cal.com + sessions table + Stripe payment

escalate_to_consultant(reason, conversation_id)
  → marks conversation as escalated, sends consultant notification

send_proposal(client_email, service_ids, custom_message?)
  → drafts and sends proposal email via Resend

get_pricing_info()
  → returns services + prices for this consultant
```

---

## Post-Session Pipeline (Inngest)

Triggered by Daily.co webhook when recording is ready:

```
daily/recording.ready webhook
    ↓
Inngest: post-session-pipeline
    ├── Step 1: Download recording from Daily → upload to Supabase Storage
    ├── Step 2: Send audio to AssemblyAI → wait for transcript (async)
    ├── Step 3: Send transcript to Claude → get structured JSON:
    │          { summary, action_items[], open_questions[], next_steps[] }
    ├── Step 4: Save to transcripts table
    ├── Step 5: Embed transcript chunks → upsert to knowledge_chunks (pgvector)
    ├── Step 6: Send follow-up email to client via Resend (React Email template)
    └── Step 7: Notify consultant — summary ready in dashboard
```

Each step is independently retryable. If AssemblyAI fails, only Step 2 retries.

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# OpenAI (embeddings only)
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Cal.com
CAL_API_KEY=
CAL_WEBHOOK_SECRET=

# Daily.co
DAILY_API_KEY=
DAILY_WEBHOOK_HMAC_SECRET=

# AssemblyAI
ASSEMBLYAI_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@inpro.ai

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Coding Conventions

### General
- **TypeScript strict mode** always. No `any`. No `@ts-ignore` without a comment explaining why.
- **Zod** for all external input validation (API routes, form inputs, webhook payloads).
- **Server Components by default.** Only add `'use client'` when you need interactivity or browser APIs.
- **Error handling:** always use try/catch in server actions and API routes. Return typed error objects, never throw to the client.

### tRPC
- One router file per domain: `sessions.ts`, `agent.ts`, `consultants.ts`, etc.
- Use `protectedProcedure` for anything requiring auth. Use `publicProcedure` only for public-facing data.
- Input validation always via Zod schema on the procedure.

### Database
- **Never use raw SQL** except in migrations. Always use Drizzle query builder.
- **Never delete columns** from schema during MVP — add nullable columns instead.
- All timestamps in UTC. Convert to user timezone only in the UI.
- Use `returning()` after insert/update to avoid a second DB round-trip.

### Agent / AI
- System prompt is built in `src/server/agent/system-prompt.ts`. All prompt logic lives there.
- Tool definitions in `src/server/agent/tools.ts`. Each tool has a Zod schema for its parameters.
- RAG context injection in `src/server/agent/rag.ts`. Top-K = 5 unless there's a specific reason.
- **Log every agent interaction** to the messages table, including tool calls and results.

### Inngest
- One function per file in `src/server/inngest/functions/`.
- Always use `step.run()` for each logical unit — this enables per-step retries.
- Use `step.waitForEvent()` for async external calls (AssemblyAI webhook).
- Every function must have an `onFailure` handler that logs to Sentry.

### Components
- shadcn/ui components go in `src/components/ui/` — never edit these directly.
- Domain components go in `src/components/consultant/`, `src/components/agent/`, etc.
- Keep components small. If a component is > 150 lines, split it.

---

## MVP Scope — What's IN and OUT

### ✅ In scope (build this)
- Consultant signup + profile setup
- AI agent setup (name, persona, knowledge base)
- Client-facing chat widget (embeddable iframe)
- Agent tool calls: check availability, create booking, escalate
- Stripe Connect for consultant payouts
- Cal.com integration for scheduling
- Daily.co video sessions with auto-recording
- Post-session pipeline (transcribe → summarize → email → index)
- Consultant dashboard: sessions, summaries, inbox, automations, earnings
- Automation toggles: auto-confirm, post-session follow-up, proposal drafting, no-show re-booking
- PostHog analytics

### ❌ Deferred (do not build in MVP)
- Mobile app (iOS/Android)
- Voice agent / phone calls
- Consultant marketplace / public search/browse
- Group sessions / cohort coaching
- Custom no-code workflow builder
- Full CRM / pipeline management
- Multi-language UI
- AI video avatar

---

## Current Build Status

**Phase:** Not started — project setup pending

**Phase 1 tasks (start here):**
1. [ ] Init Next.js 14 with App Router, TypeScript strict, Tailwind
2. [ ] Install and configure: shadcn/ui, Drizzle, tRPC, Zustand, TanStack Query
3. [ ] Set up Supabase project + enable pgvector extension
4. [ ] Write Drizzle schema (all tables above) + run first migration
5. [ ] Configure Supabase Auth (Google OAuth + magic link)
6. [ ] Consultant onboarding flow (profile, services, pricing, availability)
7. [ ] Agent config UI (name, persona, knowledge base editor)
8. [ ] Claude agent chat endpoint (Vercel AI SDK, streaming)
9. [ ] RAG pipeline (embed knowledge → pgvector → inject into prompt)
10. [ ] Client chat widget (embeddable iframe)
11. [ ] Agent tools: check_availability + create_booking (Cal.com)
12. [ ] Stripe Connect onboarding + payment on booking

**Update this section at the end of every Claude Code session.**

---

## Key External Docs

- Vercel AI SDK (agents + streaming): https://sdk.vercel.ai/docs
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Supabase + pgvector: https://supabase.com/docs/guides/ai/vector-columns
- Cal.com API: https://cal.com/docs/api-reference
- Daily.co REST API: https://docs.daily.co/reference
- AssemblyAI streaming: https://www.assemblyai.com/docs
- Inngest: https://www.inngest.com/docs
- shadcn/ui: https://ui.shadcn.com/docs

---

## How to Work With Me (Claude Code Instructions)

- **Always check this file** before starting any session task
- **Update the Build Status checklist** above when completing tasks — check off done items, add new ones discovered
- **Ask before making architectural changes** that deviate from the stack above
- **Prefer editing existing files** over creating new ones when adding to a feature
- **Run `tsc --noEmit` and fix all type errors** before considering a task complete
- **Write the Drizzle migration** any time you change `schema.ts`
- When in doubt about scope: **if it's not in the "In scope" list, don't build it**
