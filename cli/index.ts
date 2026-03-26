#!/usr/bin/env npx tsx
/**
 * BrickSuper CLI
 *
 * Thin wrapper around the operations layer for scripting and cron.
 * Same functions as the MCP server — one source of truth.
 *
 * Usage:
 *   npx tsx cli/index.ts leads list --status qualified
 *   npx tsx cli/index.ts partners health-check
 *   npx tsx cli/index.ts monitor dashboard
 *   npx tsx cli/index.ts content compliance-check "some text to check"
 */

import {
  createClient,
  listLeads,
  getLead,
  updateLeadStatus,
  addLeadNote,
  listPartners,
  getPartner,
  healthCheckAllPartners,
  checkContentCompliance,
  suggestContentUpdates,
  getDashboard,
  getAuditTrail,
  getWebhookFailures,
} from "../src/lib/operations.js";

const args = process.argv.slice(2);
const [domain, command, ...rest] = args;

async function main() {
  const client = createClient();

  switch (`${domain}:${command}`) {
    // ── Leads ─────────────────────────────────
    case "leads:list": {
      const status = rest.find((r) => r.startsWith("--status="))?.split("=")[1];
      const leads = await listLeads(client, { pipelineStatus: status });
      console.log(JSON.stringify(leads, null, 2));
      break;
    }

    case "leads:get": {
      const leadId = rest[0];
      if (!leadId) { console.error("Usage: leads get <leadId>"); process.exit(1); }
      const lead = await getLead(client, leadId);
      console.log(JSON.stringify(lead, null, 2));
      break;
    }

    case "leads:status": {
      const [leadId, newStatus] = rest;
      if (!leadId || !newStatus) {
        console.error("Usage: leads status <leadId> <new|contacted|qualified|converted|lost>");
        process.exit(1);
      }
      await updateLeadStatus(client, leadId, newStatus as any, "cli");
      console.log(`Lead ${leadId} → ${newStatus}`);
      break;
    }

    case "leads:note": {
      const [leadId, ...noteWords] = rest;
      const text = noteWords.join(" ");
      if (!leadId || !text) {
        console.error("Usage: leads note <leadId> <note text>");
        process.exit(1);
      }
      await addLeadNote(client, leadId, text, "cli");
      console.log(`Note added to ${leadId}`);
      break;
    }

    // ── Partners ──────────────────────────────
    case "partners:list": {
      const partners = await listPartners(client);
      console.log(JSON.stringify(partners, null, 2));
      break;
    }

    case "partners:get": {
      const partnerId = rest[0];
      if (!partnerId) { console.error("Usage: partners get <partnerId>"); process.exit(1); }
      const partner = await getPartner(client, partnerId);
      console.log(JSON.stringify(partner, null, 2));
      break;
    }

    case "partners:health-check": {
      console.log("Checking webhook health for all active partners...");
      const results = await healthCheckAllPartners(client);
      for (const r of results) {
        const icon = r.success ? "✓" : "✗";
        console.log(`  ${icon} ${r.name} — ${r.success ? `OK (${r.statusCode})` : r.error}`);
      }
      break;
    }

    // ── Content ───────────────────────────────
    case "content:compliance-check": {
      const text = rest.join(" ");
      if (!text) { console.error("Usage: content compliance-check <text>"); process.exit(1); }
      const violations = checkContentCompliance(text);
      if (violations.length === 0) {
        console.log("✓ COMPLIANT — no banned phrases detected.");
      } else {
        console.log("✗ VIOLATIONS:");
        for (const v of violations) {
          console.log(`  - "${v.phrase}" — ${v.reason} (${v.legalBasis})`);
        }
        process.exit(1);
      }
      break;
    }

    case "content:stale-check": {
      const suggestions = await suggestContentUpdates(client);
      console.log(JSON.stringify(suggestions, null, 2));
      break;
    }

    // ── Monitor ───────────────────────────────
    case "monitor:dashboard": {
      const dashboard = await getDashboard(client);
      const s = dashboard.stats;
      console.log(`
BrickSuper Dashboard
════════════════════
Pipeline:  New: ${s.new}  Contacted: ${s.contacted}  Qualified: ${s.qualified}  Converted: ${s.converted}  Lost: ${s.lost}
Total:     ${s.total} leads (${s.today} today, ${s.thisWeek} this week)
Quality:   ${s.qualifiedLeads} qualified / ${s.unqualifiedLeads} unqualified
Failures:  ${dashboard.recentFailures.length} recent webhook failures
      `.trim());
      break;
    }

    case "monitor:alerts": {
      const failures = await getWebhookFailures(client);
      if (failures.length === 0) {
        console.log("✓ No recent webhook failures.");
      } else {
        console.log(`✗ ${failures.length} recent webhook failures:`);
        for (const f of failures as any[]) {
          console.log(`  - ${new Date(f.createdAt).toISOString()} — ${f.details}`);
        }
      }
      break;
    }

    case "monitor:funnel": {
      const dashboard = await getDashboard(client);
      const s = dashboard.stats;
      const qualRate = s.total > 0 ? ((s.qualifiedLeads / s.total) * 100).toFixed(1) : "0";
      const convertRate = s.qualifiedLeads > 0 ? ((s.converted / s.qualifiedLeads) * 100).toFixed(1) : "0";
      console.log(`
Conversion Funnel
═════════════════
Total leads:      ${s.total}
Qualified:        ${s.qualifiedLeads} (${qualRate}%)
Converted:        ${s.converted} (${convertRate}% of qualified)
      `.trim());
      break;
    }

    // ── Audit ─────────────────────────────────
    case "audit:trail": {
      const action = rest.find((r) => r.startsWith("--action="))?.split("=")[1];
      const limit = parseInt(rest.find((r) => r.startsWith("--limit="))?.split("=")[1] || "50");
      const trail = await getAuditTrail(client, { limit, action });
      console.log(JSON.stringify(trail, null, 2));
      break;
    }

    default:
      console.log(`
BrickSuper CLI
══════════════

Usage: npx tsx cli/index.ts <domain> <command> [args]

Leads:
  leads list [--status=<status>]         List leads
  leads get <leadId>                     Get lead detail
  leads status <leadId> <newStatus>      Update pipeline status
  leads note <leadId> <text>             Add CRM note

Partners:
  partners list                          List partner firms
  partners get <partnerId>               Get partner detail
  partners health-check                  Check all webhook endpoints

Content:
  content compliance-check <text>        Check text for banned phrases
  content stale-check                    Find stale content pages

Monitor:
  monitor dashboard                      System health summary
  monitor alerts                         Recent webhook failures
  monitor funnel                         Conversion funnel metrics

Audit:
  audit trail [--action=<type>] [--limit=N]  Query audit trail
      `.trim());
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
