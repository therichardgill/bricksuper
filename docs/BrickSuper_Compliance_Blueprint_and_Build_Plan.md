# BrickSuper.com: compliance blueprint and build plan for SMSF property lead gen

**BrickSuper can operate legally without an AFSL by staying strictly within ASIC's "factual information" safe harbour — but ASIC's February 2026 crackdown on superannuation lead generators makes the timing uniquely high-stakes.** The site must be scrupulously differentiated from the 21 lead gen entities ASIC named in its 26-029MR media release. This means no recommendations, no opinions that could influence financial decisions, no pressure tactics, and full transparency about how BrickSuper earns revenue. The regulatory environment is navigable but demands precision in every content choice, tool output, disclaimer placement, and commercial arrangement. What follows is a complete compliance, content, tooling, and technical blueprint for a greenfield build.

---

## The compliance framework that keeps BrickSuper licence-free

### The three-tier classification determines everything

Under **s766B of the Corporations Act 2001**, all financial product advice requires an AFSL. But ASIC RG 244 carves out a critical safe harbour: **factual information** — defined as "objectively ascertainable information, the truth or accuracy of which cannot reasonably be questioned" — does **not** require any licence to provide. This is BrickSuper's operating zone.

The boundaries are precise. Factual information includes statements like "An SMSF can hold business real property if it meets the definition under SIS Act s66(5)" or "The ATO safe harbour interest rate for related-party LRBAs on property is 8.95% for 2025-26." **General advice** — a recommendation or opinion intended to influence a financial decision, even without considering personal circumstances — requires an AFSL. **Personal advice** — which considers or appears to consider the person's objectives, financial situation, or needs — requires an AFSL plus best-interests obligations.

The **Westpac Securities v ASIC (2021 HCA 3)** High Court decision is the critical precedent for BrickSuper's interactive tools. The court found personal advice can exist even when the adviser presents output as general, if a reasonable person would expect their circumstances were considered. This means **disclaimers alone do not save you** — the substance of tool outputs matters. A quiz that collects fund balance, member ages, and investment goals, then produces a "suitability" result, risks crossing from factual information into personal advice regardless of what the disclaimer says.

### ASIC's February 2026 lead gen review changes everything

On **18 February 2026**, ASIC commenced a formal review of advice licensees using lead generation services (26-029MR). ASIC published names of 21 lead generators and 23 AFSL holders under scrutiny. The identified red-flag features include: pressuring consumers to act immediately, claims about fund underperformance, "free super health checks," involvement of unlicensed people in the advice process, and promises of high returns. ASIC warned that lead generators providing financial services without a licence "will risk contravening the law" and that **AFSL holders who engage such lead generators "share this risk."**

Simultaneously, ASIC Report 824 (November 2025) reviewed 100 SMSF establishment advice files and found **62 did not demonstrate compliance with the best interests duty**. The $11 million penalty against Equiti Financial Services — for "cookie cutter" advice routing consumers into SMSFs to buy property through a related entity — demonstrates the enforcement intensity.

BrickSuper must position itself as the antithesis of these operators. The site's value proposition to AFSL partners should explicitly include its compliance rigour as a differentiator.

### Referral arrangements: where the line sits

ASIC INFO 282 directly addresses BrickSuper's model. A pure referral — introducing someone to a licensed adviser — is generally not "arranging" if BrickSuper merely provides information about the adviser's services, does not direct the specific product choice, and the lead has genuine choice about whether to proceed. But if BrickSuper becomes "significantly involved in the resultant dealing" through the overall customer journey, it risks crossing into "arranging to deal" under RG 36.47-58, which requires an AFSL.

The commercial structure of the referral fee matters enormously. Under **s963L**, any benefit linked to volume or value of financial products is **presumed to be conflicted remuneration**. This means:

- **Flat cost-per-lead (CPL)**: Lowest risk — fixed fee per lead regardless of outcome, recommended at **$100–300 per qualified SMSF lead**
- **Subscription/listing fee**: Lowest risk — AFSL partners pay fixed monthly fee to be listed
- **Revenue share on SMSF setups**: High risk — directly links BrickSuper's revenue to product dealings
- **Revenue share on ongoing AUM**: Very high risk — volume-based benefit presumed conflicted

