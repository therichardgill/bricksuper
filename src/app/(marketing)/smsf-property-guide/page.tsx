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
    question: "Can my SMSF buy a property I already own?",
    answer:
      "Under SIS Act s66, an SMSF generally cannot acquire assets from related parties. However, there is a specific exception for 'business real property' (s66(2)(b)). Residential property owned by a member or related party cannot be transferred into the SMSF. The ATO has issued multiple compliance actions against trustees who have attempted this arrangement.",
  },
  {
    question: "What is the minimum SMSF balance needed to invest in property?",
    answer:
      "There is no legislated minimum balance. However, the ATO has stated that SMSF trustees must consider diversification and liquidity when making investment decisions (SMSFR 2012/1). Industry bodies such as the SMSF Association have noted that funds with balances below $200,000 may face challenges meeting ongoing costs while maintaining adequate diversification, though this depends on individual circumstances.",
  },
  {
    question:
      "Can my SMSF borrow to buy property after the 2025 changes?",
    answer:
      "Limited recourse borrowing arrangements (LRBAs) remain available to SMSFs as of the 2024-25 financial year. While various reviews have considered restricting LRBAs — including the Financial System Inquiry (2014) and the Superannuation Tax Reform discussion paper — no legislation has been passed to prohibit them. Trustees should monitor ATO and Treasury announcements, as policy in this area continues to evolve.",
  },
  {
    question: "How is rental income from SMSF property taxed?",
    answer:
      "Rental income received by an SMSF in accumulation phase is taxed at a maximum rate of 15%. If the fund is paying a retirement phase pension and the property supports that pension, the income may be tax-exempt under the exempt current pension income (ECPI) provisions (s295-385 of ITAA 1997). However, expenses, fund administration costs, and accounting fees reduce the net income figure. The specific tax outcome depends on the fund's circumstances.",
  },
  {
    question: "Can SMSF members live in a property owned by the fund?",
    answer:
      "No. Under SIS Regulation 13.22A, residential property held by an SMSF must not be lived in by a member, or any related party of a member. It also must not be rented to a member or related party. Breaching this rule is a contravention of the sole purpose test (s62) and can result in the fund being made non-complying, which carries severe tax penalties — up to 45% of the fund's assets.",
  },
  {
    question:
      "What happens to SMSF property when a member dies?",
    answer:
      "The treatment depends on the fund's trust deed, any binding death benefit nomination (BDBN), and the remaining members. The property may need to be sold to pay a death benefit lump sum, or it may be retained if another member continues in the fund and the deed permits it. Where a property is the fund's main asset, liquidity constraints can force a sale under time pressure. Estate planning for SMSF property is an area where legal and financial advice specific to the member's circumstances is particularly important.",
  },
];

const ARTICLE_DATE_PUBLISHED = "2024-11-15";
const ARTICLE_DATE_MODIFIED = "2025-03-27";

export const metadata: Metadata = {
  title: "SMSF Property Investment: The Complete Australian Guide",
  description:
    "A plain-English guide to buying property in a Self-Managed Super Fund. Covers SIS Act rules, LRBA borrowing, costs, tax deductions, residential vs commercial, and common mistakes.",
  openGraph: {
    title: "SMSF Property Investment: The Complete Australian Guide",
    description:
      "Rules, costs, tax treatment, borrowing structures, and exit strategies for SMSF property — explained in plain English.",
    type: "article",
    url: "https://bricksuper.com/smsf-property-guide",
  },
  other: {
    "script:ld+json": JSON.stringify([
      generateArticleSchema({
        title: "SMSF Property Investment: The Complete Australian Guide",
        description:
          "A plain-English guide to buying property in a Self-Managed Super Fund. Covers SIS Act rules, LRBA borrowing, costs, tax deductions, and common mistakes.",
        url: "https://bricksuper.com/smsf-property-guide",
        datePublished: ARTICLE_DATE_PUBLISHED,
        dateModified: ARTICLE_DATE_MODIFIED,
        wordCount: 3200,
      }),
      generateFAQSchema(FAQ_ITEMS),
    ]),
  },
};

