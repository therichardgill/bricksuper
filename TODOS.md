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
