import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { LastUpdated } from "@/components/brand/last-updated";
import { FAQSection } from "@/components/brand/faq-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import {
  generateFAQSchema,
  generateArticleSchema,
  type FAQItem,
} from "@/lib/schema-markup";

/* ------------------------------------------------------------------ */
/*  ISR                                                                */
/* ------------------------------------------------------------------ */
export const revalidate = 86400;

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS: FAQItem[] = [
  {
    question:
      "Can my SMSF buy commercial property that my business currently leases from a third party?",
    answer:
      "Yes. An SMSF can acquire business real property from a related party or a third party, provided the property meets the 'wholly and exclusively' business use test under SMSFR 2009/1. The fund must pay market value, and any subsequent lease-back to your business must be at arm's length rent supported by an independent valuation. Note that this involves concentration risk: your retirement savings and your business income become tied to the same asset.",
  },
  {
    question:
      "What happens if part of my commercial property is vacant — does it still qualify as BRP?",
    answer:
      "Temporary vacancies while actively seeking a business tenant generally do not defeat BRP status, according to ATO guidance. However, if the property sits idle with no genuine effort to secure a business tenant, or if the vacancy is prolonged without explanation, the ATO may conclude the property is not being used wholly and exclusively for business purposes. The distinction turns on whether the vacancy is a genuine gap between tenancies versus a dormant or abandoned state.",
  },
  {
    question:
      "Does a residential property ever qualify as business real property?",
    answer:
      "A standalone residential dwelling used only for personal living does not qualify. However, certain mixed-use rural properties can qualify under the 'farm safe harbour' — where a dwelling sits on two hectares or less and the primary and principal use of the land is a business activity such as farming. Bed-and-breakfast or short-stay accommodation used wholly and exclusively as a business may also qualify, though the ATO scrutinises these arrangements closely.",
  },
  {
    question:
      "Can my SMSF borrow (via an LRBA) to buy business real property?",
    answer:
      "Yes, an SMSF can use a limited recourse borrowing arrangement to acquire BRP, but this combines the regulatory complexity of both BRP rules (SIS Act s66) and LRBA rules (SIS Act s67A). The property must be held in a separate bare trust during the loan term, repayments must come from fund resources, and the asset cannot be improved (only repaired) while the loan is outstanding. This layered complexity increases the risk of inadvertent compliance breaches and typically involves higher professional costs.",
  },
  {
    question:
      "How does the sole purpose test (SIS Act s62) interact with BRP ownership?",
    answer:
      "Even where a property qualifies as BRP, the fund must still satisfy the sole purpose test — the investment must be maintained for the purpose of providing retirement benefits to members. If the ATO forms the view that the arrangement primarily benefits the member's business (for example, below-market rent or non-arm's length terms), the fund risks losing its complying status. Every BRP arrangement needs to demonstrate a genuine retirement savings purpose, not merely a tax or business structuring benefit.",
  },
];

/* ------------------------------------------------------------------ */
/*  Metadata + JSON-LD                                                 */
/* ------------------------------------------------------------------ */
const PAGE_TITLE =
  "Business Real Property (BRP) and Your SMSF: The Plain-English Guide";
const PAGE_DESCRIPTION =
  "What qualifies as business real property under SIS Act s66(5), the 'wholly and exclusively' test from SMSFR 2009/1, lease-back rules, the farm safe harbour, and worked examples. Factual SMSF education — not financial advice.";
const PAGE_URL = "https://bricksuper.com.au/business-real-property";
const DATE_PUBLISHED = "2025-06-15";
const DATE_MODIFIED = "2026-03-27";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  other: {
    "script:ld+json": JSON.stringify([
      generateArticleSchema({
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        datePublished: DATE_PUBLISHED,
        dateModified: DATE_MODIFIED,
        wordCount: 3200,
      }),
      generateFAQSchema(FAQ_ITEMS),
    ]),
  },
};

