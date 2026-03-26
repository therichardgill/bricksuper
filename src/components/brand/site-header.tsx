import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const NAV_ITEMS = [
  { href: "/smsf-property-guide", label: "Property Guide" },
  { href: "/lrba-explained", label: "LRBA Explained" },
  { href: "/business-real-property", label: "BRP Guide" },
  { href: "/smsf-investment-strategy", label: "Strategy" },
  { href: "/how-were-funded", label: "How We're Funded" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="2" y="16" width="28" height="14" rx="3" fill="#E8611A" />
            <rect x="2" y="4" width="13" height="10" rx="2" fill="#F4924E" />
            <rect x="17" y="4" width="13" height="10" rx="2" fill="#F4924E" />
            <rect
              x="6"
              y="19"
              width="5"
              height="8"
              rx="1.5"
              fill="#C44E10"
              opacity="0.6"
            />
            <rect
              x="13.5"
              y="19"
              width="5"
              height="8"
              rx="1.5"
              fill="#C44E10"
              opacity="0.6"
            />
            <rect
              x="21"
              y="19"
              width="5"
              height="8"
              rx="1.5"
              fill="#C44E10"
              opacity="0.6"
            />
          </svg>
          <span className="font-serif text-lg text-bs-charcoal">
            BrickSuper
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-bs-mid hover:text-bs-charcoal transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/quiz">Take the Quiz</Link>
          </Button>
        </div>

        {/* Mobile: hamburger placeholder — will wire up with state */}
        <button
          className="lg:hidden p-2 text-bs-mid hover:text-bs-charcoal"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>
      </nav>
    </header>
  );
}
