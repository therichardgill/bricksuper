"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/brand/disclaimer";
import { TrafficLight } from "@/components/brand/traffic-light";
import {
  calculateLbraRepayments,
  generateStressTest,
  type LbraInputs,
  type LbraResult,
  type StressTestRow,
} from "@/lib/calculations";
import { formatAUD } from "@/lib/utils";
import { ATO_SAFE_HARBOUR_RATE } from "@/lib/constants";

const DEFAULT_INPUTS: LbraInputs = {
  purchasePrice: 650000,
  deposit: 130000,
  interestRate: 6.5,
  loanTermYears: 25,
  interestOnlyYears: 5,
  estimatedRent: 3200,
  vacancyRatePercent: 5,
};

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-bs-mid mb-1.5">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bs-muted text-sm">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          min={min}
          max={max}
          className={`w-full border border-border rounded-lg py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent ${
            prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-8" : "px-4"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bs-muted text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "bg-bs-orange-pale border-bs-orange-mid" : "border-border"
      }`}
    >
      <p className="text-xs text-bs-muted mb-1">{label}</p>
      <p
        className={`text-xl font-semibold ${
          highlight ? "text-bs-orange-dark" : "text-bs-charcoal"
        }`}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-bs-muted mt-1">{sublabel}</p>}
    </div>
  );
}

