import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { PropertyRiskProfiler } from "@/components/tools/profiler/property-risk-profiler";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Risk Profiler — SMSF Complexity Assessment",
  description: "Enter property and fund details to see complexity flags, concentration percentage, and stress-test scenarios. Mathematical calculations only.",
};

export default function PropertyRiskProfilerPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-bs-orange mb-2">Interactive Tool</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal mb-3">Property Risk Profiler</h1>
            <p className="text-bs-mid max-w-2xl leading-relaxed">
              Enter your property and fund details to see complexity and risk flags based on factual regulatory thresholds. These are mathematical calculations — not financial advice.
            </p>
          </div>
          <PropertyRiskProfiler />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
