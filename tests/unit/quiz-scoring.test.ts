import { describe, it, expect } from "vitest";
import { scoreQuiz, QUIZ_QUESTIONS } from "@/lib/quiz-data";

describe("scoreQuiz", () => {
  it("returns tier1 for under-$200K, no SMSF, no adviser", () => {
    const result = scoreQuiz({
      "has-smsf": "researching",
      balance: "under-200k",
      "business-owner": "no",
      "property-type": "not-sure",
      timeline: "exploring",
      "has-adviser": "no",
      "compliance-comfort": "not-sure",
    });
    expect(result.tier).toBe("tier1");
  });

  it("returns tier3 for high balance ($500K+)", () => {
    const result = scoreQuiz({
      "has-smsf": "yes",
      balance: "500k-1m",
      "business-owner": "no",
      "property-type": "commercial",
      timeline: "3-months",
      "has-adviser": "yes",
      "compliance-comfort": "very",
    });
    expect(result.tier).toBe("tier3");
  });

  it("returns tier3 for $1M+ balance", () => {
    const result = scoreQuiz({
      "has-smsf": "yes",
      balance: "over-1m",
      "business-owner": "no",
      "property-type": "residential",
      timeline: "3-12-months",
      "has-adviser": "yes",
      "compliance-comfort": "somewhat",
    });
    expect(result.tier).toBe("tier3");
  });

  it("returns tier3 for business owner considering BRP", () => {
    const result = scoreQuiz({
      "has-smsf": "considering",
      balance: "200-500k",
      "business-owner": "yes",
      "property-type": "business-premises",
      timeline: "3-12-months",
      "has-adviser": "no",
      "compliance-comfort": "somewhat",
    });
    expect(result.tier).toBe("tier3");
  });

  it("returns tier2 for mid-range scenario", () => {
    const result = scoreQuiz({
      "has-smsf": "considering",
      balance: "200-500k",
      "business-owner": "no",
      "property-type": "commercial",
      timeline: "3-12-months",
      "has-adviser": "yes",
      "compliance-comfort": "somewhat",
    });
    expect(result.tier).toBe("tier2");
  });

  it("calculates totalScore and maxScore", () => {
    const result = scoreQuiz({
      "has-smsf": "yes",
      balance: "over-1m",
      "business-owner": "yes",
      "property-type": "business-premises",
      timeline: "3-months",
      "has-adviser": "yes",
      "compliance-comfort": "very",
    });
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.maxScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(result.maxScore);
  });

  it("handles missing answers gracefully", () => {
    const result = scoreQuiz({});
    expect(result.totalScore).toBe(0);
    // With no answers, no hard triggers fire, defaults to tier2
    expect(result.tier).toBe("tier2");
  });

  it("has 7 questions defined", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(7);
  });

  it("every question has at least 2 options", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });
});