function StressTestTable({ rows }: { rows: StressTestRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 text-xs font-semibold text-bs-muted uppercase tracking-wider">
              Rate
            </th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-bs-muted uppercase tracking-wider">
              Monthly (IO)
            </th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-bs-muted uppercase tracking-wider">
              Monthly (P&I)
            </th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-bs-muted uppercase tracking-wider">
              Gap (IO)
            </th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-bs-muted uppercase tracking-wider">
              Gap (P&I)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rateIncrease} className="border-b border-border/50">
              <td className="py-3 px-3 text-bs-charcoal">
                {row.newRate.toFixed(1)}%
                {row.rateIncrease > 0 && (
                  <span className="text-bs-muted ml-1">
                    (+{row.rateIncrease}%)
                  </span>
                )}
              </td>
              <td className="py-3 px-3 text-right text-bs-charcoal">
                {formatAUD(row.monthlyIO)}
              </td>
              <td className="py-3 px-3 text-right text-bs-charcoal">
                {formatAUD(row.monthlyPI)}
              </td>
              <td
                className={`py-3 px-3 text-right ${
                  row.monthlyGapIO > 0 ? "text-bs-red" : "text-bs-green"
                }`}
              >
                {row.monthlyGapIO > 0 ? "+" : ""}
                {formatAUD(row.monthlyGapIO)}
              </td>
              <td
                className={`py-3 px-3 text-right ${
                  row.monthlyGapPI > 0 ? "text-bs-red" : "text-bs-green"
                }`}
              >
                {row.monthlyGapPI > 0 ? "+" : ""}
                {formatAUD(row.monthlyGapPI)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LbraCalculator() {
  const [inputs, setInputs] = useState<LbraInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<LbraResult | null>(null);
  const [stressTest, setStressTest] = useState<StressTestRow[] | null>(null);

  function handleCalculate() {
    const r = calculateLbraRepayments(inputs);
    setResult(r);
    setStressTest(generateStressTest(inputs));
  }

  function updateInput(field: keyof LbraInputs, value: number) {
    setInputs((prev) => ({ ...prev, [field]: value }));
    // Clear results when inputs change
    setResult(null);
    setStressTest(null);
  }

  return (
    <div>
      <Disclaimer variant="tool" className="mb-8" />

      {/* Input form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <InputField
          label="Purchase price"
          value={inputs.purchasePrice}
          onChange={(v) => updateInput("purchasePrice", v)}
          prefix="$"
          step={10000}
          min={0}
        />
        <InputField
          label="Deposit"
          value={inputs.deposit}
          onChange={(v) => updateInput("deposit", v)}
          prefix="$"
          step={5000}
          min={0}
        />
        <InputField
          label="Interest rate (annual)"
          value={inputs.interestRate}
          onChange={(v) => updateInput("interestRate", v)}
          suffix="%"
          step={0.1}
          min={0}
          max={20}
        />
        <InputField
          label="Loan term"
          value={inputs.loanTermYears}
          onChange={(v) => updateInput("loanTermYears", v)}
          suffix="years"
          step={1}
          min={1}
          max={30}
        />
        <InputField
          label="Interest-only period"
          value={inputs.interestOnlyYears}
          onChange={(v) => updateInput("interestOnlyYears", v)}
          suffix="years"
          step={1}
          min={0}
          max={10}
        />
        <InputField
          label="Estimated monthly rent"
          value={inputs.estimatedRent}
          onChange={(v) => updateInput("estimatedRent", v)}
          prefix="$"
          step={100}
          min={0}
        />
        <InputField
          label="Vacancy rate"
          value={inputs.vacancyRatePercent}
          onChange={(v) => updateInput("vacancyRatePercent", v)}
          suffix="%"
          step={1}
          min={0}
          max={100}
        />
      </div>

      <Button onClick={handleCalculate} size="lg" className="w-full sm:w-auto">
        Calculate Repayments
      </Button>

      {/* Results */}
      {result && (
        <div className="mt-10 space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              label="Loan amount"
              value={formatAUD(result.loanAmount)}
              sublabel={`LVR: ${result.lvr.toFixed(0)}%`}
            />
            <ResultCard
              label="Monthly (interest-only)"
              value={formatAUD(result.monthlyIO)}
              sublabel={`First ${inputs.interestOnlyYears} years`}
            />
            <ResultCard
              label="Monthly (P&I)"
              value={formatAUD(result.monthlyPI)}
              sublabel={`Remaining ${inputs.loanTermYears - inputs.interestOnlyYears} years`}
            />
            <ResultCard
              label="Rent-vs-repayment gap"
              value={formatAUD(Math.abs(result.monthlyGapIO))}
              sublabel={
                result.monthlyGapIO > 0
                  ? "Fund covers this monthly"
                  : "Rent covers repayment"
              }
              highlight={result.monthlyGapIO > 500}
            />
          </div>

          {/* Risk flags */}
          <div className="space-y-3">
            {result.lvr > 80 && (
              <TrafficLight
                level="red"
                flag="High LVR"
                description={`LVR of ${result.lvr.toFixed(0)}% exceeds 80%. Most SMSF lenders cap LVR at 70-80%.`}
                source="Industry standard SMSF lending criteria"
              />
            )}
            {result.monthlyGapIO > 500 && (
              <TrafficLight
                level="amber"
                flag="Rent-vs-repayment gap"
                description={`Your fund would need to cover ${formatAUD(result.monthlyGapIO)}/month from other sources during the interest-only period. This is one of the load-bearing numbers to take to your adviser.`}
              />
            )}
            {inputs.interestRate < ATO_SAFE_HARBOUR_RATE && (
              <TrafficLight
                level="green"
                flag="Below safe harbour rate"
                description={`Your rate (${inputs.interestRate}%) is below the ATO safe harbour rate (${ATO_SAFE_HARBOUR_RATE}%). Related-party LRBAs must charge at least the safe harbour rate.`}
                source={`ATO safe harbour rate ${ATO_SAFE_HARBOUR_RATE}% for 2025-26`}
              />
            )}
          </div>

          {/* Stress test */}
          {stressTest && (
            <div>
              <h2 className="font-serif text-xl text-bs-charcoal mb-1">
                Rate Rise Stress Test
              </h2>
              <p className="text-sm text-bs-mid mb-4">
                What happens to your repayments and gap if rates rise.
              </p>
              <div className="border border-border rounded-xl overflow-hidden">
                <StressTestTable rows={stressTest} />
              </div>
              <p className="text-xs text-bs-muted mt-3 italic">
                These are mathematical calculations based on the values you
                entered. They do not account for changes in rent, fund
                contributions, or other variables.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-bs-mid mb-3">
              These are the load-bearing numbers to take to your adviser before
              anything else.
            </p>
            <Button asChild variant="ghost">
              <a href="/quiz">Take the SMSF Readiness Quiz →</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
