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

const PAGE_TITLE =
  "Combining Super with Your Spouse: SMSF Property Investment as a Couple";
const PAGE_DESCRIPTION =
  "How couples combine superannuation balances in a two-member SMSF to reach the practical threshold for property investment. Structure, rollovers, ownership, and what happens when things change.";
const PAGE_URL = "https://bricksuper.com/smsf-couples-guide";
const DATE_PUBLISHED = "2025-09-15";
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
    question: "Can de facto couples establish an SMSF together?",
    answer:
      "Yes. The SIS Act recognises de facto relationships (including same-sex relationships) for the purposes of SMSF membership. Both partners can be members and trustees of the same fund, with the same rights and obligations as married couples. The definition of 'spouse' under s10(1) of the SIS Act includes de facto partners.",
  },
  {
    question: "What if one spouse has much more super than the other?",
    answer:
      "Each member maintains a separate member account within the SMSF, and balances are tracked individually. The fund's investment strategy must document how the chosen investments — including any property — are appropriate for both members given their respective balances, ages, and risk profiles. A large imbalance may make high-concentration property investment harder to justify for the member with the smaller balance.",
  },
  {
    question:
      "Can we buy residential property to live in through our SMSF?",
    answer:
      "No. Section 62 of the SIS Act imposes the sole purpose test, which requires SMSF assets to be maintained for the sole purpose of providing retirement benefits. Members, their relatives, and other related parties cannot live in, holiday in, or otherwise use residential property owned by the fund. Breaching the sole purpose test can result in the fund being made non-complying, triggering tax at 45% on the fund's total assets.",
  },
  {
    question: "What happens to the SMSF property if we separate?",
    answer:
      "This is a complex area where the Family Law Act 1975 and the SIS Act interact. Superannuation (including SMSF assets) can be split under a family law property settlement, but SMSF property cannot simply be transferred to one spouse outside the fund without proper legal process. A court order or binding financial agreement may be required. Both members should obtain independent legal and financial advice, as the process involves superannuation law, family law, and potentially significant tax and stamp duty implications.",
  },
  {
    question: "Is a corporate trustee better for couples?",
    answer:
      "A corporate trustee (a company acting as trustee) offers practical advantages for two-member SMSFs: it simplifies changes if a member leaves the fund or passes away, provides limited liability for the directors, and makes administrative processes like opening bank accounts and holding property title more straightforward. The trade-off is a higher initial setup cost (company registration, ASIC fees) and ongoing annual ASIC review fees. Many SMSF professionals favour corporate trustees for two-member funds, though individual trustees remain a valid option.",
  },
  {
    question:
      "Can we each contribute to the SMSF to increase the deposit?",
    answer:
      "Yes, both members can make contributions to the SMSF within the applicable caps. For the 2025-26 financial year, the concessional (before-tax) contribution cap is $30,000 per person and the non-concessional (after-tax) cap is $120,000 per person. Couples can also potentially use the bring-forward rule to contribute up to three years of non-concessional contributions in a single year, subject to total superannuation balance thresholds. All contributions must be made to the member's own account within the fund.",
  },
];

const TOC_ITEMS = [
  { id: "why-couples-combine", label: "Why couples combine super for property" },
  { id: "two-member-smsf", label: "How a two-member SMSF works" },
  { id: "rolling-super", label: "Rolling super into a joint SMSF" },
  { id: "property-ownership", label: "Property ownership in a two-member SMSF" },
  { id: "when-things-change", label: "What happens when things change" },
  { id: "costs-considerations", label: "Costs and considerations for couples" },
  { id: "adviser-questions", label: "Questions for your licensed adviser" },
];

