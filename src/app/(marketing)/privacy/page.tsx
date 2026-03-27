import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BrickSuper collects, uses, and protects your personal information under the Australian Privacy Act 1988.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-prose mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-bs-muted mb-8">
              Last updated: March 2026 · Version 1.0
            </p>

            <div className="space-y-8 text-bs-slate leading-relaxed">
              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  About this policy
                </h2>
                <p>
                  BrickSuper.com.au (&quot;BrickSuper&quot;, &quot;we&quot;,
                  &quot;us&quot;) is committed to protecting your personal
                  information in accordance with the Australian Privacy Act 1988
                  (Cth) and the Australian Privacy Principles (APPs).
                </p>
                <p className="mt-3">
                  This policy explains what personal information we collect, how
                  we use it, who we share it with, and how you can access or
                  correct it.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  What we collect (APP 3)
                </h2>
                <p>We collect the following personal information:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Contact details:</strong> first name, email address,
                    phone number (if you choose to provide it)
                  </li>
                  <li>
                    <strong>Financial indicators:</strong> super fund balance
                    range, property interest type, investment timeline, business
                    ownership status — collected through our interactive tools
                    and quiz
                  </li>
                  <li>
                    <strong>Usage data:</strong> pages visited, tools used, quiz
                    responses, calculator inputs — collected via cookies and
                    analytics (with your consent)
                  </li>
                  <li>
                    <strong>Technical data:</strong> IP address, browser type,
                    device type — for security and service improvement
                  </li>
                </ul>
                <p className="mt-3">
                  We do not collect sensitive information such as tax file
                  numbers, specific financial account details, or health
                  information.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  How we use your information (APP 6)
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    To deliver quiz results and calculator outputs to your email
                  </li>
                  <li>
                    To connect you with a licensed SMSF specialist, if you opt in
                  </li>
                  <li>
                    To send educational email content about SMSF property
                    investment (you can unsubscribe at any time)
                  </li>
                  <li>
                    To improve our tools and content based on aggregate usage
                    patterns
                  </li>
                  <li>
                    To comply with our legal obligations
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Who we share your information with (APP 6)
                </h2>
                <p>
                  If you opt in to connect with a licensed SMSF specialist, we
                  share your contact details and quiz/tool results with the
                  specialist&apos;s licensee (an AFSL holder). We disclose:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Your first name, email, and phone (if provided)</li>
                  <li>Your quiz tier and relevant tool outputs</li>
                  <li>The date and time you opted in</li>
                  <li>Your consent record</li>
                </ul>
                <p className="mt-3">
                  We do not sell, rent, or trade your personal information. We do
                  not share your information with anyone other than the specific
                  specialist you chose to connect with.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Direct marketing (APP 7)
                </h2>
                <p>
                  If you provide your email address, we may send you educational
                  content about SMSF property investment. Every email includes an
                  unsubscribe link. You can opt out at any time by clicking
                  unsubscribe or contacting us.
                </p>
                <p className="mt-3">
                  We do not use your information for marketing purposes unrelated
                  to SMSF property education.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Overseas disclosure (APP 8)
                </h2>
                <p>
                  Some of our service providers store data outside Australia:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Convex</strong> (database) — United States
                  </li>
                  <li>
                    <strong>ActiveCampaign</strong> (email marketing) — United
                    States
                  </li>
                  <li>
                    <strong>Resend</strong> (transactional email) — United States
                  </li>
                  <li>
                    <strong>Vercel</strong> (website hosting) — Global CDN with
                    US primary
                  </li>
                </ul>
                <p className="mt-3">
                  We take reasonable steps to ensure these providers handle your
                  data in accordance with the Australian Privacy Principles. By
                  providing your information, you consent to this overseas
                  disclosure.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Cookies and tracking (Privacy Amendment Act 2024)
                </h2>
                <p>
                  Under the Privacy and Other Legislation Amendment Act 2024,
                  cookies and online tracking identifiers are personal
                  information. We use:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Essential cookies:</strong> Required for the site to
                    function (session management, security)
                  </li>
                  <li>
                    <strong>Analytics cookies:</strong> Google Analytics 4 —
                    tracks page views and tool usage to improve our content (with
                    your consent)
                  </li>
                  <li>
                    <strong>Marketing cookies:</strong> Google Ads and Meta
                    pixels — measures ad performance (with your consent)
                  </li>
                </ul>
                <p className="mt-3">
                  We use Google Consent Mode v2 with a consent banner. Analytics
                  and marketing cookies only activate after you provide consent.
                  You can change your cookie preferences at any time.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Data retention
                </h2>
                <p>
                  We retain your personal information for up to 2 years from
                  collection. After this period, your data is anonymised — your
                  name, email, and phone are replaced with anonymised
                  identifiers, and the record is retained only for aggregate
                  statistical purposes.
                </p>
                <p className="mt-3">
                  You can request deletion of your data at any time (see below).
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Your rights (APPs 12 &amp; 13)
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>
                    <strong>Access</strong> the personal information we hold
                    about you
                  </li>
                  <li>
                    <strong>Correct</strong> any information that is inaccurate,
                    incomplete, or out of date
                  </li>
                  <li>
                    <strong>Request deletion</strong> of your personal
                    information
                  </li>
                  <li>
                    <strong>Unsubscribe</strong> from marketing communications at
                    any time
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a
                    href="mailto:privacy@bricksuper.com"
                    className="text-bs-orange hover:underline"
                  >
                    privacy@bricksuper.com
                  </a>
                  . We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mb-4">
                  Complaints
                </h2>
                <p>
                  If you believe we have breached the Australian Privacy
                  Principles, you can lodge a complaint with us at{" "}
                  <a
                    href="mailto:privacy@bricksuper.com"
                    className="text-bs-orange hover:underline"
                  >
                    privacy@bricksuper.com
                  </a>
                  . If you are not satisfied with our response, you can lodge a
                  complaint with the Office of the Australian Information
                  Commissioner (OAIC) at{" "}
                  <a
                    href="https://www.oaic.gov.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bs-orange hover:underline"
                  >
                    oaic.gov.au
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