/* ------------------------------------------------------------------ */
/*  Table of Contents                                                  */
/* ------------------------------------------------------------------ */
const TOC = [
  { id: "what-is-brp", label: "What is business real property?" },
  { id: "business-use-test", label: "The business use test" },
  { id: "buying-premises", label: "Buying your business premises" },
  { id: "related-party-rules", label: "Related-party rules for BRP" },
  { id: "farm-safe-harbour", label: "The farm safe harbour" },
  { id: "worked-examples", label: "Worked examples" },
  { id: "risks-and-mistakes", label: "Risks and common mistakes" },
  { id: "faq", label: "FAQ" },
] as const;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function BusinessRealPropertyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ---- Header ---- */}
          <header className="mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-bs-orange mb-3">
              Hub 3 — SMSF Education
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal leading-tight mb-4">
              {PAGE_TITLE}
            </h1>
            <LastUpdated date={new Date(DATE_MODIFIED)} className="mb-4" />
            <p className="text-sm text-bs-mid leading-relaxed max-w-2xl">
              Business real property is the single biggest exception to the
              related-party rules that normally restrict how an SMSF invests.
              Get it right and your fund can own the premises your business
              operates from. Get it wrong and the ATO can disqualify the asset
              — or worse, the entire fund. This guide walks through the law,
              the tests, and the traps, brick by brick.
            </p>
          </header>

          {/* ---- Jump links ---- */}
          <nav
            aria-label="Table of contents"
            className="mb-12 p-5 rounded-xl border border-border bg-muted/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-bs-muted mb-3">
              In this guide
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {TOC.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-bs-orange-dark hover:underline"
                  >
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ================================================================
              SECTION 1 — What is business real property?
              ================================================================ */}
          <section id="what-is-brp" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              1. What is business real property?
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              Under <strong>SIS Act s66(5)</strong>, business real property
              means any freehold or leasehold interest in real property, or
              any interest in Crown land, where the property is used wholly
              and exclusively in one or more businesses. The businesses do not
              need to be related to the SMSF members — the test is about how
              the <em>land</em> is used, not who uses it.
            </p>

            <div className="border-l-4 border-bs-orange pl-5 py-3 my-6 bg-bs-orange-pale/20 rounded-r-lg">
              <p className="text-sm text-bs-charcoal italic leading-relaxed">
                &ldquo;Business real property&rdquo; means real property (including a
                leasehold interest and an interest in Crown land) that is used
                wholly and exclusively in one or more businesses (whether or not
                carried on by the entity that holds the interest in the
                property).
              </p>
              <p className="text-xs text-bs-muted mt-2">
                — SIS Act s66(5), paraphrased for clarity
              </p>
            </div>

            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              Eligible interests include:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                <strong>Freehold interests</strong> — outright ownership of
                land and any structures on it.
              </li>
              <li>
                <strong>Leasehold interests</strong> — a lease or sub-lease
                registered on title or otherwise recognised at law.
              </li>
              <li>
                <strong>Interests in Crown land</strong> — licences, permits,
                or leases over government-owned land used for business.
              </li>
            </ul>
            <p className="text-sm text-bs-mid leading-relaxed">
              Why does BRP matter? Normally, SIS Act s66 prohibits an SMSF
              from acquiring assets from a related party. Business real
              property is a <strong>statutory exception</strong> to that rule.
              If property qualifies as BRP, the fund can buy it directly from
              a member, a member&rsquo;s relative, or a company or trust
              controlled by a member — something that is outright banned for
              almost every other asset class.
            </p>
          </section>

          {/* ================================================================
              SECTION 2 — The business use test
              ================================================================ */}
          <section id="business-use-test" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              2. The &ldquo;wholly and exclusively&rdquo; business use test
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              The ATO&rsquo;s definitive guidance is{" "}
              <strong>SMSFR 2009/1</strong>. The ruling makes several things
              clear:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                The test examines the <strong>physical use of the land</strong>,
                not how the investment is legally deployed or characterised. A
                property leased to a business that then sub-lets part of it for
                residential use fails, regardless of what the head lease says.
              </li>
              <li>
                &ldquo;Wholly and exclusively&rdquo; means{" "}
                <strong>entirely for business purposes</strong>. Even a small
                portion of non-business use — a residential flat above a shop,
                for instance — can disqualify the entire property.
              </li>
              <li>
                <strong>Incidental non-business use</strong> that is inherent
                to the business activity does not disqualify a property. A
                caretaker&rsquo;s flat on a commercial site, where the
                caretaker is there to service the business, is generally
                accepted.
              </li>
            </ul>

            <div className="border-l-4 border-bs-orange pl-5 py-3 my-6 bg-bs-orange-pale/20 rounded-r-lg">
              <p className="text-sm text-bs-charcoal italic leading-relaxed">
                <strong>The Louisa example (SMSFR 2009/1, Example 3):</strong>{" "}
                Louisa operates a medical practice in a commercial building owned
                by her SMSF. One room in the building is temporarily unoccupied
                — she has not yet found another practitioner to sub-lease it.
                The ATO confirms the property still qualifies as BRP. The empty
                room does not defeat the test because the building as a whole is
                used wholly and exclusively for business, and the vacancy is
                temporary and incidental.
              </p>
            </div>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Temporary vacancies
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              A property that is between business tenants — where the trustee
              is actively marketing for a new business tenant — generally
              retains BRP status. The ATO looks at intent, effort, and
              history. However, a property that sits idle or dormant with no
              genuine steps to re-let for business use risks losing its
              classification.
            </p>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Token or manufactured business use
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed">
              The ATO has specifically rejected arrangements where a nominal
              or token business use is created close to the time of
              acquisition — for instance, placing a vending machine on a
              vacant lot immediately before purchase. SMSFR 2009/1 makes
              clear that the &ldquo;wholly and exclusively&rdquo; test looks at
              substance, not form. If the dominant purpose is to manufacture
              BRP status, the property will not qualify.
            </p>
          </section>

          {/* ================================================================
              SECTION 3 — Buying your business premises
              ================================================================ */}
          <section id="buying-premises" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              3. Buying your business premises through your SMSF
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              This is the arrangement most people think of: your business
              operates from a commercial premises, and your SMSF buys that
              premises, then leases it back to you. The broad mechanics:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                The SMSF trustee acquires the property at{" "}
                <strong>market value</strong>, supported by a qualified
                independent valuation.
              </li>
              <li>
                The SMSF enters into a <strong>formal commercial lease</strong>{" "}
                with the business (or the entity that operates the business).
              </li>
              <li>
                The lease must be on <strong>arm&rsquo;s length terms</strong>:
                market rent, standard commercial conditions, documented in
                writing.
              </li>
              <li>
                Rent is paid into the fund&rsquo;s bank account on the agreed
                schedule. Late or missed payments are treated the same as they
                would be with any unrelated tenant.
              </li>
              <li>
                The fund claims deductions for property-related expenses
                (rates, insurance, repairs) against the rental income.
              </li>
            </ol>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Lease-back arrangement requirements
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              The ATO expects lease-back arrangements to mirror what
              arm&rsquo;s length parties would agree. Key requirements:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                Rent set at market rate, supported by a valuation from a
                registered valuer or qualified property professional.
              </li>
              <li>
                A written lease agreement with standard commercial terms
                (term, rent review mechanism, outgoings, make-good clauses).
              </li>
              <li>
                Regular rent reviews — typically annually or as specified in
                the lease.
              </li>
              <li>
                Rent actually paid on time. The ATO looks unfavourably on
                &ldquo;paper-only&rdquo; rental arrangements or persistent
                arrears from related-party tenants.
              </li>
            </ul>
            <p className="text-sm text-bs-mid leading-relaxed">
              The risk with any lease-back: if the business hits hard times,
              the rent stops, and the fund loses its primary income source
              from that asset — while still carrying rates, insurance, and
              potentially loan repayments. This is concentration risk in its
              purest form.
            </p>
          </section>

          {/* ================================================================
              SECTION 4 — Related-party rules
              ================================================================ */}
          <section id="related-party-rules" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              4. Related-party rules for BRP
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              <strong>SIS Act s66</strong> is the general prohibition: an SMSF
              trustee must not intentionally acquire an asset from a related
              party of the fund. But s66(2)(b) carves out a specific exception
              for business real property.
            </p>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              This means an SMSF can acquire BRP directly from:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-bs-mid leading-relaxed mb-4">
              <li>A member of the fund</li>
              <li>A relative of a member</li>
              <li>
                A company, trust, or partnership in which a member or relative
                has a controlling interest
              </li>
            </ul>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              For the exception to apply, the following conditions must be
              met:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-1.5 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                The property must qualify as BRP at the time of acquisition —
                that is, it must already be used wholly and exclusively for
                business purposes.
              </li>
              <li>
                The acquisition must be at <strong>market value</strong>.
              </li>
              <li>
                The fund&rsquo;s investment strategy must support the
                acquisition (SIS Reg 4.09).
              </li>
              <li>
                The <strong>sole purpose test</strong> (SIS Act s62) must be
                satisfied — the investment must be maintained for the purpose
                of providing retirement benefits.
              </li>
            </ol>

            <div className="border-l-4 border-bs-orange pl-5 py-3 my-6 bg-bs-orange-pale/20 rounded-r-lg">
              <p className="text-sm text-bs-charcoal italic leading-relaxed">
                Valuation is not optional. The ATO expects a market valuation
                from a qualified, independent valuer at the date of
                acquisition. Using an out-of-date valuation or a
                &ldquo;mates rates&rdquo; estimate exposes the fund to a
                contravention of the in-house asset rules and potential
                penalties under Part 21 of the SIS Act.
              </p>
            </div>
          </section>

          {/* ================================================================
              SECTION 5 — The farm safe harbour
              ================================================================ */}
          <section id="farm-safe-harbour" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              5. The farm safe harbour
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              Rural and farming properties often feature a dwelling alongside
              the productive land. Under SMSFR 2009/1, mixed-use rural
              property can still qualify as BRP where:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-bs-mid leading-relaxed mb-4">
              <li>
                The <strong>primary and principal use</strong> of the land is
                one or more business activities (typically farming).
              </li>
              <li>
                Any dwelling on the land sits on{" "}
                <strong>two hectares or less</strong>.
              </li>
              <li>
                The dwelling is ancillary to the business use — for example,
                a farmhouse used by a person who works the farm.
              </li>
            </ul>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              This &ldquo;safe harbour&rdquo; acknowledges the practical
              reality that working farms typically need an on-site residence.
              It does not apply to hobby farms, lifestyle blocks, or rural
              residential properties where the &ldquo;farming&rdquo; activity
              is incidental to living on the land.
            </p>
            <p className="text-sm text-bs-mid leading-relaxed">
              The risk: the boundary between a genuine farming operation and
              a lifestyle property is a question of fact. Revenue from the
              farming activity, hours worked, scale of operations, and
              whether the farm is genuinely run as a going concern all factor
              into the ATO&rsquo;s assessment. A small orchard on a large
              residential estate is unlikely to qualify.
            </p>
          </section>

          {/* ================================================================
              SECTION 6 — Worked examples
              ================================================================ */}
          <section id="worked-examples" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              6. Worked examples
            </h2>
            <p className="text-xs text-bs-muted italic mb-6">
              The following scenarios are simplified, illustrative examples
              only. They do not account for every variable in a real
              transaction and are not financial, legal, or tax advice.
              Individual circumstances vary significantly — professional
              advice is essential before acting.
            </p>

            {/* Example A */}
            <div className="border border-border rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-bs-charcoal mb-1">
                Example A: GP buying their clinic
              </h3>
              <p className="text-xs text-bs-muted mb-4">
                Illustrative scenario only — not advice
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Setup:</strong> Dr Patel operates a general practice
                from a purpose-built medical centre. She is the sole member of
                her SMSF, which has $1.2 million in accumulated savings. The
                medical centre is valued at $850,000. The property is used
                entirely for the medical practice — all rooms are consulting
                rooms, a reception area, and a clinical storage room.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>BRP analysis:</strong> The property is used wholly and
                exclusively for a business (the medical practice). It meets the
                definition under SIS Act s66(5). Even if one consulting room is
                temporarily unoccupied (the Louisa example), BRP status is
                maintained, provided Dr Patel is actively seeking to sub-lease
                that room to another practitioner.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Cost considerations:</strong> Independent valuation
                ($3,000–$5,000), legal fees for contract and lease preparation
                ($5,000–$10,000), stamp duty (varies by state — potentially
                $20,000–$40,000), ongoing annual audit costs, SMSF
                administration. The fund&rsquo;s remaining liquid assets after
                purchase ($350,000) must be sufficient to meet liabilities and
                member benefit payments.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed">
                <strong>Risk factors:</strong> Concentration risk — 71% of
                fund assets in a single property. If the practice closes or
                relocates, finding another medical tenant at equivalent rent
                may take time. The fund&rsquo;s liquidity drops substantially.
                There is no diversification across asset classes after the
                purchase.
              </p>
            </div>

            {/* Example B */}
            <div className="border border-border rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-bs-charcoal mb-1">
                Example B: Tradie buying their workshop
              </h3>
              <p className="text-xs text-bs-muted mb-4">
                Illustrative scenario only — not advice
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Setup:</strong> Sam runs an electrical contracting
                business through a company (Sam&rsquo;s Electrics Pty Ltd).
                The company operates from a light-industrial workshop in an
                outer suburb. Sam and his partner are both members of their
                two-member SMSF, which has $650,000 in assets. The workshop
                is valued at $480,000.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>BRP analysis:</strong> The workshop is used wholly
                and exclusively for Sam&rsquo;s electrical business — storing
                tools, vehicles, and materials, with a small office for
                administration. It qualifies as BRP. The fund can acquire it
                from the company (a related party) under the s66 exception.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Cost considerations:</strong> Valuation, legal, stamp
                duty, and transfer costs total approximately $15,000–$30,000
                depending on the state. The lease-back rent must be set at
                market rate for comparable light-industrial space in the area.
                If comparable rents are $28,000 per annum, that is the
                benchmark — not a figure negotiated between Sam and his SMSF.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed">
                <strong>Risk factors:</strong> Concentration risk — 74% of
                the fund in one asset. If Sam&rsquo;s business contracts or
                closes, the rent ceases. Light-industrial property in outer
                suburbs can be volatile in terms of demand. Liquidity is
                materially reduced.
              </p>
            </div>

            {/* Example C */}
            <div className="border border-border rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-bs-charcoal mb-1">
                Example C: Business owner buying a warehouse
              </h3>
              <p className="text-xs text-bs-muted mb-4">
                Illustrative scenario only — not advice
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Setup:</strong> A wholesale distribution company
                operates from a 1,200 sqm warehouse currently owned by the
                business owner personally. The owner is a member of a
                two-member SMSF with $2.1 million in assets. The warehouse is
                valued at $1.4 million.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>BRP analysis:</strong> The warehouse is used entirely
                for the distribution business — receiving, storing, and
                dispatching goods. There is no residential or private use
                component. It qualifies as BRP under s66(5). The fund can
                acquire it from the member (a related party) at market value.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed mb-3">
                <strong>Cost considerations:</strong> Higher property value
                means higher stamp duty (potentially $50,000–$70,000
                depending on state). Legal fees for a transaction of this
                size are typically $8,000–$15,000. The fund retains $700,000
                in other assets after purchase — the concentration is lower
                (67%) than the other examples but still significant.
              </p>
              <p className="text-sm text-bs-mid leading-relaxed">
                <strong>Risk factors:</strong> Warehouse properties are
                sensitive to economic cycles and shifts to digital
                distribution models. If the distribution business fails, the
                property may need significant tenant incentives or fitout
                changes to re-let. The fund also faces the liquidity question
                — can it meet pension payments and expenses from the
                remaining $700,000 while the warehouse generates rental
                income?
              </p>
            </div>

            <p className="text-xs text-bs-muted italic">
              Each of these examples involves significant financial, legal,
              and tax complexity. The scenarios above omit many real-world
              variables including GST implications, capital gains tax,
              superannuation contribution caps, and state-specific transfer
              duties. Professional advice from a licensed financial adviser,
              SMSF specialist accountant, and property lawyer is essential
              before proceeding with any BRP acquisition.
            </p>
          </section>

          {/* ================================================================
              SECTION 7 — Risks and common mistakes
              ================================================================ */}
          <section id="risks-and-mistakes" className="mb-14 scroll-mt-24">
            <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
              7. Risks and common mistakes with BRP
            </h2>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              BRP is one of the more powerful tools in the SMSF toolkit, but
              it is also one of the most frequently misunderstood. Common
              errors include:
            </p>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Misunderstanding the business use test
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              The most common mistake is assuming any commercial property
              qualifies. A vacant block, a property used partly for
              residential purposes, or a property where business use is
              token or contrived will not meet the &ldquo;wholly and
              exclusively&rdquo; threshold. The test is applied at the time
              of acquisition and must continue to be met for the duration of
              ownership.
            </p>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Failing to maintain proper lease documentation
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              A handshake rental arrangement between you and your SMSF is
              not sufficient. The ATO expects a formal written lease, market
              rent supported by a valuation, regular rent reviews, and
              actual payment of rent on time. Failure to maintain these
              records is a red flag in an SMSF audit and can result in the
              arrangement being classified as not arm&rsquo;s length — which
              triggers in-house asset breaches under SIS Act s82.
            </p>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Sole purpose test violations (SIS Act s62)
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed mb-4">
              The sole purpose test requires that the fund is maintained for
              the purpose of providing retirement benefits. If the ATO
              determines that a BRP arrangement primarily benefits the
              member&rsquo;s current business operations — rather than the
              fund&rsquo;s retirement savings objective — the fund risks
              losing its complying status. Below-market rent, personal use
              of the property, or arrangements that appear designed to
              subsidise a struggling business all raise sole purpose
              concerns.
            </p>

            <h3 className="font-semibold text-bs-charcoal text-base mt-6 mb-3">
              Concentration risk
            </h3>
            <p className="text-sm text-bs-mid leading-relaxed">
              When a fund owns the premises and the member&rsquo;s business
              pays the rent, there is a double exposure. If the business
              fails: the rent stops, the property may be difficult to
              re-let, and the fund&rsquo;s largest asset may need to be sold
              in a distressed market — all at a time when the member may
              need their retirement savings most. A fund&rsquo;s investment
              strategy (SIS Reg 4.09) must address diversification, and
              auditors are required to flag strategies that do not
              adequately account for concentration risk.
            </p>
          </section>

          {/* ---- CTA ---- */}
          <div className="my-14 p-6 rounded-xl border border-bs-orange/20 bg-bs-orange-pale/20 text-center">
            <p className="font-serif text-xl text-bs-charcoal mb-2">
              Thinking about property in your SMSF?
            </p>
            <p className="text-sm text-bs-mid mb-5 max-w-lg mx-auto">
              Our SMSF Property Readiness Quiz covers seven general
              benchmarks — balance, age, time horizon, and more. It takes
              about three minutes and gives you a factual starting point.
              No advice, no sign-up.
            </p>
            <Button asChild>
              <Link href="/quiz">Take the Readiness Quiz</Link>
            </Button>
          </div>

          {/* ---- FAQ ---- */}
          <div id="faq" className="scroll-mt-24">
            <FAQSection items={FAQ_ITEMS} />
          </div>

          {/* ---- Disclaimer ---- */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-bs-muted leading-relaxed">
              This page is factual education about Australian SMSF rules
              relating to business real property. It is not financial advice,
              tax advice, or legal advice. BrickSuper does not hold an
              Australian Financial Services Licence (AFSL). The information
              is based on the Superannuation Industry (Supervision) Act 1993,
              SMSFR 2009/1, and publicly available ATO guidance as at the
              date shown above. Rules change. Professional advice from
              licensed professionals is essential before making any decision
              about SMSF property investment.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateArticleSchema({
              title: PAGE_TITLE,
              description: PAGE_DESCRIPTION,
              url: PAGE_URL,
              datePublished: DATE_PUBLISHED,
              dateModified: DATE_MODIFIED,
              wordCount: 3200,
            }),
            generateFAQSchema(FAQ_ITEMS),
          ]),
        }}
      />
    </>
  );
}
