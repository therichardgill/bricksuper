import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-bs-charcoal rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,97,26,0.2) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[1.8px] text-bs-orange mb-4">
          SMSF Property Education
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-white leading-tight mb-4">
          Thinking about buying property{" "}
          <em className="text-bs-orange-light not-italic">
            through your SMSF?
          </em>
        </h1>
        <p className="text-base text-white/60 leading-relaxed mb-8 max-w-xl">
          Educational tools and plain-English guides to help you understand the
          rules, costs, and risks — so you can ask better questions when you talk
          to a licensed adviser.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/quiz">Take the SMSF Property Readiness Quiz</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="border-white/20 text-white hover:bg-white/10">
            <Link href="/smsf-property-guide">Read the Guide</Link>
          </Button>
        </div>
        <p className="text-[11px] text-white/30 mt-6 max-w-lg leading-relaxed">
          BrickSuper provides educational information only. We do not hold an
          AFSL and do not provide financial advice.
        </p>
      </div>
    </section>
  );
}
