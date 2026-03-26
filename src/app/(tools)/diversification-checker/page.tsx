import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { DiversificationChecker } from "@/components/tools/diversification/diversification-checker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diversification Checker — SMSF Asset Allocation",
  description: "See how adding property affects your SMSF's asset allocation. Pre and post-purchase comparison with ATO benchmark flagging.",
};

export default function DiversificationCheckerPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-bs-orange mb-2">Interactive Tool</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal mb-3">Diversification Checker</h1>
            <p className="text-bs-mid max-w-2xl leading-relaxed">
              Enter your current fund allocation and proposed property purchase to see how it changes your asset mix. Flags concentration against ATO benchmarks.
            </p>
          </div>
          <DiversificationChecker />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
