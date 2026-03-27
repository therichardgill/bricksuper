@AGENTS.md

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Project Overview

BrickSuper.com.au is a compliance-first SMSF property lead generation platform for the Australian market. It operates within ASIC's factual-information safe harbour (s766B Corporations Act 2001) — **we do not hold an AFSL and do not provide financial advice.**

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Backend/DB:** Convex (US-hosted, disclosed in privacy policy)
- **UI:** Radix UI (shadcn/ui) + Tailwind CSS v4
- **Auth:** Clerk (admin CRM only — public site is unauthenticated)
- **Forms:** React Hook Form + Zod v4
- **Charts:** Recharts
- **Email:** Resend (transactional), ActiveCampaign (nurture)
- **Tracking:** GTM + GA4 + CookieYes (Consent Mode v2)
- **AI Interface:** MCP Server (@modelcontextprotocol/sdk) + CLI
- **Tests:** Vitest
- **Deploy:** Vercel

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run all tests (Vitest)
npm run lint         # ESLint
npm run lint:compliance  # Scan content for banned phrases (CI gate)
npx convex dev       # Start Convex dev server (generates types)
npx tsx mcp/server.ts    # Start MCP server (stdio)
npx tsx cli/index.ts     # CLI — run with no args for help
```

## Compliance Rules (CRITICAL)

**Every piece of content — whether written by a human or AI — must follow these rules.**

### Never use these phrases:
- "independent", "impartial", "unbiased" (s923A restricted)
- "you should", "we recommend" (crosses into financial advice)
- "your super is underperforming" (ASIC red-flag)
- "free super health check" (ASIC enforcement target)
- "high returns", "guaranteed", "risk-free" (misleading)
- "our expert team" (implies in-house advice capacity)
- "turbocharge your super", "unlock your potential" (promotional)
- "get started on your journey" (sales language)
- "act now", "don't wait" (urgency tactics)

### Always:
- Pair every benefit with its corresponding risk
- Cite regulatory sources (ATO, ASIC, SIS Act section numbers)
- Use `assertCompliantText()` from `lib/compliance.ts` at write boundaries
- Include the appropriate disclaimer variant (site/tool/form) on every page

### Write boundary enforcement:
All mutations that create/modify user-facing text pass through compliance check. This applies to CRM notes (addLeadNote), content, and agent-generated text. See `lib/compliance.ts`.

## Architecture

```
PUBLIC SITE (unauthenticated)    ADMIN CRM (/admin, Clerk)    AI AGENTS
┌──────────────────────┐        ┌──────────────────────┐     ┌──────────┐
│ Landing / Hubs / Tools│        │ Lead Pipeline        │     │ MCP      │
└──────────┬───────────┘        │ Partner Management   │     │ CLI      │
           │                    │ Audit Trail          │     │ Triggers │
           ▼                    └──────────┬───────────┘     └────┬─────┘
    ┌──────────────────────────────────────┴───────────────────────┘
    │                    lib/operations.ts
    │              (single source of truth)
    └──────────────────────┬──────────────────────────────────────
                           ▼
                    Convex Backend (9 tables)
```

## MCP Server

Config in `.mcp.json`. Tools: leads:list/get/status/note, partners:list/get/create/test-webhook/health-check, content:check-compliance/suggest-updates, monitor:dashboard/webhook-failures, audit:trail/compliance-report.

## Brand Voice

"Brick by brick" — plain-spoken, balanced, grounded, respectful. See `docs/bricksuper-brand-voice-v1.1.html` for full guide. See `docs/bricksuper-brand-guidelines.html` for design system.

## Testing

Run `npm test` before committing. Coverage targets: 100% on `lib/compliance.ts`, 90%+ on other lib/ modules.

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.
