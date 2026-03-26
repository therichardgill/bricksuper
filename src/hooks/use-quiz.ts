"use client";

import { useState, useCallback, useRef } from "react";
import { QUIZ_QUESTIONS, scoreQuiz, type QuizResult } from "@/lib/quiz-data";

export type QuizPhase = "quiz" | "results" | "lead-gate" | "success";

export function useQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<QuizPhase>("quiz");
  const [result, setResult] = useState<QuizResult | null>(null);
  const startedAt = useRef(Date.now());

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  const canGoBack = currentStep > 0;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const selectAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion]
  );

  const goNext = useCallback(() => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Quiz complete — score and show results
      const scored = scoreQuiz(answers);
      setResult(scored);
      setPhase("results");
    }
  }, [currentStep, totalQuestions, answers]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const proceedToLeadGate = useCallback(() => {
    setPhase("lead-gate");
  }, []);

  const completeSubmission = useCallback(() => {
    setPhase("success");
  }, []);

  const getDurationSeconds = useCallback(() => {
    return Math.round((Date.now() - startedAt.current) / 1000);
  }, []);

  return {
    // State
    phase,
    currentStep,
    currentQuestion,
    currentAnswer,
    answers,
    result,
    progress,
    totalQuestions,
    canGoBack,

    // Actions
    selectAnswer,
    goNext,
    goBack,
    proceedToLeadGate,
    completeSubmission,
    getDurationSeconds,
  };
}
