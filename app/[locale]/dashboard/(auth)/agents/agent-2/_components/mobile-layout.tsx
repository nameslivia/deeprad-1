import { UploadSection } from './upload-section';
import { ReviewParamsSection } from './review-params-section';
import { ResultsSection } from './results-section';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';

interface MobileLayoutProps {
  step1Expanded: boolean;
  setStep1Expanded: (value: boolean) => void;
  manuscriptCategory: string;
  setManuscriptCategory: (value: string) => void;
  hasFile: boolean;
  setHasFile: (value: boolean) => void;
  step2Expanded: boolean;
  setStep2Expanded: (value: boolean) => void;
  verdict: string;
  setVerdict: (value: string) => void;
  comments: string;
  setComments: (value: string) => void;
  isReviewParamsReady: boolean;
}

export function MobileLayout({
  step1Expanded,
  setStep1Expanded,
  setManuscriptCategory,
  setHasFile,
  step2Expanded,
  setStep2Expanded,
  setVerdict,
  setComments,
  isReviewParamsReady,
}: MobileLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Control Sections */}
      <div className="space-y-6">
        {/* Step 1: Upload Section */}
        <UploadSection
          isExpanded={step1Expanded}
          onToggle={() => setStep1Expanded(!step1Expanded)}
          onCategoryChange={setManuscriptCategory}
          onFileChange={setHasFile}
        />

        {/* Step 2: Review Parameters Section */}
        <ReviewParamsSection
          isExpanded={step2Expanded}
          onToggle={() => setStep2Expanded(!step2Expanded)}
          onVerdictChange={setVerdict}
          onCommentsChange={setComments}
          isReady={isReviewParamsReady}
        />
      </div>
    </div>
  );
}