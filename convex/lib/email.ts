import { Resend } from "resend";
import { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { QuizTier, TIER_CONVERSION_VALUES } from "./leadTiers";

const FROM_EMAIL = "BrickSuper <hello@mail.bricksuper.com>";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const TIER_LABELS: Record<QuizTier, string> = {
  tier1: "Early stage — keep learning",
  tier2: "Worth exploring further",
  tier3: "Strong readiness indicators",
};

const TIER_DESCRIPTIONS: Record<QuizTier, string> = {
  tier1:
    "Based on your answers, there are some areas to consider before taking the next step with SMSF property. We've included educational resources below to help you build your understanding.",
  tier2:
    "Your quiz results suggest there are important questions to explore with a licensed adviser. We've outlined the key areas below.",
  tier3:
    "Your quiz results show strong readiness indicators for SMSF property investment. A licensed adviser can help you assess whether this path suits your specific circumstances.",
};

export async function sendPartnerNotificationEmail(
  ctx: ActionCtx,
  leadId: Id<"leads">,
  lead: {
    firstName: string;
    email: string;
    phone?: string;
    tier?: QuizTier;
    fundBalanceRange?: string;
    primaryInterest?: string;
    timeline?: string;
    isBusinessOwner?: boolean;
    createdAt: number;
  },
  partner: {
    name: string;
    contactEmail: string;
    contactName: string;
  }
) {
  const resend = getResend();
  if (!resend) {
    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "email_skipped",
      details: "RESEND_API_KEY not configured — partner notification skipped",
    });
    return false;
  }

  const tier = lead.tier ?? "tier2";
  const conversionValue = TIER_CONVERSION_VALUES[tier];
  const submittedAt = new Date(lead.createdAt).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
  });

  const plainText = `New qualified lead from BrickSuper

Name: ${lead.firstName}
Email: ${lead.email}${lead.phone ? `\nPhone: ${lead.phone}` : ""}
Quiz tier: ${tier} — ${TIER_LABELS[tier]}
Fund balance: ${lead.fundBalanceRange ?? "Not provided"}
Interest: ${lead.primaryInterest ?? "Not specified"}
Timeline: ${lead.timeline ?? "Not specified"}
Business owner: ${lead.isBusinessOwner ? "Yes" : "No"}
Estimated value: $${conversionValue} AUD
Submitted: ${submittedAt} AEST

This lead opted in to connect with a licensed SMSF advisory firm via BrickSuper.
Please contact them within 24 hours per the partner SLA.`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: partner.contactEmail,
      subject: `New SMSF lead: ${lead.firstName} (${tier})`,
      text: plainText,
      html: `
        <h2>New qualified lead from BrickSuper</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${lead.firstName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          ${lead.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : ""}
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Quiz tier</td><td style="padding:8px;border-bottom:1px solid #eee;">${tier} — ${TIER_LABELS[tier]}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Fund balance</td><td style="padding:8px;border-bottom:1px solid #eee;">${lead.fundBalanceRange ?? "Not provided"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${lead.primaryInterest ?? "Not specified"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Timeline</td><td style="padding:8px;border-bottom:1px solid #eee;">${lead.timeline ?? "Not specified"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Business owner</td><td style="padding:8px;border-bottom:1px solid #eee;">${lead.isBusinessOwner ? "Yes" : "No"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Estimated value</td><td style="padding:8px;border-bottom:1px solid #eee;">$${conversionValue} AUD</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Submitted</td><td style="padding:8px;">${submittedAt} AEST</td></tr>
        </table>
        <p style="margin-top:16px;color:#666;font-size:13px;">
          This lead opted in to connect with a licensed SMSF advisory firm via BrickSuper.
          Please contact them within 24 hours per the partner SLA.
        </p>
      `,
    });

    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "partner_email_sent",
      details: `Notification sent to ${partner.name} (${partner.contactEmail})`,
    });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "partner_email_failed",
      details: `Failed to notify ${partner.name}: ${message}`,
    });
    return false;
  }
}

