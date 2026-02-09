'use client';

import { useState } from 'react';
import { UploadSection } from './components/upload-section';
import { ReviewParamsSection } from './components/review-params-section';
import { ResultsSection } from './components/results-section';
import { ChatbotButton } from './components/chatbot-button';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ScholarAgents2Page() {

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

    const isGenerating = proSearchStatus === 'running' || peerReviewStatus === 'generating';

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container py-6 h-[calc(100vh-6rem)]">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                    <p className="text-muted-foreground">Overview of your token usage and activity.</p>
                </div>

                <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border md:min-w-[450px]">

                    {/* Left Column: Controls */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full overflow-y-auto pr-4 space-y-6">
                            {/* Step 1 */}
                            <UploadSection
                                isExpanded={step1Expanded}
                                onToggle={() => setStep1Expanded(!step1Expanded)}
                                onCategoryChange={setManuscriptCategory}
                                onFileChange={setHasFile}
                            />

                            {/* Step 2 */}
                            <ReviewParamsSection
                                isExpanded={step2Expanded}
                                onToggle={() => setStep2Expanded(!step2Expanded)}
                                onVerdictChange={setVerdict}
                                onCommentsChange={setComments}
                                isReady={isReviewParamsReady}
                            />

                            {/* Generate Button */}
                            <div className="pt-4 sticky bottom-0 bg-background pb-4 z-10">
                                <Button
                                    size="lg"
                                    className="w-full h-12 text-lg font-semibold shadow-lg transition-all"
                                    disabled={!isGenerateEnabled || isGenerating}
                                    onClick={handleGenerate}
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    {isGenerating ? 'Processing...' : 'Generate Review'}
                                </Button>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Column: AI Process & Result */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full overflow-y-auto pl-4 space-y-6">
                            <ResultsSection
                                proSearchStatus={proSearchStatus}
                                peerReviewStatus={peerReviewStatus}
                            />
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            {/* Floating Chatbot */}
            <ChatbotButton />
        </div>
    );
}
