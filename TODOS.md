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
