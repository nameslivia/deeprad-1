'use client';

import { ReviewFooter } from './_components/review-footer';
import { StepNavigation } from './_components/step-navigation';
import { Step1_FileUpload } from './_components/steps/step1-file-upload';
import { Step2_JournalSelection } from './_components/steps/step2-journal-selection';
import { Step3_AIReviewResults } from './_components/steps/step3-ai-review-results';
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

  const handleStepClick = (step: 1 | 2 | 3) => {
    if(step <= currentStep || (step === 2 && canProceedToStep2())) {
      setStep(step);
    }
  };

  // Determine if user can proceed to next step
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return canProceedToStep2();
      case 2:
        return true;
      case 3:
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">

      <StepNavigation
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        onStepClick={handleStepClick}
        canGoBack={currentStep > 1}
        canGoNext={canGoNext()}
      />      

      <main className="flex-1 bg-background">
        <div className="container py-8">
          {currentStep === 1 && <Step1_FileUpload />}
          {currentStep === 2 && <Step2_JournalSelection />}
          {currentStep === 3 && <Step3_AIReviewResults />}
        </div>
      </main>

      <ReviewFooter />
    </div>
  );
}
