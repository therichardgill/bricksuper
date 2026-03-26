import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/constants";

const levelConfig: Record<
  RiskLevel,
  { bg: string; dot: string; text: string; label: string }
> = {
  green: {
    bg: "bg-bs-green-pale",
    dot: "bg-bs-green",
    text: "text-bs-green-dark",
    label: "Low risk",
  },
  amber: {
    bg: "bg-bs-amber-pale",
    dot: "bg-bs-amber",
    text: "text-bs-amber",
    label: "Moderate risk",
  },
  red: {
    bg: "bg-bs-red-pale",
    dot: "bg-bs-red",
    text: "text-bs-red-dark",
    label: "High risk",
  },
};

interface TrafficLightProps {
  level: RiskLevel;
  flag: string;
  description: string;
  source?: string;
  className?: string;
}

export function TrafficLight({
  level,
  flag,
  description,
  source,
  className,
}: TrafficLightProps) {
  const config = levelConfig[level];

  return (
    <div
      className={cn(
        "rounded-lg border p-3 flex items-start gap-3",
        config.bg,
        className
      )}
      role="alert"
      aria-label={`${config.label}: ${flag}`}
    >
      <div
        className={cn("size-2.5 rounded-full mt-1.5 shrink-0", config.dot)}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", config.text)}>{flag}</span>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
              config.bg,
              config.text
            )}
          >
            {config.label}
          </span>
        </div>
        <p className="text-sm text-bs-slate mt-1 leading-relaxed">
          {description}
        </p>
        {source && (
          <p className="text-xs text-bs-muted mt-1 italic">Source: {source}</p>
        )}
      </div>
    </div>
  );
}
