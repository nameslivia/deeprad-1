'use client';

import { ReviewFooter } from '@/components/paper-review/review-footer';
import { StepNavigation } from '@/components/paper-review/step-navigation';
import { Step1_FileUpload } from '@/components/paper-review/steps/step1-file-upload';
import { Step2_JournalSelection } from '@/components/paper-review/steps/step2-journal-selection';
import { Step3_AIReviewResults } from '@/components/paper-review/steps/step3-ai-review-results';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';

export default function PaperReviewPage() {
  const { currentStep, setStep, canProceedToStep2 } =
    usePaperReviewStore();

  const handleBack = () => {
    if (currentStep > 1) {
      setStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  // Determine if user can proceed to next step
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return canProceedToStep2();
      case 2:
        return true; // Can always proceed from journal selection
      case 3:
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 bg-background">
        <div className="container py-8">
          {currentStep === 1 && <Step1_FileUpload />}
          {currentStep === 2 && <Step2_JournalSelection />}
          {currentStep === 3 && <Step3_AIReviewResults />}
        </div>
      </main>

      <StepNavigation
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        canGoBack={currentStep > 1}
        canGoNext={canGoNext()}
      />

      <ReviewFooter />
    </div>
  );
}
