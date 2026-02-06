'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UploadZone } from '@/components/paper-review/upload-zone';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;
    status: 'idle' | 'uploading' | 'completed' | 'error';
    progress: number;
    category: 'manuscript' | 'references' | 'prompt';
}

interface UploadSectionProps {
    onCategoryChange: (value: string) => void;
    onFileChange: (hasFile: boolean) => void;
    isExpanded?: boolean;
    onToggle?: () => void;
}

export function UploadSection({
    onCategoryChange,
    onFileChange,
    isExpanded = true,
    onToggle
}: UploadSectionProps) {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [manuscriptCategory, setManuscriptCategory] = useState('');

    const handleFilesSelected = useCallback((files: File[], category: 'manuscript' | 'references' | 'prompt') => {
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

        // Notify parent if manuscript file is uploaded
        if (category === 'manuscript') {
            onFileChange(true);
        }
    }, [onFileChange]);

    const handleRemoveFile = useCallback((id: string) => {
        setUploadedFiles(prev => {
            const newFiles = prev.filter(f => f.id !== id);
            // Check if manuscript file still exists
            const hasManuscript = newFiles.some(f => f.category === 'manuscript');
            
            // Delay the call to avoid updating parent in render
            setTimeout(() => {
                onFileChange(hasManuscript);
            }, 0);
            
            return newFiles;
        });
    }, [onFileChange]);

    const handleCategoryChange = (value: string) => {
        setManuscriptCategory(value);
        onCategoryChange(value);
    };

    const manuscriptFiles = uploadedFiles.filter(f => f.category === 'manuscript');
    const referenceFiles = uploadedFiles.filter(f => f.category === 'references');

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex bg-primary text-primary-foreground h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                        1
                    </div>             
                    <Upload className="h-5 w-5" />
                    <h2 className="text-card-foreground">Upload Documents</h2>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-6 px-4 pb-6 pt-0">
                    {/* Manuscript Category */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Manuscript Category </label>
                        <Select value={manuscriptCategory || undefined} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="original-research">Original Research</SelectItem>
                                <SelectItem value="review-article">Review Article</SelectItem>
                                <SelectItem value="case-report">Case Report</SelectItem>
                                <SelectItem value="letter-to-editor">Letter to Editor</SelectItem>
                                <SelectItem value="meta-analysis">Meta-Analysis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Manuscript File Upload */}
                    <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                            <label className="text-sm font-medium">Manuscript <span className="text-destructive">*</span></label>
                        </div>
                        <UploadZone
                            category="manuscript"
                            accept=".pdf,.docx,.doc"
                            multiple={false}
                            onFilesSelected={(files) => handleFilesSelected(files, 'manuscript')}
                            title="Drop files or click to upload"
                            subtitle=""
                            uploadedFiles={manuscriptFiles}
                            onDeleteFile={handleRemoveFile}
                            showDragHint={false}
                            size="small"
                        />
                    </div>

                    {/* Reference Articles */}
                    <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                            <label className="text-sm font-medium">Reference Articles</label>
                        </div>
                        <UploadZone
                            category="references"
                            accept=".pdf,.docx,.doc"
                            multiple={true}
                            onFilesSelected={(files) => handleFilesSelected(files, 'references')}
                            title="Upload References"
                            subtitle=""
                            uploadedFiles={referenceFiles}
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
