/**
 * SMSF Readiness Quiz — 6 questions
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
    id: "super-balance",
    text: "How much do you currently have in super?",
    options: [
      { value: "under-100k", label: "Under $100,000", score: 0 },
      { value: "100k-200k", label: "$100,000–$200,000", score: 1 },
      { value: "200k-300k", label: "$200,000–$300,000", score: 2 },
      { value: "300k-500k", label: "$300,000–$500,000", score: 3 },
      { value: "over-500k", label: "$500,000+", score: 4 },
    ],
  },
  {
    id: "employment-status",
    text: "What is your current employment status?",
    options: [
      { value: "payg", label: "PAYG employee", score: 1 },
      { value: "self-employed", label: "Self-employed", score: 2 },
      { value: "business-owner", label: "Business owner", score: 3 },
    ],
  },
  {
    id: "household-income",
    text: "What is your approximate household income?",
    options: [
      { value: "under-80k", label: "Under $80,000", score: 0 },
      { value: "80k-150k", label: "$80,000–$150,000", score: 1 },
      { value: "over-150k", label: "$150,000+", score: 2 },
    ],
  },
  {
    id: "owns-property",
    text: "Do you currently own property?",
    options: [
      { value: "yes", label: "Yes", score: 2 },
      { value: "no", label: "No", score: 0 },
    ],
  },
  {
    id: "primary-goal",
    text: "What is your primary goal?",
    options: [
      { value: "build-security", label: "Building financial security", score: 1 },
      { value: "retirement-planning", label: "Planning for retirement", score: 1 },
      { value: "passive-income", label: "Creating passive income", score: 1 },
    ],
  },
  {
    id: "timeline",
    text: "When are you looking to invest?",
    options: [
      { value: "asap", label: "ASAP", score: 3 },
      { value: "3-6-months", label: "3–6 months", score: 2 },
      { value: "6-12-months", label: "6–12 months", score: 1 },
      { value: "exploring", label: "Just exploring", score: 0 },
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
 * Score the quiz and determine tier based on the new question set.
 *
 * Tier 1 (not ready): low balance < $100K or low scores
 * Tier 3 (worth exploring): balance > $500K OR high income + business owner
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
  const balanceUnder100k = answers["super-balance"] === "under-100k";
  
  if (balanceUnder100k) {
    return { tier: "tier1", totalScore, maxScore };
  }

  // Tier 3: Strong indicators
  const highBalance =
    answers["super-balance"] === "300k-500k" || answers["super-balance"] === "over-500k";
  const highIncomeBizOwner =
    answers["employment-status"] === "business-owner" &&
    answers["household-income"] === "over-150k";

  if (highBalance || highIncomeBizOwner) {
    return { tier: "tier3", totalScore, maxScore };
  }

  // Tier 2: Everything else
  return { tier: "tier2", totalScore, maxScore };
}
