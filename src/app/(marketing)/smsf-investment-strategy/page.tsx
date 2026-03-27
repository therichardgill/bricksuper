import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { LastUpdated } from "@/components/brand/last-updated";
import { FAQSection } from "@/components/brand/faq-section";
import { Button } from "@/components/ui/button";
import {
  generateFAQSchema,
  generateArticleSchema,
  type FAQItem,
} from "@/lib/schema-markup";

export const revalidate = 86400;

const FAQ_ITEMS: FAQItem[] = [
  {
    question:
      "Is it illegal to hold 90% or more of an SMSF in a single property?",
    answer:
      "No. Australian law does not prescribe maximum allocation limits for SMSFs. SIS Regulation 4.09 requires trustees to consider diversification, not achieve a specific allocation. The obligation is to document that the concentration was a deliberate, informed decision rather than an oversight.",
  },
  {
    question: "How often must an SMSF investment strategy be reviewed?",
    answer:
      "The SIS Act requires review 'regularly' and whenever circumstances change. The ATO considers at least annual review as good practice. Triggering events include a property purchase or sale, a change in a member's employment or health, significant market movements, or a change in fund membership.",
  },
  {
    question:
      "What happens if my SMSF does not have a written investment strategy?",
    answer:
      "Failure to prepare and implement an investment strategy is a contravention of SIS Regulation 4.09 and may attract administrative penalties of up to $4,200 per trustee (or per director of a corporate trustee). The ATO may also issue a notice of non-compliance or education direction.",
  },
  {
    question:
      "Does the investment strategy need to mention insurance for members?",
    answer:
      "Yes. SIS Regulation 4.09(2)(e) requires trustees to consider whether to hold insurance cover for each member. The strategy must document this consideration, even if the decision is not to hold insurance. Reasons for the decision (for or against) form part of the record.",
  },
  {
    question:
      "Can the ATO force an SMSF to sell a property to improve diversification?",
    answer:
      "The ATO does not direct asset allocation. However, if an audit reveals the trustee failed to genuinely consider diversification, the ATO may issue penalties, education directions, or rectification directions. These compliance actions can indirectly pressure a fund to adjust its holdings.",
  },
];

const PAGE_URL =
  "https://bricksuper.com/smsf-investment-strategy";

const articleSchema = generateArticleSchema({
  title:
    "SMSF Investment Strategy: What the Law Requires and How to Get It Right",
  description:
    "A factual guide to SMSF investment strategy obligations under SIS Regulation 4.09, including the five mandatory considerations, concentration documentation, and property-specific factors.",
  url: PAGE_URL,
  datePublished: "2025-06-01",
  dateModified: "2026-03-27",
  wordCount: 2400,
});

const faqSchema = generateFAQSchema(FAQ_ITEMS);

export const metadata: Metadata = {
  title:
    "SMSF Investment Strategy: What the Law Requires | BrickSuper",
  description:
    "Understand the five mandatory considerations under SIS Regulation 4.09, how to document a concentration decision, and when to review your SMSF investment strategy.",
  alternates: { canonical: PAGE_URL },
  other: {
    "script:ld+json": JSON.stringify([articleSchema, faqSchema]),
  },
};

const TOC = [
  { id: "what-is", label: "What is an SMSF investment strategy?" },
  { id: "five-considerations", label: "The five mandatory considerations" },
  { id: "concentration", label: "Can you hold 90%+ in property?" },
  { id: "documenting", label: "How to document a concentration decision" },
  { id: "when-to-review", label: "When to review your strategy" },
  { id: "property", label: "Investment strategy and property" },
  { id: "faq", label: "FAQs" },
];

export default function SMSFInvestmentStrategyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal leading-tight mb-4">
            SMSF Investment Strategy: What the Law Requires and How to
            Get&nbsp;It&nbsp;Right
          </h1>
          <LastUpdated date={new Date("2026-03-27")} className="mb-8" />

          {/* Table of contents */}
          <nav
            aria-label="Table of contents"
            className="mb-10 rounded-lg border border-border p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bs-muted mb-3">
              On this page
            </p>
            <ol className="space-y-1.5 list-decimal list-inside text-sm text-bs-mid">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:text-bs-orange-dark underline underline-offset-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* --- Section 1 --- */}
          <section id="what-is" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              What is an SMSF investment strategy?
            </h2>
            <div className="space-y-4 text-sm text-bs-mid leading-relaxed">
              <p>
                Every SMSF must have a written investment strategy. This is
                not optional guidance&nbsp;&mdash; it is a legal obligation
                under{" "}
                <strong className="text-bs-charcoal">
                  SIS Regulation 4.09
                </strong>{" "}
                and reinforced by the trustee covenant in{" "}
                <strong className="text-bs-charcoal">
                  SIS Act s52(2)(f)
                </strong>
                .
              </p>
              <p>
                The strategy sets out the fund&rsquo;s objectives for making,
                holding, and realising investments. It must be
                formulated, reviewed regularly, and given effect to.
                A strategy that exists on paper but is not followed is as much a
                breach as having no strategy at all.
              </p>
              <p>
                Trustees who fail to prepare and implement an investment
                strategy face administrative penalties of up to{" "}
                <strong className="text-bs-charcoal">
                  $4,200 per trustee
                </strong>{" "}
                (or per director of a corporate trustee). The ATO can also issue
                education directions requiring trustees to complete approved
                training at their own cost.
              </p>
            </div>
          </section>

          {/* --- Section 2 --- */}
          <section id="five-considerations" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              The five mandatory considerations
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              SIS Regulation 4.09(2) lists five matters the strategy must
              address. Each represents both a compliance obligation and a
              practical planning step.
            </p>

            {/* (a) Risk and return */}
            <h3 className="font-semibold text-bs-charcoal mb-2">
              (a) Risk involved in, and likely return from, investments
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              The strategy must document the expected return profile and the
              risks associated with each asset class held. For a
              property-focused fund, this includes rental yield assumptions,
              vacancy risk, capital growth expectations, and interest rate
              exposure on any borrowing. Higher expected returns typically carry
              higher risk; both sides belong in the written record.
            </p>

            {/* (b) Diversification */}
            <h3 className="font-semibold text-bs-charcoal mb-2">
              (b) Composition of the fund&rsquo;s investments as a whole,
              including diversification
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              Trustees must consider the degree of diversification across and
              within asset classes. For a fund holding a single residential
              property, this means explicitly acknowledging the concentration
              and recording why the trustee considers it acceptable given the
              fund&rsquo;s circumstances. Diversification provides downside
              protection but can also dilute returns; the law requires
              consideration, not a specific outcome.
            </p>

            {/* (c) Liquidity */}
            <h3 className="font-semibold text-bs-charcoal mb-2">
              (c) Liquidity of the fund&rsquo;s investments
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              Property is inherently illiquid. A sale can take months and
              carries transaction costs of 2&ndash;5% of the property value.
              The strategy must show how the fund will meet ongoing cash
              obligations&nbsp;&mdash; insurance premiums, accounting fees, loan
              repayments, and member benefit payments&nbsp;&mdash; without being
              forced into a distressed sale.
            </p>

            {/* (d) Ability to discharge liabilities */}
            <h3 className="font-semibold text-bs-charcoal mb-2">
              (d) Ability to discharge existing and prospective liabilities
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              This extends beyond liquidity to cover the fund&rsquo;s total
              balance sheet. A fund with an LRBA must show it can service loan
              repayments under normal conditions and under stress scenarios
              (e.g., vacancy, rate rises). Prospective liabilities include a
              member approaching retirement who may soon request a lump sum or
              pension payments.
            </p>

            {/* (e) Insurance */}
            <h3 className="font-semibold text-bs-charcoal mb-2">
              (e) Whether to hold insurance cover for each member
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-6">
              The strategy must document whether the fund holds (or has decided
              not to hold) life, total and permanent disability, or income
              protection insurance for each member. Insurance adds a recurring
              cost that reduces net returns, but it provides protection against
              catastrophic events that could force a property sale. The decision
              either way must be recorded with reasons.
            </p>
          </section>

          {/* --- Section 3 --- */}
          <section id="concentration" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              Can you hold 90%+ in property?
            </h2>
            <div className="space-y-4 text-sm text-bs-mid leading-relaxed">
              <p>
                Yes. No provision in the SIS Act or Regulations sets a maximum
                allocation to any single asset or asset class. The obligation
                under SIS Regulation 4.09 is to{" "}
                <strong className="text-bs-charcoal">consider</strong> and{" "}
                <strong className="text-bs-charcoal">document</strong> the
                diversification rationale, not to achieve a specific allocation
                split.
              </p>
              <p>
                In 2019, the ATO conducted a targeted campaign, writing to
                approximately{" "}
                <strong className="text-bs-charcoal">
                  17,700 SMSF trustees
                </strong>{" "}
                whose funds held more than 90% of assets in a single asset or
                asset class. The letters did not allege a breach; they reminded
                trustees of their obligation to consider diversification and to
                document that consideration. Funds that could demonstrate genuine
                deliberation faced no further action.
              </p>
              <p>
                Concentration amplifies both upside and downside.
                A fund with 95% in a single property benefits fully from capital
                growth on that property, but also bears the full impact of a
                vacancy, market downturn, or unexpected maintenance cost. The
                key is that these trade-offs are understood and recorded,
                brick&nbsp;by&nbsp;brick.
              </p>
            </div>
          </section>

          {/* --- Inline CTA --- */}
          <div className="rounded-lg border border-bs-orange/30 bg-bs-orange-pale/30 p-6 mb-12">
            <p className="text-sm font-semibold text-bs-charcoal mb-2">
              Check your fund&rsquo;s concentration
            </p>
            <p className="text-sm text-bs-mid mb-4">
              Enter your pre- and post-purchase asset allocation to see how
              concentration compares with ATO benchmarks. Takes about
              2&nbsp;minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/diversification-checker">
                  Diversification Checker
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/quiz">SMSF Readiness Quiz</Link>
              </Button>
            </div>
          </div>

          {/* --- Section 4 --- */}
          <section id="documenting" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              How to document a concentration decision
            </h2>
            <div className="space-y-4 text-sm text-bs-mid leading-relaxed">
              <p>
                Documentation is the difference between a compliant fund and a
                non-compliant one. The ATO looks for evidence that
                diversification was genuinely considered, not merely that a
                checkbox was ticked.
              </p>
              <p>
                The investment strategy itself should contain language showing
                the trustee has weighed concentration risk. For example:
                &ldquo;The trustee has considered the concentration of fund
                assets in a single residential property and has determined
                that this allocation is appropriate given [specific
                reasons].&rdquo;
              </p>
              <p>
                Supporting evidence to retain alongside the strategy includes:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Signed minutes of trustee meetings discussing the strategy</li>
                <li>
                  Cash flow projections showing the fund can meet expenses during
                  vacancy
                </li>
                <li>
                  Market research or valuation reports considered at the time of
                  the decision
                </li>
                <li>
                  Correspondence with advisers (accountant, financial planner) on
                  the topic
                </li>
                <li>
                  Annual review notes confirming the strategy was reconsidered
                </li>
              </ul>
              <p>
                Records that exist only in hindsight carry less weight. The
                strongest evidence is contemporaneous&nbsp;&mdash; created at or
                near the time the decision was made.
              </p>
            </div>
          </section>

          {/* --- Section 5 --- */}
          <section id="when-to-review" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              When to review your strategy
            </h2>
            <div className="space-y-4 text-sm text-bs-mid leading-relaxed">
              <p>
                The SIS Act requires the investment strategy to be reviewed
                &ldquo;regularly.&rdquo; The ATO considers at least annual
                review as the minimum standard. However, certain events
                should trigger an immediate review regardless of the
                annual cycle:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Purchase or sale of a major asset (especially property)</li>
                <li>
                  A member approaching retirement or requesting a benefit
                  payment
                </li>
                <li>
                  Change in a member&rsquo;s employment, health, or family
                  circumstances
                </li>
                <li>Significant market movements or interest rate changes</li>
                <li>New member joining or existing member leaving the fund</li>
                <li>Change in insurance arrangements</li>
              </ul>
              <p>
                Each review should be documented with the date, the matters
                considered, and whether the strategy was amended or confirmed
                unchanged. A one-line file note stating &ldquo;strategy
                reviewed, no changes&rdquo; is insufficient; the record must
                show what was actually considered.
              </p>
            </div>
          </section>

          {/* --- Section 6 --- */}
          <section id="property" className="mb-12 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              Investment strategy and property
            </h2>
            <div className="space-y-4 text-sm text-bs-mid leading-relaxed">
              <p>
                Property introduces specific considerations that the investment
                strategy must address explicitly. These go beyond the general
                five-factor framework.
              </p>
              <p>
                <strong className="text-bs-charcoal">Illiquidity.</strong>{" "}
                Unlike shares or managed funds, property cannot be partially
                sold. The strategy must address how the fund will maintain
                adequate cash reserves to cover expenses during the period
                required to sell (typically 3&ndash;6 months, potentially longer
                in a slow market).
              </p>
              <p>
                <strong className="text-bs-charcoal">Concentration.</strong>{" "}
                A single property can represent 70&ndash;95% of a
                fund&rsquo;s assets. The strategy must explicitly acknowledge
                this concentration and document the trustee&rsquo;s rationale
                for accepting it. Higher concentration increases sensitivity to
                property-specific events such as tenant default or local
                market decline.
              </p>
              <p>
                <strong className="text-bs-charcoal">
                  Insurance of property.
                </strong>{" "}
                Building and landlord insurance are not merely prudent; they
                relate directly to the trustee&rsquo;s obligation to protect
                fund assets. The strategy should note the types of cover held
                and the sums insured.
              </p>
              <p>
                <strong className="text-bs-charcoal">
                  Cash reserves for maintenance and vacancy.
                </strong>{" "}
                The strategy should set out the fund&rsquo;s approach to
                maintaining a cash buffer. Common considerations include the
                cost of foreseeable repairs, the likelihood and expected
                duration of vacancy, and the fund&rsquo;s capacity to meet
                loan repayments from contributions alone if rental income
                stops. Holding insufficient cash is a risk; holding too much
                reduces exposure to growth assets.
              </p>
            </div>
          </section>

          {/* --- FAQ --- */}
          <div id="faq" className="scroll-mt-24">
            <FAQSection items={FAQ_ITEMS} />
          </div>

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([articleSchema, faqSchema]),
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
