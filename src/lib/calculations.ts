/**
 * BrickSuper Calculation Utilities
 *
 * Pure mathematical functions for LRBA repayments, stress testing,
 * and concentration analysis. All outputs are factual calculations —
 * no opinions, no recommendations, no suitability determinations.
 */

// ── LRBA Repayment Calculations ─────────────────────────────────

export interface LbraInputs {
  purchasePrice: number;
  deposit: number;
  interestRate: number; // annual, e.g. 6.5
  loanTermYears: number;
  interestOnlyYears: number;
  estimatedRent: number; // monthly
  vacancyRatePercent: number; // e.g. 5
}

export interface LbraResult {
  loanAmount: number;
  lvr: number;
  monthlyIO: number;
  monthlyPI: number;
  totalInterestIO: number;
  totalInterestPI: number;
  totalCost: number;
  effectiveMonthlyRent: number;
  monthlyGapIO: number;
  monthlyGapPI: number;
}

export function calculateLbraRepayments(inputs: LbraInputs): LbraResult {
  const loanAmount = inputs.purchasePrice - inputs.deposit;
  const lvr = (loanAmount / inputs.purchasePrice) * 100;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const totalMonths = inputs.loanTermYears * 12;
  const ioMonths = inputs.interestOnlyYears * 12;
  const piMonths = totalMonths - ioMonths;

  // Interest-only monthly payment
  const monthlyIO = loanAmount * monthlyRate;

  // Principal + interest monthly payment (for the P&I period)
  const monthlyPI =
    piMonths > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, piMonths)) /
        (Math.pow(1 + monthlyRate, piMonths) - 1)
      : 0;

  // Total interest over IO period
  const totalInterestIO = monthlyIO * ioMonths;

  // Total interest over P&I period (approximate — doesn't account for principal reduction during IO)
  const totalInterestPI = monthlyPI * piMonths - loanAmount;

  const totalCost = totalInterestIO + Math.max(0, totalInterestPI);

  // Effective rent after vacancy
  const effectiveMonthlyRent =
    inputs.estimatedRent * (1 - inputs.vacancyRatePercent / 100);

  // Gap: positive means fund needs to cover the difference
  const monthlyGapIO = monthlyIO - effectiveMonthlyRent;
  const monthlyGapPI = monthlyPI - effectiveMonthlyRent;

  return {
    loanAmount,
    lvr,
    monthlyIO: Math.round(monthlyIO),
    monthlyPI: Math.round(monthlyPI),
    totalInterestIO: Math.round(totalInterestIO),
    totalInterestPI: Math.round(Math.max(0, totalInterestPI)),
    totalCost: Math.round(totalCost),
    effectiveMonthlyRent: Math.round(effectiveMonthlyRent),
    monthlyGapIO: Math.round(monthlyGapIO),
    monthlyGapPI: Math.round(monthlyGapPI),
  };
}

// ── Stress Test ─────────────────────────────────────────────────

export interface StressTestRow {
  rateIncrease: number; // percentage points above base
  newRate: number;
  monthlyIO: number;
  monthlyPI: number;
  monthlyGapIO: number;
  monthlyGapPI: number;
}

export function generateStressTest(
  inputs: LbraInputs,
  increments: number[] = [0, 1, 2, 3]
): StressTestRow[] {
  return increments.map((inc) => {
    const stressed = calculateLbraRepayments({
      ...inputs,
      interestRate: inputs.interestRate + inc,
    });
    return {
      rateIncrease: inc,
      newRate: inputs.interestRate + inc,
      monthlyIO: stressed.monthlyIO,
      monthlyPI: stressed.monthlyPI,
      monthlyGapIO: stressed.monthlyGapIO,
      monthlyGapPI: stressed.monthlyGapPI,
    };
  });
}

// ── Concentration / Diversification ─────────────────────────────

export interface AssetAllocation {
  label: string;
  value: number;
}

export interface ConcentrationResult {
  prePurchase: AssetAllocation[];
  postPurchase: AssetAllocation[];
  propertyConcentrationPre: number;
  propertyConcentrationPost: number;
  totalPrePurchase: number;
  totalPostPurchase: number;
}

export function calculateConcentration(
  existingAssets: AssetAllocation[],
  proposedPropertyValue: number
): ConcentrationResult {
  const totalPre = existingAssets.reduce((sum, a) => sum + a.value, 0);
  const totalPost = totalPre + proposedPropertyValue;

  const existingProperty = existingAssets
    .filter((a) => a.label.toLowerCase().includes("property"))
    .reduce((sum, a) => sum + a.value, 0);

  const propertyConcentrationPre =
    totalPre > 0 ? (existingProperty / totalPre) * 100 : 0;
  const propertyConcentrationPost =
    totalPost > 0
      ? ((existingProperty + proposedPropertyValue) / totalPost) * 100
      : 0;

  const postPurchase = [
    ...existingAssets,
    { label: "Proposed property", value: proposedPropertyValue },
  ];

  return {
    prePurchase: existingAssets,
    postPurchase,
    propertyConcentrationPre,
    propertyConcentrationPost,
    totalPrePurchase: totalPre,
    totalPostPurchase: totalPost,
  };
}
