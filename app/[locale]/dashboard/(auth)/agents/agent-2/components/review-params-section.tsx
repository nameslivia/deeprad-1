'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Settings, CheckCircle2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadZone } from '@/components/paper-review/upload-zone';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;
    status: 'idle' | 'uploading' | 'completed' | 'error';
    progress: number;
    category: 'authorGuide';
}

interface ReviewParamsSectionProps {
    onVerdictChange: (value: string) => void;
    onCommentsChange: (value: string) => void;
    isExpanded?: boolean;
    onToggle?: () => void;
    isReady?: boolean;
}

export function ReviewParamsSection({
    onVerdictChange,
    onCommentsChange,
    isExpanded = true,
    onToggle,
    isReady = false
}: ReviewParamsSectionProps) {
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleFilesSelected = useCallback((files: File[], category: 'authorGuide') => {
        const newFiles: UploadedFile[] = files.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            status: 'completed' as const,
            progress: 100,
            category: category
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
    }, []);

    const handleRemoveFile = useCallback((id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    const authorGuidelineFiles = uploadedFiles.filter(f => f.category === 'authorGuide');

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex bg-primary text-primary-foreground h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                        2
                    </div>
                    <Settings className="h-5 w-5" />
                    <h2 className="text-card-foreground">Review Parameters</h2>
                </div>

                <div className="flex items-center gap-2">
                    {isReady && (
                        <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                        </div>
                    )}
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
                            <SelectTrigger className="w-full">
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
                            placeholder="Share comments on the manuscript's originality, methods, clarity, and suggestions for improvement..."
                            className="min-h-30 resize-y"
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
                            <Settings2 className="h-4 w-4" />
                            Advanced Settings
                            {advancedOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {advancedOpen && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Review Tone</label>
                                        <Select defaultValue="direct">
                                            <SelectTrigger className="w-full">
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
                                            <SelectTrigger className="w-full">
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
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Select Journal or Load Author Guide Here</label>
                        <Select defaultValue="accept-minor">
                            <SelectTrigger className="w-full">
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
                        <UploadZone
                            category="authorGuide"
                            accept=".pdf,.docx,.doc"
                            multiple={false}
                            onFilesSelected={(files) => handleFilesSelected(files, 'authorGuide')}
                            title="Upload Author Guidelines"
                            subtitle=""
                            uploadedFiles={authorGuidelineFiles}
                            onDeleteFile={handleRemoveFile}
                            showDragHint={false}
                            size="small"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
