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

const PAGE_TITLE = "LRBA Explained: How SMSF Property Borrowing Works";
const PAGE_DESCRIPTION =
  "A plain-English guide to limited recourse borrowing arrangements (LRBAs) for SMSFs. Structure, lending rates, ATO safe harbour, bare trusts, and key risks.";
const PAGE_URL = "https://bricksuper.com/lrba-explained";
const DATE_PUBLISHED = "2025-07-01";
const DATE_MODIFIED = "2026-03-27";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    siteName: "BrickSuper",
  },
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Can an SMSF borrow to buy residential property?",
    answer:
      "An SMSF may borrow under a limited recourse borrowing arrangement (LRBA) as permitted by SIS Act s67A. The property must be held in a bare trust until the loan is fully repaid. This is one of the few exceptions to the general borrowing prohibition in s67 of the SIS Act.",
  },
  {
    question: "What happens if the SMSF defaults on an LRBA loan?",
    answer:
      "Because the arrangement is limited recourse, the lender's claim is restricted to the asset held in the bare trust. The lender cannot pursue other assets within the SMSF. However, a default may still trigger broader compliance issues and could affect the fund's ability to meet member benefit obligations.",
  },
  {
    question: "Do the big four banks offer SMSF loans?",
    answer:
      "As of 2025, all four major Australian banks (CBA, Westpac, NAB, ANZ) have withdrawn from SMSF lending. SMSF borrowers typically access finance through non-bank lenders such as Reduce Home Loans, Liberty, Firstmac, and others. Non-bank rates and terms vary significantly.",
  },
  {
    question: "What is the ATO safe harbour interest rate for related-party LRBAs?",
    answer:
      "For the 2025-26 income year, the ATO safe harbour rate is 8.85% for real property. This rate applies when an SMSF borrows from a related party. If the interest rate charged is below the safe harbour rate, the ATO may treat the difference as non-arm's length income, which is taxed at the top marginal rate.",
  },
  {
    question: "Can an SMSF improve a property purchased under an LRBA?",
    answer:
      "While the LRBA is in place, the SMSF generally cannot make improvements that change the fundamental character of the property. Repairs and maintenance are permitted, but renovations, extensions, or structural changes are not allowed until the loan is fully repaid and the property is transferred out of the bare trust into the SMSF's name.",
  },
];

const TOC_ITEMS = [
  { id: "what-is-lrba", label: "What is an LRBA?" },
  { id: "lrba-structure", label: "How an LRBA is structured" },
  { id: "lending-rates", label: "Current lending rates" },
  { id: "safe-harbour", label: "ATO safe harbour rate" },
  { id: "risks", label: "Risks of LRBA borrowing" },
  { id: "lrba-vs-no-borrowing", label: "LRBA vs buying without borrowing" },
  { id: "bare-trust", label: "The bare trust explained" },
];

