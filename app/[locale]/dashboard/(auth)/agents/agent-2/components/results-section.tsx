'use client';

import { Check, Search, FileText, Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ResultsSectionProps {
    proSearchStatus: 'idle' | 'running' | 'completed';
    peerReviewStatus: 'idle' | 'generating' | 'generated';
}

export function ResultsSection({ proSearchStatus, peerReviewStatus }: ResultsSectionProps) {

    // Mock data for Pro Search
    const steps = [
        { label: 'Analyzing manuscript structure and formatting' },
        { label: 'Identifying research methodology and data' },
        { label: 'Cross-referencing related literature databases' },
        { label: 'Analysis complete. Ready to generate review' },
    ];

    const [completedSteps, setCompletedSteps] = useState<number>(0);
    const [copySuccess, setCopySuccess] = useState(false);

    // Collapsible state for both sections
    const [proSearchExpanded, setProSearchExpanded] = useState(true);
    const [peerReviewExpanded, setPeerReviewExpanded] = useState(true);

    // Effect to simulate steps completing one by one when proSearchStatus is running
    useEffect(() => {
        if (proSearchStatus === 'idle') {
            setCompletedSteps(0);
        } else if (proSearchStatus === 'running') {
            // Reset completed steps when starting
            setCompletedSteps(0);

            // Total duration is roughly 4000ms in parent, so we space these out
            const stepDuration = 900;

            const timers: NodeJS.Timeout[] = [];

            steps.forEach((_, index) => {
                const timer = setTimeout(() => {
                    setCompletedSteps(prev => Math.min(prev + 1, steps.length));
                }, (index + 1) * stepDuration);
                timers.push(timer);
            });

            return () => {
                timers.forEach(clearTimeout);
            };
        } else if (proSearchStatus === 'completed') {
            setCompletedSteps(steps.length);
        }
    }, [proSearchStatus, steps.length]);

    const handleCopy = async () => {
        const reviewContent = `Peer Review Report

Overall Assessment
Decision: Accept with Minor Revision

Summary of Review:

The manuscript presents a compelling analysis of the proposed methodology. The experimental design is robust, and the results largely support the conclusions. However, there are minor inconsistencies in the statistical analysis that need addressing.

- Originality: High. The approach to data verification is novel.
- Methodology: Sound, but requires clarification on sample selection.
- Clarity: Well-written, though the discussion section is slightly verbose.

Recommendation: Accept with Minor Revisions`;

        try {
            await navigator.clipboard.writeText(reviewContent);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Pro Search Card */}
            <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setProSearchExpanded(!proSearchExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex bg-primary text-primary-foreground h-8 w-8 items-center justify-center rounded-lg">
                            <Search className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Pro Search</h3>
                            <p className="text-xs text-muted-foreground">Intelligent analysis & retrieval</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {proSearchStatus === 'completed' && (
                            <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                            </div>
                        )}
                        {proSearchStatus === 'running' && (
                            <div className="flex items-center text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Analyzing
                            </div>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {proSearchExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                {proSearchExpanded && (
                    <div className="px-4 pb-6">
                        <div className="border-t border-border mb-4" />
                        <div className="space-y-2 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg">
                            {steps.map((step, index) => {
                                const isCompleted = index < completedSteps;
                                return (
                                    <div key={index} className="flex items-start gap-2.5 transition-all duration-300">
                                        {isCompleted && (
                                            <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                        )}
                                        <span className={`text-xs font-medium ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Peer Review Result Card */}
            <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setPeerReviewExpanded(!peerReviewExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex bg-primary text-primary-foreground h-8 w-8 items-center justify-center rounded-lg">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">Peer Review Result</h3>
                            <p className="text-xs text-muted-foreground">Generated review report</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {peerReviewStatus === 'generating' && (
                            <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full">
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generating
                            </div>
                        )}
                        {peerReviewStatus === 'generated' && (
                            <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Generated
                            </div>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {peerReviewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {peerReviewExpanded && (
                    <div className="px-4 pb-6">
                        <div className="border-t border-border mb-1" />
                        {peerReviewStatus === 'generating' ? (
                            <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                                <span className="text-xs font-medium">Drafting comprehensive peer review...</span>
                            </div>
                        ) : peerReviewStatus === 'generated' ? (
                            <>

                                {/* Copy Button */}
                                <div className="flex justify-end mb-1">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent transition-colors"
                                    >
                                        {copySuccess ? (
                                            <>
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Review Content */}
                                <div className="w-full text-sm text-muted-foreground space-y-3 bg-card p-4 rounded border">
                                    <p className="font-semibold text-foreground">Summary of Review:</p>
                                    <p>
                                        The manuscript presents a compelling analysis of the proposed methodology.
                                        The experimental design is robust, and the results largely support the conclusions.
                                        However, there are minor inconsistencies in the statistical analysis that need addressing.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Originality:</strong> High. The approach to data verification is novel.</li>
                                        <li><strong>Methodology:</strong> Sound, but requires clarification on sample selection.</li>
                                        <li><strong>Clarity:</strong> Well-written, though the discussion section is slightly verbose.</li>
                                    </ul>
                                    <div className="pt-2">
                                        <span className="font-semibold text-foreground">Recommendation:</span> Accept with Minor Revisions
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-xs text-muted-foreground">
                                Waiting for Pro Search completion...
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Warning Note */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-destructive dark:text-destructive border border-orange-200 dark:border-orange-800/30">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p className="text-xs">Scholar Agent may produce inaccurate results. Please verify all generated content.</p>
            </div>

        </div>
    );
}