import { describe, it, expect } from "vitest";
import { qualifyLead, type QualificationInput } from "@/lib/qualification";

describe("qualifyLead", () => {
  const qualifiedInput: QualificationInput = {
    hasExistingSmsf: true,
    fundBalanceRange: "500k-1m",
    wantsSpecialistConnection: true,
    timeline: "3-months",
    email: "sarah@example.com.au",
    firstName: "Sarah",
  };

  it("qualifies a lead meeting all criteria", () => {
    const result = qualifyLead(qualifiedInput);
    expect(result.isQualified).toBe(true);
    expect(result.failedCriteria).toHaveLength(0);
  });

  it("disqualifies when specialist connection not opted in", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      wantsSpecialistConnection: false,
    });
    expect(result.isQualified).toBe(false);
    expect(result.failedCriteria).toContain(
      "Did not opt in to specialist connection"
    );
  });

  it("disqualifies when balance below $200K", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      fundBalanceRange: "under-200k",
    });
    expect(result.isQualified).toBe(false);
    expect(result.failedCriteria).toContain(
      "Fund balance below $200K threshold"
    );
  });

  it("qualifies at $200K-$500K boundary", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      fundBalanceRange: "200-500k",
    });
    expect(result.isQualified).toBe(true);
  });

  it("qualifies with $1M+ balance", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      fundBalanceRange: "over-1m",
    });
    expect(result.isQualified).toBe(true);
  });

  it("disqualifies with missing email", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      email: "",
    });
    expect(result.isQualified).toBe(false);
  });

  it("disqualifies with invalid email (no @)", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      email: "notanemail",
    });
    expect(result.isQualified).toBe(false);
  });

  it("disqualifies with empty first name", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      firstName: "   ",
    });
    expect(result.isQualified).toBe(false);
  });

  it("soft-passes exploring timeline", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      timeline: "exploring",
    });
    // Timeline is a soft criterion — doesn't disqualify on its own
    expect(result.isQualified).toBe(true);
    expect(result.passedCriteria).toContain("Exploring timeline (soft pass)");
  });

  it("passes with undefined hasExistingSmsf (considering)", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      hasExistingSmsf: undefined,
    });
    expect(result.isQualified).toBe(true);
    expect(result.passedCriteria).toContain(
      "Has or intends to establish SMSF"
    );
  });

  it("handles undefined fundBalanceRange", () => {
    const result = qualifyLead({
      ...qualifiedInput,
      fundBalanceRange: undefined,
    });
    expect(result.isQualified).toBe(false);
  });
});
