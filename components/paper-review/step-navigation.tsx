'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
}

export function StepNavigation({
  currentStep,
  onBack,
  onNext,
  canGoBack,
  canGoNext
}: StepNavigationProps) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex items-center justify-between border-t bg-background p-6">
      <div className="flex items-center gap-2">
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              step === currentStep
                ? 'bg-primary'
                : step < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        {currentStep > 1 && (
          <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
            BACK
          </Button>
        )}
        {currentStep < 4 && (
          <Button onClick={onNext} disabled={!canGoNext}>
            NEXT
          </Button>
        )}
      </div>
    </div>
  );
}
