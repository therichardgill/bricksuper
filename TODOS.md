# TODOS

## ~~P2: Unit tests for scoreQuiz() tier boundaries~~ DONE

Completed during eng review 2026-04-01. Tests rewritten in `tests/unit/quiz-scoring.test.ts` to match new 6-question set with 15 test cases covering all tier boundaries, edge cases, and structure validation. 59/59 passing.

## P3: Unit tests for generateFlags() and generateAdviserQuestions()

**What:** Unit tests for the results page helper functions in `src/components/tools/quiz/quiz-results.tsx`.

**Why:** These functions produce the traffic-light risk flags and adviser question lists that users see. Incorrect flags (wrong risk level for a given balance) would undermine the compliance positioning.

**Test cases needed:**
- Balance over-500k/300k-500k → green fund balance flag
- Balance 200k-300k → amber fund balance flag
- Balance under-100k/100k-200k → red fund balance flag
- Business owner → BRP-specific adviser questions included
- Low balance → cost-impact adviser question included
- All profiles → always includes liquidity, concentration, LRBA, SIS Reg 4.09 questions

**Effort:** S (human: ~1hr / CC: ~3min)
**Priority:** P3
**Depends on:** None
**Source:** Eng review, 2026-04-01

## P2: Field-level visibility masking per org type

**What:** Implement lead field masking in `convex/portal.ts` based on org type. Adviser/broker/accountant orgs see all lead fields. Developer orgs see inquiry-level data only (no `fundBalanceRange`, `hasExistingSmsf`, `hasExistingAdviser`, `isBusinessOwner`, `tier`, `qualificationStatus`, `utmSource`).

**Why:** Compliance requirement. Developer orgs must not see SMSF qualification data. A developer seeing `fundBalanceRange: "over-500k"` for a lead could influence how they market to that person. Field visibility contract designed during eng review, implementation ships in PR2 (portal UI).

**Test cases needed:**
- Developer org lead view excludes `fundBalanceRange`, `tier`, `qualificationStatus`, `hasExistingSmsf`, `hasExistingAdviser`, `isBusinessOwner`, `utmSource`
- Adviser org lead view includes all fields
- Broker/accountant org lead view includes all fields (they handle SMSF clients)

**Effort:** S (human: ~1hr / CC: ~5min)
**Priority:** P2
**Depends on:** PR1c (auth + organisations table)
**Source:** Eng review, 2026-04-02

## P3: Optimize N+1 query in listLeads org name enrichment

**What:** Replace per-lead `ctx.db.get(routedToOrgId)` in `convex/admin.ts` with batch dedup: collect unique org IDs, fetch once each, build a lookup map. Currently `admin.ts:75-84` fetches partner/org name individually per lead (up to 50 reads per query).

**Why:** Most leads route to the same few orgs. With 50 leads and 3 orgs, this does 50 reads instead of 3. Simple optimization that compounds as lead volume grows.

**Effort:** S (human: ~30min / CC: ~3min)
**Priority:** P3
**Depends on:** PR1c (migration to organisations table)
**Source:** Eng review, 2026-04-02

## P1: Resend email integration (replaces ActiveCampaign)

**What:** Add Resend for all email: partner lead notifications, lead confirmation/results emails, and nurture sequences. Replaces ActiveCampaign entirely.

**Why:** Simpler, cheaper at current volume (free tier: 3K emails/month), clean API that works naturally as a Convex action. No need for ActiveCampaign's heavyweight CRM/automation features pre-validation.

**Emails to build:**
1. **Partner lead notification** — sent via `routeToPartner` when a qualified lead is routed. Contains: lead name, email, phone, quiz tier, fund balance range, property interest, timestamp. This is the critical path for the Go-Live Sprint — partners need to receive leads.
2. **Lead confirmation** — sent to user after quiz submission. Contains: their quiz results summary, tier-appropriate educational links, disclaimer. If they opted in to specialist connection, confirm that a firm will be in touch.
3. **Nurture sequence** (post-launch) — 5-7 emails over 21 days for leads who captured email but didn't opt in to specialist connection. Educational content, not sales. Can use Resend's Broadcast/Audiences feature or schedule via Convex cron.

**Implementation:**
- `npm install resend`
- Convex env var: `RESEND_API_KEY`
- New Convex action: `convex/lib/email.ts` — shared send helper with audit trail logging
- Update `routeToPartner` in `convex/leads.ts` to send partner notification email
- New action: `sendLeadConfirmation` scheduled after `submitQuizLead`
- React Email templates (optional, can start with plain text/HTML)
- All emails must pass compliance check — no advice language

**Privacy note:** Resend is US-hosted. Already disclosed in privacy policy under overseas data recipients.

**Effort:** S (human: ~2 days / CC: ~30 min)
**Priority:** P1 — needed for Go-Live Sprint (partner notifications)
**Depends on:** Resend account created, API key generated
**Source:** Go-Live Sprint planning, 2026-04-04

## Post-Validation: Multi-Tenant Partner Portal

**What:** Clerk Organizations + `organisations` table + org-scoped CRM + partner portal. Full spec in `docs/specs/multi-tenant-architecture.md`.

**Why:** Enables partner firms to self-serve: view their routed leads, manage their team, add notes. Required for scaling beyond 1-2 partners. Currently leads route via email — portal replaces that with a proper dashboard.

**Before building, fix these spec bugs:**
1. Use `ConvexProviderWithAuth` from `convex/react`, not `ConvexProviderWithClerk` (doesn't exist)
2. Use `publicMetadata.is_system_admin` for admin check, not `org_id` claim (breaks on org switch)
3. Add `"aud": "convex"` to Clerk JWT template config (without it, `getUserIdentity()` silently returns null)
4. Define field-level visibility response shapes per org type in `portal.ts` spec (compliance-critical)

**Gate:** Only build after $500 Google Ads test validates unit economics AND at least one partner is paying CPL.
**Effort:** L (human: ~3 weeks / CC: ~2 days)
**Priority:** Post-validation
**Depends on:** Go-Live Sprint complete, partner revenue validated
**Source:** Office hours, 2026-04-03
