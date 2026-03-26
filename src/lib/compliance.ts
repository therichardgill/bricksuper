/**
 * BrickSuper Compliance Utilities
 *
 * Enforces ASIC factual-information safe harbour requirements.
 * Every piece of user-facing text — whether written by a human or AI agent —
 * must pass assertCompliantText() before publication.
 *
 * Legal basis:
 * - s766B Corporations Act 2001 (factual information safe harbour)
 * - s923A (restricted terms: "independent", "impartial", "unbiased")
 * - ASIC 26-029MR (pressure tactics, lead gen crackdown Feb 2026)
 * - Westpac v ASIC (2021 HCA 3) — disclaimers alone don't save you
 */

export interface BannedPhrase {
  phrase: string;
  reason: string;
  legalBasis: string;
}

export const BANNED_PHRASES: BannedPhrase[] = [
  {
    phrase: "independent",
    reason: "Legally restricted term for non-licensees",
    legalBasis: "s923A Corporations Act",
  },
  {
    phrase: "impartial",
    reason: "Legally restricted term for non-licensees",
    legalBasis: "s923A Corporations Act",
  },
  {
    phrase: "unbiased",
    reason: "Legally restricted term for non-licensees",
    legalBasis: "s923A Corporations Act",
  },
  {
    phrase: "you should",
    reason: "Crosses into financial advice territory",
    legalBasis: "s766B Corporations Act / RG 244",
  },
  {
    phrase: "we recommend",
    reason: "Crosses into financial advice territory",
    legalBasis: "s766B Corporations Act / RG 244",
  },
  {
    phrase: "your super is underperforming",
    reason: "ASIC red-flag pressure tactic",
    legalBasis: "ASIC 26-029MR",
  },
  {
    phrase: "free super health check",
    reason: "Named in ASIC enforcement actions",
    legalBasis: "ASIC 26-029MR",
  },
  {
    phrase: "high returns",
    reason: "Misleading in any investment context",
    legalBasis: "ASIC RG 234",
  },
  {
    phrase: "guaranteed",
    reason: "Misleading in any investment context",
    legalBasis: "ASIC RG 234",
  },
  {
    phrase: "risk-free",
    reason: "Misleading in any investment context",
    legalBasis: "ASIC RG 234",
  },
  {
    phrase: "our expert team",
    reason: "Implies in-house advice capacity we don't hold",
    legalBasis: "s766B Corporations Act",
  },
  {
    phrase: "turbocharge your super",
    reason: "Promotional — not how builders talk",
    legalBasis: "Brand voice guide / ASIC 26-029MR",
  },
  {
    phrase: "unlock your potential",
    reason: "Promotional — not how builders talk",
    legalBasis: "Brand voice guide / ASIC 26-029MR",
  },
  {
    phrase: "get started on your journey",
    reason: "Sales language banned under ASIC 26-029MR framing",
    legalBasis: "ASIC 26-029MR",
  },
  {
    phrase: "act now",
    reason: "Urgency tactic — ASIC red-flag",
    legalBasis: "ASIC 26-029MR",
  },
  {
    phrase: "don't wait",
    reason: "Urgency tactic — ASIC red-flag",
    legalBasis: "ASIC 26-029MR",
  },
];

export interface ComplianceViolation {
  phrase: string;
  reason: string;
  legalBasis: string;
  position: number;
}

/**
 * Check text for banned compliance phrases.
 * Returns an array of violations found. Empty array = compliant.
 */
export function checkCompliance(text: string): ComplianceViolation[] {
  const lower = text.toLowerCase();
  const violations: ComplianceViolation[] = [];

  for (const banned of BANNED_PHRASES) {
    const idx = lower.indexOf(banned.phrase.toLowerCase());
    if (idx !== -1) {
      violations.push({
        phrase: banned.phrase,
        reason: banned.reason,
        legalBasis: banned.legalBasis,
        position: idx,
      });
    }
  }

  return violations;
}

/**
 * Assert text is compliant. Throws if violations found.
 * Use at write boundaries — Convex mutations, CRM notes, content commits.
 */
export function assertCompliantText(text: string): void {
  const violations = checkCompliance(text);
  if (violations.length > 0) {
    const details = violations
      .map((v) => `"${v.phrase}" — ${v.reason} (${v.legalBasis})`)
      .join("; ");
    throw new Error(`Compliance violation: ${details}`);
  }
}

/**
 * Check if text is compliant. Returns true if no violations.
 */
export function isCompliant(text: string): boolean {
  return checkCompliance(text).length === 0;
}