**The recommended structure is flat CPL or subscription**, documented in a written referral agreement specifying that BrickSuper provides no advice and does not "arrange" dealings.

### Restricted terms and positioning language

Section 923A of the Corporations Act restricts the words **"independent," "impartial," and "unbiased"** to licensees meeting specific conditions. BrickSuper must never use these terms. Safe alternatives are "educational" and "informational."

**Safe positioning statement**: "BrickSuper.com provides educational information about self-managed super funds and property investment. We do not provide financial product advice, do not hold an AFSL, and are not authorised to provide financial advice. Where you need personalised guidance, we can connect you with licensed professionals — but the decision to engage any adviser is always yours."

**Dangerous phrases to avoid**: "you should," "we recommend," "the best approach," "your super could be performing better," "get started on your SMSF journey," "our expert team," and any superlatives about SMSF property investment. Every benefit mentioned must be paired with corresponding risks, mirroring ASIC's Moneysmart approach.

### Disclaimer architecture

Disclaimers must be layered, not just a one-time footer. The Westpac HCA decision established that a single general-advice warning at the beginning may be insufficient:

- **Site-wide footer**: Abbreviated disclaimer on every page stating no AFSL, factual information only, referral fee disclosure
- **Tool-specific disclaimers**: Prominent above every calculator, quiz, and interactive tool — stating outputs are illustrative only based on user inputs and general assumptions
- **Pre-submission disclaimer**: On any form collecting user information for lead routing, disclosing the referral arrangement
- **"How We're Funded" page**: Full transparency about the CPL model, specifying the fee is fixed regardless of advice received or products acquired

A dedicated **"How We're Funded"** page should state: "BrickSuper earns revenue by connecting visitors interested in SMSF advice with licensed financial advisers. When you choose to be connected, BrickSuper may receive a fixed referral fee from the adviser's licensee. This fee is the same regardless of what advice you receive or whether you proceed with any financial product."

---

## Content architecture built around five exploitable gaps

### The SMSF property education landscape has clear weaknesses

Analysis of existing competitors reveals no single dominant "SMSF property education" brand in Australian search results. Moneysmart provides cautionary surface-level content. SuperGuide offers the deepest coverage but **paywalls most content behind $199/year membership**. The SMSF Association publishes technical PDFs aimed at professionals, not consumers. Accounting firms produce scattered blog posts. No site integrates compliance education, practical tools, and independent lending information in one consumer-friendly hub.

Five specific content gaps represent BrickSuper's entry strategy:

1. **Plain-English BRP education** — all existing business real property content is written in dense legal language by law firms and auditors; no consumer-friendly guide exists
2. **SMSF property readiness/risk assessment tool** — zero competitors offer an interactive complexity assessment combining BRP status, concentration, liquidity, and leverage analysis
3. **Independent LRBA lending landscape** — no regularly-updated editorial guide covers which lenders still offer SMSF property loans, current rates (6.3–7.2%), and the gap between market rates and ATO safe harbour rates (8.95%)
4. **Diversification/concentration tools and templates** — the ATO wrote to 17,700 funds about concentration risk in 2019, yet no tool helps trustees assess their own position or draft compliant justification language
5. **Property-focused investment strategy templates** — existing templates are generic, paywalled, or locked to adviser platforms

### Hub-and-spoke architecture targeting four pillar topics

**Hub 1: SMSF Property Investment Guide** (/smsf-property-guide/) — the main pillar targeting "SMSF property" and "buy property with SMSF" clusters. Spokes cover rules, checklists, costs, residential vs commercial, tax deductions, and exit strategies. Target **5,000+ words** with FAQ schema, jump links, and a visual journey map.

