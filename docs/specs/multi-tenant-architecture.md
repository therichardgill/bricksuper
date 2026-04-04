# Multi-Tenant Architecture Spec

**Status:** Draft — ready for coding agent handover
**Date:** 2026-04-01
**Scope:** Clerk Organizations + new `organisations` data model + org-scoped CRM + partner portal

---

## 1. Context

BrickSuper is evolving from a single-tenant admin CRM into a multi-tenant platform serving multiple provider types: AFSL advisers, property developers, mortgage brokers, and accountants.

### Current state

- **Auth:** Clerk v7.0.7, authentication only (`useAuth().isSignedIn`), no roles or orgs
- **Missing:** No `convex/auth.config.ts` — `ctx.auth.getUserIdentity()` returns `null`
- **Partner model:** `partnerFirms` table — single type (adviser firms), managed exclusively by BrickSuper admin
- **CRM:** 5-stage pipeline, compliance-checked notes, auto-routing, audit trail — all single-tenant
- **Middleware:** `src/proxy.ts` protects `/admin(.*)` with `auth.protect()`, no role checks

### Target state

- Clerk Organizations with role-based permissions
- Generic `organisations` table supporting multiple provider types
- Org-scoped data access (partners see only their routed leads)
- Partner portal: invite team, view leads + activity (read-only pipeline)
- BrickSuper internal retains full admin access across all orgs

---

## 2. Clerk Organizations Setup

### 2.1 Enable Organizations in Clerk Dashboard

1. Enable Organizations in Clerk Dashboard → Organizations settings
2. Configure allowed roles:
   - `org:admin` — manages their org's team, views all org data
   - `org:member` — views org data (leads, activity)
3. Set default role for new members: `org:member`

### 2.2 Create `convex/auth.config.ts`

This file is **missing** and required for `ctx.auth.getUserIdentity()` to work.

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL!,  // e.g. "https://your-app.clerk.accounts.dev"
      applicationID: "convex",
    },
  ],
};
```

Add `CLERK_ISSUER_URL` to `.env.local` (the Clerk Frontend API URL from Dashboard → API Keys).

### 2.3 Wire Clerk tokens into Convex

Replace the basic `ConvexProvider` with `ConvexProviderWithClerk` in `src/components/convex-client-provider.tsx`:

```typescript
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

// Passes Clerk JWT to Convex on every request
<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
  {children}
</ConvexProviderWithClerk>
```

### 2.4 Middleware changes (`src/proxy.ts`)

Extend to handle route-level org checks:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Admin routes: require sign-in
  if (pathname.startsWith("/admin")) {
    await auth.protect();
  }

  // Portal routes: require sign-in + active org
  if (pathname.startsWith("/portal")) {
    await auth.protect();
    // Clerk automatically scopes to active org via session claims
  }
});

export const config = {
  matcher: ["/admin(.*)", "/portal(.*)"],
};
```

### 2.5 Custom session claims

Configure Clerk to include org metadata in the JWT so Convex can read it server-side:

In Clerk Dashboard → Sessions → Customize session token:
```json
{
  "org_id": "{{org.id}}",
  "org_role": "{{org.role}}",
  "org_slug": "{{org.slug}}"
}
```

This means `ctx.auth.getUserIdentity()` in Convex will return these fields.

---

## 3. Data Model

### 3.1 New tables

#### `organisations`

The core multi-tenant entity. Every partner org maps to a Clerk Organization.

```typescript
organisations: defineTable({
  // Clerk link
  clerkOrgId: v.string(),       // Clerk Organization ID (org_xxx)

  // Core fields
  name: v.string(),
  type: v.union(
    v.literal("adviser"),
    v.literal("developer"),
    v.literal("broker"),
    v.literal("accountant")
  ),
  status: v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("onboarding"),
    v.literal("suspended")
  ),

  // Contact
  contactName: v.string(),
  contactEmail: v.string(),
  contactPhone: v.optional(v.string()),

  // Operational
  geographies: v.array(v.string()),   // AU states: ["QLD", "NSW", ...]
  webhookUrl: v.optional(v.string()),  // For lead delivery
  leadCount: v.number(),              // Denormalized counter

  // Notes (internal, BrickSuper only)
  notes: v.optional(v.string()),

  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
  .index("by_clerkOrgId", ["clerkOrgId"])
  .index("by_type", ["type"])
  .index("by_status", ["status"])
  .index("by_type_and_status", ["type", "status"]),
```

