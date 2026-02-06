'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Simulate file upload
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setUploadedFile({ name: file.name, size: 'Original File' });
            onFileChange(true);
        }
    };

    const handleClickUpload = () => {
        // Simulate file input click
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setUploadedFile({ name: file.name, size: 'Original File' });
                onFileChange(true);
            }
        };
        input.click();
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFile(null);
        onFileChange(false);
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-all duration-200">
            <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="flex bg-primary/10 text-primary h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                        1
                    </div>
                    <h2 className="text-lg font-semibold text-card-foreground">Upload Documents</h2>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-6 px-4 pb-6 pt-0">
                    {/* Manuscript Category */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Manuscript Category <span className="text-destructive">*</span></label>
                        <Select onValueChange={onCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="original-research">Original Research</SelectItem>
                                <SelectItem value="review-article">Review Article</SelectItem>
                                <SelectItem value="case-report">Case Report</SelectItem>
                                <SelectItem value="letter-to-editor">Letter to Editor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Upload Mock - Visual Replica of UploadZone */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Manuscript <span className="text-destructive">*</span></label>
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={!uploadedFile ? handleClickUpload : undefined}
                            className={cn(
                                "border-input relative flex min-h-[200px] flex-col overflow-hidden rounded-xl border border-dashed p-4 transition-colors",
                                !uploadedFile && "cursor-pointer hover:bg-accent/30 items-center justify-center text-center",
                                uploadedFile && "bg-background"
                            )}
                        >
                            {uploadedFile ? (
                                <div className="flex w-full flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Uploaded Files (1)</h3>
                                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleClickUpload}>
                                            <Upload className="mr-1 h-3 w-3" /> Replace
                                        </Button>
                                    </div>
                                    <div className="relative aspect-[4/3] w-full max-w-[200px] rounded-lg border bg-accent p-2">
                                        <div className="absolute inset-0 bottom-8 flex items-center justify-center bg-muted/30">
                                            <FileText className="h-10 w-10 text-primary" />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
                                            onClick={handleRemoveFile}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-left">
                                            <p className="truncate text-xs font-medium">{uploadedFile.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{uploadedFile.size}</p>
                                        </div>
                                        <div className="absolute left-2 top-2 rounded-full bg-green-500 p-1 text-white">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-full bg-muted p-4 mb-3">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Drag & drop or click to upload</p>
                                        <p className="text-xs text-muted-foreground">Supports .pdf, .docx, .doc</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Reference Articles (Optional) */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Reference Articles</label>
                        <div className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 text-center transition-colors hover:bg-accent/30">
                            <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drop files or click to upload</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Supports PDF & DOCX (max 5MB)</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
