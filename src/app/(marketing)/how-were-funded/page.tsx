import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { Disclaimer } from "@/components/brand/disclaimer";
import { DISCLAIMER_FUNDING } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We're Funded",
  description:
    "Full transparency about how BrickSuper earns revenue. We receive a fixed referral fee — the same regardless of what advice you receive.",
};

export default function HowWereFundedPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-prose mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl text-bs-charcoal mb-6">
              How We&apos;re Funded
            </h1>

            <div className="prose prose-slate max-w-none space-y-6 text-bs-slate leading-relaxed">
              <p className="text-lg">
                BrickSuper believes in complete transparency about how we earn
                revenue. Here is exactly how it works.
              </p>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mt-10 mb-4">
                  Our revenue model
                </h2>
                <p>{DISCLAIMER_FUNDING}</p>
                <p>
                  Specifically, BrickSuper operates on a{" "}
                  <strong>flat cost-per-lead (CPL)</strong> model. When you
                  choose to be connected with a licensed SMSF specialist through
                  our platform, we may receive a fixed referral fee from the
                  specialist&apos;s licensee.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mt-10 mb-4">
                  What &quot;fixed&quot; means
                </h2>
                <ul className="space-y-3">
                  <li>
                    The fee is the <strong>same amount</strong> regardless of
                    what advice you receive
                  </li>
                  <li>
                    The fee is the <strong>same amount</strong> regardless of
                    whether you proceed with any financial product
                  </li>
                  <li>
                    The fee is <strong>not linked</strong> to the volume or value
                    of any financial products — this is important because
                    volume-based benefits are presumed to be conflicted
                    remuneration under s963L of the Corporations Act 2001
                  </li>
                  <li>
                    The fee is documented in a{" "}
                    <strong>written referral agreement</strong> with each
                    specialist&apos;s licensee
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mt-10 mb-4">
                  What we do not do
                </h2>
                <ul className="space-y-3">
                  <li>
                    We do not provide financial product advice — we do not hold
                    an Australian Financial Services Licence (AFSL)
                  </li>
                  <li>
                    We do not direct your choice of adviser or financial product
                  </li>
                  <li>
                    We do not receive commission, trailing fees, or any payment
                    linked to what you invest in
                  </li>
                  <li>
                    We do not pressure you to act — the decision to connect with
                    a specialist is always yours, and there is no cost to you for
                    using BrickSuper
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mt-10 mb-4">
                  Why this model
                </h2>
                <p>
                  ASIC&apos;s February 2026 review of lead generation services
                  (26-029MR) identified significant risks with certain lead gen
                  models — particularly those involving pressure tactics,
                  volume-based remuneration, and unlicensed involvement in the
                  advice process.
                </p>
                <p>
                  BrickSuper&apos;s flat CPL model is designed to stay clearly
                  within the referral safe harbour described in ASIC INFO 282. A
                  pure referral — introducing someone to a licensed adviser — is
                  generally not &quot;arranging&quot; if BrickSuper merely
                  provides information about the adviser&apos;s services, does
                  not direct the specific product choice, and the lead has
                  genuine choice about whether to proceed.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-bs-charcoal mt-10 mb-4">
                  Your choice, always
                </h2>
                <p>
                  You can use all of BrickSuper&apos;s educational tools,
                  guides, and calculators without ever connecting with a
                  specialist. The content is free and ungated. When you do choose
                  to connect, you are making that decision freely — and you can
                  change your mind at any time.
                </p>
              </section>
            </div>

            <Disclaimer variant="site" className="mt-12" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
