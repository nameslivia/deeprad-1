'use client';

import { useState, useEffect } from 'react';
import { ChatbotButton } from './_components/chatbot-button';
import { useMediaQuery } from 'react-responsive';
import { cn } from '@/lib/utils';
import { MobileLayout } from './_components/mobile-layout';
import { DesktopLayout } from './_components/desktop-layout';

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

    // Shared props for both layouts
    const layoutProps = {
        step1Expanded,
        setStep1Expanded,
        manuscriptCategory,
        setManuscriptCategory,
        hasFile,
        setHasFile,
        step2Expanded,
        setStep2Expanded,
        verdict,
        setVerdict,
        comments,
        setComments,
        isReviewParamsReady,
        isGenerateEnabled,
        isGenerating,
        handleGenerate,
        handleClear,
        proSearchStatus,
        peerReviewStatus,
    };

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
                    <MobileLayout {...layoutProps} />
                ) : (
                    <DesktopLayout {...layoutProps} />
                )}
            </div>

            {/* Floating Chatbot Button */}
            <ChatbotButton />
        </div>
    );
}