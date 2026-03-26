"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn, formatDate } from "@/lib/utils";

const pipelineCards = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "converted", label: "Converted" },
] as const;

export default function AdminDashboardPage() {
  const data = useQuery(api.admin.getDashboardStats);

  if (!data) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 bg-white">
              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-3" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 bg-white">
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-3" />
              <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { stats, recentFailures } = data;

  return (
    <div>
      <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Dashboard</h1>

      {/* Pipeline summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {pipelineCards.map(({ key, label }) => (
          <div key={key} className="border border-border rounded-xl p-5 bg-muted">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-semibold text-bs-charcoal">
              {stats[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-border rounded-xl p-5 bg-white">
          <p className="text-sm text-muted-foreground mb-1">This Week</p>
          <p className="text-2xl font-semibold text-bs-charcoal">{stats.thisWeek}</p>
        </div>
        <div className="border border-border rounded-xl p-5 bg-white">
          <p className="text-sm text-muted-foreground mb-1">Today</p>
          <p className="text-2xl font-semibold text-bs-charcoal">{stats.today}</p>
        </div>
        <div className="border border-border rounded-xl p-5 bg-white">
          <p className="text-sm text-muted-foreground mb-1">Qualified vs Unqualified</p>
          <p className="text-2xl font-semibold text-bs-charcoal">
            {stats.qualifiedLeads} / {stats.unqualifiedLeads}
          </p>
        </div>
      </div>

      {/* Recent webhook failures */}
      {recentFailures.length > 0 && (
        <div className="border border-border rounded-xl p-5 bg-white">
          <h2 className="font-semibold text-bs-charcoal mb-4">Recent Webhook Failures</h2>
          <ul className="space-y-3">
            {recentFailures.map((failure) => (
              <li
                key={failure._id}
                className="flex items-start justify-between border-b border-border/50 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm text-bs-charcoal">{failure.details}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(failure.createdAt)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Failed
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
