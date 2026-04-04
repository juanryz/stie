import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { no: 1, label: "Data Pribadi" },
  { no: 2, label: "Pendidikan" },
  { no: 3, label: "Orang Tua" },
  { no: 4, label: "Program" },
  { no: 5, label: "Dokumen" },
  { no: 6, label: "Review" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile: text only */}
      <p className="sm:hidden text-sm text-muted-foreground text-center mb-4">
        Langkah {currentStep} dari {STEPS.length} —{" "}
        <span className="font-medium text-[#1B4F72]">
          {STEPS[currentStep - 1]?.label}
        </span>
      </p>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center w-full">
        {STEPS.map((step, i) => {
          const isDone = currentStep > step.no;
          const isActive = currentStep === step.no;

          return (
            <div key={step.no} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isDone &&
                      "border-[#1B4F72] bg-[#1B4F72] text-white",
                    isActive &&
                      "border-[#1B4F72] bg-white text-[#1B4F72]",
                    !isDone && !isActive &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckIcon className="h-4 w-4" /> : step.no}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isActive ? "text-[#1B4F72]" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 mb-5 rounded-full transition-colors",
                    isDone ? "bg-[#1B4F72]" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: progress bar */}
      <div className="sm:hidden h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-[#1B4F72] transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
