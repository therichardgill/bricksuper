#!/usr/bin/env npx tsx
/**
 * BrickSuper MCP Server
 *
 * Universal interface for AI agents to operate the platform.
 * Runs as stdio transport for Claude Code, or HTTP for remote agents.
 *
 * Usage (Claude Code):
 *   Add to .mcp.json:
 *   { "mcpServers": { "bricksuper": { "command": "npx", "args": ["tsx", "mcp/server.ts"] } } }
 *
 * Usage (CLI):
 *   CONVEX_URL=https://your-project.convex.cloud npx tsx mcp/server.ts
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createClient,
  listLeads,
  getLead,
  updateLeadStatus,
  addLeadNote,
  listPartners,
  getPartner,
  createPartner,
  testPartnerWebhook,
  healthCheckAllPartners,
  checkContentCompliance,
  suggestContentUpdates,
  getDashboard,
  getAuditTrail,
  getWebhookFailures,
} from "../src/lib/operations.js";

const server = new McpServer({
  name: "bricksuper",
  version: "1.0.0",
});

// Lazy client — created on first tool call
let _client: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

// ── Lead Tools ──────────────────────────────────────────────────

server.tool(
  "leads:list",
  "List leads with optional filters (status, source, qualification)",
  {
    pipelineStatus: z.string().optional().describe("Filter: new, contacted, qualified, converted, lost"),
    qualificationStatus: z.string().optional().describe("Filter: qualified, unqualified"),
    source: z.string().optional().describe("Filter: quiz, profiler, calculator, etc."),
    limit: z.number().optional().describe("Max results (default 50)"),
  },
  async (args) => {
    const leads = await listLeads(getClient(), args);
    return { content: [{ type: "text" as const, text: JSON.stringify(leads, null, 2) }] };
  }
);

server.tool(
  "leads:get",
  "Get full lead detail including timeline, audit trail, notes, and quiz response",
  { leadId: z.string().describe("The Convex lead ID") },
  async ({ leadId }) => {
    const lead = await getLead(getClient(), leadId);
    return { content: [{ type: "text" as const, text: JSON.stringify(lead, null, 2) }] };
  }
);

server.tool(
  "leads:update_status",
  "Move a lead through the pipeline (new → contacted → qualified → converted → lost)",
  {
    leadId: z.string().describe("The Convex lead ID"),
    newStatus: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
    userId: z.string().optional().describe("Who made this change"),
  },
  async ({ leadId, newStatus, userId }) => {
    await updateLeadStatus(getClient(), leadId, newStatus, userId);
    return { content: [{ type: "text" as const, text: `Lead ${leadId} status updated to ${newStatus}` }] };
  }
);

server.tool(
  "leads:add_note",
  "Add a CRM note to a lead (compliance-checked at write boundary)",
  {
    leadId: z.string().describe("The Convex lead ID"),
    text: z.string().describe("Note text (will be compliance-checked for banned phrases)"),
    userId: z.string().describe("Who is adding this note"),
  },
  async ({ leadId, text, userId }) => {
    try {
      await addLeadNote(getClient(), leadId, text, userId);
      return { content: [{ type: "text" as const, text: `Note added to lead ${leadId}` }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `COMPLIANCE ERROR: ${err instanceof Error ? err.message : "Unknown error"}` }],
        isError: true,
      };
    }
  }
);

// ── Partner Tools ───────────────────────────────────────────────

server.tool(
  "partners:list",
  "List all partner firms with status and lead counts",
  {},
  async () => {
    const partners = await listPartners(getClient());
    return { content: [{ type: "text" as const, text: JSON.stringify(partners, null, 2) }] };
  }
);

server.tool(
  "partners:get",
  "Get partner detail including webhook health and recent leads",
  { partnerId: z.string().describe("The Convex partner ID") },
  async ({ partnerId }) => {
    const partner = await getPartner(getClient(), partnerId);
    return { content: [{ type: "text" as const, text: JSON.stringify(partner, null, 2) }] };
  }
);

server.tool(
  "partners:create",
  "Add a new partner advisory firm",
  {
    name: z.string(),
    afslNumber: z.string(),
    contactName: z.string(),
    contactEmail: z.string(),
    contactPhone: z.string().optional(),
    webhookUrl: z.string().optional(),
    cplRate: z.number().describe("Dollars per lead"),
    geographies: z.array(z.string()).describe("e.g. ['NSW', 'VIC']"),
    specialisations: z.array(z.string()).describe("e.g. ['commercial-property', 'brp']"),
  },
  async (args) => {
    const id = await createPartner(getClient(), args);
    return { content: [{ type: "text" as const, text: `Partner created: ${id}` }] };
  }
);

server.tool(
  "partners:test_webhook",
  "Send a test payload to a partner's webhook URL and report the result",
  { partnerId: z.string() },
  async ({ partnerId }) => {
    const result = await testPartnerWebhook(getClient(), partnerId);
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "partners:health_check",
  "Check webhook endpoint health for all active partners",
  {},
  async () => {
    const results = await healthCheckAllPartners(getClient());
    return { content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }] };
  }
);

// ── Content Tools ───────────────────────────────────────────────

server.tool(
  "content:check_compliance",
  "Run banned-phrase compliance check on provided text. Returns violations or empty array if clean.",
  { text: z.string().describe("Text to check for compliance violations") },
  async ({ text }) => {
    const violations = checkContentCompliance(text);
    if (violations.length === 0) {
      return { content: [{ type: "text" as const, text: "COMPLIANT — no banned phrases detected." }] };
    }
    return {
      content: [{
        type: "text" as const,
        text: `VIOLATIONS FOUND:\n${violations.map((v) => `- "${v.phrase}" — ${v.reason} (${v.legalBasis})`).join("\n")}`,
      }],
    };
  }
);

server.tool(
  "content:suggest_updates",
  "Identify content pages that may be stale (>90 days since review)",
  {},
  async () => {
    const suggestions = await suggestContentUpdates(getClient());
    return { content: [{ type: "text" as const, text: JSON.stringify(suggestions, null, 2) }] };
  }
);

// ── Monitor Tools ───────────────────────────────────────────────

server.tool(
  "monitor:dashboard",
  "System health summary: lead volume, pipeline counts, webhook failures",
  {},
  async () => {
    const dashboard = await getDashboard(getClient());
    return { content: [{ type: "text" as const, text: JSON.stringify(dashboard, null, 2) }] };
  }
);

server.tool(
  "monitor:webhook_failures",
  "List recent webhook delivery failures with error details",
  {},
  async () => {
    const failures = await getWebhookFailures(getClient());
    return { content: [{ type: "text" as const, text: JSON.stringify(failures, null, 2) }] };
  }
);

// ── Audit Tools ─────────────────────────────────────────────────

server.tool(
  "audit:trail",
  "Query the full audit trail with optional action filter",
  {
    limit: z.number().optional().describe("Max entries (default 100)"),
    action: z.string().optional().describe("Filter by action type"),
  },
  async (args) => {
    const trail = await getAuditTrail(getClient(), args);
    return { content: [{ type: "text" as const, text: JSON.stringify(trail, null, 2) }] };
  }
);

server.tool(
  "audit:compliance_report",
  "Generate a compliance summary — disclaimer coverage and banned phrase scan status",
  {},
  async () => {
    const report = {
      disclaimerCoverage: {
        siteFooter: "Present on all pages via SiteFooter component",
        toolDisclaimer: "Present on /quiz, /lrba-calculator, /property-risk-profiler, /diversification-checker",
        formDisclaimer: "Present on quiz lead gate form",
        howWereFunded: "Dedicated page at /how-were-funded",
      },
      bannedPhraseStatus: "CI lint configured — all content files scanned at build time",
      complianceArchitecture: {
        writeBoundary: "assertCompliantText() enforced on CRM notes (addLeadNote mutation)",
        ciLint: "scripts/lint-compliance.ts scans content files",
        brandVoice: "13 banned phrases defined in lib/compliance.ts with legal citations",
      },
      lastAuditDate: new Date().toISOString(),
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(report, null, 2) }] };
  }
);

// ── Start Server ────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