#### `orgProfiles`

Type-specific fields. One row per organisation, discriminated by `type`.

```typescript
orgProfiles: defineTable(
  v.union(
    v.object({
      orgId: v.id("organisations"),
      type: v.literal("adviser"),
      afslNumber: v.string(),
      authorisedRepNumber: v.optional(v.string()),
      cplRate: v.number(),           // AUD per qualified lead
      specialisations: v.array(v.string()),
    }),
    v.object({
      orgId: v.id("organisations"),
      type: v.literal("developer"),
      stockTypes: v.array(v.string()),  // ["residential", "commercial", "land"]
      activeListings: v.optional(v.number()),
      feeModel: v.optional(v.string()), // "per-inquiry", "monthly", "per-listing"
    }),
    v.object({
      orgId: v.id("organisations"),
      type: v.literal("broker"),
      aclNumber: v.string(),           // Australian Credit Licence
      cplRate: v.optional(v.number()),
      lenderPanel: v.optional(v.array(v.string())),
    }),
    v.object({
      orgId: v.id("organisations"),
      type: v.literal("accountant"),
      taxAgentNumber: v.optional(v.string()),
      limitedAfslNumber: v.optional(v.string()),
      cplRate: v.optional(v.number()),
      services: v.optional(v.array(v.string())),
    })
  )
)
  .index("by_orgId", ["orgId"]),
```

### 3.2 Modified tables

#### `leads` — add org routing

Replace `routedToPartnerId: v.optional(v.id("partnerFirms"))` with:

```typescript
// Routing (replace partnerFirms references)
routedToOrgId: v.optional(v.id("organisations")),
routedAt: v.optional(v.number()),
partnerNotifiedAt: v.optional(v.number()),
```

Add index:
```typescript
.index("by_routedToOrgId", ["routedToOrgId"])
```

Remove:
```typescript
// DELETE these
routedToPartnerId: v.optional(v.id("partnerFirms")),
// DELETE index
.index("by_routedToPartnerId", ["routedToPartnerId"])
```

#### `auditTrail` — add org reference

Replace `partnerId: v.optional(v.id("partnerFirms"))` with:

```typescript
orgId: v.optional(v.id("organisations")),
```

#### `leadNotes` — add org context

Add field so partner-written notes are attributed to their org:

```typescript
orgId: v.optional(v.id("organisations")),
```

### 3.3 Deprecated table

`partnerFirms` — keep temporarily during migration, then drop. See section 7.

---

## 4. Access Control Model

### 4.1 Role hierarchy

| Context | Role | Can see | Can do |
|---------|------|---------|--------|
| BrickSuper internal | `system_admin` | All leads, all orgs, all audit | Everything |
| Partner org | `org:admin` | Org's routed leads, org activity, org team | Invite/remove members, view leads, add notes |
| Partner org | `org:member` | Org's routed leads, org activity | View leads, add notes |

### 4.2 Identifying BrickSuper admins

Option: Use a Clerk Organization for BrickSuper itself (e.g., `org_bricksuper`). Store its `clerkOrgId` as an env var `BRICKSUPER_ORG_ID`. When `orgId === BRICKSUPER_ORG_ID`, grant system admin access.

### 4.3 Convex auth helper

Create `convex/lib/auth.ts`:

