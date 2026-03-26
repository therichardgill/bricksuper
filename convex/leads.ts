import { v } from "convex/values";
import { mutation, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const submitQuizLead = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    phone: v.optional(v.string()),
    wantsSpecialistConnection: v.boolean(),

    // Quiz data
    quizResponseId: v.optional(v.id("quizResponses")),
    tier: v.optional(
      v.union(v.literal("tier1"), v.literal("tier2"), v.literal("tier3"))
    ),

    // Qualification inputs
    fundBalanceRange: v.optional(v.string()),
    primaryInterest: v.optional(v.string()),
    timeline: v.optional(v.string()),
    isBusinessOwner: v.optional(v.boolean()),
    hasExistingSmsf: v.optional(v.boolean()),
    hasExistingAdviser: v.optional(v.boolean()),

    // Source tracking
    source: v.string(),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    landingPage: v.optional(v.string()),

    // Consent
    consentText: v.string(),
    privacyPolicyVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Deduplicate: check for existing lead with same email in last 30 days
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
      .first();

    if (existing) {
      // Update existing lead rather than creating duplicate
      await ctx.db.patch(existing._id, {
        updatedAt: now,
        wantsSpecialistConnection: args.wantsSpecialistConnection,
        tier: args.tier ?? existing.tier,
      });

      await ctx.db.insert("auditTrail", {
        leadId: existing._id,
        action: "lead_updated_dedup",
        details: "Duplicate submission within 30 days — updated existing lead",
        createdAt: now,
      });

      return { leadId: existing._id, isNew: false };
    }

    // Qualify the lead
    const validBalances = ["200-500k", "500k-1m", "over-1m"];
    const isQualified =
      args.wantsSpecialistConnection &&
      args.email.includes("@") &&
      args.firstName.trim().length > 0 &&
      args.fundBalanceRange !== undefined &&
      validBalances.includes(args.fundBalanceRange);

    const qualificationStatus = isQualified ? "qualified" : "unqualified";

    // Create lead
    const leadId = await ctx.db.insert("leads", {
      email: args.email.toLowerCase(),
      firstName: args.firstName.trim(),
      phone: args.phone,
      wantsSpecialistConnection: args.wantsSpecialistConnection,

      fundBalanceRange: args.fundBalanceRange,
      primaryInterest: args.primaryInterest,
      timeline: args.timeline,
      isBusinessOwner: args.isBusinessOwner,
      hasExistingSmsf: args.hasExistingSmsf,
      hasExistingAdviser: args.hasExistingAdviser,

      qualificationStatus,
      qualificationCriteria: isQualified
        ? ["balance", "specialist", "contact"]
        : [],
      tier: args.tier,

      pipelineStatus: "new",

      source: args.source,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      utmContent: args.utmContent,
      landingPage: args.landingPage,

      consentGiven: true,
      consentTimestamp: now,
      consentText: args.consentText,
      privacyPolicyVersion: args.privacyPolicyVersion,

      createdAt: now,
    });

    // Audit trail
    await ctx.db.insert("auditTrail", {
      leadId,
      action: isQualified ? "lead_qualified" : "lead_unqualified",
      details: `Lead created from ${args.source} — ${qualificationStatus}`,
      metadata: {
        tier: args.tier,
        fundBalanceRange: args.fundBalanceRange,
        wantsSpecialist: args.wantsSpecialistConnection,
      },
      createdAt: now,
    });

    // Status history
    await ctx.db.insert("leadStatusHistory", {
      leadId,
      fromStatus: "",
      toStatus: "new",
      createdAt: now,
    });

    // If qualified, schedule partner routing
    if (isQualified) {
      await ctx.scheduler.runAfter(0, internal.leads.routeToPartner, {
        leadId,
      });
    }

    return { leadId, isNew: true, qualificationStatus };
  },
});

export const routeToPartner = internalAction({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    // Get the lead
    const lead = await ctx.runQuery(internal.leads.getLeadInternal, { leadId });
    if (!lead) return;

    // Find an active partner (for now, get the first active one)
    const partners = await ctx.runQuery(
      internal.leads.getActivePartnersInternal
    );
    if (partners.length === 0) {
      await ctx.runMutation(internal.leads.logAudit, {
        leadId,
        action: "partner_webhook_failed",
        details: "No active partner firms configured",
      });
      return;
    }

    const partner = partners[0];

    // Update lead with routing info
    await ctx.runMutation(internal.leads.updateLeadRouting, {
      leadId,
      partnerId: partner._id,
    });

    // Send webhook if URL configured
    if (partner.webhookUrl) {
      const payload = {
        leadId: leadId,
        firstName: lead.firstName,
        email: lead.email,
        phone: lead.phone,
        tier: lead.tier,
        fundBalanceRange: lead.fundBalanceRange,
        primaryInterest: lead.primaryInterest,
        timeline: lead.timeline,
        isBusinessOwner: lead.isBusinessOwner,
        source: lead.source,
        consentTimestamp: lead.consentTimestamp,
        createdAt: lead.createdAt,
      };

      let success = false;
      let lastError = "";

      // 3 retries with exponential backoff
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(partner.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            success = true;
            break;
          }
          lastError = `HTTP ${response.status}: ${response.statusText}`;
        } catch (err) {
          lastError =
            err instanceof Error ? err.message : "Unknown network error";
        }

        // Exponential backoff: 1s, 2s, 4s
        if (attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
        }
      }

      await ctx.runMutation(internal.leads.logAudit, {
        leadId,
        action: success
          ? "partner_webhook_sent"
          : "partner_webhook_failed",
        details: success
          ? `Webhook delivered to ${partner.name}`
          : `Webhook failed after 3 attempts: ${lastError}`,
      });
    }

    // Increment partner lead count
    await ctx.runMutation(internal.leads.incrementPartnerLeadCount, {
      partnerId: partner._id,
    });
  },
});

// Internal helpers used by the action
export const getLeadInternal = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    return await ctx.db.get(leadId);
  },
});

export const getActivePartnersInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("partnerFirms")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const updateLeadRouting = internalMutation({
  args: {
    leadId: v.id("leads"),
    partnerId: v.id("partnerFirms"),
  },
  handler: async (ctx, { leadId, partnerId }) => {
    await ctx.db.patch(leadId, {
      routedToPartnerId: partnerId,
      routedAt: Date.now(),
    });
  },
});

export const logAudit = internalMutation({
  args: {
    leadId: v.id("leads"),
    action: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditTrail", {
      leadId: args.leadId,
      action: args.action,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});

export const incrementPartnerLeadCount = internalMutation({
  args: { partnerId: v.id("partnerFirms") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (partner) {
      await ctx.db.patch(partnerId, {
        leadCount: partner.leadCount + 1,
        updatedAt: Date.now(),
      });
    }
  },
});
