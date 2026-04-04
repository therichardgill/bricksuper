import { v } from "convex/values";
import { internalAction, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Nurture email sequence — 5 emails over 21 days.
 *
 * Target: leads who captured email but did NOT opt in to specialist connection.
 * These leads showed interest (completed quiz, gave email) but weren't ready
 * to talk to an adviser. The sequence educates them until they're ready.
 *
 * Schedule:
 *   Stage 0: Confirmation email (sent immediately by sendLeadConfirmation)
 *   Stage 1: Day 3 — "What SMSF property actually costs"
 *   Stage 2: Day 7 — "LRBA explained in plain English"
 *   Stage 3: Day 12 — "Business real property — could your premises be in your SMSF?"
 *   Stage 4: Day 17 — "5 questions to ask a licensed adviser"
 *   Stage 5: Day 21 — "Ready to take the next step?"
 *
 * Each email links back to BrickSuper content hubs and offers the specialist
 * connection opt-in. All content must pass compliance checks — no advice language.
 */

const NURTURE_SCHEDULE_DAYS = [0, 3, 7, 12, 17, 21];

export const getLeadsDueForNurture = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get leads that have email but haven't unsubscribed and aren't fully nurtured
    const leads = await ctx.db
      .query("leads")
      .filter((q) =>
        q.and(
          q.eq(q.field("wantsSpecialistConnection"), false),
          q.eq(q.field("unsubscribedAt"), undefined)
        )
      )
      .collect();

    // Filter to leads due for their next nurture stage
    return leads.filter((lead) => {
      const stage = lead.nurtureStage ?? 0;
      if (stage >= NURTURE_SCHEDULE_DAYS.length) return false;

      const nextStageDays = NURTURE_SCHEDULE_DAYS[stage];
      const dueAt = lead.createdAt + nextStageDays * 24 * 60 * 60 * 1000;
      return now >= dueAt;
    });
  },
});

export const advanceNurtureStage = internalMutation({
  args: {
    leadId: v.id("leads"),
    stage: v.number(),
  },
  handler: async (ctx, { leadId, stage }) => {
    await ctx.db.patch(leadId, {
      nurtureStage: stage,
      nurtureSentAt: Date.now(),
    });
  },
});

export const processNurtureQueue = internalAction({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.runQuery(
      internal.nurture.getLeadsDueForNurture
    );

    // TODO: Implement nurture email sending per stage
    // For each lead:
    //   1. Determine current nurtureStage
    //   2. Send the appropriate email for that stage via Resend
    //   3. Call advanceNurtureStage to increment
    //   4. Log to audit trail
    //
    // Email content must pass assertCompliantText() before sending.
    // Each email should include an unsubscribe link.

    if (leads.length > 0) {
      console.log(`Nurture queue: ${leads.length} leads due for next email`);
    }
  },
});
