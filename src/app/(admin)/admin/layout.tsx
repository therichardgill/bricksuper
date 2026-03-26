"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Building2,
  ScrollText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Building2 },
  { href: "/admin/audit", label: "Audit Trail", icon: ScrollText },
] as const;

function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-bs-orange-pale text-bs-orange-dark font-medium"
                : "text-bs-mid hover:text-bs-charcoal hover:bg-muted"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-bs-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-bs-charcoal mb-4">
            BrickSuper Admin
          </h1>
          <p className="text-bs-mid mb-6">
            Sign in to access the CRM dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="bg-bs-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-bs-orange-dark transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen flex bg-background">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-60 border-r border-border flex-col p-4 bg-white">
            <div className="flex items-center gap-2.5 mb-8 px-3">
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
              <span className="font-serif text-bs-charcoal">Admin</span>
            </div>
            <AdminSidebar className="flex-1" />
            <div className="mt-auto pt-4 border-t border-border px-3">
              <UserButton />
            </div>
          </aside>

          {/* Mobile header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
            <span className="font-serif text-bs-charcoal">Admin</span>
            <div className="flex items-center gap-3">
              <UserButton />
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-2 text-bs-mid"
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              >
                {mobileNavOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav overlay */}
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-8">
                <AdminSidebar />
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 lg:p-8 p-4 pt-18 lg:pt-8">
            {children}
          </main>
        </div>
  );
}
