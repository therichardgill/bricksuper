/**
 * BrickSuper Operations Layer
 *
 * Single source of truth for all business operations.
 * Used by: Web UI (Next.js), MCP Server, CLI.
 *
 *   ┌──────────┐  ┌──────────┐  ┌──────────┐
 *   │ Web UI   │  │ MCP      │  │ CLI      │
 *   └────┬─────┘  └────┬─────┘  └────┬─────┘
 *        └──────────────┼──────────────┘
 *                       ▼
 *               lib/operations.ts  ← you are here
 *                       ▼
 *               Convex Backend
 *
 * These functions wrap Convex client calls so that
 * MCP tools and CLI commands don't duplicate logic.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { checkCompliance } from "./compliance";

export function createClient(url?: string): ConvexHttpClient {
  const convexUrl = url || process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) throw new Error("CONVEX_URL not set");
  return new ConvexHttpClient(convexUrl);
}

// ── Lead Operations ─────────────────────────────────────────────

export async function listLeads(
  client: ConvexHttpClient,
  filters?: {
    pipelineStatus?: string;
    qualificationStatus?: string;
    source?: string;
    limit?: number;
  }
) {
  return client.query(api.admin.listLeads, {
    pipelineStatus: filters?.pipelineStatus,
    qualificationStatus: filters?.qualificationStatus,
    source: filters?.source,
    limit: filters?.limit,
  });
}

export async function getLead(client: ConvexHttpClient, leadId: string) {
  return client.query(api.admin.getLead, { leadId: leadId as any });
}

export async function updateLeadStatus(
  client: ConvexHttpClient,
  leadId: string,
  newStatus: "new" | "contacted" | "qualified" | "converted" | "lost",
  userId?: string
) {
  return client.mutation(api.admin.updateLeadStatus, {
    leadId: leadId as any,
    newStatus,
    userId,
  });
}

export async function addLeadNote(
  client: ConvexHttpClient,
  leadId: string,
  text: string,
  userId: string
) {
  // Compliance check before write
  const violations = checkCompliance(text);
  if (violations.length > 0) {
    throw new Error(
      `Compliance violation in note: ${violations.map((v) => `"${v.phrase}"`).join(", ")}`
    );
  }
  return client.mutation(api.admin.addLeadNote, {
    leadId: leadId as any,
    text,
    userId,
  });
}

// ── Partner Operations ──────────────────────────────────────────

export async function listPartners(client: ConvexHttpClient) {
  return client.query(api.admin.listPartners, {});
}

export async function getPartner(client: ConvexHttpClient, partnerId: string) {
  return client.query(api.admin.getPartner, { partnerId: partnerId as any });
}

export async function createPartner(
  client: ConvexHttpClient,
  data: {
    name: string;
    afslNumber: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    webhookUrl?: string;
    cplRate: number;
    geographies: string[];
    specialisations: string[];
  }
) {
  return client.mutation(api.admin.createPartner, data);
}

export async function testPartnerWebhook(
  client: ConvexHttpClient,
  partnerId: string
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  const partner = await getPartner(client, partnerId);
  if (!partner?.partner?.webhookUrl) {
    return { success: false, error: "No webhook URL configured" };
  }

  try {
    const response = await fetch(partner.partner.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test: true,
        source: "bricksuper-health-check",
        timestamp: new Date().toISOString(),
      }),
    });
    return { success: response.ok, statusCode: response.status };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function healthCheckAllPartners(client: ConvexHttpClient) {
  const partners = await listPartners(client);
  const results = await Promise.all(
    partners
      .filter((p: any) => p.isActive && p.webhookUrl)
      .map(async (p: any) => ({
        name: p.name,
        partnerId: p._id,
        ...(await testPartnerWebhook(client, p._id)),
      }))
  );
  return results;
}

// ── Content Operations ──────────────────────────────────────────

export function checkContentCompliance(text: string) {
  return checkCompliance(text);
}

export async function suggestContentUpdates(client: ConvexHttpClient) {
  // Check for stale content (>90 days since review)
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

  // This would query contentMeta, but since we store content in code,
  // we report based on known hub pages and their last-updated dates
  const hubs = [
    { slug: "/smsf-property-guide", title: "SMSF Property Guide" },
    { slug: "/lrba-explained", title: "LRBA Explained" },
    { slug: "/business-real-property", title: "Business Real Property" },
    { slug: "/smsf-investment-strategy", title: "Investment Strategy" },
  ];

  return {
    staleThreshold: new Date(ninetyDaysAgo).toISOString(),
    hubs: hubs.map((h) => ({
      ...h,
      note: "Content freshness tracked via git commits. Run `git log --oneline -1 -- src/app/(marketing)${h.slug}` to check.",
    })),
  };
}

// ── Monitor Operations ──────────────────────────────────────────

export async function getDashboard(client: ConvexHttpClient) {
  return client.query(api.admin.getDashboardStats, {});
}

export async function getAuditTrail(
  client: ConvexHttpClient,
  opts?: { limit?: number; action?: string }
) {
  return client.query(api.admin.getAuditTrail, {
    limit: opts?.limit,
    action: opts?.action,
  });
}

export async function getWebhookFailures(client: ConvexHttpClient) {
  return getAuditTrail(client, {
    action: "partner_webhook_failed",
    limit: 20,
  });
}