const TOC_ITEMS = [
  { id: "what-is-smsf-property", label: "What is SMSF property investment?" },
  { id: "rules", label: "Rules for buying property" },
  { id: "residential-vs-commercial", label: "Residential vs commercial" },
  { id: "costs", label: "Costs" },
  { id: "tax-deductions", label: "Tax deductions" },
  { id: "lrba-structure", label: "LRBA borrowing structure" },
  { id: "exit-strategies", label: "Exit strategies & timing" },
  { id: "common-mistakes", label: "Common mistakes to avoid" },
];

export default function SMSFPropertyGuidePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-prose mx-auto">
            {/* Header */}
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal leading-tight">
              SMSF Property Investment: The Complete Australian Guide
            </h1>
            <div className="mt-4">
              <LastUpdated date={new Date(ARTICLE_DATE_MODIFIED)} />
            </div>

            {/* Table of Contents */}
            <nav
              aria-label="Table of contents"
              className="mt-8 bg-muted/40 border border-border rounded-lg p-5"
            >
              <p className="text-sm font-semibold text-bs-charcoal mb-3">
                In this guide
              </p>
              <ol className="space-y-1.5">
                {TOC_ITEMS.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-bs-mid hover:text-bs-orange transition-colors"
                    >
                      {i + 1}. {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* --- Section 1: What is SMSF property investment? --- */}
            <section id="what-is-smsf-property" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                1. What is SMSF property investment?
              </h2>
              <p className="text-bs-slate leading-relaxed">
                A Self-Managed Super Fund (SMSF) is a private superannuation fund
                regulated by the ATO, with a maximum of six members who are
                typically also the trustees. Under superannuation law, SMSFs can
                invest in a broad range of assets, including direct property —
                both residential and commercial.
              </p>
              <p className="text-bs-slate leading-relaxed mt-4">
                As of June 2023, the ATO reported that SMSFs held approximately
                $88 billion in direct property (residential and non-residential
                combined), representing around 10% of total SMSF assets under
                management. Property is the third-largest SMSF asset class behind
                listed shares and cash.
              </p>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif text-bs-charcoal">
                Property in super is not the same as property outside super. The
                rules are stricter, the costs are higher, and the consequences of
                getting it wrong are severe. The benefit is the tax environment —
                but that benefit only materialises if the structure is compliant
                and the numbers work.
              </div>
              <p className="text-bs-slate leading-relaxed">
                SMSF property investment means the fund — not the individual —
                owns the property. The property is held on trust for the members'
                retirement benefit. This distinction has significant legal,
                financial, and practical implications that run through every
                section of this guide.
              </p>
            </section>

            {/* --- Section 2: Rules for buying property --- */}
            <section id="rules" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                2. Rules for buying property in your SMSF
              </h2>
              <p className="text-bs-slate leading-relaxed">
                The Superannuation Industry (Supervision) Act 1993 (SIS Act) and
                its regulations set out the legal framework. Several core tests
                apply to every SMSF property purchase:
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                The sole purpose test (s62)
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Every investment decision must be made for the sole purpose of
                providing retirement benefits to fund members (or their dependants
                in the event of death). If a property purchase provides a current
                benefit to a member — such as a holiday home they use personally —
                it fails this test. The penalty for breaching the sole purpose
                test can include the fund being declared non-complying, resulting
                in tax at the top marginal rate on the fund's entire taxable
                income.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Arm&apos;s length dealing (s109)
              </h3>
              <p className="text-bs-slate leading-relaxed">
                All SMSF investments must be made and maintained on an arm&apos;s
                length basis. For property, this means the purchase price must
                reflect market value, rent must be set at market rates, and lease
                terms must reflect what an independent party would agree to. The
                ATO actively audits related-party transactions for arm&apos;s
                length compliance.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Related party acquisition rules (s66)
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Under s66 of the SIS Act, an SMSF is generally prohibited from
                acquiring assets from related parties. The key exception is
                business real property (BRP) — commercial property used wholly and
                exclusively in a business. A member can sell their commercial
                premises to their SMSF, but residential property cannot be
                acquired from a related party under any circumstances.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                In-house asset rules (s82-85)
              </h3>
              <p className="text-bs-slate leading-relaxed">
                An SMSF must not hold more than 5% of its total assets as
                in-house assets. Leasing residential property to a related party
                would make it an in-house asset and likely breach this limit. BRP
                leased to a related party business is specifically excluded from
                the in-house asset definition under s71(1)(j), which is one reason
                commercial property has distinct advantages in an SMSF context.
              </p>

              <p className="text-bs-slate leading-relaxed mt-4 font-medium">
                Questions to discuss with your licensed adviser:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-bs-slate leading-relaxed">
                <li>Does the specific property pass the sole purpose test given your fund&apos;s circumstances?</li>
                <li>Are all related-party transactions documented at arm&apos;s length valuations?</li>
                <li>Does your fund&apos;s trust deed permit direct property investment?</li>
              </ul>
            </section>

            {/* --- Section 3: Residential vs commercial --- */}
            <section id="residential-vs-commercial" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                3. Residential vs commercial property
              </h2>
              <p className="text-bs-slate leading-relaxed">
                The distinction between residential and commercial property in an
                SMSF is not just about asset class — it affects what transactions
                are legally permitted, who can use the property, and the risk
                profile of the investment.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Residential property
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Residential property held in an SMSF cannot be lived in by, or
                rented to, any member or related party (SIS Reg 13.22A). It
                cannot be acquired from a related party. Rental yields on
                residential property have historically been lower than commercial
                (CoreLogic data from 2023 showed a national gross residential
                yield of approximately 3.7%). Vacancy periods are typically
                shorter than commercial, but tenant turnover and maintenance
                demands can be higher.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Commercial property (business real property)
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Business real property can be acquired from a related party and
                leased back to a member&apos;s business — a significant structural
                advantage. Commercial leases are typically longer (3-10 years with
                options), and tenants often cover outgoings under net lease
                structures. However, commercial vacancy periods can be
                substantially longer, and finding a new tenant for a specialised
                commercial property may take months. ASIC Report 824 (2022) noted
                that concentration in a single commercial property represents a
                material risk to SMSF portfolios.
              </p>

              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif text-bs-charcoal">
                Both property types carry concentration risk. The ATO&apos;s 2019
                compliance campaign found that many funds with property as their
                dominant asset had insufficient liquidity to pay benefits or meet
                expenses when circumstances changed.
              </div>

              <p className="text-bs-slate leading-relaxed mt-4 font-medium">
                Questions to discuss with your licensed adviser:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-bs-slate leading-relaxed">
                <li>What percentage of the fund would this property represent, and does that align with the fund&apos;s investment strategy?</li>
                <li>If the property were vacant for 6-12 months, could the fund meet its obligations?</li>
              </ul>
            </section>

            {/* --- Section 4: Costs --- */}
            <section id="costs" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                4. Costs of SMSF property investment
              </h2>
              <p className="text-bs-slate leading-relaxed">
                The cost structure for buying property inside an SMSF is
                materially different from purchasing in a personal name. These
                additional costs reduce net returns and must be factored into any
                analysis.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Setup and acquisition costs
              </h3>
              <ul className="list-disc pl-6 mt-2 space-y-1.5 text-bs-slate leading-relaxed">
                <li>SMSF establishment (if new fund): $1,500 - $3,500 including trust deed and corporate trustee setup</li>
                <li>Conveyancing and legal fees: $1,500 - $3,000 (may be higher for LRBA structures requiring a bare trust deed)</li>
                <li>Stamp duty: varies by state and property value — this is typically the largest single transaction cost</li>
                <li>Bare trust deed (for LRBA): $500 - $1,500</li>
                <li>Lender establishment fees (LRBA): $500 - $2,000</li>
                <li>Property valuation: $300 - $800</li>
              </ul>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Ongoing annual costs
              </h3>
              <ul className="list-disc pl-6 mt-2 space-y-1.5 text-bs-slate leading-relaxed">
                <li>SMSF annual audit: $500 - $1,500</li>
                <li>Accounting and tax return preparation: $1,500 - $3,500</li>
                <li>ASIC annual review fee (corporate trustee): approximately $63</li>
                <li>ATO supervisory levy: $259 (2024-25)</li>
                <li>Property management fees: typically 5-10% of gross rental income</li>
                <li>Insurance (building and landlord): varies by property</li>
                <li>Maintenance and repairs: varies, but should be budgeted</li>
              </ul>

              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif text-bs-charcoal">
                The ATO notes that total annual SMSF running costs average around
                $4,500 to $7,000 per year, before property-specific expenses.
                These costs exist whether or not the property is tenanted. For
                funds with smaller balances, fixed costs consume a larger
                proportion of returns.
              </div>

              <p className="text-bs-slate leading-relaxed mt-4 font-medium">
                Questions to discuss with your licensed adviser:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-bs-slate leading-relaxed">
                <li>What are the total annual holding costs for this property within the SMSF, including fund-level costs?</li>
                <li>At what occupancy rate does the property break even after all SMSF and property costs?</li>
              </ul>
            </section>

            {/* --- Section 5: Tax deductions --- */}
            <section id="tax-deductions" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                5. Tax deductions available
              </h2>
              <p className="text-bs-slate leading-relaxed">
                SMSFs in accumulation phase pay tax at a maximum rate of 15% on
                net income. This concessional rate applies to rental income, and
                the fund can claim deductions for expenses incurred in producing
                that income.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Deductible expenses
              </h3>
              <ul className="list-disc pl-6 mt-2 space-y-1.5 text-bs-slate leading-relaxed">
                <li>Interest on LRBA borrowings (deductible to the fund, subject to s26-102 ITAA 1997 for limited recourse arrangements)</li>
                <li>Property management fees</li>
                <li>Council rates, water rates, land tax</li>
                <li>Insurance premiums (building, landlord)</li>
                <li>Repairs and maintenance (revenue expenses, not capital improvements)</li>
                <li>Depreciation of building (Division 43) and plant and equipment (Division 40)</li>
                <li>SMSF administration costs apportioned to the property</li>
              </ul>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Capital gains tax (CGT) treatment
              </h3>
              <p className="text-bs-slate leading-relaxed">
                If an SMSF holds a property for more than 12 months in
                accumulation phase, it is eligible for a one-third CGT discount —
                meaning only two-thirds of the capital gain is included in
                assessable income, resulting in an effective CGT rate of 10%. In
                pension phase, capital gains may be entirely exempt under the ECPI
                provisions. However, where a property is purchased under an LRBA,
                the CGT cost base calculations are more complex, and a tax
                professional familiar with SMSF property is needed to determine the
                correct position.
              </p>

              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif text-bs-charcoal">
                Tax benefits are real, but they are not guaranteed. Changes to
                superannuation tax law — such as the proposed Division 296 tax on
                balances above $3 million — can alter the equation. The tax
                advantage of holding property in super must be weighed against the
                additional costs, reduced flexibility, and liquidity constraints.
              </div>
            </section>

            {/* --- Section 6: LRBA borrowing structure --- */}
            <section id="lrba-structure" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                6. The LRBA borrowing structure
              </h2>
              <p className="text-bs-slate leading-relaxed">
                Under s67A of the SIS Act, an SMSF may borrow money under a
                limited recourse borrowing arrangement to acquire a single
                acquirable asset. This is the only way an SMSF can borrow to
                invest (with limited exceptions for short-term settlement
                borrowing under s67(2)).
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                How an LRBA works
              </h3>
              <p className="text-bs-slate leading-relaxed">
                The property is held on a separate bare trust (also called a
                holding trust or custodian trust) until the loan is fully repaid.
                The bare trustee holds legal title to the property on behalf of
                the SMSF. Once the loan is repaid, title transfers to the SMSF
                trustee. The &quot;limited recourse&quot; element means the
                lender&apos;s recourse is limited to the asset itself — if the
                SMSF defaults, the lender can seize the property but cannot claim
                against other SMSF assets.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Key restrictions
              </h3>
              <ul className="list-disc pl-6 mt-2 space-y-1.5 text-bs-slate leading-relaxed">
                <li>The borrowed funds must be used to acquire a single acquirable asset (s67A(1)(a))</li>
                <li>The asset must not be subject to a charge or encumbrance prior to acquisition</li>
                <li>The property cannot be altered in a way that would make it a different asset — renovations are limited to repairs, maintenance, and like-for-like replacement (ATO SMSFR 2012/1)</li>
                <li>Interest rates on related-party loans must comply with the ATO&apos;s safe harbour terms (PCG 2016/5) — currently the RBA cash rate plus 4% for real property, reviewed periodically</li>
              </ul>

              <p className="text-bs-slate leading-relaxed mt-4">
                For a detailed breakdown of LRBA structures, interest rates, and
                safe harbour terms, see the{" "}
                <Link
                  href="/lrba-explained"
                  className="text-bs-orange hover:underline underline-offset-2"
                >
                  LRBA Explained guide
                </Link>
                .
              </p>

              <p className="text-bs-slate leading-relaxed mt-4 font-medium">
                Questions to discuss with your licensed adviser:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-bs-slate leading-relaxed">
                <li>Is an LRBA appropriate given the fund&apos;s cash flow and members&apos; ages?</li>
                <li>Can the fund service the loan if the property is vacant for an extended period?</li>
                <li>What are the total interest costs over the life of the loan compared to the expected after-tax return?</li>
              </ul>
            </section>

            {/* --- Section 7: Exit strategies --- */}
            <section id="exit-strategies" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                7. Exit strategies and timing
              </h2>
              <p className="text-bs-slate leading-relaxed">
                Property is an illiquid asset. Selling a property takes weeks to
                months, and the SMSF trustee does not control the timeline. Exit
                planning is a critical part of SMSF property investment that is
                frequently underestimated.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Selling property in the fund
              </h3>
              <p className="text-bs-slate leading-relaxed">
                A property sale follows the same process as any property
                transaction — listing, negotiation, conveyancing, settlement. The
                SMSF trustee is the vendor. Sale proceeds are credited to the
                fund&apos;s bank account. Capital gains tax applies as described in
                Section 5 above, and the timing of the sale (relative to pension
                phase status) affects the tax outcome significantly.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Transitioning to pension phase
              </h3>
              <p className="text-bs-slate leading-relaxed">
                When a member reaches preservation age and meets a condition of
                release (such as retirement), the fund can begin paying a pension.
                If the property supports a pension income stream, the rental income
                and any capital gain on sale may qualify as exempt current pension
                income. However, the fund must still be able to meet minimum
                pension payment requirements — and if the property is the fund&apos;s
                primary asset, this can create cash flow pressure.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Member death or incapacity
              </h3>
              <p className="text-bs-slate leading-relaxed">
                If a member dies or becomes permanently incapacitated, the fund may
                need to pay benefits as a lump sum. Where property is the dominant
                asset, this can force a sale — potentially in unfavourable market
                conditions. The ATO&apos;s compliance approach to SMSF wind-ups (where
                a fund fails to distribute benefits in a timely manner) adds
                regulatory urgency to these situations.
              </p>

              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif text-bs-charcoal">
                The question is not just &quot;when do I want to sell?&quot; — it is
                &quot;what happens if I have to sell?&quot; Every SMSF property investment
                needs a documented exit strategy that accounts for market
                downturns, vacancy, and unexpected life events.
              </div>
            </section>

            {/* --- Section 8: Common mistakes --- */}
            <section id="common-mistakes" className="scroll-mt-20">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                8. Common mistakes to avoid
              </h2>
              <p className="text-bs-slate leading-relaxed">
                The ATO&apos;s 2019 SMSF property compliance campaign reviewed
                approximately 17,700 funds that held direct property as a
                significant portion of their assets. The campaign identified
                several recurring issues:
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Concentration risk
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Holding a single property as the majority of a fund&apos;s assets
                creates concentration risk. If the property is vacant, the fund
                may not have sufficient cash to cover loan repayments, insurance,
                rates, and administration costs. ASIC Report 824 specifically
                flagged that many SMSFs with direct property had inadequate
                diversification relative to the fund&apos;s objectives and members&apos;
                risk profiles.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Liquidity shortfalls
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Unlike listed investments, property cannot be partially sold. When
                a fund needs cash — to pay benefits, meet minimum pension
                requirements, or cover unexpected expenses — and property is the
                dominant asset, trustees face difficult choices. The ATO has
                emphasised that trustees must maintain adequate liquidity as part
                of their investment strategy (SMSFR 2012/1).
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Underestimating total costs
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Many analyses of SMSF property investment compare the 15% fund tax
                rate against personal marginal rates without accounting for the
                additional layer of SMSF administration costs, audit fees, and
                more limited lending terms (higher interest rates, lower LVR
                ratios). A property that generates a positive return in a personal
                name may produce a lower net return — or a negative one — inside a
                super fund once all costs are included.
              </p>

              <h3 className="text-lg font-semibold text-bs-charcoal mt-6 mb-2">
                Non-arm&apos;s length arrangements
              </h3>
              <p className="text-bs-slate leading-relaxed">
                Renting a commercial property to a related-party business below
                market rent, or purchasing property above market value from a
                related party, triggers non-arm&apos;s length income (NALI)
                provisions. Under the NALI rules (s295-550 ITAA 1997), income from
                non-arm&apos;s length arrangements can be taxed at the top marginal
                rate of 45%, eliminating the tax advantage entirely. The ATO has
                issued guidance on NALI in the context of SMSF property in
                LCR 2021/2.
              </p>

              <p className="text-bs-slate leading-relaxed mt-4 font-medium">
                Questions to discuss with your licensed adviser:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-bs-slate leading-relaxed">
                <li>What is the fund&apos;s liquidity position if the property is vacant for 6 months?</li>
                <li>Has a total cost analysis been prepared comparing in-fund vs out-of-fund ownership?</li>
                <li>Does the investment strategy document address concentration risk?</li>
              </ul>
            </section>

            {/* --- CTA --- */}
            <div className="mt-16 text-center border-t border-border pt-10">
              <h2 className="font-serif text-2xl text-bs-charcoal mb-3">
                Not sure where to start?
              </h2>
              <p className="text-bs-slate leading-relaxed mb-6">
                Take the BrickSuper readiness quiz to identify the key questions
                for your situation — then take those questions to your licensed
                adviser.
              </p>
              <Button asChild size="lg">
                <Link href="/quiz">Take the SMSF Property Quiz</Link>
              </Button>
            </div>

            {/* --- FAQ --- */}
            <FAQSection items={FAQ_ITEMS} />
          </div>
        </article>
      </main>

      <SiteFooter />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateArticleSchema({
              title:
                "SMSF Property Investment: The Complete Australian Guide",
              description:
                "A plain-English guide to buying property in a Self-Managed Super Fund.",
              url: "https://bricksuper.com/smsf-property-guide",
              datePublished: ARTICLE_DATE_PUBLISHED,
              dateModified: ARTICLE_DATE_MODIFIED,
              wordCount: 3200,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)),
        }}
      />
    </>
  );
}