export async function sendLeadConfirmationEmail(
  ctx: ActionCtx,
  leadId: Id<"leads">,
  lead: {
    firstName: string;
    email: string;
    tier?: QuizTier;
    fundBalanceRange?: string;
    wantsSpecialistConnection: boolean;
  }
) {
  const resend = getResend();
  if (!resend) {
    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "email_skipped",
      details: "RESEND_API_KEY not configured — lead confirmation skipped",
    });
    return false;
  }

  const tier = lead.tier ?? "tier2";
  const tierLabel = TIER_LABELS[tier];
  const tierDescription = TIER_DESCRIPTIONS[tier];

  const specialistSection = lead.wantsSpecialistConnection
    ? `<div style="background:#E8F5EE;border:1px solid #1A7A4A;border-radius:8px;padding:16px;margin:16px 0;">
        <strong style="color:#1A7A4A;">You've opted to connect with a licensed advisory firm.</strong>
        <p style="margin:8px 0 0;color:#333;">A licensed SMSF advisory firm will be in touch within 24 hours to discuss your situation. They hold an Australian Financial Services Licence (AFSL) and can provide personal advice tailored to your circumstances.</p>
      </div>`
    : `<div style="background:#FDF3E0;border:1px solid #C4780E;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#333;">If you'd like to discuss your situation with a licensed SMSF advisory firm, you can retake the quiz and opt in on the results page.</p>
      </div>`;

  const specialistText = lead.wantsSpecialistConnection
    ? "You've opted to connect with a licensed advisory firm. They will be in touch within 24 hours to discuss your situation."
    : "If you'd like to discuss your situation with a licensed SMSF advisory firm, you can retake the quiz and opt in on the results page.";

  const confirmPlainText = `Hi ${lead.firstName},

Thank you for completing the BrickSuper SMSF Readiness Quiz.

Your result: ${tierLabel}

${tierDescription}
${lead.fundBalanceRange ? `\nFund balance range: ${lead.fundBalanceRange}` : ""}

${specialistText}

Helpful resources:
- SMSF Property Investment Guide: https://bricksuper.com/smsf-property-guide
- LRBA Explained: https://bricksuper.com/lrba-explained
- LRBA Calculator: https://bricksuper.com/lrba-calculator

---
BrickSuper provides factual information about SMSF property investment. We do not provide financial advice. This email and the quiz results are general in nature and do not take into account your personal circumstances. Always consult a licensed financial adviser before making investment decisions.

Privacy Policy: https://bricksuper.com/privacy`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: `Your SMSF readiness results — ${tierLabel}`,
      text: confirmPlainText,
      html: `
        <div style="max-width:600px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1C1C1E;">
          <h2 style="color:#1C1C1E;">Hi ${lead.firstName},</h2>
          <p>Thank you for completing the BrickSuper SMSF Readiness Quiz.</p>

          <div style="background:#FAFAF8;border:1px solid #E2E1EC;border-radius:8px;padding:16px;margin:16px 0;">
            <h3 style="margin:0 0 8px;color:#1C1C1E;">Your result: ${tierLabel}</h3>
            <p style="margin:0;color:#3D3D4A;">${tierDescription}</p>
          </div>

          ${lead.fundBalanceRange ? `<p><strong>Fund balance range:</strong> ${lead.fundBalanceRange}</p>` : ""}

          ${specialistSection}

          <h3>Helpful resources</h3>
          <ul style="padding-left:20px;color:#3D3D4A;">
            <li><a href="https://bricksuper.com/smsf-property-guide" style="color:#E8611A;">SMSF Property Investment Guide</a></li>
            <li><a href="https://bricksuper.com/lrba-explained" style="color:#E8611A;">LRBA Explained — Borrowing in Your SMSF</a></li>
            <li><a href="https://bricksuper.com/lrba-calculator" style="color:#E8611A;">LRBA Calculator</a></li>
          </ul>

          <p style="margin-top:24px;padding-top:16px;border-top:1px solid #E2E1EC;color:#9B9BAA;font-size:12px;">
            BrickSuper provides factual information about SMSF property investment. We do not provide financial advice.
            This email and the quiz results are general in nature and do not take into account your personal circumstances.
            Always consult a licensed financial adviser before making investment decisions.
          </p>
          <p style="color:#9B9BAA;font-size:12px;">
            <a href="https://bricksuper.com/privacy" style="color:#9B9BAA;">Privacy Policy</a>
          </p>
        </div>
      `,
    });

    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "lead_confirmation_sent",
      details: `Confirmation email sent to ${lead.email}`,
    });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await ctx.runMutation(internal.leads.logAudit, {
      leadId,
      action: "lead_confirmation_failed",
      details: `Failed to send confirmation to ${lead.email}: ${message}`,
    });
    return false;
  }
}
