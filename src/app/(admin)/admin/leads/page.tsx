"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

const pipelineOptions = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const qualificationOptions = [
  { value: "", label: "All Qualification" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
];

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

export default function LeadsPage() {
  const [pipelineStatus, setPipelineStatus] = useState("");
  const [qualificationStatus, setQualificationStatus] = useState("");

  const leads = useQuery(api.admin.listLeads, {
    pipelineStatus: pipelineStatus || undefined,
    qualificationStatus: qualificationStatus || undefined,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Leads</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={pipelineStatus}
          onChange={(e) => setPipelineStatus(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {pipelineOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={qualificationStatus}
          onChange={(e) => setQualificationStatus(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {qualificationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pipeline Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Partner</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {!leads
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : leads.map((lead) => (
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
                      {lead.partnerName ?? "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
