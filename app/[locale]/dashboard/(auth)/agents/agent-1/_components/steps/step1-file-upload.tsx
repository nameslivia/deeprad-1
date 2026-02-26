'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UploadZone } from '@/components/paper-review/upload-zone';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';
import { uploadFiles } from '@/lib/api/paperReviewApi';
import type { ManuscriptType } from '@/types/paperReview';
import { useCallback, useState } from 'react';

export function Step1_FileUpload() {
  const {
    manuscriptType,
    setManuscriptType,
    setSelectedJournal,
    uploadedFiles,
    addFiles,
    removeFile,
    updateFileProgress,
    updateFileStatus
  } = usePaperReviewStore();

  const [searchValue, setSearchValue] = useState('');

  const handleFilesSelected = useCallback(
    (files: File[], category: 'manuscript' | 'references' | 'authorGuide') => {
      addFiles(files, category);

      setTimeout(() => {
        const currentFiles = usePaperReviewStore.getState().uploadedFiles;
        const filesToUpload = currentFiles.filter(f => f.status === 'idle');
        if (filesToUpload.length > 0) {
          uploadFiles(filesToUpload, updateFileProgress, updateFileStatus);
        }
      }, 100);
    },
    [addFiles, updateFileProgress, updateFileStatus]
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      setSelectedJournal(value);
    }
  };

  const manuscriptFiles = uploadedFiles.filter((f) => f.category === 'manuscript');
  const referenceFiles = uploadedFiles.filter((f) => f.category === 'references');
  const authorGuideFiles = uploadedFiles.filter((f) => f.category === 'authorGuide');

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
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

      {/* Upload Zones */}
      <div className="grid gap-6 md:grid-cols-2">
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
            uploadedFiles={referenceFiles}
            onDeleteFile={removeFile}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Select Journal</span>
        </div>
      </div>

      {/* Journal Search */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Search for a journal</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Type journal name (e.g., Nature, Science, PLOS ONE)..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchValue && (
          <p className="text-sm text-muted-foreground">
            Selected journal: <span className="font-medium">{searchValue}</span>
          </p>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Author Guide Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Upload Author Guide</label>
        <div className="mx-auto max-w-md">
          <UploadZone
            category="authorGuide"
            accept=".pdf,.docx,.doc"
            multiple={false}
            onFilesSelected={(files) => handleFilesSelected(files, 'authorGuide')}
            title="Upload Author Guide"
            uploadedFiles={authorGuideFiles}
            onDeleteFile={removeFile}
          />
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="font-medium">About AI Policy Transparency</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Deeprad will analyze the journal&apos;s AI policy and ensure your manuscript
          complies with their requirements for AI-assisted writing disclosure and
          formatting guidelines.
        </p>
      </div>
    </div>
  );
}
