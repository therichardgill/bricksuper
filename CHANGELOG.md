# Changelog

All notable changes to BrickSuper will be documented in this file.

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
