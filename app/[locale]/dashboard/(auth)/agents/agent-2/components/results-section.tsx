'use client';

import { Check, Search, FileText, Loader2, AlertTriangle, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResultsSectionProps {
    status: 'idle' | 'generating' | 'complete';
}

export function ResultsSection({ status = 'idle' }: ResultsSectionProps) {

    // Mock data for Pro Search
    const proSearchSteps = [
        { label: 'Analyzing manuscript structure and formatting', completed: true },
        { label: 'Identifying research methodology and data', completed: true },
        { label: 'Cross-referencing related literature databases', completed: true },
        { label: 'Analysis complete. Ready to generate review', completed: true },
    ];

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
                    <div className="flex items-center text-xs font-medium text-teal-500">
                        <Check className="mr-1 h-3 w-3" /> Complete
                        <Settings className="ml-2 h-3 w-3 text-muted-foreground cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-2 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg">
                    {proSearchSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                            <Check className="h-3.5 w-3.5 text-teal-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground font-medium">{step.label}</span>
                        </div>
                    ))}
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
                    {status === 'generating' && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 pointer-events-none">
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generating
                        </Badge>
                    )}
                    <Settings className="h-3 w-3 text-muted-foreground cursor-pointer" />
                </div>

                <div className="min-h-[120px] flex items-center justify-center bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border-dashed border border-orange-200 dark:border-orange-800">
                    {status === 'generating' ? (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                            <span className="text-xs font-medium">Generating peer review report...</span>
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground">
                            {/* Placeholder for before generation or after */}
                            Ready to generate
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
