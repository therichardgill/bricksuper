"use client";

import { cn } from "@/lib/utils";
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer?: string;
  onSelect: (value: string) => void;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
}: QuizQuestionProps) {
  return (
    <div>
      <h2
        className="font-serif text-xl sm:text-2xl text-bs-charcoal mb-6 leading-snug"
        id={`question-${question.id}`}
        tabIndex={-1}
      >
        {question.text}
      </h2>

      <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.value)}
              className={cn(
                "w-full text-left border rounded-xl px-5 py-4 flex items-center gap-3 transition-colors min-h-[56px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bs-orange focus-visible:ring-offset-2",
                isSelected
                  ? "border-bs-orange bg-bs-orange-pale/50 text-bs-charcoal"
                  : "border-border hover:border-bs-orange/30 hover:bg-bs-orange-pale/20 text-bs-slate"
              )}
            >
              <div
                className={cn(
                  "size-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  isSelected ? "border-bs-orange" : "border-bs-muted"
                )}
              >
                {isSelected && (
                  <div className="size-2.5 rounded-full bg-bs-orange" />
                )}
              </div>
              <span className="text-sm sm:text-base">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
