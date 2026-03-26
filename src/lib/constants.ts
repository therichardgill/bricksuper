/**
 * BrickSuper Constants
 *
 * ATO benchmarks, safe harbour rates, and regulatory thresholds.
 * Every value includes its source citation for compliance audit trail.
 */

// ── ATO Benchmarks ──────────────────────────────────────────────

/** ATO safe harbour interest rate for related-party LRBAs on property (2025-26) */
export const ATO_SAFE_HARBOUR_RATE = 8.85;
export const ATO_SAFE_HARBOUR_RATE_SOURCE = "ATO TD 2024/7";

/** Concentration threshold that triggered ATO's 2019 campaign */
export const ATO_CONCENTRATION_THRESHOLD = 90;
export const ATO_CONCENTRATION_SOURCE =
  "ATO wrote to 17,700 funds with >90% single-asset concentration in 2019";

/** SMSF minimum practical balance threshold */
export const SMSF_MIN_BALANCE = 200_000;
export const SMSF_MIN_BALANCE_SOURCE =
  "ASIC dropped $500K guidance Dec 2022; industry threshold ~$200K per University of Adelaide research (Feb 2025)";

/** Administrative penalty per trustee for non-compliance with SIS Reg 4.09 */
export const SIS_REG_409_PENALTY = 4_200;
export const SIS_REG_409_SOURCE = "SIS Regulation 4.09";

// ── Traffic Light Thresholds ────────────────────────────────────

export type RiskLevel = "green" | "amber" | "red";

export interface TrafficLightThreshold {
  metric: string;
  green: string;
  amber: string;
  red: string;
  source: string;
}

export const TRAFFIC_LIGHT_THRESHOLDS: TrafficLightThreshold[] = [
  {
    metric: "Fund balance",
    green: "≥$500K",
    amber: "$200K–$500K",
    red: "<$200K with property purchase",
    source: SMSF_MIN_BALANCE_SOURCE,
  },
  {
    metric: "Concentration (single asset)",
    green: "<50%",
    amber: "50%–90%",
    red: ">90%",
    source: ATO_CONCENTRATION_SOURCE,
  },
  {
    metric: "Liquidity ratio",
    green: ">30%",
    amber: "20%–30%",
    red: "<20%",
    source: "Industry best practice — ability to meet ongoing fund expenses",
  },
  {
    metric: "Rent-vs-repayment gap",
    green: "Rent covers repayment",
    amber: "Gap <$500/month",
    red: "Gap >$500/month",
    source: "Cash flow stress indicator — factual calculation",
  },
];

// ── Lead Qualification ──────────────────────────────────────────

export const LEAD_QUALIFICATION_CRITERIA = [
  "Has existing SMSF OR intends to establish one",
  "Super balance ≥$200K (or strong contribution trajectory)",
  "Expressed interest in property investment through SMSF",
  "Opted in to 'connect with licensed specialist'",
  "Provided valid email + first name",
  "Located in geography served by a partner advisory firm",
] as const;

// ── Quiz Tiers ──────────────────────────────────────────────────

export const QUIZ_TIERS = {
  tier1: {
    label: "An SMSF may not be right for you right now",
    description:
      "Based on general industry benchmarks, your answers share characteristics with situations where SMSF costs may outweigh benefits.",
  },
  tier2: {
    label: "Important questions to explore",
    description:
      "Based on general industry benchmarks, your answers suggest topics worth discussing with a licensed specialist.",
  },
  tier3: {
    label: "Could be worth exploring further",
    description:
      "Based on general industry benchmarks, your answers share characteristics with situations where an SMSF may be worth investigating with a licensed specialist.",
  },
} as const;

// ── Disclaimer Text ─────────────────────────────────────────────

export const DISCLAIMER_SITE =
  "BrickSuper.com.au provides factual, educational information about self-managed super funds and property investment. We do not provide financial product advice, do not hold an Australian Financial Services Licence (AFSL), and are not authorised to provide financial advice. Where you need personalised guidance, we can connect you with licensed professionals — but the decision to engage any adviser is always yours.";

export const DISCLAIMER_TOOL =
  "This tool does not provide financial advice. Outputs are based on general industry benchmarks and mathematical calculations using the data you enter. They cannot consider your personal circumstances. Only a licensed financial adviser can determine whether an SMSF or property investment is appropriate for you.";

export const DISCLAIMER_FORM =
  "BrickSuper does not provide financial advice. Any specialist is independently licensed under their own AFSL. BrickSuper may receive a fixed referral fee if you choose to connect — this fee is the same regardless of the advice you receive or what you decide to do next.";

export const DISCLAIMER_FUNDING =
  "BrickSuper earns revenue by connecting visitors interested in SMSF advice with licensed financial advisers. When you choose to be connected, BrickSuper may receive a fixed referral fee from the adviser's licensee. This fee is the same regardless of what advice you receive or whether you proceed with any financial product.";

// ── Market Data ─────────────────────────────────────────────────

export const SMSF_STATS = {
  totalFunds: 653_062,
  totalAssets: 1_050_000_000_000, // $1.05 trillion
  nonResidentialProperty: 105_000_000_000, // ~$105 billion
  outstandingLRBAs: 70_000_000_000, // >$70 billion
  newFundsPerYear: 42_000, // 2024-25
  newFundGrowthRate: 27.1, // % YoY
  medianNewMemberAge: 46,
  averageAssetsPerFund: 1_630_000, // $1.63M in 2023-24
  source: "ATO SMSF Statistics 2023-24",
} as const;
