/**
 * Lead Qualification Engine
 *
 * 6 criteria determine whether a lead is "qualified" (billable at CPL).
 * Unqualified leads go to email nurture only — not billed.
 */

import { VALID_BALANCE_RANGES } from "../../convex/lib/leadTiers";

export interface QualificationInput {
  hasExistingSmsf: boolean | undefined;
  fundBalanceRange: string | undefined;
  wantsSpecialistConnection: boolean;
  timeline: string | undefined;
  email: string;
  firstName: string;
  // Geography check happens at routing time, not qualification
}

export interface QualificationResult {
  isQualified: boolean;
  passedCriteria: string[];
  failedCriteria: string[];
}

export function qualifyLead(input: QualificationInput): QualificationResult {
  const passed: string[] = [];
  const failed: string[] = [];

  // 1. Has existing SMSF OR intends to establish one
  if (input.hasExistingSmsf === true || input.hasExistingSmsf === undefined) {
    // undefined means "considering" — passes
    passed.push("Has or intends to establish SMSF");
  } else {
    failed.push("No SMSF and not considering");
  }

  // 2. Super balance ≥$200K
  if (
    input.fundBalanceRange &&
    (VALID_BALANCE_RANGES as readonly string[]).includes(input.fundBalanceRange)
  ) {
    passed.push("Fund balance ≥$200K");
  } else {
    failed.push("Fund balance below $200K threshold");
  }

  // 3. Expressed interest in property investment
  // If they completed the quiz, this is implicitly true
  passed.push("Expressed interest in SMSF property investment");

  // 4. Opted in to specialist connection
  if (input.wantsSpecialistConnection) {
    passed.push("Opted in to specialist connection");
  } else {
    failed.push("Did not opt in to specialist connection");
  }

  // 5. Provided valid email + first name
  const hasValidEmail =
    input.email.length > 0 && input.email.includes("@");
  const hasFirstName = input.firstName.trim().length > 0;
  if (hasValidEmail && hasFirstName) {
    passed.push("Provided valid contact details");
  } else {
    failed.push("Missing valid email or first name");
  }

  // 6. Timeline is not "just exploring" (soft criterion)
  if (input.timeline && input.timeline !== "exploring") {
    passed.push("Active purchase timeline");
  } else {
    // This is a soft fail — doesn't disqualify on its own
    passed.push("Exploring timeline (soft pass)");
  }

  // Qualified if: specialist connection + valid contact + balance ≥$200K
  // These are the hard gates. Others are supplementary.
  const isQualified =
    input.wantsSpecialistConnection &&
    hasValidEmail &&
    hasFirstName &&
    input.fundBalanceRange !== undefined &&
    (VALID_BALANCE_RANGES as readonly string[]).includes(input.fundBalanceRange);

  return { isQualified, passedCriteria: passed, failedCriteria: failed };
}
