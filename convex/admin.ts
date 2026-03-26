import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Dashboard Stats ─────────────────────────────────────────────

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();

    const stats = {
      total: leads.length,
      new: leads.filter((l) => l.pipelineStatus === "new").length,
      contacted: leads.filter((l) => l.pipelineStatus === "contacted").length,
      qualified: leads.filter((l) => l.pipelineStatus === "qualified").length,
      converted: leads.filter((l) => l.pipelineStatus === "converted").length,
      lost: leads.filter((l) => l.pipelineStatus === "lost").length,
      qualifiedLeads: leads.filter(
        (l) => l.qualificationStatus === "qualified"
      ).length,
      unqualifiedLeads: leads.filter(
        (l) => l.qualificationStatus === "unqualified"
      ).length,
      thisWeek: leads.filter(
        (l) => l.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
      today: leads.filter(
        (l) => l.createdAt > Date.now() - 24 * 60 * 60 * 1000
      ).length,
    };

    // Recent webhook failures
    const recentAudit = await ctx.db
      .query("auditTrail")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q) => q.eq(q.field("action"), "partner_webhook_failed"))
      .take(5);

    return { stats, recentFailures: recentAudit };
  },
});

// ── Lead Queries ────────────────────────────────────────────────

export const listLeads = query({
  args: {
    pipelineStatus: v.optional(v.string()),
    qualificationStatus: v.optional(v.string()),
    source: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let leadsQuery = ctx.db.query("leads").withIndex("by_createdAt").order("desc");

    const leads = await leadsQuery.take(args.limit ?? 50);

    // Client-side filter (Convex doesn't support multi-index filter chaining)
    let filtered = leads;
    if (args.pipelineStatus) {
      filtered = filtered.filter(
        (l) => l.pipelineStatus === args.pipelineStatus
      );
    }
    if (args.qualificationStatus) {
      filtered = filtered.filter(
        (l) => l.qualificationStatus === args.qualificationStatus
      );
    }
    if (args.source) {
      filtered = filtered.filter((l) => l.source === args.source);
    }

    // Enrich with partner names
    const enriched = await Promise.all(
      filtered.map(async (lead) => {
        let partnerName: string | null = null;
        if (lead.routedToPartnerId) {
          const partner = await ctx.db.get(lead.routedToPartnerId);
          partnerName = partner?.name ?? null;
        }
        return { ...lead, partnerName };
      })
    );

    return enriched;
  },
});

export const getLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;

    // Get partner info
    let partner = null;
    if (lead.routedToPartnerId) {
      partner = await ctx.db.get(lead.routedToPartnerId);
    }

    // Get quiz response
    const quizResponse = await ctx.db
      .query("quizResponses")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .first();

    // Get audit trail
    const auditTrail = await ctx.db
      .query("auditTrail")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .order("desc")
      .collect();

    // Get notes
    const notes = await ctx.db
      .query("leadNotes")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .order("desc")
      .collect();

    // Get status history
    const statusHistory = await ctx.db
      .query("leadStatusHistory")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .order("desc")
      .collect();

    return { lead, partner, quizResponse, auditTrail, notes, statusHistory };
  },
});

// ── Lead Mutations ──────────────────────────────────────────────

export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    newStatus: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("lost")
    ),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { leadId, newStatus, userId }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) throw new Error("Lead not found");

    const oldStatus = lead.pipelineStatus;

    await ctx.db.patch(leadId, {
      pipelineStatus: newStatus,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("leadStatusHistory", {
      leadId,
      fromStatus: oldStatus,
      toStatus: newStatus,
      userId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditTrail", {
      leadId,
      action: "status_changed",
      details: `Pipeline status changed: ${oldStatus} → ${newStatus}`,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const addLeadNote = mutation({
  args: {
    leadId: v.id("leads"),
    text: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { leadId, text, userId }) => {
    // Compliance check on note text
    const bannedPhrases = [
      "you should",
      "we recommend",
      "independent",
      "impartial",
      "unbiased",
    ];
    const lower = text.toLowerCase();
    for (const phrase of bannedPhrases) {
      if (lower.includes(phrase)) {
        throw new Error(
          `Note contains banned phrase "${phrase}". CRM notes are part of the compliance audit trail.`
        );
      }
    }

    await ctx.db.insert("leadNotes", {
      leadId,
      userId,
      text,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditTrail", {
      leadId,
      action: "note_added",
      details: `Note added by ${userId}`,
      userId,
      createdAt: Date.now(),
    });
  },
});

// ── Partner Queries ─────────────────────────────────────────────

export const listPartners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("partnerFirms")
      .order("desc")
      .collect();
  },
});

export const getPartner = query({
  args: { partnerId: v.id("partnerFirms") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) return null;

    // Get leads routed to this partner
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_routedToPartnerId", (q) =>
        q.eq("routedToPartnerId", partnerId)
      )
      .order("desc")
      .take(50);

    // Get recent audit entries for this partner
    const auditEntries = await ctx.db
      .query("auditTrail")
      .filter((q) => q.eq(q.field("partnerId"), partnerId))
      .order("desc")
      .take(20);

    return { partner, leads, auditEntries };
  },
});

export const createPartner = mutation({
  args: {
    name: v.string(),
    afslNumber: v.string(),
    contactName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    cplRate: v.number(),
    geographies: v.array(v.string()),
    specialisations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("partnerFirms", {
      ...args,
      isActive: true,
      leadCount: 0,
      createdAt: Date.now(),
    });
  },
});

// ── Audit Trail ─────────────────────────────────────────────────

export const getAuditTrail = query({
  args: {
    limit: v.optional(v.number()),
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("auditTrail")
      .withIndex("by_createdAt")
      .order("desc");

    const entries = await q.take(args.limit ?? 100);

    let filtered = entries;
    if (args.action) {
      filtered = filtered.filter((e) => e.action === args.action);
    }

    // Enrich with lead names
    const enriched = await Promise.all(
      filtered.map(async (entry) => {
        let leadName: string | null = null;
        if (entry.leadId) {
          const lead = await ctx.db.get(entry.leadId);
          leadName = lead
            ? `${lead.firstName} (${lead.email})`
            : null;
        }
        return { ...entry, leadName };
      })
    );

    return enriched;
  },
});
