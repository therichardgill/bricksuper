"use client";

import { useState } from "react";
import { TrafficLight } from "@/components/brand/traffic-light";
import { Disclaimer } from "@/components/brand/disclaimer";
import { Button } from "@/components/ui/button";
import { formatAUD, formatPercent } from "@/lib/utils";
import {
  ATO_CONCENTRATION_THRESHOLD,
  ATO_CONCENTRATION_SOURCE,
  SMSF_MIN_BALANCE,
  SMSF_MIN_BALANCE_SOURCE,
} from "@/lib/constants";
import type { RiskLevel } from "@/lib/constants";

// ── Types ───────────────────────────────────────────────────────

type PropertyType = "commercial" | "residential" | "business-premises" | "mixed-use";

interface PropertyInputs {
  purchasePrice: number;
  propertyType: PropertyType;
  estimatedMonthlyRent: number;
  businessOwned: boolean;
  vacancyRate: number;
}

interface FundInputs {
  fundBalance: number;
  cashAssets: number;
  depositAvailable: number;
  existingProperties: number;
  currentPropertyValue: number;
}

interface RiskFlag {
  flag: string;
  level: RiskLevel;
  description: string;
  source: string;
}

// ── Input Components ────────────────────────────────────────────

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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm text-bs-mid mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-bs-mid mb-1.5">{label}</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 border rounded-lg py-3 text-sm font-medium transition-colors ${
            value
              ? "border-bs-orange bg-bs-orange-pale text-bs-orange-dark"
              : "border-border text-bs-mid hover:border-bs-muted"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 border rounded-lg py-3 text-sm font-medium transition-colors ${
            !value
              ? "border-bs-orange bg-bs-orange-pale text-bs-orange-dark"
              : "border-border text-bs-mid hover:border-bs-muted"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ── Calculation ─────────────────────────────────────────────────

function calculateRiskFlags(
  property: PropertyInputs,
  fund: FundInputs
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  // 1. Fund Balance
  const fundBalanceLevel: RiskLevel =
    fund.fundBalance >= 500_000
      ? "green"
      : fund.fundBalance >= 200_000
        ? "amber"
        : "red";
  flags.push({
    flag: "Fund Balance",
    level: fundBalanceLevel,
    description:
      fundBalanceLevel === "green"
        ? `Fund balance of ${formatAUD(fund.fundBalance)} is above $500K.`
        : fundBalanceLevel === "amber"
          ? `Fund balance of ${formatAUD(fund.fundBalance)} is between $200K and $500K. Costs may represent a higher percentage of total assets.`
          : `Fund balance of ${formatAUD(fund.fundBalance)} is below the $200K industry threshold. SMSF running costs may erode returns at this balance level.`,
    source: SMSF_MIN_BALANCE_SOURCE,
  });

  // 2. Concentration (post-purchase)
  const totalPropertyValue = fund.currentPropertyValue + property.purchasePrice;
  const postPurchaseBalance =
    fund.fundBalance + property.purchasePrice - fund.depositAvailable;
  const concentrationPct =
    postPurchaseBalance > 0
      ? (totalPropertyValue / postPurchaseBalance) * 100
      : 0;
  const concentrationLevel: RiskLevel =
    concentrationPct < 50 ? "green" : concentrationPct <= 90 ? "amber" : "red";
  flags.push({
    flag: "Concentration (post-purchase)",
    level: concentrationLevel,
    description: `Property would represent ${formatPercent(concentrationPct)} of total fund assets after purchase. ${
      concentrationLevel === "red"
        ? `This exceeds the ${ATO_CONCENTRATION_THRESHOLD}% threshold that triggered ATO scrutiny.`
        : concentrationLevel === "amber"
          ? "This is above 50% single-asset concentration."
          : "Below 50% single-asset concentration."
    }`,
    source: ATO_CONCENTRATION_SOURCE,
  });

  // 3. Liquidity (post-purchase)
  const remainingCash = fund.cashAssets - fund.depositAvailable;
  const liquidityPct =
    postPurchaseBalance > 0 ? (remainingCash / postPurchaseBalance) * 100 : 0;
  const liquidityLevel: RiskLevel =
    liquidityPct > 30 ? "green" : liquidityPct >= 20 ? "amber" : "red";
  flags.push({
    flag: "Liquidity (post-purchase)",
    level: liquidityLevel,
    description: `Remaining liquid assets would be ${formatAUD(Math.max(0, remainingCash))} (${formatPercent(Math.max(0, liquidityPct))} of fund). ${
      liquidityLevel === "red"
        ? "Below 20% — limited capacity to meet ongoing expenses, insurance, and unexpected costs."
        : liquidityLevel === "amber"
          ? "Between 20-30% — monitor ability to cover fund expenses."
          : "Above 30% liquidity ratio."
    }`,
    source: "Industry best practice — ability to meet ongoing fund expenses",
  });

  // 4. LVR
  const loanAmount = property.purchasePrice - fund.depositAvailable;
  const lvr =
    property.purchasePrice > 0
      ? (loanAmount / property.purchasePrice) * 100
      : 0;
  if (fund.depositAvailable < property.purchasePrice) {
    const lvrLevel: RiskLevel =
      lvr < 60 ? "green" : lvr <= 80 ? "amber" : "red";
    flags.push({
      flag: "Loan-to-Value Ratio (LVR)",
      level: lvrLevel,
      description: `LVR of ${formatPercent(lvr)}. ${
        lvrLevel === "red"
          ? "Above 80% — most SMSF lenders will not lend at this LVR."
          : lvrLevel === "amber"
            ? "Between 60-80% — within range but higher LVR means higher repayments and lender scrutiny."
            : "Below 60% — within typical SMSF lender criteria."
      }`,
      source: "SMSF lender criteria — most lenders cap at 70-80% LVR",
    });
  } else {
    flags.push({
      flag: "Loan-to-Value Ratio (LVR)",
      level: "green",
      description:
        "Deposit covers full purchase price — no LRBA borrowing required.",
      source: "SMSF lender criteria — most lenders cap at 70-80% LVR",
    });
  }

  // 5. BRP Status
  const isBrpEligibleType =
    property.propertyType === "commercial" ||
    property.propertyType === "business-premises";
  if (property.businessOwned && isBrpEligibleType) {
    flags.push({
      flag: "Business Real Property (BRP)",
      level: "green",
      description:
        'May qualify as business real property under SIS Act s66(5). BRP is exempt from the in-house asset rules if properly structured. BRP status is a legal determination — seek legal advice.',
      source: "SMSFR 2009/1",
    });
  } else if (property.propertyType === "residential") {
    flags.push({
      flag: "Business Real Property (BRP)",
      level: "amber",
      description:
        'Residential property cannot be business real property. The in-house asset rules and related-party usage restrictions apply. BRP status is a legal determination — seek legal advice.',
      source: "SMSFR 2009/1",
    });
  } else {
    flags.push({
      flag: "Business Real Property (BRP)",
      level: "amber",
      description: `Property type is "${property.propertyType === "mixed-use" ? "mixed-use" : property.propertyType}" ${
        property.businessOwned
          ? "and is used in a business you own"
          : "but is not used in a business you own"
      }. BRP eligibility depends on the specific use and legal structure. BRP status is a legal determination — seek legal advice.`,
      source: "SMSFR 2009/1",
    });
  }

  // 6. Rent-vs-repayment gap
  if (fund.depositAvailable < property.purchasePrice) {
    const annualRate = 6.5 / 100;
    const monthlyIOPayment = (loanAmount * annualRate) / 12;
    const effectiveRent =
      property.estimatedMonthlyRent * (1 - property.vacancyRate / 100);
    const gap = monthlyIOPayment - effectiveRent;

    const gapLevel: RiskLevel =
      gap <= 0 ? "green" : gap < 500 ? "amber" : "red";
    flags.push({
      flag: "Rent-vs-Repayment Gap",
      level: gapLevel,
      description:
        gapLevel === "green"
          ? `Effective rent of ${formatAUD(effectiveRent)}/month covers the estimated interest-only repayment of ${formatAUD(monthlyIOPayment)}/month at 6.5%.`
          : `Estimated interest-only repayment at 6.5% is ${formatAUD(monthlyIOPayment)}/month. Effective rent (after ${property.vacancyRate}% vacancy) is ${formatAUD(effectiveRent)}/month. Gap of ${formatAUD(gap)}/month must be funded from other sources.`,
      source: "Cash flow stress indicator — factual calculation at 6.5% IO rate",
    });
  }

  return flags;
}

// ── Main Component ──────────────────────────────────────────────

const PROPERTY_TYPE_OPTIONS = [
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
  { value: "business-premises", label: "Business premises" },
  { value: "mixed-use", label: "Mixed-use" },
];

const DEFAULT_PROPERTY: PropertyInputs = {
  purchasePrice: 650000,
  propertyType: "commercial",
  estimatedMonthlyRent: 3200,
  businessOwned: false,
  vacancyRate: 5,
};

const DEFAULT_FUND: FundInputs = {
  fundBalance: 400000,
  cashAssets: 200000,
  depositAvailable: 130000,
  existingProperties: 0,
  currentPropertyValue: 0,
};

export function PropertyRiskProfiler() {
  const [property, setProperty] = useState<PropertyInputs>(DEFAULT_PROPERTY);
  const [fund, setFund] = useState<FundInputs>(DEFAULT_FUND);
  const [flags, setFlags] = useState<RiskFlag[] | null>(null);

  function updateProperty<K extends keyof PropertyInputs>(
    field: K,
    value: PropertyInputs[K]
  ) {
    setProperty((prev) => ({ ...prev, [field]: value }));
    setFlags(null);
  }

  function updateFund<K extends keyof FundInputs>(
    field: K,
    value: FundInputs[K]
  ) {
    setFund((prev) => ({ ...prev, [field]: value }));
    setFlags(null);
  }

  function handleAssess() {
    setFlags(calculateRiskFlags(property, fund));
  }

  const amberOrRedFlags = flags?.filter((f) => f.level !== "green") ?? [];

  return (
    <div>
      <Disclaimer variant="tool" className="mb-8" />

      {/* Input form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Property Details */}
        <div>
          <h2 className="font-serif text-lg text-bs-charcoal mb-4">
            Property Details
          </h2>
          <div className="space-y-4">
            <InputField
              label="Purchase price"
              value={property.purchasePrice}
              onChange={(v) => updateProperty("purchasePrice", v)}
              prefix="$"
              step={10000}
              min={0}
            />
            <SelectField
              label="Property type"
              value={property.propertyType}
              onChange={(v) => updateProperty("propertyType", v as PropertyType)}
              options={PROPERTY_TYPE_OPTIONS}
            />
            <InputField
              label="Estimated monthly rent"
              value={property.estimatedMonthlyRent}
              onChange={(v) => updateProperty("estimatedMonthlyRent", v)}
              prefix="$"
              step={100}
              min={0}
            />
            <ToggleField
              label="Is this property used in a business you own?"
              value={property.businessOwned}
              onChange={(v) => updateProperty("businessOwned", v)}
            />
            <InputField
              label="Vacancy rate assumption"
              value={property.vacancyRate}
              onChange={(v) => updateProperty("vacancyRate", v)}
              suffix="%"
              step={1}
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Fund Details */}
        <div>
          <h2 className="font-serif text-lg text-bs-charcoal mb-4">
            Fund Details
          </h2>
          <div className="space-y-4">
            <InputField
              label="Current total fund balance"
              value={fund.fundBalance}
              onChange={(v) => updateFund("fundBalance", v)}
              prefix="$"
              step={10000}
              min={0}
            />
            <InputField
              label="Current cash/liquid assets in fund"
              value={fund.cashAssets}
              onChange={(v) => updateFund("cashAssets", v)}
              prefix="$"
              step={5000}
              min={0}
            />
            <InputField
              label="LRBA deposit available"
              value={fund.depositAvailable}
              onChange={(v) => updateFund("depositAvailable", v)}
              prefix="$"
              step={5000}
              min={0}
            />
            <InputField
              label="Number of existing properties in fund"
              value={fund.existingProperties}
              onChange={(v) => updateFund("existingProperties", v)}
              step={1}
              min={0}
            />
            <InputField
              label="Current property value in fund"
              value={fund.currentPropertyValue}
              onChange={(v) => updateFund("currentPropertyValue", v)}
              prefix="$"
              step={10000}
              min={0}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleAssess} size="lg" className="w-full sm:w-auto">
        Run Assessment
      </Button>

      {/* Results */}
      {flags && (
        <div className="mt-10 space-y-8">
          <div>
            <h2 className="font-serif text-xl text-bs-charcoal mb-1">
              Risk Assessment
            </h2>
            <p className="text-sm text-bs-mid mb-4">
              Based on the values you entered, assessed against factual
              regulatory thresholds.
            </p>
          </div>

          {/* Risk flags */}
          <div className="space-y-3">
            {flags.map((f) => (
              <TrafficLight
                key={f.flag}
                level={f.level}
                flag={f.flag}
                description={f.description}
                source={f.source}
              />
            ))}
          </div>

          {/* Questions for adviser */}
          {amberOrRedFlags.length > 0 && (
            <div className="border border-border rounded-xl p-5">
              <h3 className="font-serif text-lg text-bs-charcoal mb-3">
                Questions to take to your adviser
              </h3>
              <p className="text-sm text-bs-mid mb-3">
                Based on the amber and red flags above, these are topics worth
                discussing with a licensed specialist:
              </p>
              <ul className="space-y-2">
                {amberOrRedFlags.map((f) => (
                  <li key={f.flag} className="flex items-start gap-2 text-sm text-bs-slate">
                    <span className="text-bs-orange mt-0.5 shrink-0">&#x2022;</span>
                    <span>
                      {f.flag === "Fund Balance" &&
                        "Is my fund balance sufficient to absorb SMSF running costs and still benefit from direct property ownership?"}
                      {f.flag === "Concentration (post-purchase)" &&
                        "What is the concentration risk of this property within my overall fund, and how does it affect diversification?"}
                      {f.flag === "Liquidity (post-purchase)" &&
                        "Will the fund have enough liquid assets to cover ongoing expenses, insurance premiums, and unexpected repairs?"}
                      {f.flag === "Loan-to-Value Ratio (LVR)" &&
                        "What LVR can I realistically obtain from an SMSF lender, and how do repayments affect fund cash flow?"}
                      {f.flag === "Business Real Property (BRP)" &&
                        "Does this property qualify as business real property under SIS Act s66(5), and what are the compliance requirements?"}
                      {f.flag === "Rent-vs-Repayment Gap" &&
                        "How will the fund cover the gap between rental income and loan repayments, especially if rates rise or vacancy increases?"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-bs-muted mt-4 italic">
                These questions are based on the factual thresholds flagged
                above. Only a licensed financial adviser can assess whether this
                investment is appropriate for your circumstances.
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
              <a href="/quiz">Take the SMSF Readiness Quiz &#x2192;</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