```typescript
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export type AuthContext = {
  userId: string;          // Clerk user ID (tokenIdentifier)
  orgId: string | null;    // Clerk org ID from session claims
  orgRole: string | null;  // "org:admin" | "org:member"
  isSystemAdmin: boolean;  // true if orgId === BRICKSUPER_ORG_ID
  convexOrgId: Id<"organisations"> | null;  // Resolved from clerkOrgId
};

export async function getAuthContext(
  ctx: QueryCtx | MutationCtx
): Promise<AuthContext> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const clerkOrgId = (identity as any).org_id ?? null;
  const orgRole = (identity as any).org_role ?? null;

  // Check if system admin
  const brickSuperOrgId = process.env.BRICKSUPER_ORG_ID;
  const isSystemAdmin = clerkOrgId === brickSuperOrgId;

  // Resolve Convex org ID
  let convexOrgId: Id<"organisations"> | null = null;
  if (clerkOrgId && !isSystemAdmin) {
    const org = await ctx.db
      .query("organisations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", clerkOrgId))
      .unique();
    convexOrgId = org?._id ?? null;
  }

  return {
    userId: identity.tokenIdentifier,
    orgId: clerkOrgId,
    orgRole,
    isSystemAdmin,
    convexOrgId,
  };
}

/** Assert the caller is a BrickSuper system admin */
export async function requireSystemAdmin(ctx: QueryCtx | MutationCtx) {
  const auth = await getAuthContext(ctx);
  if (!auth.isSystemAdmin) throw new Error("System admin access required");
  return auth;
}

/** Assert the caller belongs to the specified org (or is system admin) */
export async function requireOrgAccess(
  ctx: QueryCtx | MutationCtx,
  orgId: Id<"organisations">
) {
  const auth = await getAuthContext(ctx);
  if (auth.isSystemAdmin) return auth;
  if (auth.convexOrgId !== orgId) throw new Error("Organisation access denied");
  return auth;
}
```

---

## 5. Convex Function Changes

### 5.1 New file: `convex/organisations.ts`

```typescript
// Queries
listOrganisations          // system admin: all; org user: own org only
getOrganisation(orgId)     // system admin or org member
getOrganisationProfile(orgId)  // type-specific profile

// Mutations (system admin only)
createOrganisation(...)    // creates org + orgProfile + Clerk Organization via action
updateOrganisation(...)
deactivateOrganisation(...)

// Mutations (org:admin)
updateOrgContact(...)      // org admin can update their own contact details
```

### 5.2 Modified: `convex/admin.ts`

All existing queries/mutations gain auth context:

- `getDashboardStats` — system admin only; add per-org stats
- `listLeads` — system admin sees all; org user sees only `routedToOrgId === their org`
- `getLead` — system admin or lead's routed org
- `updateLeadStatus` — system admin only (partners are view + notes only)
- `addLeadNote` — system admin or lead's routed org (with orgId attribution)
- `listPartners` → renamed to `listOrganisations` (or kept as alias during migration)
- `getPartner` → `getOrganisation`
- `createPartner` → `createOrganisation` (system admin only)
- `getAuditTrail` — system admin sees all; org user sees entries for their org's leads

### 5.3 Modified: `convex/leads.ts`

- `submitQuizLead` — no auth change (public mutation from unauthenticated site)
- `routeToPartner` → `routeToOrganisation` — queries `organisations` table instead of `partnerFirms`
- Internal helpers updated to reference `organisations` table
- `updateLeadRouting` — patches `routedToOrgId` instead of `routedToPartnerId`

### 5.4 New file: `convex/portal.ts`

Partner-facing queries (all require org auth):

```typescript
// Partner portal queries
getMyOrganisation()        // returns org + profile for current user's active org
getMyLeads(filters?)       // leads where routedToOrgId === my org
getMyLead(leadId)          // single lead detail (scoped to org)
getMyActivity()            // audit trail filtered to org's leads

// Partner portal mutations
addLeadNote(leadId, text)  // compliance-checked, attributed to org + user
```

---

## 6. Operations Layer Changes (`src/lib/operations.ts`)

All functions gain an optional `orgScope` parameter. When present, queries are filtered server-side. The operations layer remains the single source of truth for Web UI, MCP, and CLI.

```typescript
// Before
export async function listLeads(client, filters?)

// After
export async function listLeads(client, filters?, orgScope?: string)
```

The MCP server and CLI always operate as system admin (they use service-level Convex client, not user-scoped).

---

## 7. Migration Plan

### Phase 1: Schema + Auth foundation

1. Create `convex/auth.config.ts`
2. Wire `ConvexProviderWithClerk` in client provider
3. Add `organisations` and `orgProfiles` tables to schema
4. Add `routedToOrgId` field to `leads` (alongside existing `routedToPartnerId` — both exist temporarily)
5. Add `orgId` field to `auditTrail` and `leadNotes`
6. Create `convex/lib/auth.ts` helper
7. Deploy schema changes

