"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/schema-markup";

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-serif text-2xl text-bs-charcoal mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-bs-charcoal">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-bs-muted shrink-0 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-bs-mid leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
