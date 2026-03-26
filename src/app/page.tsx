import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { HeroSection } from "@/components/brand/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CONTENT_HUBS = [
  {
    href: "/smsf-property-guide",
    title: "SMSF Property Investment Guide",
    description:
      "Rules, costs, checklists, residential vs commercial, tax deductions, and exit strategies.",
    featured: true,
  },
  {
    href: "/lrba-explained",
    title: "LRBA Explained",
    description:
      "How limited recourse borrowing works, current lending rates, safe harbour rates, structure diagrams.",
  },
  {
    href: "/business-real-property",
    title: "Business Real Property",
    description:
      "The plain-English BRP guide. The 'wholly and exclusively' test, lease-back rules, worked examples.",
  },
  {
    href: "/smsf-investment-strategy",
    title: "Investment Strategy",
    description:
      "Free property-focused templates meeting SIS Reg 4.09. Five mandatory considerations explained.",
  },
] as const;

const TOOLS = [
  {
    href: "/quiz",
    title: "SMSF Readiness Quiz",
    description:
      "7 questions, ~3 minutes. See where you stand based on general industry benchmarks.",
    primary: true,
  },
  {
    href: "/lrba-calculator",
    title: "LRBA Calculator",
    description:
      "Repayments, rent-vs-gap analysis, stress test at +1/2/3% rate rises.",
    primary: false,
  },
  {
    href: "/property-risk-profiler",
    title: "Property Risk Profiler",
    description:
      "Enter property + fund details. See complexity flags, concentration %, stress scenarios.",
    primary: false,
  },
  {
    href: "/diversification-checker",
    title: "Diversification Checker",
    description:
      "Pre/post-purchase allocation. Flags concentration vs ATO benchmarks.",
    primary: false,
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          {/* Hero */}
          <HeroSection />

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 py-4 border-y border-border text-xs text-bs-muted">
            <span>No financial advice</span>
            <span>Factual information only</span>
            <span>Not affiliated with any AFSL</span>
            <span>
              <Link
                href="/how-were-funded"
                className="underline hover:text-bs-charcoal"
              >
                See how we&apos;re funded
              </Link>
            </span>
          </div>

          {/* Content Hubs — asymmetric layout */}
          <section>
            <h2 className="font-serif text-2xl text-bs-charcoal mb-6">
              Plain-English Guides
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Featured hub — full width */}
              <Link
                href={CONTENT_HUBS[0].href}
                className="lg:col-span-2 bg-bs-charcoal rounded-xl p-8 hover:bg-bs-slate transition-colors group"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-bs-orange mb-2">
                  Comprehensive Guide
                </p>
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-bs-orange-light transition-colors mb-2">
                  {CONTENT_HUBS[0].title}
                </h3>
                <p className="text-sm text-white/50 max-w-xl">
                  {CONTENT_HUBS[0].description}
                </p>
              </Link>

              {/* Remaining hubs */}
              {CONTENT_HUBS.slice(1).map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="border border-border rounded-xl p-6 hover:border-bs-orange/30 hover:bg-bs-orange-pale/30 transition-colors group"
                >
                  <h3 className="font-serif text-lg text-bs-charcoal group-hover:text-bs-orange-dark transition-colors mb-2">
                    {hub.title}
                  </h3>
                  <p className="text-sm text-bs-mid leading-relaxed">
                    {hub.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Interactive Tools — staggered */}
          <section>
            <h2 className="font-serif text-2xl text-bs-charcoal mb-6">
              Interactive Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`border border-border rounded-xl p-6 hover:border-bs-orange/30 hover:bg-bs-orange-pale/30 transition-colors group ${
                    tool.primary ? "sm:row-span-2" : ""
                  }`}
                >
                  <h3 className="font-semibold text-bs-charcoal group-hover:text-bs-orange-dark transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-bs-mid leading-relaxed">
                    {tool.description}
                  </p>
                  {tool.primary && (
                    <Button variant="ghost" size="sm" className="mt-4">
                      Start the Quiz →
                    </Button>
                  )}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
