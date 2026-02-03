'use client';

import { ReviewFooter } from '@/components/paper-review/review-footer';
import { StepNavigation } from '@/components/paper-review/step-navigation';
import { Step1_FileUpload } from '@/components/paper-review/steps/step1-file-upload';
import { Step2_UploadProgress } from '@/components/paper-review/steps/step2-upload-progress';
import { Step3_JournalSelection } from '@/components/paper-review/steps/step3-journal-selection';
import { Step4_AIReviewResults } from '@/components/paper-review/steps/step4-ai-review-results';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';

export default function PaperReviewPage() {
  const { currentStep, setStep, canProceedToStep2, canProceedToStep3 } =
    usePaperReviewStore();

  const handleBack = () => {
    if (currentStep > 1) {
      // Step 3 → Step 1
      if (currentStep === 3) {
        setStep(1);
      } else {
        setStep((currentStep - 1) as 1 | 2 | 3 | 4);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setStep((currentStep + 1) as 1 | 2 | 3 | 4);
    }
  };

  // Determine if user can proceed to next step
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return canProceedToStep2();
      case 2:
        return canProceedToStep3();
      case 3:
        return true; // Can always proceed from journal selection
      case 4:
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
          {currentStep === 2 && <Step2_UploadProgress />}
          {currentStep === 3 && <Step3_JournalSelection />}
          {currentStep === 4 && <Step4_AIReviewResults />}
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
