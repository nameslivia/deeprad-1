'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Upload, X, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ReviewParamsSectionProps {
    onVerdictChange: (value: string) => void;
    onCommentsChange: (value: string) => void;
    isExpanded?: boolean;
    onToggle?: () => void;
}

export function ReviewParamsSection({
    onVerdictChange,
    onCommentsChange,
    isExpanded = true,
    onToggle
}: ReviewParamsSectionProps) {
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [authorGuideFile, setAuthorGuideFile] = useState<{ name: string; size: string } | null>(null);

    const handleClickUpload = () => {
        // Simulate file input click
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setAuthorGuideFile({ name: file.name, size: 'Original File' });
            }
        };
        input.click();
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAuthorGuideFile(null);
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                        2
                    </div>
                    <h2 className="text-lg font-semibold text-card-foreground">Review Parameters</h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-6 px-4 pb-6 pt-0">

                    {/* Verdict */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Verdict <span className="text-destructive">*</span></label>
                        <Select onValueChange={onVerdictChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select verdict..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="accept">Accept</SelectItem>
                                <SelectItem value="accept-minor">Accept with Minor Revision</SelectItem>
                                <SelectItem value="major-revision">Major Revision</SelectItem>
                                <SelectItem value="reject">Reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Concerns & Comments */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Concerns & Comments <span className="text-destructive">*</span></label>
                        <Textarea
                            placeholder="Enter your main concerns and comments for the review..."
                            className="min-h-[120px] resize-y"
                            onChange={(e) => onCommentsChange(e.target.value)}
                        />
                    </div>

                    {/* Advanced Settings */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setAdvancedOpen(!advancedOpen)}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Settings className="h-4 w-4" />
                            Advanced Settings
                            {advancedOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {advancedOpen && (
                            <div className="mt-4 space-y-6 rounded-lg border bg-muted/30 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Review Tone</label>
                                        <Select defaultValue="direct">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="direct">Direct / Critical</SelectItem>
                                                <SelectItem value="constructive">Constructive / Encouraging</SelectItem>
                                                <SelectItem value="formal">Formal / Neutral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Review Result Language</label>
                                        <Select defaultValue="en-US">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en-US">American English</SelectItem>
                                                <SelectItem value="en-GB">British English</SelectItem>
                                                <SelectItem value="zh-TW">Traditional Chinese</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Select Journal or Load Author Guide Here</label>
                                    <Select defaultValue="accept-minor">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Journal..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="accept-minor">Accept with Minor Revision</SelectItem>
                                            {/* Mock items */}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Author Guidelines</label>

                                    {/* Mini Upload Zone */}
                                    <div
                                        onClick={!authorGuideFile ? handleClickUpload : undefined}
                                        className={cn(
                                            "border-input relative flex min-h-[100px] flex-col overflow-hidden rounded-xl border border-dashed p-4 transition-colors",
                                            !authorGuideFile && "cursor-pointer hover:bg-accent/30 items-center justify-center text-center",
                                            authorGuideFile && "bg-background"
                                        )}
                                    >
                                        {authorGuideFile ? (
                                            <div className="flex w-full flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">Uploaded Files (1)</h3>
                                                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleClickUpload}>
                                                        <Upload className="mr-1 h-3 w-3" /> Replace
                                                    </Button>
                                                </div>
                                                <div className="relative flex items-center gap-3 rounded-lg border bg-accent p-3">
                                                    <FileText className="h-8 w-8 text-primary" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate text-sm font-medium">{authorGuideFile.name}</p>
                                                        <p className="text-xs text-muted-foreground">{authorGuideFile.size}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={handleRemoveFile}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <div className="absolute -top-1 -right-1 rounded-full bg-green-500 p-0.5 text-white">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <Button variant="outline" size="sm" className="pointer-events-none">
                                                    <Upload className="mr-2 h-3.5 w-3.5" />
                                                    Add more
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
