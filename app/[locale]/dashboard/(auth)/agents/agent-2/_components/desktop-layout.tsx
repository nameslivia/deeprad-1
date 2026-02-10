import { UploadSection } from './upload-section';
import { ReviewParamsSection } from './review-params-section';
import { ResultsSection } from './results-section';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface DesktopLayoutProps {
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
  isGenerateEnabled: boolean;
  isGenerating: boolean;
  handleGenerate: () => void;
  handleClear: () => void;
  proSearchStatus: 'idle' | 'running' | 'completed';
  peerReviewStatus: 'idle' | 'generating' | 'generated';
}

export function DesktopLayout({
  step1Expanded,
  setStep1Expanded,
  setManuscriptCategory,
  setHasFile,
  step2Expanded,
  setStep2Expanded,
  setVerdict,
  setComments,
  isReviewParamsReady,
  isGenerateEnabled,
  isGenerating,
  handleGenerate,
  handleClear,
  proSearchStatus,
  peerReviewStatus,
}: DesktopLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full md:min-w-[450px]"
    >
      {/* Left Panel: Controls */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full overflow-y-auto space-y-6 pr-4">
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

          {/* Generate Review Button - Sticky at bottom */}
          <div className="pt-4 sticky bottom-0 bg-background pb-4 z-10">
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-12 text-lg font-semibold shadow-lg transition-all"
                disabled={!isGenerateEnabled || isGenerating}
                onClick={handleGenerate}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGenerating ? 'Processing...' : 'Generate Review'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6"
                onClick={handleClear}
                disabled={isGenerating}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>

      {/* Resizable Handle */}
      <ResizableHandle withHandle />

      {/* Right Panel: AI Process & Results */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full overflow-y-auto space-y-6 pl-4">
          <ResultsSection
            proSearchStatus={proSearchStatus}
            peerReviewStatus={peerReviewStatus}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}