**Hub 2: LRBA Explained** (/lrba-explained/) — targeting "LRBA SMSF" and "limited recourse borrowing arrangement." Critically, this hub includes an **independent lending rates comparison page updated quarterly** — a key differentiator. Current market data: most major banks have exited SMSF lending; active non-bank lenders (Reduce Home Loans, loans.com.au, WLTH, Liberty, Firstmac) offer rates from 6.39% to 7.2% variable, with LVRs of 60-80%. Spokes cover structure diagrams, safe harbour rates, related-party loans, bare trust explainers, and risk deep-dives.

**Hub 3: Business Real Property Guide** (/business-real-property/) — the **biggest competitive gap to exploit**. Under SMSFR 2009/1, BRP must be an eligible interest (freehold, leasehold, or assignable Crown land) used "wholly and exclusively" in one or more businesses. The "wholly and exclusively" test concerns physical use of land, not just legal deployment. Minor/trifling non-business use is acceptable (the ATO's Louisa example: a medical practice with one empty room still qualifies). Temporary vacancies while seeking tenants don't defeat BRP status. But idle/dormant property fails, and token business use timed to acquisition will be rejected. Mixed-use has a farm safe harbour: a dwelling on ≤2 hectares where main use is business can still qualify. Spokes cover plain-English definitions, the business use test, buying business premises through an SMSF, lease-back arrangements, related-party rules, and worked examples.

**Hub 4: SMSF Investment Strategy** (/smsf-investment-strategy/) — targeting "SMSF investment strategy template." SIS Regulation 4.09 requires trustees to formulate, review regularly, and give effect to a written strategy addressing **five mandatory considerations**: risk/return, diversification, liquidity, ability to discharge liabilities, and insurance. Administrative penalties of **$4,200 per trustee** can apply for non-compliance. Critically, no law prevents holding 90%+ in one asset class — the obligation is to **consider and document** the diversification rationale. BrickSuper can own this with free property-focused templates.

### SEO keyword opportunities are substantial

The competitive landscape shows fragmented, often low-quality content ranking for high-intent queries. Key clusters:

- **"Can I buy my business premises in my SMSF"** — ranked by SMSF admin firms and law firms; most content lacks depth on risks and LRBA mechanics
- **"SMSF commercial property"** — surface-level marketing content dominates; strong opportunity for a compliance-focused education resource
- **"SMSF property risks"** — few pieces quantify risks using ATO statistics or reference the 2019 diversification campaign
- **"Business real property SMSF"** — most content is either too technical (professional audience) or too superficial (consumer); a significant gap exists for intermediate-level, business-owner-focused content
- **"SMSF investment strategy template"** — existing templates are generic or paywalled; a free, property-focused template with worked examples would rank strongly
- **"SMSF property settlement process," "bare trust SMSF," "SMSF concentration risk"** — low-competition, high-value long-tail opportunities

Recommended content formats: long-form pillar pages (3,000–7,000 words) with FAQ schema markup for "People Also Ask" capture, How-To schema for process guides, interactive tools for dwell time and link magnetism, comparison tables for featured snippets, and quarterly-updated lending/statistics pages for freshness signals. Every page should carry a "Last updated" date prominently — a critical trust signal for YMYL (Your Money or Your Life) content.

### The data backs up the content strategy

The latest ATO statistics tell a compelling story for BrickSuper's audience: **653,062 SMSFs** hold **$1.05 trillion** in assets (24.3% of all superannuation). Non-residential property accounts for **~$105 billion** (11.2% of SMSF assets), with outstanding LRBAs exceeding **$70 billion**. Average SMSF assets per fund hit **$1.63 million** in 2023-24, up 29% over five years. Critically, **42,000 new SMSFs** were established in 2024-25 — up 27.1% year-on-year — and the median age of new members dropped to **46 years**, suggesting a younger, potentially more digitally-engaged cohort entering the market.

University of Adelaide research (released February 2025, covering 421,000+ SMSFs) found SMSFs with **≥$200,000** in assets achieve returns competitive with APRA funds over five-year periods, outperforming by **1.1–1.3 percentage points annualised**. However, bottom-quartile SMSFs dramatically underperform (1.6% vs 8.0% for APRA funds), driven by heavy cash holdings and poor diversification. ASIC dropped its $500K minimum balance guidance in December 2022; the practical industry threshold is now **~$200,000**. This data underpins BrickSuper's comparison content and quiz thresholds.

---

## Four interactive tools designed as compliant lead engines

### Tool 1: Property complexity and risk profiler

This is BrickSuper's flagship lead gen tool — and the highest-risk from a compliance perspective. Users manually enter property details (purchase price, rent, type, business use) plus fund data (balance, liquid assets, member ages, contributions, existing assets). The tool outputs an educational "complexity and risk flags" dashboard using traffic-light indicators — never a recommendation.

**Safe outputs** include: mathematical calculations (LVR, portfolio concentration percentage, rent-vs-repayment gap), factual statements about regulatory thresholds ("The ATO monitors funds with >90% concentration"), stress-test scenarios showing impacts of rate rises and vacancies, and a list of questions to ask a licensed adviser. **Outputs that would cross into advice**: "you should/shouldn't buy this property," suitability determinations, ranking this investment against alternatives, or recommending contribution strategies.

Critical technical decision: **do not scrape property listing URLs.** REA Group (realestate.com.au) has no public API, employs aggressive anti-bot measures, and Terms of Service prohibit scraping. For a compliance-focused site, the legal risk is unacceptable. Instead, require manual entry — this is legally clean, more reliable, forces user engagement for better lead qualification, and can optionally store a URL as a reference field. The Domain.com.au developer API programme could be explored for commercial listing metadata as a future enhancement.

The BRP status flag is particularly valuable: based on property type and business-use answers, the tool flags whether the property may qualify under s66(5), citing SMSFR 2009/1, with a clear statement that "BRP status is a legal determination — seek legal advice." No competitor combines BRP flagging, concentration analysis, liquidity risk, and stress testing in one workflow.

### Tool 2: "Should you even run an SMSF?" quiz

This segments users into three tiers based on 10 questions covering fund balance, contributions, member count, investment goals, time availability, financial literacy, existing professional relationships, business ownership, and risk tolerance. The compliance-safe output for each tier is a **list of questions to ask a licensed adviser**, not a suitability determination.

- **Tier 1 ("An SMSF may not be right for you right now")**: Triggered by balance <$200K without strong contribution trajectory, no time, no professional support. Output directs to Moneysmart, explains cost-to-balance dynamics, offers a lead magnet.
- **Tier 2 ("Important questions to explore")**: Triggered by $200K–$500K balance or higher balance with limited time/experience. Generates a personalised question list and offers specialist connection.
- **Tier 3 ("Could be worth exploring further")**: Triggered by >$500K, reasonable time commitment, existing professional support. Offers AFSL partner connection.

The framing must never say "suitable" or "recommend." Safe language: "Based on general industry benchmarks, your answers share characteristics with..." followed by "Only a licensed financial adviser can determine whether an SMSF is appropriate for your specific circumstances." Moneysmart has no equivalent interactive tool — this is a clear gap BrickSuper can own.

### Tool 3: LRBA calculator and diversification checker

The LRBA rough-cut calculator takes purchase price, deposit, interest rate (default to current ~6.5%), loan term, interest-only period, rent, and vacancy rate. It outputs monthly repayments, rent-vs-repayment gap, and critically a **stress-test table** showing impacts of +1%, +2%, +3% rate increases and 3-to-6-month vacancies. Pure mathematical calculation — compliant as factual information.

The diversification checker takes current asset allocation and proposed property price, outputting pre/post-purchase allocation pie charts and flagging concentration against ATO benchmarks. At **>90% single-asset concentration**, the tool cites the ATO's 2019 campaign targeting 17,700 funds. At 70–90%, it flags above-median concentration. This connects directly to the investment strategy content hub.

### Tool 4: Gated lead magnets with progressive profiling

Lead magnets should follow a **two-stage progressive profiling model** to balance conversion with data capture. Stage 1 (ungated): let users use calculators and quiz freely to build trust. Stage 2 (light gate): to receive results by email, capture email + first name + optional phone + "Would you like to speak with a licensed specialist?" toggle. Stage 3 (premium content): for downloadable guides, add fund balance range, primary interest, and timeline dropdown.

Priority lead magnets in order of expected conversion value:

1. **"SMSF Property Investor's Pre-Purchase Checklist"** — 30+ items covering BRP qualification through exit strategy, framed as "Use this checklist when discussing with your licensed adviser"
2. **"10 Questions to Ask Before Buying Commercial Property in Your SMSF"** — instantly useful, action-oriented, high shareability
3. **"SMSF Property Decision Framework"** — visual flowchart PDF (Is it BRP? → Need an LRBA? → Can your fund support it?)
4. **"SMSF Investment Strategy Template Guide"** — what must be included per Reg 4.09, how to document concentration decisions
5. **5-part email course: "SMSF Property Investing Fundamentals"** — delivered over 10 days, covering BRP, LRBA, diversification, costs, and next steps

Every downloadable must carry a first-page disclaimer and page-footer reminder that this is general information only. CTAs within lead magnets must say "Connect with a licensed SMSF specialist" rather than "We recommend" or "Based on your situation."

---

## Lead capture, routing, and tracking for lights-out operation

### CTAs framed as value exchange, not advice provision

The CTA hierarchy follows the funnel: **top-of-funnel** CTAs offer educational access ("Take the SMSF Readiness Quiz," "Calculate: Can My SMSF Afford This Property?"); **mid-funnel** CTAs deliver results ("Email Me My Results," "Get My SMSF Readiness Report"); **bottom-of-funnel** CTAs enable connection ("Connect Me with a Licensed SMSF Specialist"). Every specialist-connection CTA must include micro-copy: "BrickSuper does not provide financial advice. Any specialist is independently licensed under their own AFSL."

The email nurture sequence runs **7 emails over 21 days**: welcome + results delivery (Day 0), SMSF basics (Day 2), commercial property focus including BRP (Day 5), LRBA explainer (Day 8), compliance and sole purpose test (Day 12), generalised scenario walkthrough (Day 16), and next-steps CTA with specialist connection (Day 21). Every email carries a general information disclaimer. Content personalises based on quiz answers (balance range, business owner vs employee) but never produces tailored recommendations.

Behaviour-based triggers fire on: quiz/calculator completion (immediate results email + CTA), 3+ content pages in one session (exit-intent popup for guide download), return visit (dynamic hero: "Welcome back"), checklist download without specialist request (Day 2 follow-up), and abandoned specialist-request form (email recovery within 4 hours).

### Pixel and privacy architecture

All tracking deploys through **Google Tag Manager** with a GA4 data layer as single source of truth. Recommended conversion events:

| Event | Platform | Signal |
|---|---|---|
| `quiz_complete` | Google Ads, Meta, LinkedIn | High intent |
| `calculator_use` | Google Ads, Meta | Medium-high intent |
| `content_download` | Google Ads, Meta | Medium intent |
| `email_capture` | All platforms | Qualified lead |
| `specialist_request` | All platforms (primary conversion) | Sales-ready lead |

Implement **Google Consent Mode v2** integrated with a cookie consent tool. While Australia does not yet legally mandate GDPR-style cookie consent banners, the **Privacy and Other Legislation Amendment Act 2024** (Royal Assent December 2024) now explicitly treats cookies and online tracking identifiers as personal information. OAIC published guidance on tracking pixel obligations in November 2024 requiring prior notice about pixel use. For BrickSuper — a financial-services-adjacent site handling potentially sensitive financial data — implementing a best-practice consent banner is strongly recommended. It builds trust with the financially cautious SMSF audience, future-proofs against reforms taking effect through 2026, and is required for Google Consent Mode v2 functionality. CookieYes (~$12/month) integrates with GTM and supports Australian APPs.

Server-side tagging (GTM server-side with Meta Conversions API) should be implemented in Phase 2 when ad spend exceeds ~$2–3K/month, improving data quality and bypassing ad blockers at ~$100–200/month hosting cost.

### AFSL partner scoping and approach strategy

Natural partner types for BrickSuper, in priority order:

- **SMSF Specialist Advisers (SSA designation)** from the SMSF Association — directly aligned, specialist knowledge, discoverable via the SMSF Association directory
- **Financial planning firms with SMSF specialisation** — can provide comprehensive establishment and strategy advice under full AFSL
- **Accounting firms with limited AFSL** — many hold limited licences specifically for SMSF advice; natural referral path for business owners
- **Mortgage brokers holding Australian Credit Licences** — critical for LRBA lending; complement the financial advice referral

Find partners through: ASIC's AFSL Register (search for "SMSF advice" authorisation), SMSF Association SSA directory, Financial Advice Association Australia adviser search, CPA Australia and CA ANZ directories for accountants with limited AFSLs, and direct outreach to firms advertising SMSF services in target geographies.

The approach pitch should lead with value: "We deliver pre-qualified, educated SMSF property leads at $X per lead, from a compliance-reviewed educational platform." Emphasise the compliance positioning as a differentiator from the entities named in ASIC's 26-029MR review. Offer a no-commitment 10-lead pilot.

### Lean tech stack at ~$150/month

**Webflow** (CMS, $29–46/month) over WordPress — clean fast code with excellent Core Web Vitals, built-in hosting/CDN/SSL, visual editor for non-developer iteration, no plugin maintenance or security patching. Better for a greenfield site that needs speed-to-market and design quality over massive content volume.

**ActiveCampaign Plus** (CRM + marketing automation, $49–75/month for 1,000 contacts) over HubSpot — automation available on all plans (vs HubSpot's $890/month Professional tier), industry-leading 94.2% email deliverability, built-in CRM with deal pipelines, lead scoring, and progressive profiling. HubSpot only becomes justified at team sizes and revenue levels well beyond greenfield.

**Google Tag Manager** (free) for all pixel management. **Zapier Starter** ($29/month) for lead routing automation — webhook notifications to AFSL partners plus Google Sheets audit trail logging every routing event with timestamp and consent records. **CookieYes** (~$12/month) for consent management.

The integration flow: User → Webflow site → GTM fires GA4/Meta/LinkedIn pixels → ActiveCampaign captures lead via embedded forms → lead scoring and nurture automation → routing logic assigns to appropriate AFSL partner based on geography and lead type → Zapier pushes notification to partner + logs to audit sheet → partner confirms contact → ActiveCampaign updates deal stage. Total monthly cost: **approximately $130–180**, scaling with contact volume.

For quiz and calculator tools, either embed third-party tools (Typeform at $25–50/month for quiz; Outgrow at $22–55/month for calculators) within Webflow pages, or build custom with JavaScript (one-time development cost of $2–5K for more control and better compliance framing).

---

## Conclusion: a viable model requiring surgical compliance execution

BrickSuper sits at the intersection of strong market demand (42,000 new SMSFs per year, $105 billion in SMSF non-residential property), clear content gaps (no dominant SMSF property education brand), and heightened regulatory scrutiny (ASIC's February 2026 lead gen crackdown). The model works if — and only if — compliance is treated as a foundational architecture decision rather than an afterthought.

Three actions should precede any public launch. First, engage a financial services compliance lawyer to review all site content, tool outputs, and the draft referral agreement — budget **$5–10K** for initial legal setup. Second, structure AFSL partner arrangements exclusively as flat CPL or subscription fees, documented in written agreements with mutual compliance obligations. Third, build disclaimer infrastructure directly into the CMS so that every page type automatically carries appropriate warnings.

The competitive moat is educational quality married to compliance rigour. In a market where ASIC is actively naming and shaming operators, BrickSuper's positioning as a transparent, balanced, regulation-aware education platform becomes both a regulatory shield and a commercial differentiator — a site that AFSL partners can confidently associate with because it makes their compliance obligations easier, not harder.