'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UploadZone } from '../upload-zone';
import { FileItem } from '../file-item';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';
import { formatManuscriptType } from '@/lib/paperReviewUtils';
import type { ManuscriptType } from '@/types/paperReview';

export function Step1_FileUpload() {
  const {
    manuscriptType,
    setManuscriptType,
    uploadedFiles,
    addFiles,
    removeFile
  } = usePaperReviewStore();

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

      {/* Upload Zones */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Manuscript File</label>
            <span className="text-xs text-destructive">Required</span>
          </div>
          <UploadZone
            category="manuscript"
            accept=".pdf,.docx,.doc"
            multiple={false}
            onFilesSelected={(files) => addFiles(files, 'manuscript')}
            title="Upload Manuscript"
            subtitle="PDF or DOCX format"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Reference Articles</label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <UploadZone
            category="references"
            accept=".pdf,.docx,.doc"
            multiple={true}
            onFilesSelected={(files) => addFiles(files, 'references')}
            title="Upload References"
            subtitle="Multiple files allowed"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium">Prompt File</label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <UploadZone
            category="prompt"
            accept=".pdf,.docx,.doc,.txt"
            multiple={false}
            onFilesSelected={(files) => addFiles(files, 'prompt')}
            title="Upload Prompt"
            subtitle="Custom review instructions"
          />
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Uploaded Files</h3>
          <div className="space-y-3">
            {manuscriptFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Manuscript
                </p>
                {manuscriptFiles.map((file) => (
                  <FileItem key={file.id} file={file} onDelete={removeFile} />
                ))}
              </div>
            )}
            {referenceFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  References
                </p>
                {referenceFiles.map((file) => (
                  <FileItem key={file.id} file={file} onDelete={removeFile} />
                ))}
              </div>
            )}
            {promptFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Prompt
                </p>
                {promptFiles.map((file) => (
                  <FileItem key={file.id} file={file} onDelete={removeFile} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
