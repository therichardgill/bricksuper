"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { cn, formatDate, formatAUD } from "@/lib/utils";
import Link from "next/link";

const pipelineBadgeStyles: Record<string, string> = {
  new: "bg-gray-100 text-gray-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-gray-800 text-white",
  lost: "bg-red-100 text-red-800",
};

const tierBadgeStyles: Record<string, string> = {
  tier1: "bg-red-50 text-red-700",
  tier2: "bg-amber-50 text-amber-700",
  tier3: "bg-green-50 text-green-700",
};

export default function PartnerDetailPage() {
  const { id } = useParams() as { id: string };
  const partnerId = id as Id<"partnerFirms">;

  const data = useQuery(api.admin.getPartner, { partnerId });

  if (data === undefined) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Partner Detail</h1>
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-white">
            <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-56 bg-muted animate-pulse rounded mb-3" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Partner Detail</h1>
        <div className="border border-border rounded-xl p-5 bg-white">
          <p className="text-muted-foreground">Partner not found.</p>
        </div>
      </div>
    );
  }

  const { partner, leads, auditEntries } = data;

  return (
    <div>
      <h1 className="font-serif text-2xl text-bs-charcoal mb-6">{partner.name}</h1>

      {/* Partner info */}
      <div className="border border-border rounded-xl p-5 bg-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-semibold text-bs-charcoal">Partner Information</h2>
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
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-bs-charcoal font-medium">{partner.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">AFSL#</dt>
            <dd className="text-bs-charcoal">{partner.afslNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Contact Name</dt>
            <dd className="text-bs-charcoal">{partner.contactName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Contact Email</dt>
            <dd className="text-bs-charcoal">{partner.contactEmail}</dd>
          </div>
          {partner.contactPhone && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Contact Phone</dt>
              <dd className="text-bs-charcoal">{partner.contactPhone}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">CPL Rate</dt>
            <dd className="text-bs-charcoal">{formatAUD(partner.cplRate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Geographies</dt>
            <dd className="text-bs-charcoal">{partner.geographies.join(", ") || "--"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Specialisations</dt>
            <dd className="text-bs-charcoal">{partner.specialisations.join(", ") || "--"}</dd>
          </div>
          {partner.webhookUrl && (
            <div className="flex justify-between md:col-span-2">
              <dt className="text-muted-foreground">Webhook URL</dt>
              <dd className="text-bs-charcoal break-all">{partner.webhookUrl}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Recent leads */}
      <div className="border border-border rounded-xl bg-white overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-semibold text-bs-charcoal">Recent Leads</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pipeline Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  No leads routed to this partner yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead._id}`}
                      className="text-bs-charcoal font-medium hover:underline"
                    >
                      {lead.firstName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.source}</td>
                  <td className="px-4 py-3">
                    {lead.tier && (
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          tierBadgeStyles[lead.tier] ?? "bg-gray-100 text-gray-800"
                        )}
                      >
                        {lead.tier}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        pipelineBadgeStyles[lead.pipelineStatus] ?? "bg-gray-100 text-gray-800"
                      )}
                    >
                      {lead.pipelineStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Webhook status */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h2 className="font-semibold text-bs-charcoal mb-4">Webhook Status</h2>
        {auditEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No webhook activity recorded.</p>
        ) : (
          <ul className="space-y-3">
            {auditEntries.map((entry) => (
              <li
                key={entry._id}
                className="flex items-start justify-between border-b border-border/50 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm text-bs-charcoal">{entry.action}</p>
                  {entry.details && (
                    <p className="text-xs text-muted-foreground">{entry.details}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {formatDate(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
