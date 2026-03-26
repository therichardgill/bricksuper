"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { cn, formatAUD } from "@/lib/utils";
import Link from "next/link";

export default function PartnersPage() {
  const partners = useQuery(api.admin.listPartners);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-bs-charcoal">Partners</h1>
        <button
          disabled
          title="Coming soon"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-bs-charcoal text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Partner
        </button>
      </div>

      {!partners ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 bg-white">
              <div className="h-5 w-40 bg-muted animate-pulse rounded mb-3" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((partner) => (
            <Link
              key={partner._id}
              href={`/admin/partners/${partner._id}`}
              className="border border-border rounded-xl p-5 bg-white hover:shadow-sm transition-shadow block"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-bs-charcoal">{partner.name}</h2>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    partner.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {partner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">AFSL#</dt>
                  <dd className="text-bs-charcoal">{partner.afslNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="text-bs-charcoal">{partner.contactEmail}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Lead Count</dt>
                  <dd className="text-bs-charcoal">{partner.leadCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">CPL Rate</dt>
                  <dd className="text-bs-charcoal">{formatAUD(partner.cplRate)}</dd>
                </div>
                {partner.webhookUrl && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Webhook</dt>
                    <dd className="text-bs-charcoal truncate max-w-[200px]">
                      {partner.webhookUrl}
                    </dd>
                  </div>
                )}
              </dl>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
