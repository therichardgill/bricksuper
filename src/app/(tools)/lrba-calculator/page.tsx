import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { LbraCalculator } from "@/components/tools/calculator/lbra-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LRBA Calculator — SMSF Property Loan Repayments",
  description:
    "Calculate SMSF property loan repayments, rent-vs-repayment gap, and stress test at +1/2/3% rate rises. Pure maths, no opinions.",
};

export default function LbraCalculatorPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-bs-orange mb-2">
              Interactive Tool
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal mb-3">
              LRBA Repayment Calculator
            </h1>
            <p className="text-bs-mid max-w-2xl leading-relaxed">
              Enter your property and loan details to see monthly repayments,
              the rent-vs-repayment gap, and how rate rises would affect your
              fund. These are mathematical calculations only.
            </p>
          </div>
          <LbraCalculator />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
