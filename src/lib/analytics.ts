/**
 * Analytics event helpers — typed wrappers around dataLayer.push().
 *
 * All functions are safe to call during SSR (no-op) and with ad blockers (no-op).
 * Debug mode: add ?gtm_debug=1 to any URL to log events to console.
 *
 *   Component ──► trackXxx() ──► SSR guard ──► dataLayer guard ──► dataLayer.push()
 *                                                                       │
 *                                                               GTM picks up event
 *                                                               (if consent granted)
 */

import type { QuizTier } from "@/lib/quiz-data";
import { TIER_CONVERSION_VALUES } from "../../convex/lib/leadTiers";

// dataLayer type is already declared by @next/third-parties

function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("gtm_debug");
}

function pushEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dl = (window as any).dataLayer as unknown[] | undefined;
  if (!dl) return;

  const payload = { event, ...data };
  dl.push(payload);

  if (isDebugMode()) {
    console.log("[GTM Debug]", event, payload);
  }
}

// ── Quiz funnel events ──────────────────────────────────

export function trackQuizStart(): void {
  pushEvent("quiz_start");
}

export function trackQuizComplete(tier: QuizTier, balanceRange?: string): void {
  pushEvent("quiz_complete", {
    quiz_tier: tier,
    fund_balance_range: balanceRange,
  });
}

export function trackEmailCapture(
  tier: QuizTier,
  balanceRange?: string,
  hashedEmail?: string,
  eventId?: string,
): void {
  pushEvent("email_capture", {
    quiz_tier: tier,
    fund_balance_range: balanceRange,
    event_id: eventId,
    // Enhanced Conversions: GTM reads this for Google Ads matching
    ...(hashedEmail
      ? { enhanced_conversion_data: { email: hashedEmail } }
      : {}),
  });
}

export function trackSpecialistRequest(
  tier: QuizTier,
  balanceRange?: string,
  eventId?: string,
): void {
  const value = TIER_CONVERSION_VALUES[tier];
  pushEvent("specialist_request", {
    quiz_tier: tier,
    fund_balance_range: balanceRange,
    conversion_value: value,
    conversion_currency: "AUD",
    event_id: eventId,
  });
}

// ── Tool events ─────────────────────────────────────────

export function trackCalculatorUse(
  calculator: "lrba" | "risk-profiler" | "diversification",
): void {
  pushEvent("calculator_use", { calculator_name: calculator });
}

// ── Utility ─────────────────────────────────────────────

export function generateEventId(): string {
  return crypto.randomUUID();
}