export default function LRBAExplainedPage() {
  const faqSchema = generateFAQSchema(FAQ_ITEMS);
  const articleSchema = generateArticleSchema({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    wordCount: 2200,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <SiteHeader />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-prose mx-auto">
            {/* Header */}
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal leading-tight mb-4">
              {PAGE_TITLE}
            </h1>
            <LastUpdated date={new Date(DATE_MODIFIED)} className="mb-8" />

            {/* Table of Contents */}
            <nav
              aria-label="Table of contents"
              className="border border-border rounded-xl p-5 mb-10 bg-muted/30"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-bs-muted mb-3">
                In this guide
              </p>
              <ol className="space-y-1.5">
                {TOC_ITEMS.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-bs-mid hover:text-bs-orange-dark transition-colors"
                    >
                      {i + 1}. {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Section 1: What is an LRBA? */}
            <section id="what-is-lrba" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                What is a limited recourse borrowing arrangement?
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                A limited recourse borrowing arrangement (LRBA) is the primary legal
                mechanism that allows an SMSF to borrow money to acquire a single
                acquirable asset. It is governed by{" "}
                <strong>Section 67A of the Superannuation Industry (Supervision) Act 1993</strong>{" "}
                (SIS Act), which creates an exception to the general prohibition on
                superannuation fund borrowing under s67.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                The term &ldquo;limited recourse&rdquo; means the lender&rsquo;s rights
                are restricted to the asset being acquired. If the SMSF defaults, the
                lender can seize the property held in the bare trust but cannot pursue
                other assets within the fund. This protects existing member balances from
                being used to satisfy the debt.
              </p>
              <blockquote className="border-l-4 border-bs-orange pl-4 my-6 text-bs-mid italic">
                &ldquo;Limited recourse&rdquo; protects the fund&rsquo;s other assets
                from the lender&rsquo;s claim — but it does not protect the fund from
                the consequences of losing the property itself.
              </blockquote>
              <p className="text-bs-slate leading-relaxed">
                The property must be a &ldquo;single acquirable asset&rdquo; as defined
                by the SIS Act. It cannot be improved or fundamentally altered while
                held in the bare trust. This restriction has significant implications
                for renovation strategies.
              </p>
            </section>

            {/* Section 2: How an LRBA is structured */}
            <section id="lrba-structure" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                How an LRBA is structured
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                An LRBA involves three parties and a specific holding structure
                mandated by s67A of the SIS Act:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>The SMSF trustee</strong> — enters the loan agreement
                  and directs the investment. The trustee has beneficial ownership but
                  not legal title while the loan is outstanding.
                </li>
                <li>
                  <strong>The lender</strong> — provides the loan funds. This may be a
                  bank, non-bank lender, or in some cases a related party (subject to
                  arm&rsquo;s length requirements).
                </li>
                <li>
                  <strong>The bare trust (holding trust)</strong> — a separate trust that
                  holds legal title to the property on behalf of the SMSF. The bare
                  trustee&rsquo;s only role is to hold the asset.
                </li>
              </ol>
              <p className="text-bs-slate leading-relaxed mb-4">
                While the loan is outstanding, the property sits in the bare trust. The
                SMSF trustee makes loan repayments and collects rental income (if any).
                Once the loan is fully repaid, the bare trustee transfers legal title to
                the SMSF trustee, and the bare trust is wound up.
              </p>
              <blockquote className="border-l-4 border-bs-orange pl-4 my-6 text-bs-mid italic">
                The bare trust exists solely to satisfy the SIS Act requirement. It
                holds legal title but has no discretion — it acts only on the SMSF
                trustee&rsquo;s direction.
              </blockquote>
            </section>

            {/* Section 3: Current SMSF lending rates */}
            <section id="lending-rates" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                Current SMSF lending rates
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Since the exit of the big four banks from SMSF lending, borrowers
                rely on non-bank lenders. The table below shows indicative rates as
                of early 2026. These are factual market observations, not
                endorsements of any lender.
              </p>

              <div className="border border-border rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        Lender
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        Indicative Rate
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        Max LVR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-bs-slate">Reduce Home Loans</td>
                      <td className="px-4 py-3 text-bs-slate">~6.39%</td>
                      <td className="px-4 py-3 text-bs-slate">80%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate">loans.com.au</td>
                      <td className="px-4 py-3 text-bs-slate">~6.49%</td>
                      <td className="px-4 py-3 text-bs-slate">80%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate">WLTH</td>
                      <td className="px-4 py-3 text-bs-slate">~6.59%</td>
                      <td className="px-4 py-3 text-bs-slate">70%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate">Liberty</td>
                      <td className="px-4 py-3 text-bs-slate">~6.89%</td>
                      <td className="px-4 py-3 text-bs-slate">80%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate">Firstmac</td>
                      <td className="px-4 py-3 text-bs-slate">~7.19%</td>
                      <td className="px-4 py-3 text-bs-slate">70%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-bs-muted mb-4">
                Rates are indicative only, sourced from publicly available lender
                rate cards as of March 2026. Actual rates depend on LVR, loan size,
                property type, and borrower circumstances. Rates change frequently.
              </p>
              <p className="text-bs-slate leading-relaxed">
                Most non-bank SMSF lenders offer LVRs between 60% and 80% for
                residential property. Commercial property LVRs are typically lower,
                around 60-70%. Loan terms generally range from 15 to 30 years with
                principal and interest repayments required.
              </p>
            </section>

            {/* Section 4: ATO safe harbour rate */}
            <section id="safe-harbour" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                The ATO safe harbour rate
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                When an SMSF borrows from a related party (for example, a member or
                a related company), the ATO requires the loan to be on arm&rsquo;s
                length terms. To simplify compliance, the ATO publishes a{" "}
                <strong>safe harbour interest rate</strong> each income year.
              </p>
              <blockquote className="border-l-4 border-bs-orange pl-4 my-6 text-bs-mid italic">
                For the 2025-26 income year, the ATO safe harbour rate for real
                property LRBAs is <strong>8.85% per annum</strong>. This is
                published in PCG 2016/5.
              </blockquote>
              <p className="text-bs-slate leading-relaxed mb-4">
                The safe harbour rate applies specifically to related-party LRBAs. If
                the SMSF borrows from a commercial lender at market rates, the safe
                harbour rate is not directly relevant — the commercial terms themselves
                satisfy the arm&rsquo;s length requirement.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                If a related-party loan charges interest below the safe harbour rate
                without meeting the alternative arm&rsquo;s length criteria in PCG
                2016/5, the ATO may treat the income from that arrangement as{" "}
                <strong>non-arm&rsquo;s length income (NALI)</strong>. NALI is taxed
                at the top marginal rate (currently 45%) rather than the concessional
                superannuation rate of 15%.
              </p>
              <p className="text-bs-slate leading-relaxed">
                The safe harbour rate is reviewed annually and is typically higher
                than commercial SMSF lending rates, reflecting the ATO&rsquo;s
                expectation of a risk premium on related-party loans.
              </p>
            </section>

            {/* CTA */}
            <div className="border border-border rounded-xl p-6 text-center my-12 bg-muted/30">
              <p className="font-serif text-lg text-bs-charcoal mb-2">
                Model the numbers for a specific scenario
              </p>
              <p className="text-sm text-bs-mid mb-4">
                The LRBA calculator shows repayments, rent-vs-gap analysis, and
                stress tests at higher interest rates.
              </p>
              <Button asChild>
                <Link href="/lrba-calculator">Open the LRBA Calculator</Link>
              </Button>
            </div>

            {/* Section 5: Risks */}
            <section id="risks" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                Risks of LRBA borrowing
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Borrowing within an SMSF amplifies both returns and risks. The
                following risks are well-documented in ATO and ASIC guidance:
              </p>
              <ul className="space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>Concentration risk.</strong> A single property may
                  represent 50-80% of total fund assets after an LRBA purchase,
                  reducing diversification across asset classes.
                </li>
                <li>
                  <strong>Liquidity pressure.</strong> Loan repayments, insurance,
                  maintenance, and land tax create ongoing cash demands. If rental
                  income falls short, the fund must use other assets or member
                  contributions to cover the gap.
                </li>
                <li>
                  <strong>Interest rate rises.</strong> A 2-3% rate increase on a
                  $400,000 loan adds $8,000-$12,000 per year in interest costs.
                  Stress testing at higher rates is prudent.
                </li>
                <li>
                  <strong>Vacancy and tenant risk.</strong> Extended vacancies
                  create direct cash flow pressure while loan repayments continue
                  regardless of occupancy.
                </li>
                <li>
                  <strong>Inability to improve the property.</strong> Under SIS Act
                  s67A, the property cannot be fundamentally altered while held in
                  the bare trust. This prevents value-adding renovations during the
                  loan period.
                </li>
                <li>
                  <strong>Forced sale risk.</strong> If the fund cannot meet
                  repayments and other obligations (such as pension payments to
                  retired members), the trustee may need to sell the property,
                  potentially at an unfavourable time.
                </li>
              </ul>
              <blockquote className="border-l-4 border-bs-orange pl-4 my-6 text-bs-mid italic">
                ASIC Report 575 (2018) found that SMSF members with balances below
                $500,000 generally had lower returns than equivalent APRA-regulated
                funds, with property concentration being a contributing factor.
              </blockquote>
            </section>

            {/* Section 6: LRBA vs buying without borrowing */}
            <section id="lrba-vs-no-borrowing" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                LRBA vs buying without borrowing
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Both approaches have trade-offs. The table below summarises key
                differences — neither approach is inherently superior.
              </p>

              <div className="border border-border rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        Factor
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        With LRBA
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-bs-charcoal">
                        Without borrowing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Entry cost</td>
                      <td className="px-4 py-3 text-bs-slate">
                        20-40% deposit plus costs
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        100% purchase price plus costs
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Ongoing costs</td>
                      <td className="px-4 py-3 text-bs-slate">
                        Loan repayments, bare trust fees, higher accounting
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        Standard property costs only
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Property choice</td>
                      <td className="px-4 py-3 text-bs-slate">
                        Cannot alter character during loan
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        Full flexibility to renovate
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Risk profile</td>
                      <td className="px-4 py-3 text-bs-slate">
                        Leverage amplifies gains and losses
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        No leverage risk
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Complexity</td>
                      <td className="px-4 py-3 text-bs-slate">
                        Bare trust deed, separate trustee, lender requirements
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        Standard SMSF property purchase
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-bs-slate font-medium">Tax deductions</td>
                      <td className="px-4 py-3 text-bs-slate">
                        Interest is deductible against fund income
                      </td>
                      <td className="px-4 py-3 text-bs-slate">
                        No interest deduction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 7: The bare trust explained */}
            <section id="bare-trust" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                The bare trust explained
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                A bare trust (sometimes called a holding trust or custodian trust) is
                a trust where the trustee holds legal title to an asset but has no
                active duties beyond holding and transferring the asset as directed.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                Under an LRBA, the bare trust is a mandatory structural requirement.
                Section 67A of the SIS Act requires the acquired asset to be held on
                trust so that the SMSF trustee acquires beneficial ownership while
                the bare trustee holds legal title. This structure is what makes the
                loan &ldquo;limited recourse&rdquo; — the lender&rsquo;s security
                interest is limited to the asset in the bare trust.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                The bare trustee is typically a special-purpose company established
                solely for this role. It cannot be the same entity as the SMSF
                trustee. The bare trust requires its own trust deed, which must be
                properly executed before settlement.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                Once the LRBA loan is fully repaid, the bare trustee transfers legal
                title of the property to the SMSF trustee. At this point, the bare
                trust is wound up and the SMSF holds the property directly. The
                property is then treated as any other SMSF asset — it can be
                renovated, improved, or dealt with at the trustee&rsquo;s discretion
                (subject to the fund&rsquo;s investment strategy and sole purpose
                test under s62 of the SIS Act).
              </p>
              <blockquote className="border-l-4 border-bs-orange pl-4 my-6 text-bs-mid italic">
                A bare trust is not optional in an LRBA — it is a structural
                requirement under s67A. Without a properly constituted bare trust,
                the borrowing arrangement may breach the SIS Act.
              </blockquote>
            </section>

            {/* Disclaimer */}
            <div className="border-t border-border pt-6 mt-12 text-xs text-bs-muted leading-relaxed">
              <p className="mb-2">
                <strong>General information only.</strong> This page provides factual
                information about SMSF borrowing under the SIS Act. It is not
                financial advice, tax advice, or a recommendation to enter into any
                borrowing arrangement. Lending rates shown are indicative and sourced
                from publicly available rate cards — they are not offers or
                endorsements.
              </p>
              <p>
                Decisions about SMSF borrowing involve complex regulatory, tax, and
                financial considerations. Trustees considering an LRBA typically
                consult a licensed financial adviser, SMSF specialist accountant, and
                solicitor experienced in superannuation law.
              </p>
            </div>

            {/* FAQ */}
            <FAQSection items={FAQ_ITEMS} />
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
