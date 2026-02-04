'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UploadZone } from '../upload-zone';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';
import { uploadFiles } from '@/lib/api/paperReviewApi';
import type { ManuscriptType } from '@/types/paperReview';
import { useCallback } from 'react';

export function Step1_FileUpload() {
  const {
    manuscriptType,
    setManuscriptType,
    uploadedFiles,
    addFiles,
    removeFile,
    updateFileProgress,
    updateFileStatus
  } = usePaperReviewStore();

  const handleFilesSelected = useCallback(
    (files: File[], category: 'manuscript' | 'references' | 'prompt') => {
      const newFileIds: string[] = [];
      
      // Add files to store
      addFiles(files, category);
      
      // Start uploading files
      setTimeout(() => {
        // Get the latest uploadedFiles
        const currentFiles = usePaperReviewStore.getState().uploadedFiles;
        const filesToUpload = currentFiles.filter(f => f.status === 'idle');
        if (filesToUpload.length > 0) {
          uploadFiles(filesToUpload, updateFileProgress, updateFileStatus);
        }
      }, 100); // Give a little time for the store to update
    },
    [addFiles, updateFileProgress, updateFileStatus]
  );        

  const manuscriptFiles = uploadedFiles.filter((f) => f.category === 'manuscript');
  const referenceFiles = uploadedFiles.filter((f) => f.category === 'references');
  const promptFiles = uploadedFiles.filter((f) => f.category === 'prompt');

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Upload Your Manuscript</h1>
        <p className="mt-2 text-muted-foreground">
          Select the manuscript type and upload your files
        </p>
      </div>

      {/* Manuscript Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Manuscript Categories</label>
        <Select
          value={manuscriptType || undefined}
          onValueChange={(value) => setManuscriptType(value as ManuscriptType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category..." />
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

      {/* Upload Zones with embedded file lists */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Manuscript File */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Manuscript File</label>
            <span className="text-xs text-destructive">Required</span>
          </div>
          <UploadZone
            category="manuscript"
            accept=".pdf,.docx,.doc"
            multiple={false}
            onFilesSelected={(files) => handleFilesSelected(files, 'manuscript')}
            title="Upload Manuscript"
            subtitle="PDF or DOCX format"
            uploadedFiles={manuscriptFiles}
            onDeleteFile={removeFile}
          />
        </div>

        {/* Reference Articles */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Reference Articles</label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <UploadZone
            category="references"
            accept=".pdf,.docx,.doc"
            multiple={true}
            onFilesSelected={(files) => handleFilesSelected(files, 'references')}
            title="Upload References"
            subtitle="Multiple files allowed"
            uploadedFiles={referenceFiles}
            onDeleteFile={removeFile}
          />
        </div>

        {/* Prompt File */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Prompt File</label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <UploadZone
            category="prompt"
            accept=".pdf,.docx,.doc,.txt"
            multiple={false}
            onFilesSelected={(files) => handleFilesSelected(files, 'prompt')}
            title="Upload Prompt"
            subtitle="Custom review instructions"
            uploadedFiles={promptFiles}
            onDeleteFile={removeFile}
          />
        </div>
      </div>
    </div>
  );
}