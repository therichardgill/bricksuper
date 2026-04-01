"use client";

import { Button } from "@/components/ui/button";
import { TrafficLight } from "@/components/brand/traffic-light";
import { QUIZ_TIERS } from "@/lib/constants";
import type { QuizResult } from "@/lib/quiz-data";
import type { RiskLevel } from "@/lib/constants";

interface QuizResultsProps {
  result: QuizResult;
  answers: Record<string, string>;
  onContinue: () => void;
}

interface ResultFlag {
  flag: string;
  level: RiskLevel;
  description: string;
  source?: string;
}

function generateFlags(answers: Record<string, string>): ResultFlag[] {
  const flags: ResultFlag[] = [];

  // Balance flag
  const balance = answers["super-balance"];
  if (balance === "over-500k" || balance === "300k-500k") {
    flags.push({
      flag: "Fund balance",
      level: "green",
      description:
        "Within range commonly associated with viable SMSFs based on University of Adelaide research.",
      source:
        "University of Adelaide SMSF research (Feb 2025) — SMSFs with ≥$200K achieve competitive returns",
    });
  } else if (balance === "200k-300k") {
    flags.push({
      flag: "Fund balance",
      level: "amber",
      description:
        "At the lower end of the range where SMSF costs may significantly impact net returns. Worth discussing with a licensed adviser.",
      source: "ASIC practical industry threshold ~$200K (updated Dec 2022)",
    });
  } else {
    flags.push({
      flag: "Fund balance",
      level: "red",
      description:
        "Below the level where SMSF administration costs typically consume a significant portion of returns. The ATO and ASIC have both flagged this as a concern.",
      source: "ASIC practical industry threshold ~$200K (updated Dec 2022)",
    });
  }

  // Concentration flag
  flags.push({
    flag: "Concentration risk",
    level: balance === "under-100k" || balance === "100k-200k" ? "red" : "amber",
    description:
      "Adding property to an SMSF can result in a significant portion of your fund being in a single asset. The ATO wrote to 17,700 trustees about concentration risk in 2019.",
    source: "ATO concentration risk campaign, 2019",
  });

  // Compliance flag (always show as an educational warning for prospective trustees)
  flags.push({
    flag: "Compliance readiness",
    level: "amber",
    description:
      "SMSF trustees have ongoing legal obligations including annual audits, investment strategy reviews, and ATO reporting. Administrative penalties of $4,200 per trustee can apply for non-compliance.",
    source: "SIS Regulation 4.09",
  });

  return flags;
}

function generateAdviserQuestions(
  answers: Record<string, string>
): string[] {
  const questions: string[] = [];

  if (answers["employment-status"] === "business-owner") {
    questions.push(
      "If I want to purchase commercial premises for my business, does it qualify as business real property under SIS Act s66(5)?"
    );
    questions.push(
      "What are the lease-back arrangement requirements if my business will occupy the premises?"
    );
  }

  const balance = answers["super-balance"];
  if (
    balance === "100k-200k" ||
    balance === "under-100k" ||
    balance === "200k-300k"
  ) {
    questions.push(
      "Given my fund balance, how would SMSF administration costs impact my net returns compared to my current super fund?"
    );
  }

  questions.push(
    "How would adding property affect my fund's liquidity position and ability to meet ongoing expenses?"
  );
  questions.push(
    "What concentration risk implications should I consider given my current asset mix?"
  );

  questions.push(
    "If I am borrowing to invest, how does the LRBA safe harbour rate (8.95%) compare to current market rates (~6.5%)?"
  );

  questions.push(
    "How should my investment strategy document this decision per SIS Regulation 4.09?"
  );

  return questions;
}

export function QuizResults({
  result,
  answers,
  onContinue,
}: QuizResultsProps) {
  const tier = QUIZ_TIERS[result.tier];
  const flags = generateFlags(answers);
  const adviserQuestions = generateAdviserQuestions(answers);

  return (
    <div className="max-w-lg mx-auto">
      {/* Tier heading */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-bs-muted mb-2">
          Based on general industry benchmarks
        </p>
        <h2 className="font-serif text-2xl text-bs-charcoal mb-2">
          {tier.label}
        </h2>
        <p className="text-sm text-bs-mid leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Traffic light flags */}
      <div className="space-y-3 mb-8">
        {flags.map((flag) => (
          <TrafficLight
            key={flag.flag}
            level={flag.level}
            flag={flag.flag}
            description={flag.description}
            source={flag.source}
          />
        ))}
      </div>

      {/* Questions to ask adviser */}
      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-wider text-bs-muted mb-3">
          Questions to ask a licensed adviser
        </h3>
        <ol className="space-y-3">
          {adviserQuestions.map((q, i) => (
            <li key={i} className="flex gap-3 text-sm text-bs-slate leading-relaxed">
              <span className="text-bs-orange font-semibold shrink-0">
                {i + 1}.
              </span>
              {q}
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="border-t border-border pt-6">
        <Button onClick={onContinue} size="lg" className="w-full">
          Get your full results by email
        </Button>
        <p className="text-xs text-bs-muted mt-3 text-center">
          We&apos;ll also ask if you&apos;d like to connect with a licensed SMSF
          specialist.
        </p>
      </div>
    </div>
  );
}
