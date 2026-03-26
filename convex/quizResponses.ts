import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveQuizResponse = mutation({
  args: {
    sessionId: v.string(),
    leadId: v.optional(v.id("leads")),
    answers: v.array(
      v.object({
        questionId: v.string(),
        questionText: v.string(),
        answer: v.string(),
        score: v.number(),
      })
    ),
    totalScore: v.number(),
    tier: v.union(v.literal("tier1"), v.literal("tier2"), v.literal("tier3")),
    startedAt: v.number(),
    completedAt: v.number(),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizResponses", args);
  },
});
