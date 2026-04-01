# Changelog

All notable changes to BrickSuper will be documented in this file.

## [0.2.0.0] - 2026-04-01

You can now measure which ads generate leads. GTM fires conversion events at every quiz step, Meta CAPI sends server-side data immune to ad blockers, and UTM params are captured automatically so you know which campaign produced each lead.

### Added

- GTM container via `@next/third-parties/google` with CookieYes Consent Mode v2 integration. Tags only fire after user grants consent.
- dataLayer events at each quiz funnel step: `quiz_start`, `quiz_complete`, `email_capture`, `specialist_request`, `calculator_use`.
- Meta Conversions API (CAPI) via Convex action. Server-side event fires for all leads with SHA-256 hashed PII, 3x retry with exponential backoff, and audit trail.
- Pixel/CAPI deduplication via shared `event_id` (UUID) generated client-side and passed to both browser pixel and server CAPI.
- Custom GA4 dimensions: `quiz_tier` and `fund_balance_range` on conversion events for segmentation.
- Enhanced Conversions: hashed email passed to Google Ads for ~10-15% better attribution matching.
- UTM auto-capture hook (`useUTMCapture`): reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from URL, stores in sessionStorage (first-touch attribution), and passes to lead mutation.
- Debug mode: add `?gtm_debug=1` to any URL to log all dataLayer pushes to console.
- Tier-based conversion values ($0/$150/$300 per tier) for Google Ads ROAS bidding.
- Shared lead tier constants (`convex/lib/leadTiers.ts`): single source of truth for valid balance ranges and conversion values.
- 16 new unit tests: analytics event helpers (12) and UTM capture hook (4).

### Changed

- `qualification.ts` and `convex/leads.ts` now import balance ranges from shared `convex/lib/leadTiers.ts` instead of inline arrays.
- Leads schema extended with `utmTerm` and `eventId` fields.
- Lead form now captures UTM parameters and generates event IDs for conversion tracking.

## [0.1.0.0] - 2026-04-01

Public site now loads without Clerk auth interference. Quiz simplified to 6 questions with hard tier gates. Error handling visible to users on the lead capture form.

### Changed

- Migrated Clerk middleware to proxy scoped to `/admin` routes only, fixing public page crashes on Next.js 16.
- Simplified quiz from 7 to 6 questions: dropped SMSF status, property type, adviser, and compliance comfort questions; added household income, property ownership, and primary goal.
- Rewrote quiz scoring with hard tier gates: under $100K always tier1, $300K+ or high-income business owners always tier3, everything else tier2.
- Updated LRBA safe harbour rate from 8.85% to 8.95% in quiz results.

### Added

- Toast notification on lead form submission failure (sonner library) so users know when something goes wrong.
- DESIGN.md with full design system: typography, colours, components, spacing, accessibility patterns.
- Skill routing rules in CLAUDE.md for automated workflow invocation.
- TODOS.md for tracking deferred work.

### Fixed

- Rewrote quiz-scoring tests to match new question set (was using old answer keys, 6 tests failing). Now 15 tests covering all tier boundaries and edge cases.
