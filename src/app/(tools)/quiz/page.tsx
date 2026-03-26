import { SiteHeader } from "@/components/brand/site-header";
import { SiteFooter } from "@/components/brand/site-footer";
import { QuizStepper } from "@/components/tools/quiz/quiz-stepper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMSF Property Readiness Quiz",
  description:
    "7 questions, ~3 minutes. See where you stand based on general industry benchmarks for SMSF property investment.",
};

export default function QuizPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizStepper />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
