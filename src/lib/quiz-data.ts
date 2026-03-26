/**
 * SMSF Readiness Quiz — 7 questions
 *
 * Each answer has a score that feeds into tier calculation.
 * Questions collect factual data — no opinion or suitability language.
 */

export interface QuizOption {
  value: string;
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "has-smsf",
    text: "Do you currently have a self-managed super fund (SMSF)?",
    options: [
      { value: "yes", label: "Yes", score: 3 },
      { value: "considering", label: "No, but I'm considering one", score: 2 },
      { value: "researching", label: "No, just researching", score: 1 },
    ],
  },
  {
    id: "balance",
    text: "What is the approximate total balance of your super (or the super you're considering rolling into an SMSF)?",
    options: [
      { value: "under-200k", label: "Under $200,000", score: 0 },
      { value: "200-500k", label: "$200,000 – $500,000", score: 2 },
      { value: "500k-1m", label: "$500,000 – $1,000,000", score: 3 },
      { value: "over-1m", label: "Over $1,000,000", score: 3 },
    ],
  },
  {
    id: "business-owner",
    text: "Are you a business owner?",
    options: [
      { value: "yes", label: "Yes", score: 2 },
      { value: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "property-type",
    text: "What type of property are you considering for your SMSF?",
    options: [
      { value: "commercial", label: "Commercial property", score: 2 },
      { value: "residential", label: "Residential property", score: 1 },
      { value: "business-premises", label: "My own business premises", score: 3 },
      { value: "not-sure", label: "Not sure yet", score: 0 },
    ],
  },
  {
    id: "timeline",
    text: "How soon are you looking to purchase property through an SMSF?",
    options: [
      { value: "3-months", label: "Within 3 months", score: 3 },
      { value: "3-12-months", label: "3–12 months", score: 2 },
      { value: "exploring", label: "Just exploring", score: 1 },
    ],
  },
  {
    id: "has-adviser",
    text: "Do you currently work with a financial adviser or accountant for your super?",
    options: [
      { value: "yes", label: "Yes", score: 2 },
      { value: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "compliance-comfort",
    text: "How comfortable are you with the ongoing compliance responsibilities of running an SMSF?",
    options: [
      { value: "very", label: "Very comfortable — I understand the obligations", score: 2 },
      { value: "somewhat", label: "Somewhat — I have a general idea", score: 1 },
      { value: "not-sure", label: "Not sure — I'd want to learn more", score: 0 },
    ],
  },
];

export type QuizTier = "tier1" | "tier2" | "tier3";

export interface QuizResult {
  tier: QuizTier;
  totalScore: number;
  maxScore: number;
}

/**
 * Score the quiz and determine tier.
 *
 * Tier 1 (not ready): balance < $200K AND no existing SMSF AND no adviser
 * Tier 3 (worth exploring): balance > $500K OR (business owner considering BRP)
 * Tier 2 (questions to explore): everything else
 */
export function scoreQuiz(answers: Record<string, string>): QuizResult {
  const maxScore = QUIZ_QUESTIONS.reduce((max, q) => {
    const highest = Math.max(...q.options.map((o) => o.score));
    return max + highest;
  }, 0);

  let totalScore = 0;
  for (const q of QUIZ_QUESTIONS) {
    const answer = answers[q.id];
    const option = q.options.find((o) => o.value === answer);
    if (option) totalScore += option.score;
  }

  // Tier 1: Hard triggers for "not ready"
  const balanceUnder200k = answers["balance"] === "under-200k";
  const noSmsf = answers["has-smsf"] === "researching";
  const noAdviser = answers["has-adviser"] === "no";

  if (balanceUnder200k && noSmsf && noAdviser) {
    return { tier: "tier1", totalScore, maxScore };
  }

  // Tier 3: Strong indicators
  const highBalance =
    answers["balance"] === "500k-1m" || answers["balance"] === "over-1m";
  const businessOwnerBRP =
    answers["business-owner"] === "yes" &&
    answers["property-type"] === "business-premises";

  if (highBalance || businessOwnerBRP) {
    return { tier: "tier3", totalScore, maxScore };
  }

  // Tier 2: Everything else
  return { tier: "tier2", totalScore, maxScore };
}
