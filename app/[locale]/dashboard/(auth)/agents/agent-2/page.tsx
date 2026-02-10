'use client';

import { useState } from 'react';
import { UploadSection } from './_components/upload-section';
import { ReviewParamsSection } from './_components/review-params-section';
import { ResultsSection } from './_components/results-section';
import { ChatbotButton } from './_components/chatbot-button';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from 'react-responsive';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function ScholarAgents2Page() {
    // Mobile detection via react-responsive
    // We use a state to ensure no hydration mismatch (default to false/desktop until mounted)
    const isMobileQuery = useMediaQuery({ maxWidth: 767 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobileQuery);
    }, [isMobileQuery]);

    // State for interaction flow
    const [step1Expanded, setStep1Expanded] = useState(true);
    const [step2Expanded, setStep2Expanded] = useState(true);

    // Form State
    const [manuscriptCategory, setManuscriptCategory] = useState('');
    const [hasFile, setHasFile] = useState(false);
    const [verdict, setVerdict] = useState('');
    const [comments, setComments] = useState('');

    // Result State
    // 'idle' -> 'running' -> 'completed'
    const [proSearchStatus, setProSearchStatus] = useState<'idle' | 'running' | 'completed'>('idle');
    // 'idle' -> 'generating' -> 'generated'
    const [peerReviewStatus, setPeerReviewStatus] = useState<'idle' | 'generating' | 'generated'>('idle');

    // Logic to enable "Generate Review"
    const isGenerateEnabled =
        manuscriptCategory !== '' &&
        hasFile &&
        verdict !== '' &&
        comments.trim() !== '';

    // Logic to show "Ready" badge in ReviewParamsSection
    const isReviewParamsReady = verdict !== '' && comments.trim() !== '';

    const handleGenerate = () => {
        // 1. Start Pro Search
        setProSearchStatus('running');
        setPeerReviewStatus('idle'); // Reset peer review status if re-generating

        // Simulate Pro Search duration
        setTimeout(() => {
            setProSearchStatus('completed');

            // 2. Start Peer Review Generation
            setPeerReviewStatus('generating');

            // Simulate Peer Review Generation duration
            setTimeout(() => {
                setPeerReviewStatus('generated');
            }, 3000); // 3 seconds for peer review generation

        }, 4000); // 4 seconds for pro search
    };

    const handleClear = () => {
        // Reset all form state
        setManuscriptCategory('');
        setHasFile(false);
        setVerdict('');
        setComments('');
        
        // Reset result state
        setProSearchStatus('idle');
        setPeerReviewStatus('idle');
        
        // Expand sections again
        setStep1Expanded(true);
        setStep2Expanded(true);
    };

    const isGenerating = proSearchStatus === 'running' || peerReviewStatus === 'generating';

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className={cn(
                "container py-6",
                // Mobile: use auto height with spacing, Desktop: fixed viewport height
                isMobile ? "space-y-6" : "h-[calc(100vh-6rem)]"
            )}>
                {/* Page Header */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                    <p className="text-muted-foreground">Overview of your token usage and activity.</p>
                </div>

                {isMobile ? (
                    // Mobile Layout: Simple vertical stack without ResizablePanel
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

                            {/* Generate Review Button */}
                            <div className="pt-4 flex gap-3">
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

                        {/* Results Section */}
                        <ResultsSection
                            proSearchStatus={proSearchStatus}
                            peerReviewStatus={peerReviewStatus}
                        />
                    </div>
                ) : (
                    // Desktop Layout: Resizable horizontal panels
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
                )}
            </div>

            {/* Floating Chatbot Button */}
            <ChatbotButton />
        </div>
    );
}