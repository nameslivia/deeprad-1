'use client';

import { Check, Search, FileText, Loader2, AlertTriangle, Settings, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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


    return (
        <div className="space-y-6">
            {/* Pro Search Card */}
            <Card className="p-4 border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                            <Search className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Pro Search</h3>
                            <p className="text-xs text-muted-foreground">Intelligent analysis & retrieval</p>
                        </div>
                    </div>
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
                </div>

                <div className="space-y-2 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg">
                    {steps.map((step, index) => {
                        const isCompleted = index < completedSteps;
                        const isCurrent = index === completedSteps && proSearchStatus === 'running';

                        return (
                            <div key={index} className="flex items-start gap-2.5 transition-all duration-300">
                                {isCompleted ? (
                                    <Check className="h-3.5 w-3.5 text-teal-500 mt-0.5 shrink-0" />
                                ) : isCurrent ? (
                                    <Loader2 className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0 animate-spin" />
                                ) : (
                                    <div className="h-3.5 w-3.5 mt-0.5 shrink-0 rounded-full border border-muted-foreground/30" />
                                )}
                                <span className={`text-xs font-medium ${isCompleted ? 'text-muted-foreground' : isCurrent ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Peer Review Result Card */}
            <Card className="p-4 border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Peer Review Result</h3>
                            <p className="text-xs text-muted-foreground">Generated review report</p>
                        </div>
                    </div>
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
                </div>

                <div className="min-h-[120px] flex items-center justify-center bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border-dashed border border-orange-200 dark:border-orange-800 p-4">
                    {peerReviewStatus === 'generating' ? (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
                            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                            <span className="text-xs font-medium">Drafting comprehensive peer review...</span>
                        </div>
                    ) : peerReviewStatus === 'generated' ? (
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
                    ) : (
                        <div className="text-xs text-muted-foreground">
                            Waiting for Pro Search completion...
                        </div>
                    )}
                </div>
            </Card>

            {/* Warning Note */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-100/50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/30">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p className="text-xs">Scholar Agent may produce inaccurate results. Please verify all generated content.</p>
            </div>

        </div>
    );
}