### Phase 2: Data migration

1. Write migration script: for each `partnerFirms` row:
   - Create Clerk Organization via Clerk Backend API
   - Insert `organisations` row with `clerkOrgId`
   - Insert `orgProfiles` row (type: "adviser", carrying `afslNumber`, `cplRate`, `specialisations`)
   - Update all `leads` where `routedToPartnerId === old ID` → set `routedToOrgId`
   - Update all `auditTrail` where `partnerId === old ID` → set `orgId`
2. Verify data integrity
3. This is a one-time script — can be a Convex internalMutation + internalAction

### Phase 3: Auth-gated functions

1. Update `convex/admin.ts` — add `getAuthContext()` to all queries/mutations
2. Create `convex/portal.ts` with org-scoped functions
3. Create `convex/organisations.ts` for org management
4. Update `convex/leads.ts` routing to use `organisations` table
5. Update `src/lib/operations.ts` with org-scoping

### Phase 4: UI

1. Update middleware (`src/proxy.ts`) to handle `/portal(.*)` routes
2. Add Clerk `<OrganizationSwitcher>` to admin layout
3. Create `/portal` route group with org-scoped layout:
   - `/portal` — org dashboard (lead stats, recent activity)
   - `/portal/leads` — org's leads (read-only pipeline status)
   - `/portal/leads/[id]` — lead detail + add notes
   - `/portal/team` — org member management (org:admin only)
   - `/portal/settings` — org contact details (org:admin only)
4. Update `/admin/partners` → `/admin/organisations` (show all types)
5. Update `/admin/organisations/[id]` — type-aware detail view
6. Nav items update: add org type icons, filter by type

### Phase 5: Cleanup

1. Remove `partnerFirms` table from schema
2. Remove `routedToPartnerId` from `leads`
3. Remove `partnerId` from `auditTrail`
4. Remove old partner-specific code paths
5. Update MCP tools to use new org model

---

## 8. Route Structure

```
/admin                          (system admin — BrickSuper internal)
├── /admin                      Dashboard (all orgs, all leads)
├── /admin/leads                All leads
├── /admin/leads/[id]           Lead detail
├── /admin/organisations        All partner organisations
├── /admin/organisations/new    Create new org
├── /admin/organisations/[id]   Org detail + leads + activity
├── /admin/audit                Full audit trail
└── /admin/settings             System settings

/portal                         (partner org members)
├── /portal                     Org dashboard (my leads stats)
├── /portal/leads               My org's leads
├── /portal/leads/[id]          Lead detail + add notes
├── /portal/team                Member management (org:admin)
└── /portal/settings            Org settings (org:admin)
```

---

## 9. Environment Variables (New)

```bash
# Add to .env.local
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
BRICKSUPER_ORG_ID=org_xxxxx   # Clerk org ID for BrickSuper internal team
```

---

## 10. Compliance Notes

- Partner portal users can add notes — these pass through the same `checkCompliance()` gate
- Partner portal is read-only for pipeline status — partners cannot move leads through stages
- All partner actions are logged in `auditTrail` with `orgId` + `userId` attribution
- Lead PII visibility: partners see contact info only for leads routed to them
- Developer orgs see inquiry-level data only (no SMSF qualification details like `fundBalanceRange`)
  - This requires a field-level visibility mask in `convex/portal.ts` based on org type

---

## 11. Open Questions

1. **Clerk Organization creation flow** — do we auto-create Clerk orgs when a BrickSuper admin creates an organisation in the CRM, or is it a manual step? (Recommend: auto-create via Clerk Backend API in a Convex action)
2. **Invitation flow** — partner org admin invites their team via Clerk's built-in invite, or custom UI? (Recommend: Clerk's `<OrganizationProfile>` component handles this out of the box)
3. **Developer lead model** — developers with stock don't receive SMSF leads the same way advisers do. Do they get a separate "inquiry" model, or do we reuse leads with a different qualification path? (Defer to Phase 2 of the platform build)
4. **Billing integration** — CPL billing per org. Track in Convex or integrate Stripe? (Defer — manual invoicing is fine initially)
