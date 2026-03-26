import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LastUpdatedProps {
  date: Date | number;
  className?: string;
}

export function LastUpdated({ date, className }: LastUpdatedProps) {
  return (
    <time
      dateTime={
        typeof date === "number"
          ? new Date(date).toISOString()
          : date.toISOString()
      }
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-bs-muted",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-bs-green" aria-hidden="true" />
      Last reviewed {formatDate(date)}
    </time>
  );
}
