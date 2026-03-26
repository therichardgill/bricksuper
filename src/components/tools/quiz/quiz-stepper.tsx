"use client";

import { Button } from "@/components/ui/button";
import { QuizQuestion } from "./quiz-question";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizResults } from "./quiz-results";
import { QuizLeadGate } from "./quiz-lead-gate";
import { Disclaimer } from "@/components/brand/disclaimer";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export function QuizStepper() {
  const quiz = useQuiz();

  // Success phase
  if (quiz.phase === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <CheckCircle2 className="size-16 text-bs-green mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-bs-charcoal mb-3">
          Results on their way
        </h2>
        <p className="text-bs-mid leading-relaxed">
          Check your inbox — we&apos;ve sent your full results with questions to
          discuss with a licensed adviser.
        </p>
      </div>
    );
  }

  // Lead gate phase
  if (quiz.phase === "lead-gate" && quiz.result) {
    return (
      <QuizLeadGate
        result={quiz.result}
        answers={quiz.answers}
        durationSeconds={quiz.getDurationSeconds()}
        onComplete={quiz.completeSubmission}
      />
    );
  }

  // Results phase
  if (quiz.phase === "results" && quiz.result) {
    return (
      <QuizResults
        result={quiz.result}
        answers={quiz.answers}
        onContinue={quiz.proceedToLeadGate}
      />
    );
  }

  // Quiz phase
  if (!quiz.currentQuestion) return null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-bs-muted">
            Question {quiz.currentStep + 1} of {quiz.totalQuestions}
          </span>
          <span className="text-xs text-bs-muted">~3 minutes</span>
        </div>
        <div className="h-1 bg-bs-border rounded-full overflow-hidden">
          <div
            className="h-full bg-bs-orange rounded-full transition-all duration-300"
            style={{ width: `${quiz.progress}%` }}
            role="progressbar"
            aria-valuenow={quiz.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Quiz progress"
          />
        </div>
      </div>

      {/* Question */}
      <QuizQuestion
        question={quiz.currentQuestion}
        selectedAnswer={quiz.currentAnswer}
        onSelect={quiz.selectAnswer}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="secondary"
          onClick={quiz.goBack}
          disabled={!quiz.canGoBack}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          onClick={quiz.goNext}
          disabled={!quiz.currentAnswer}
          className="gap-2"
        >
          {quiz.currentStep === quiz.totalQuestions - 1 ? (
            "See Results"
          ) : (
            <>
              Next
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>

      {/* Per-tool disclaimer */}
      <Disclaimer variant="tool" className="mt-8" />
    </div>
  );
}
