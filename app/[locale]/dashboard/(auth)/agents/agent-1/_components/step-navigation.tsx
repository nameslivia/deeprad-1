'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: 1 | 2;
  onBack: () => void;
  onNext: () => void;
  onStepClick: (step: 1 | 2) => void;
  canGoBack: boolean;
  canGoNext: boolean;
}

export function StepNavigation({
  currentStep,
  onBack,
  onNext,
  onStepClick,
  canGoBack,
  canGoNext
}: StepNavigationProps) {
  const steps = [
    { id: 1, label: 'Upload File', icon: Upload },
    { id: 2, label: 'Review Results', icon: CheckCircle }
  ];

  const currentStepIndex = currentStep - 1;

  return (
    <div className="border-b bg-background">
      <div className="container py-6">
        {/* Step Indicators */}
        <div className="mb-6 flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex-1 text-center">
                <button
                  onClick={() => onStepClick(step.id as 1 | 2)}
                  className={cn(
                    'mx-auto flex size-10 items-center justify-center rounded-full text-lg transition-all lg:size-12',
                    'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isCompleted || isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'border bg-muted text-muted-foreground'
                  )}
                  aria-label={`Go to step ${step.id}: ${step.label}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <StepIcon className="size-5" />
                  )}
                </button>
                <div
                  className={cn(
                    'mt-2 text-xs lg:text-sm',
                    isCurrent && 'font-semibold text-foreground',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress
            className="w-full"
            value={(currentStepIndex / (steps.length - 1)) * 100}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
                BACK
              </Button>
            )}
            {currentStep < 2 && (
              <Button onClick={onNext} disabled={!canGoNext}>
                NEXT
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

