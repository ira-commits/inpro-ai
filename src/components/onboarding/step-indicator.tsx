import { cn } from "@/lib/utils";

const STEPS = [
  { id: "profile", label: "Profile" },
  { id: "services", label: "Services" },
  { id: "agent", label: "Your AI" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface StepIndicatorProps {
  current: StepId;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted &&
                    "bg-primary text-primary-foreground",
                  isActive &&
                    "border-2 border-primary bg-background text-primary",
                  !isCompleted &&
                    !isActive &&
                    "border-2 border-muted bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-5 h-px w-16 transition-colors",
                  i < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
