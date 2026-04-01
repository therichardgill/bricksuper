/**
 * Shared lead tier constants — single source of truth.
 *
 * Used by: convex/leads.ts (qualification), src/lib/qualification.ts,
 * src/lib/analytics.ts (conversion values).
 *
 * If balance ranges change (e.g., quiz options updated), update HERE only.
 */

export const VALID_BALANCE_RANGES = [
  "200k-300k",
  "300k-500k",
  "over-500k",
] as const;

export type BalanceRange = (typeof VALID_BALANCE_RANGES)[number];

export type QuizTier = "tier1" | "tier2" | "tier3";

/**
 * Estimated partner referral fee per tier (AUD).
 * Used for Google Ads ROAS-based bidding.
 * Adjust as CPL pricing is validated with advisory firms.
 */
export const TIER_CONVERSION_VALUES: Record<QuizTier, number> = {
  tier1: 0, // Not billable — nurture only
  tier2: 150,
  tier3: 300,
};
