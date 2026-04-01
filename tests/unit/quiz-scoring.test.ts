import { describe, it, expect } from "vitest";
import { scoreQuiz, QUIZ_QUESTIONS } from "@/lib/quiz-data";

describe("scoreQuiz", () => {
  // Tier 1: Hard gate — balance under $100K
  it("returns tier1 when balance is under $100K", () => {
    const result = scoreQuiz({
      "super-balance": "under-100k",
      "employment-status": "payg",
      "household-income": "under-80k",
      "owns-property": "no",
      "primary-goal": "build-security",
      timeline: "exploring",
    });
    expect(result.tier).toBe("tier1");
  });

  it("returns tier1 for under-100k even with high income and business owner", () => {
    const result = scoreQuiz({
      "super-balance": "under-100k",
      "employment-status": "business-owner",
      "household-income": "over-150k",
      "owns-property": "yes",
      "primary-goal": "passive-income",
      timeline: "asap",
    });
    expect(result.tier).toBe("tier1");
  });

  // Tier 3: High balance gates
  it("returns tier3 for balance $300K-$500K", () => {
    const result = scoreQuiz({
      "super-balance": "300k-500k",
      "employment-status": "payg",
      "household-income": "under-80k",
      "owns-property": "no",
      "primary-goal": "build-security",
      timeline: "exploring",
    });
    expect(result.tier).toBe("tier3");
  });

  it("returns tier3 for balance over $500K", () => {
    const result = scoreQuiz({
      "super-balance": "over-500k",
      "employment-status": "payg",
      "household-income": "80k-150k",
      "owns-property": "yes",
      "primary-goal": "retirement-planning",
      timeline: "3-6-months",
    });
    expect(result.tier).toBe("tier3");
  });

  // Tier 3: Business owner + high income gate
  it("returns tier3 for business owner with $150K+ income (even low balance)", () => {
    const result = scoreQuiz({
      "super-balance": "100k-200k",
      "employment-status": "business-owner",
      "household-income": "over-150k",
      "owns-property": "yes",
      "primary-goal": "passive-income",
      timeline: "asap",
    });
    expect(result.tier).toBe("tier3");
  });

  it("does NOT return tier3 for business owner with low income", () => {
    const result = scoreQuiz({
      "super-balance": "200k-300k",
      "employment-status": "business-owner",
      "household-income": "under-80k",
      "owns-property": "no",
      "primary-goal": "build-security",
      timeline: "exploring",
    });
    expect(result.tier).toBe("tier2");
  });

  // Tier 2: Everything else
  it("returns tier2 for $100K-$200K balance, PAYG, low income", () => {
    const result = scoreQuiz({
      "super-balance": "100k-200k",
      "employment-status": "payg",
      "household-income": "under-80k",
      "owns-property": "no",
      "primary-goal": "build-security",
      timeline: "exploring",
    });
    expect(result.tier).toBe("tier2");
  });

  it("returns tier2 for $200K-$300K balance with moderate profile", () => {
    const result = scoreQuiz({
      "super-balance": "200k-300k",
      "employment-status": "self-employed",
      "household-income": "80k-150k",
      "owns-property": "yes",
      "primary-goal": "retirement-planning",
      timeline: "3-6-months",
    });
    expect(result.tier).toBe("tier2");
  });

  // Score calculation
  it("calculates totalScore and maxScore correctly", () => {
    const result = scoreQuiz({
      "super-balance": "over-500k",
      "employment-status": "business-owner",
      "household-income": "over-150k",
      "owns-property": "yes",
      "primary-goal": "passive-income",
      timeline: "asap",
    });
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.maxScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(result.maxScore);
  });

  it("returns maxScore as sum of highest option scores", () => {
    const expectedMax = QUIZ_QUESTIONS.reduce((max, q) => {
      return max + Math.max(...q.options.map((o) => o.score));
    }, 0);
    const result = scoreQuiz({});
    expect(result.maxScore).toBe(expectedMax);
  });

  // Edge cases
  it("handles missing answers gracefully (score 0, tier2)", () => {
    const result = scoreQuiz({});
    expect(result.totalScore).toBe(0);
    // No balance answer means balanceUnder100k is false, highBalance is false,
    // highIncomeBizOwner is false → falls through to tier2
    expect(result.tier).toBe("tier2");
  });

  it("handles partial answers", () => {
    const result = scoreQuiz({
      "super-balance": "over-500k",
    });
    expect(result.tier).toBe("tier3");
    // Score should only include the balance question's score
    expect(result.totalScore).toBe(4);
  });

  // Question structure validation
  it("has 6 questions defined", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(6);
  });

  it("every question has at least 2 options", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every question has a unique id", () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every option has a numeric score", () => {
    for (const q of QUIZ_QUESTIONS) {
      for (const o of q.options) {
        expect(typeof o.score).toBe("number");
      }
    }
  });
});
