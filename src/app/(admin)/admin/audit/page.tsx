"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { cn, formatDate } from "@/lib/utils";

const actionOptions = [
  { value: "", label: "All Actions" },
  { value: "status_changed", label: "Status Changed" },
  { value: "note_added", label: "Note Added" },
  { value: "lead_created", label: "Lead Created" },
  { value: "lead_qualified", label: "Lead Qualified" },
  { value: "partner_webhook_sent", label: "Webhook Sent" },
  { value: "partner_webhook_failed", label: "Webhook Failed" },
  { value: "lead_routed", label: "Lead Routed" },
];

const actionBadgeStyles: Record<string, string> = {
  status_changed: "bg-blue-100 text-blue-800",
  note_added: "bg-purple-100 text-purple-800",
  lead_created: "bg-green-100 text-green-800",
  lead_qualified: "bg-emerald-100 text-emerald-800",
  partner_webhook_sent: "bg-cyan-100 text-cyan-800",
  partner_webhook_failed: "bg-red-100 text-red-800",
  lead_routed: "bg-amber-100 text-amber-800",
};

export default function AuditPage() {
  const [filterAction, setFilterAction] = useState("");

  const entries = useQuery(api.admin.getAuditTrail, {
    limit: 100,
    action: filterAction || undefined,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Audit Trail</h1>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {actionOptions.map((opt) => (
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
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Timestamp</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Lead</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            {!entries
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : entries.map((entry) => (
                  <tr
                    key={entry._id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          actionBadgeStyles[entry.action] ?? "bg-gray-100 text-gray-800"
                        )}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-bs-charcoal">
                      {entry.leadName ?? "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.details ?? "\u2014"}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
