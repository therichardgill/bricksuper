import Link from "next/link";
import { Disclaimer } from "./disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="16"
                  width="28"
                  height="14"
                  rx="3"
                  fill="#E8611A"
                />
                <rect
                  x="2"
                  y="4"
                  width="13"
                  height="10"
                  rx="2"
                  fill="#F4924E"
                />
                <rect
                  x="17"
                  y="4"
                  width="13"
                  height="10"
                  rx="2"
                  fill="#F4924E"
                />
              </svg>
              <span className="font-serif text-bs-charcoal">BrickSuper</span>
            </div>
            <p className="text-sm text-bs-muted leading-relaxed">
              Educational information about SMSF property investment. We do not
              provide financial advice.
            </p>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-bs-charcoal mb-3">
              Guides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/smsf-property-guide"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  SMSF Property Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/lrba-explained"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  LRBA Explained
                </Link>
              </li>
              <li>
                <Link
                  href="/business-real-property"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  Business Real Property
                </Link>
              </li>
              <li>
                <Link
                  href="/smsf-investment-strategy"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  Investment Strategy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-bs-charcoal mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-were-funded"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  How We&apos;re Funded
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-bs-mid hover:text-bs-charcoal"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Site disclaimer */}
        <Disclaimer variant="site" />

        <p className="text-xs text-bs-muted mt-6 text-center">
          &copy; {new Date().getFullYear()} BrickSuper.com.au. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
