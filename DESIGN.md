# BrickSuper Design System

Source of truth for all UI decisions. Extracted from brand guidelines v1.0 and voice guide v1.1.

## Brand Voice — "Brick by Brick"

Four pillars: **Plain-spoken** (kitchen table test), **Balanced** (every benefit paired with risk), **Grounded** (cite ATO, reference legislation, use real numbers), **Respectful** (trust the reader as a capable adult).

Metaphor: Building/construction language used naturally. "Laying foundations," "mortaring in decisions," "testing whether the structure holds," "bringing in the right tradesperson."

See `docs/bricksuper-brand-voice-v1.1.html` for full guide.

## Typography

| Role | Font | Weight | Size / Line Height |
|------|------|--------|--------------------|
| Display | DM Serif Display | 400 | 38px / 1.1 |
| H2 | DM Serif Display | 400 | 26px / 1.2 |
| H3 | DM Sans | 600 | 18px / 1.3 |
| Body | DM Sans | 400 | 15px / 1.75 |
| Small | DM Sans | 400 | 12px / 1.65 |
| Caption | DM Sans | 500 | 11px / 1.4 |

CSS variables: `--font-sans` (DM Sans), `--font-serif` (DM Serif Display).

## Colour Palette

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `--bs-orange` | `#E8611A` | Primary buttons, links, focus rings, selected states |
| `--bs-orange-dark` | `#C44E10` | Hover state for primary |
| `--bs-orange-pale` | `#FDF0E8` | Selected option backgrounds, accent surfaces |
| `--bs-orange-mid` | `#FAD5BC` | Progress indicators, subtle highlights |

### Neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `--bs-charcoal` | `#1C1C1E` | Primary text, headings, hero backgrounds |
| `--bs-slate` | `#3D3D4A` | Body text, descriptions |
| `--bs-mid` | `#6B6B7A` | Secondary text, labels |
| `--bs-muted` | `#9B9BAA` | Placeholder text, captions, metadata |
| `--bs-border` | `#E2E1EC` | Borders, dividers, inactive toggle |
| `--bs-bg` | `#FAFAF8` | Page background |

### Semantic (Traffic-Light System)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bs-green` / `--bs-green-pale` | `#1A7A4A` / `#E8F5EE` | Low risk, success states |
| `--bs-amber` / `--bs-amber-pale` | `#C4780E` / `#FDF3E0` | Moderate risk, warnings, disclaimers |
| `--bs-red` / `--bs-red-pale` | `#B03020` / `#FCEEEB` | High risk, errors |

Traffic-light flags use factual regulatory thresholds only. Green = within ATO benchmarks, Amber = approaching flagged thresholds, Red = exceeds thresholds the ATO has acted on. Each flag cites its regulatory source.

## Components

### Buttons
- **Primary:** Orange bg (`--bs-orange`), white text, 8px radius, 14px DM Sans
- **Secondary:** Charcoal border, transparent bg
- **Ghost:** Orange border, transparent bg
- All buttons: `rounded-lg`, `focus-visible:ring-2 ring-bs-orange ring-offset-2`

### Form Inputs
- Border: `--bs-border`, `rounded-lg`, `px-4 py-3`
- Focus: `ring-2 ring-bs-orange`, border transparent
- Error: `text-bs-red` below field, `text-xs`

### Tags / Badges
- 20px radius pills
- Variants: orange, green, amber, red (using semantic palette)

### Disclaimer Component
- Amber pale background (`--bs-amber-pale`), amber border
- Icon + text layout
- Three variants: `site` (footer), `tool` (above interactive elements), `form` (before submit)

### Traffic Light
- Rounded-lg card with semantic background
- Colored dot (2.5 size) + flag name + risk label badge + description + source citation
- Uses `role="alert"` for accessibility

### Content Cards
- 12px radius (`rounded-xl`), 1px border, white bg

### Custom Radio Buttons (Quiz)
- Full-width, left-aligned, `rounded-xl`, `px-5 py-4`, min-h 56px
- Radio circle: 5 size, 2px border, orange dot when selected
- Selected: orange border, pale orange bg
- Hover: 30% opacity orange border, 20% opacity pale bg
- `role="radio"`, `aria-checked`, `focus-visible:ring-2`

## Spacing Scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px (aligns with Tailwind defaults: 1 / 2 / 3 / 4 / 6 / 8 / 12 / 16).

## Layout

- Max content width: `max-w-lg` (32rem / 512px) for quiz/tool screens
- Page structure: `min-h-full flex flex-col`
- Centering: `mx-auto`

## Accessibility

- All interactive elements have `focus-visible:ring-2 ring-bs-orange ring-offset-2`
- Radio groups use `role="radiogroup"` + `aria-labelledby`
- Progress bar uses `role="progressbar"` + `aria-valuenow/min/max`
- Traffic lights use `role="alert"` + `aria-label`
- Form labels linked via `htmlFor`
- Touch targets: 56px min on quiz options, 44px+ on buttons

## Compliance UI Patterns

- Every tool page has a `<Disclaimer variant="tool" />` above the interactive area
- Lead capture forms have `<Disclaimer variant="form" />` before the submit button
- Every page has site-wide footer disclaimer
- Tool outputs use "Based on general industry benchmarks" framing
- Questions phrased as "Questions to ask a licensed adviser," never recommendations
- Banned words enforced by `assertCompliantText()` at write boundaries
