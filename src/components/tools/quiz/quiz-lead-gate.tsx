"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/brand/disclaimer";
import { Loader2 } from "lucide-react";
import type { QuizResult } from "@/lib/quiz-data";
import { DISCLAIMER_FORM } from "@/lib/constants";

const leadSchema = z.object({
  firstName: z.string().check(
    z.refine((val) => val.length > 0, "First name is required")
  ),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  wantsSpecialist: z.boolean(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface QuizLeadGateProps {
  result: QuizResult;
  answers: Record<string, string>;
  durationSeconds: number;
  onComplete: () => void;
}

export function QuizLeadGate({
  result,
  answers,
  durationSeconds,
  onComplete,
}: QuizLeadGateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      wantsSpecialist: false,
    },
  });

  const wantsSpecialist = watch("wantsSpecialist");

  // Convex mutation will be wired once `npx convex dev` generates types.
  // Until then, the lead data is logged to console for testing.
  async function onSubmit(data: LeadFormData) {
    if (isSubmitting) return; // Double-submit prevention
    setIsSubmitting(true);

    try {
      // Lead payload matches the Convex submitQuizLead mutation shape
      const leadPayload = {
        email: data.email,
        firstName: data.firstName,
        phone: data.phone || undefined,
        wantsSpecialistConnection: data.wantsSpecialist,
        tier: result.tier,
        fundBalanceRange: answers["balance"],
        primaryInterest: answers["property-type"],
        timeline: answers["timeline"],
        isBusinessOwner: answers["business-owner"] === "yes",
        hasExistingSmsf: answers["has-smsf"] === "yes",
        hasExistingAdviser: answers["has-adviser"] === "yes",
        source: "quiz",
        consentText: DISCLAIMER_FORM,
        privacyPolicyVersion: "1.0",
      };

      // TODO: Replace with useMutation(api.leads.submitQuizLead) once Convex is connected
      console.log("[BrickSuper] Lead submission payload:", leadPayload);
      await new Promise((resolve) => setTimeout(resolve, 800));

      onComplete();
    } catch (err) {
      console.error("Lead submission failed:", err);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="border border-border rounded-xl p-6 bg-background">
        <h3 className="font-serif text-xl text-bs-charcoal mb-4">
          Get your full results by email
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm text-bs-mid mb-1.5"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Sarah"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-bs-red mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-bs-mid mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="sarah@example.com.au"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-bs-red mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone (optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm text-bs-mid mb-1.5"
            >
              Phone{" "}
              <span className="text-bs-muted">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="04XX XXX XXX"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent"
              {...register("phone")}
            />
          </div>

          {/* Specialist toggle */}
          <label className="flex items-center gap-3 py-3 cursor-pointer">
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${
                wantsSpecialist ? "bg-bs-orange" : "bg-bs-border"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                {...register("wantsSpecialist")}
              />
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  wantsSpecialist ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-bs-slate">
              I&apos;d like to be connected with a licensed SMSF specialist
            </span>
          </label>

          {/* Disclaimer */}
          <Disclaimer variant="form" />

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Email me my results"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
