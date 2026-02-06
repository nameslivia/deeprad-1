'use client';

import { useState } from 'react';
import { UploadSection } from './components/upload-section';
import { ReviewParamsSection } from './components/review-params-section';
import { ResultsSection } from './components/results-section';
import { ChatbotButton } from './components/chatbot-button';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'complete'>('idle');

    // Logic to enable "Generate Review"
    const isGenerateEnabled =
        manuscriptCategory !== '' &&
        hasFile &&
        verdict !== '' &&
        comments.trim() !== '';

    const handleGenerate = () => {
        setGenerationStatus('generating');
        // Simulate generation process
        setTimeout(() => {
            setGenerationStatus('complete');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                    <p className="text-muted-foreground">Overview of your token usage and activity.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Controls */}
                    <div className="space-y-6">

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
                        />

                        {/* Generate Button */}
                        <div className="pt-4 sticky bottom-6 z-10">
                            <Button
                                size="lg"
                                className="w-full h-12 text-lg font-semibold shadow-lg transition-all"
                                disabled={!isGenerateEnabled || generationStatus === 'generating'}
                                onClick={handleGenerate}
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                {generationStatus === 'generating' ? 'Generating Review...' : 'Generate Review'}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: AI Process & Result */}
                    <div className="space-y-6">
                        <ResultsSection status={generationStatus} />
                    </div>
                </div>
            </div>

            {/* Floating Chatbot */}
            <ChatbotButton />
        </div>
    );
}
