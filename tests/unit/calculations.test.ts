import { describe, it, expect } from "vitest";
import {
  calculateLbraRepayments,
  generateStressTest,
  calculateConcentration,
} from "@/lib/calculations";

describe("calculateLbraRepayments", () => {
  const baseInputs = {
    purchasePrice: 650000,
    deposit: 130000,
    interestRate: 6.5,
    loanTermYears: 25,
    interestOnlyYears: 5,
    estimatedRent: 3200,
    vacancyRatePercent: 5,
  };

  it("calculates loan amount correctly", () => {
    const result = calculateLbraRepayments(baseInputs);
    expect(result.loanAmount).toBe(520000);
  });

  it("calculates LVR correctly", () => {
    const result = calculateLbraRepayments(baseInputs);
    expect(result.lvr).toBeCloseTo(80, 0);
  });

  it("calculates monthly IO payment", () => {
    const result = calculateLbraRepayments(baseInputs);
    // $520K * 6.5% / 12 ≈ $2,817
    expect(result.monthlyIO).toBeGreaterThan(2700);
    expect(result.monthlyIO).toBeLessThan(2900);
  });

  it("calculates monthly P&I payment (higher than IO)", () => {
    const result = calculateLbraRepayments(baseInputs);
    expect(result.monthlyPI).toBeGreaterThan(result.monthlyIO);
  });

  it("calculates effective rent after vacancy", () => {
    const result = calculateLbraRepayments(baseInputs);
    // $3200 * (1 - 0.05) = $3040
    expect(result.effectiveMonthlyRent).toBe(3040);
  });

  it("calculates rent-vs-repayment gap", () => {
    const result = calculateLbraRepayments(baseInputs);
    expect(result.monthlyGapIO).toBe(result.monthlyIO - result.effectiveMonthlyRent);
  });

  it("handles zero deposit", () => {
    const result = calculateLbraRepayments({ ...baseInputs, deposit: 0 });
    expect(result.loanAmount).toBe(650000);
    expect(result.lvr).toBe(100);
  });

  it("handles zero vacancy rate", () => {
    const result = calculateLbraRepayments({
      ...baseInputs,
      vacancyRatePercent: 0,
    });
    expect(result.effectiveMonthlyRent).toBe(3200);
  });

  it("handles rent exceeding repayment (negative gap)", () => {
    const result = calculateLbraRepayments({
      ...baseInputs,
      estimatedRent: 5000,
    });
    expect(result.monthlyGapIO).toBeLessThan(0);
  });

  it("handles zero interest-only period", () => {
    const result = calculateLbraRepayments({
      ...baseInputs,
      interestOnlyYears: 0,
    });
    // P&I for full term
    expect(result.monthlyPI).toBeGreaterThan(0);
  });
});

describe("generateStressTest", () => {
  const baseInputs = {
    purchasePrice: 650000,
    deposit: 130000,
    interestRate: 6.5,
    loanTermYears: 25,
    interestOnlyYears: 5,
    estimatedRent: 3200,
    vacancyRatePercent: 5,
  };

  it("returns rows for default increments (0, 1, 2, 3)", () => {
    const rows = generateStressTest(baseInputs);
    expect(rows).toHaveLength(4);
    expect(rows[0].rateIncrease).toBe(0);
    expect(rows[1].rateIncrease).toBe(1);
    expect(rows[2].rateIncrease).toBe(2);
    expect(rows[3].rateIncrease).toBe(3);
  });

  it("base row matches direct calculation", () => {
    const rows = generateStressTest(baseInputs);
    const direct = calculateLbraRepayments(baseInputs);
    expect(rows[0].monthlyIO).toBe(direct.monthlyIO);
  });

  it("each row has higher repayments than the last", () => {
    const rows = generateStressTest(baseInputs);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].monthlyIO).toBeGreaterThan(rows[i - 1].monthlyIO);
    }
  });

  it("correctly applies rate increase", () => {
    const rows = generateStressTest(baseInputs);
    expect(rows[1].newRate).toBe(7.5);
    expect(rows[2].newRate).toBe(8.5);
  });
});

describe("calculateConcentration", () => {
  it("calculates pre and post purchase totals", () => {
    const result = calculateConcentration(
      [
        { label: "Shares", value: 300000 },
        { label: "Cash", value: 200000 },
      ],
      500000
    );
    expect(result.totalPrePurchase).toBe(500000);
    expect(result.totalPostPurchase).toBe(1000000);
  });

  it("calculates property concentration correctly", () => {
    const result = calculateConcentration(
      [
        { label: "Shares", value: 300000 },
        { label: "Cash", value: 200000 },
      ],
      500000
    );
    expect(result.propertyConcentrationPre).toBe(0);
    expect(result.propertyConcentrationPost).toBe(50);
  });

  it("includes existing property in pre-purchase concentration", () => {
    const result = calculateConcentration(
      [
        { label: "Existing property", value: 400000 },
        { label: "Cash", value: 100000 },
      ],
      300000
    );
    expect(result.propertyConcentrationPre).toBe(80);
    expect(result.propertyConcentrationPost).toBeCloseTo(87.5, 0);
  });

  it("handles empty existing assets", () => {
    const result = calculateConcentration([], 500000);
    expect(result.propertyConcentrationPre).toBe(0);
    expect(result.propertyConcentrationPost).toBe(100);
  });

  it("adds proposed property to post-purchase array", () => {
    const result = calculateConcentration(
      [{ label: "Cash", value: 100000 }],
      400000
    );
    expect(result.postPurchase).toHaveLength(2);
    expect(result.postPurchase[1].label).toBe("Proposed property");
    expect(result.postPurchase[1].value).toBe(400000);
  });
});