export default function SMSFCouplesGuidePage() {
  const faqSchema = generateFAQSchema(FAQ_ITEMS);
  const articleSchema = generateArticleSchema({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    wordCount: 2800,
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

            {/* Section 1: Why couples combine super */}
            <section id="why-couples-combine" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                Why couples combine super for property
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Most SMSF property purchases require a practical minimum of
                around $250,000 in combined fund assets — enough to cover a
                deposit, purchase costs, and maintain adequate liquidity. Many
                individual Australians don&rsquo;t reach that threshold on their
                own. According to ABS data (2023), the median individual
                superannuation balance in Australia is approximately $170,000.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                A couple who each have $170,000 in super reaches $340,000 when
                both balances are held within a single SMSF. This is one of the
                most common paths into SMSF property investment — not because
                combining is always the right decision, but because the
                arithmetic often makes it the only way the numbers work.
              </p>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif">
                Combining super into a joint SMSF is a significant structural
                decision. It ties both members&rsquo; retirement savings to the
                same fund, the same investment strategy, and the same trustee
                obligations. The benefits of pooled capital come with shared
                risk.
              </div>
              <p className="text-bs-slate leading-relaxed">
                It is worth noting that a higher combined balance does not
                automatically mean SMSF property is appropriate. The fund still
                needs sufficient liquidity after the purchase, an investment
                strategy that accounts for both members&rsquo; needs, and the
                capacity to meet ongoing costs including insurance, maintenance,
                and any loan repayments.
              </p>
            </section>

            {/* Section 2: How a two-member SMSF works */}
            <section id="two-member-smsf" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                How a two-member SMSF works
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Under the SIS Act, all members of an SMSF must be trustees of
                the fund (or directors of the corporate trustee). In a
                two-member SMSF, both spouses are members and both serve as
                trustees. There is no passive member — both carry equal legal
                responsibility for the fund&rsquo;s compliance.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                SMSFs can have up to six members (increased from four by
                legislation effective 1 July 2021). For couples, the typical
                structure is a two-member fund with either:
              </p>
              <ul className="space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>Individual trustees.</strong> Both spouses are
                  appointed as individual trustees of the SMSF. This is simpler
                  and cheaper to establish, but creates complications if a member
                  needs to leave the fund (for example, on separation or death)
                  because legal title to assets is held in the trustees&rsquo;
                  personal names.
                </li>
                <li>
                  <strong>Corporate trustee.</strong> A company is established as
                  the sole trustee, and both spouses are directors of that
                  company. This structure makes it easier to change membership,
                  provides limited liability protection, and simplifies asset
                  ownership — the company holds title, so changes in membership
                  do not require title transfers.
                </li>
              </ul>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif">
                The SIS Act requirement that all members be trustees (s17A) means
                both spouses share trustee duties equally. One spouse cannot
                delegate compliance responsibilities to the other.
              </div>
            </section>

            {/* Section 3: Rolling super into a joint SMSF */}
            <section id="rolling-super" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                Rolling super into a joint SMSF
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                The process of combining super into a joint SMSF follows a
                specific sequence. The SMSF must be properly established before
                any rollovers occur:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>Establish the SMSF.</strong> Execute the trust deed,
                  appoint trustees (or establish the corporate trustee), obtain
                  an ABN and TFN, open a bank account in the fund&rsquo;s name,
                  and register with the ATO as a regulated SMSF.
                </li>
                <li>
                  <strong>Prepare the investment strategy.</strong> Before making
                  any investments, the trustees must prepare and sign a written
                  investment strategy that considers both members&rsquo;
                  circumstances (SIS Regulation 4.09).
                </li>
                <li>
                  <strong>Roll over existing balances.</strong> Each spouse
                  requests a rollover from their existing super fund(s) into the
                  new SMSF. This is done via the ATO&rsquo;s SuperStream
                  electronic rollover system.
                </li>
                <li>
                  <strong>Confirm receipt.</strong> Once the funds arrive in the
                  SMSF bank account, they are allocated to each member&rsquo;s
                  individual account within the fund.
                </li>
              </ol>
              <p className="text-bs-slate leading-relaxed mb-4">
                A critical point: each member maintains their own separate
                member account within the SMSF. The balances are not literally
                merged. Member A&rsquo;s $180,000 and Member B&rsquo;s $160,000
                remain separately tracked, even though the fund invests pooled
                assets.
              </p>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif">
                A rollover from an existing super fund to an SMSF does not
                trigger a taxable event. It is a transfer within the
                superannuation system. However, some existing funds may charge
                exit fees or sell down investments (potentially crystallising
                gains within that fund) as part of the rollover process.
              </div>
              <p className="text-bs-slate leading-relaxed">
                The timing of rollovers matters. If the couple plans to purchase
                property, all rollover funds need to have arrived and cleared
                before the SMSF can enter a contract. Rollovers can take
                anywhere from 3 to 30 business days depending on the releasing
                fund.
              </p>
            </section>

            {/* Section 4: Property ownership */}
            <section id="property-ownership" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                Property ownership in a two-member SMSF
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                When an SMSF purchases property, the property is owned by the
                SMSF trustee — not by the individual members. The members have a
                beneficial interest in the fund&rsquo;s assets proportional to
                their member account balances, but they do not personally own the
                property.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                If the purchase uses a limited recourse borrowing arrangement
                (LRBA), the loan is made to the SMSF trustee and the property is
                held in a bare trust until the loan is repaid. The bare trustee
                holds legal title on behalf of the SMSF, not on behalf of
                individual members. Both members benefit (or bear losses) through
                the impact on their respective member accounts.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                Both members can contribute to the fund to build the deposit,
                subject to contribution caps. For the 2025-26 financial year:
              </p>
              <ul className="space-y-2 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>Concessional contributions:</strong> $30,000 per member
                  per year (includes employer contributions, salary sacrifice,
                  and personal deductible contributions)
                </li>
                <li>
                  <strong>Non-concessional contributions:</strong> $120,000 per
                  member per year (with bring-forward provisions allowing up to
                  $360,000 over three years, subject to total super balance
                  thresholds)
                </li>
              </ul>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif">
                Contribution caps are per member, not per fund. A couple can
                collectively contribute up to $60,000 in concessional
                contributions and $240,000 in non-concessional contributions per
                year — but exceeding individual caps triggers penalty tax
                regardless of the other member&rsquo;s position.
              </div>
            </section>

            {/* CTA */}
            <div className="border border-border rounded-xl p-6 text-center my-12 bg-muted/30">
              <p className="font-serif text-lg text-bs-charcoal mb-2">
                Not sure if combining super is the right starting point?
              </p>
              <p className="text-sm text-bs-mid mb-4">
                Our quiz helps you understand where you stand — including
                whether your combined balances meet practical thresholds.
              </p>
              <Button asChild>
                <Link href="/quiz">Take the SMSF Readiness Quiz</Link>
              </Button>
            </div>

            {/* Section 5: When things change */}
            <section id="when-things-change" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                What happens when things change
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                A two-member SMSF is a long-term structural commitment. Life
                changes — separation, death, retirement, or a change of mind —
                create specific challenges when the fund holds illiquid assets
                like property.
              </p>

              <h3 className="font-semibold text-bs-charcoal mt-8 mb-3">
                Divorce or separation
              </h3>
              <p className="text-bs-slate leading-relaxed mb-4">
                When a couple separates, SMSF assets (including property) form
                part of the superannuation pool that may be split under the
                Family Law Act 1975. However, SMSF property cannot simply be
                transferred to one spouse&rsquo;s name. The property is held by
                the trustee, and any split must comply with both the Family Law
                Act and the SIS Act.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                Options may include selling the property and distributing
                proceeds, one member rolling their share out to another fund, or
                restructuring the SMSF — but each option has tax, stamp duty,
                and compliance implications that require specialist legal and
                financial advice.
              </p>
              <div className="bg-bs-orange-pale border-l-4 border-bs-orange rounded-r-lg p-4 my-6 italic font-serif">
                Separation with an SMSF property is significantly more complex
                than separation with individually owned assets. Both parties
                need independent legal advice from practitioners experienced in
                both family law and superannuation law. This is not an area for
                informal arrangements.
              </div>

              <h3 className="font-semibold text-bs-charcoal mt-8 mb-3">
                Death of a member
              </h3>
              <p className="text-bs-slate leading-relaxed mb-4">
                If one member dies, their benefits must be dealt with according
                to the fund&rsquo;s trust deed, any binding death benefit
                nomination (BDBN), and the SIS Act. The surviving spouse may
                receive the deceased&rsquo;s benefits as a reversionary pension
                or lump sum. If the SMSF uses individual trustees, the surviving
                spouse must appoint a replacement trustee or convert to a
                corporate trustee structure — an SMSF cannot operate with a
                single individual trustee for more than six months.
              </p>

              <h3 className="font-semibold text-bs-charcoal mt-8 mb-3">
                One member reaching retirement
              </h3>
              <p className="text-bs-slate leading-relaxed mb-4">
                In many couples, one partner reaches preservation age or retires
                before the other. The fund may need to pay a pension to the
                retired member while the other member is still in accumulation
                phase. If the fund&rsquo;s assets are heavily concentrated in
                property, meeting pension payment obligations can create
                liquidity challenges — you cannot pay a pension with a fraction
                of a building.
              </p>

              <h3 className="font-semibold text-bs-charcoal mt-8 mb-3">
                One member wanting to exit
              </h3>
              <p className="text-bs-slate leading-relaxed mb-4">
                If one member wants to leave the SMSF (for example, to return to
                a large industry or retail fund), their balance must be rolled
                out. If the fund&rsquo;s assets are primarily in property, the
                fund may need to sell the property to fund the rollover — or the
                remaining member needs sufficient other assets within the fund to
                cover the departing member&rsquo;s balance.
              </p>
            </section>

            {/* Section 6: Costs and considerations */}
            <section id="costs-considerations" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                Costs and considerations for couples
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                SMSF costs are generally per fund, not per member. This means a
                two-member fund splits the fixed overhead — audit fees, tax
                return preparation, ASIC fees (for corporate trustees),
                accounting, and administration — across two members rather than
                one. On a per-person basis, a two-member SMSF is typically more
                cost-effective than a single-member fund.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                However, cost efficiency does not mean cost is low. Typical
                annual SMSF running costs range from $2,000 to $5,000 or more,
                depending on complexity. Funds holding property with an LRBA sit
                toward the higher end due to additional accounting, bare trust
                administration, and lender reporting requirements.
              </p>
              <p className="text-bs-slate leading-relaxed mb-4">
                Key considerations for couples:
              </p>
              <ul className="space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  <strong>Shared trustee liability.</strong> Both members are
                  equally liable for any trustee breaches, even if only one
                  member was primarily involved in the decision. The ATO can
                  pursue both trustees for penalties under the SIS Act.
                </li>
                <li>
                  <strong>Investment strategy alignment.</strong> The
                  fund&rsquo;s investment strategy must be appropriate for both
                  members. If one spouse has a much larger balance, the strategy
                  needs to document how a concentrated property investment is
                  consistent with both members&rsquo; circumstances — including
                  the member with the smaller balance who may have an even higher
                  concentration exposure.
                </li>
                <li>
                  <strong>Insurance.</strong> Trustees must consider whether
                  insurance cover is appropriate for each member (SIS Act s52(7)(c)).
                  For a two-member fund holding property, the death or disability
                  of either member could have significant implications for the
                  fund&rsquo;s ability to meet its obligations.
                </li>
                <li>
                  <strong>Record keeping.</strong> The fund must maintain
                  separate records for each member&rsquo;s accumulation account,
                  contributions, and (if applicable) pension accounts. Both
                  trustees must be involved in decision-making and sign off on
                  minutes, investment strategy reviews, and trustee resolutions.
                </li>
              </ul>
            </section>

            {/* Section 7: Questions for your adviser */}
            <section id="adviser-questions" className="mb-12 scroll-mt-24">
              <h2 className="font-serif text-2xl text-bs-charcoal mt-12 mb-4">
                Questions to discuss with your licensed adviser
              </h2>
              <p className="text-bs-slate leading-relaxed mb-4">
                Before establishing a joint SMSF for property investment,
                couples typically discuss these questions with a licensed
                financial adviser who holds an Australian Financial Services
                Licence (AFSL) authorising advice on SMSFs:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-bs-slate leading-relaxed mb-4">
                <li>
                  Given our combined balances and ages, does a two-member SMSF
                  with property make sense compared to staying in our current
                  funds — factoring in fees, insurance, investment options, and
                  diversification?
                </li>
                <li>
                  What happens to the fund and the property if our relationship
                  ends? What protections can be documented in advance?
                </li>
                <li>
                  How will the investment strategy accommodate both of our risk
                  profiles and retirement timelines, especially if our ages or
                  balances differ significantly?
                </li>
                <li>
                  What is the total cost of running the SMSF (including
                  establishment, annual administration, audit, and any LRBA
                  costs) — and at what balance does this become cost-effective
                  compared to our existing arrangements?
                </li>
                <li>
                  If one of us wants to exit the fund in future, what liquidity
                  does the fund need to facilitate that rollover without forcing
                  a property sale?
                </li>
                <li>
                  What insurance arrangements are appropriate within the fund for
                  each member, and how do these compare to any existing cover we
                  hold through our current super funds?
                </li>
              </ol>
            </section>

            {/* Disclaimer */}
            <div className="border-t border-border pt-6 mt-12 text-xs text-bs-muted leading-relaxed">
              <p className="mb-2">
                <strong>General information only.</strong> This page provides
                factual information about two-member SMSFs and property
                investment by couples. It is not financial advice, tax advice,
                legal advice, or a recommendation to establish an SMSF or
                purchase property. Contribution caps and thresholds referenced
                are for the 2025-26 financial year and are subject to annual
                indexation by the Australian Government.
              </p>
              <p>
                Establishing a joint SMSF for property investment involves
                superannuation law, property law, tax law, and (potentially)
                family law. Couples considering this path typically consult a
                licensed financial adviser, SMSF specialist accountant, and
                solicitor experienced in superannuation law before making any
                decisions.
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
