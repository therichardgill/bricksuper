import { cn } from "@/lib/utils";
import {
  DISCLAIMER_SITE,
  DISCLAIMER_TOOL,
  DISCLAIMER_FORM,
} from "@/lib/constants";
import { AlertTriangle } from "lucide-react";

type DisclaimerVariant = "site" | "tool" | "form";

const DISCLAIMER_TEXT: Record<DisclaimerVariant, string> = {
  site: DISCLAIMER_SITE,
  tool: DISCLAIMER_TOOL,
  form: DISCLAIMER_FORM,
};

const variantStyles: Record<DisclaimerVariant, string> = {
  site: "bg-muted border-border text-muted-foreground text-xs",
  tool: "bg-bs-amber-pale border-[#E0C070] text-bs-slate text-sm",
  form: "bg-bs-orange-pale border-bs-orange-mid text-bs-slate text-sm",
};

interface DisclaimerProps {
  variant: DisclaimerVariant;
  className?: string;
}

export function Disclaimer({ variant, className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex gap-3 items-start",
        variantStyles[variant],
        className
      )}
      role="note"
      aria-label="Important disclaimer"
    >
      {variant !== "site" && (
        <AlertTriangle
          className="size-4 shrink-0 mt-0.5 text-bs-amber"
          aria-hidden="true"
        />
      )}
      <div>
        {variant === "tool" && (
          <p className="font-semibold text-bs-charcoal mb-1">
            This tool does not provide financial advice.
          </p>
        )}
        <p className="leading-relaxed">{DISCLAIMER_TEXT[variant]}</p>
      </div>
    </div>
  );
}
