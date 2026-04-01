import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    email: v.string(),
    firstName: v.string(),
    phone: v.optional(v.string()),

    // Qualification data
    fundBalanceRange: v.optional(v.string()),
    primaryInterest: v.optional(v.string()),
    timeline: v.optional(v.string()),
    isBusinessOwner: v.optional(v.boolean()),
    hasExistingSmsf: v.optional(v.boolean()),
    hasExistingAdviser: v.optional(v.boolean()),
    wantsSpecialistConnection: v.boolean(),

    // Qualification outcome
    qualificationStatus: v.union(
      v.literal("qualified"),
      v.literal("unqualified"),
      v.literal("pending")
    ),
    qualificationCriteria: v.optional(v.array(v.string())),
    tier: v.optional(
      v.union(v.literal("tier1"), v.literal("tier2"), v.literal("tier3"))
    ),

    // Pipeline status
    pipelineStatus: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("lost")
    ),

    // Source tracking
    source: v.string(),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    landingPage: v.optional(v.string()),

    // Meta CAPI deduplication
    eventId: v.optional(v.string()),

    // Routing
    routedToPartnerId: v.optional(v.id("partnerFirms")),
    routedAt: v.optional(v.number()),
    partnerNotifiedAt: v.optional(v.number()),

    // Consent
    consentGiven: v.boolean(),
    consentTimestamp: v.number(),
    consentText: v.string(),
    privacyPolicyVersion: v.string(),

    // ActiveCampaign
    activeCampaignContactId: v.optional(v.string()),
    nurtureSent: v.optional(v.boolean()),

    // Lifecycle
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    anonymisedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_qualificationStatus", ["qualificationStatus"])
    .index("by_pipelineStatus", ["pipelineStatus"])
    .index("by_source", ["source"])
    .index("by_routedToPartnerId", ["routedToPartnerId"])
    .index("by_createdAt", ["createdAt"]),

  quizResponses: defineTable({
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
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_leadId", ["leadId"])
    .index("by_tier", ["tier"]),

  toolUsage: defineTable({
    sessionId: v.string(),
    tool: v.union(
      v.literal("quiz"),
      v.literal("property-risk-profiler"),
      v.literal("lrba-calculator"),
      v.literal("diversification-checker")
    ),
    inputs: v.any(),
    outputs: v.any(),
    riskFlags: v.optional(
      v.array(
        v.object({
          flag: v.string(),
          level: v.union(
            v.literal("green"),
            v.literal("amber"),
            v.literal("red")
          ),
          description: v.string(),
          source: v.string(),
        })
      )
    ),
    leadId: v.optional(v.id("leads")),
    createdAt: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_tool", ["tool"])
    .index("by_leadId", ["leadId"]),

  partnerFirms: defineTable({
    name: v.string(),
    afslNumber: v.string(),
    contactName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    webhookUrl: v.optional(v.string()),
    isActive: v.boolean(),
    cplRate: v.number(),
    geographies: v.array(v.string()),
    specialisations: v.array(v.string()),
    leadCount: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_isActive", ["isActive"])
    .index("by_afslNumber", ["afslNumber"]),

  auditTrail: defineTable({
    leadId: v.optional(v.id("leads")),
    partnerId: v.optional(v.id("partnerFirms")),
    action: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.any()),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_leadId", ["leadId"])
    .index("by_action", ["action"])
    .index("by_createdAt", ["createdAt"]),

  leadNotes: defineTable({
    leadId: v.id("leads"),
    userId: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_leadId", ["leadId"]),

  leadStatusHistory: defineTable({
    leadId: v.id("leads"),
    fromStatus: v.string(),
    toStatus: v.string(),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_leadId", ["leadId"]),

  contentMeta: defineTable({
    slug: v.string(),
    title: v.string(),
    pageType: v.union(
      v.literal("hub"),
      v.literal("spoke"),
      v.literal("tool"),
      v.literal("static")
    ),
    lastReviewedAt: v.number(),
    lastUpdatedAt: v.number(),
    reviewedBy: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    schemaType: v.optional(
      v.union(v.literal("faq"), v.literal("how-to"), v.literal("article"))
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_pageType", ["pageType"]),

  lendingRates: defineTable({
    lenderName: v.string(),
    productName: v.string(),
    rateVariable: v.optional(v.number()),
    rateFixed: v.optional(v.number()),
    fixedTerm: v.optional(v.string()),
    maxLvr: v.number(),
    propertyTypes: v.array(v.string()),
    lastVerified: v.number(),
    sourceUrl: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_lenderName", ["lenderName"])
    .index("by_isActive", ["isActive"]),
});
