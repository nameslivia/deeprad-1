'use client';

import { useEffect, useState } from 'react';
import { Upload, CheckCircle2, Loader2, X, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/paperReviewUtils';
import type { UploadZoneProps, UploadedFile } from '@/types/paperReview';
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileWord } from "react-icons/fa";
import { useFileUpload } from '@/hooks/use-file-upload';

interface ExtendedUploadZoneProps extends UploadZoneProps {
  uploadedFiles?: UploadedFile[];
  onDeleteFile?: (id: string) => void;
  showDragHint?: boolean;
  size?: 'default' | 'small';
}

export function UploadZone({
  category,
  accept,
  multiple = false,
  onFilesSelected,
  disabled = false,
  title,
  subtitle,
  uploadedFiles = [],
  onDeleteFile,
  showDragHint = true,
  size = 'default'
}: ExtendedUploadZoneProps) {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  // useFileUpload Hook
  const [
    { isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop: originalHandleDrop,
      openFileDialog,
      getInputProps
    }
  ] = useFileUpload({
    accept,
    multiple,
    onFilesAdded: (addedFiles) => {
      // convert added files to File type
      const files = addedFiles.map(f => f.file as File);
      onFilesSelected(files);
    }
  });

  // generate preview URLs for image files
  useEffect(() => {
    const newPreviewUrls: Record<string, string> = {};

    uploadedFiles.forEach((file) => {
      if (file.file && file.type.startsWith('image/')) {
        // Reuse existing URL if available
        if (previewUrls[file.id]) {
          newPreviewUrls[file.id] = previewUrls[file.id];
        } else {
          // Only create URL for new files
          newPreviewUrls[file.id] = URL.createObjectURL(file.file);
        }
      }
    });

    // Only update if there are actual changes
    const hasChanges =
      Object.keys(newPreviewUrls).length !== Object.keys(previewUrls).length ||
      Object.keys(newPreviewUrls).some(id => !previewUrls[id]);

    if (hasChanges) {
      setPreviewUrls(newPreviewUrls);
    }

    // Cleanup URLs for removed files
    return () => {
      Object.keys(previewUrls).forEach((id) => {
        if (!newPreviewUrls[id]) {
          URL.revokeObjectURL(previewUrls[id]);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles]);

  const hasFiles = uploadedFiles.length > 0;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={originalHandleDrop}
      data-dragging={isDragging || undefined}
      data-files={hasFiles || undefined}
      className={cn(
        "border-input relative flex min-h-52 flex-col overflow-hidden rounded-xl border border-dashed p-4 transition-colors",
        isDragging && "bg-accent/50",
        !hasFiles && "justify-center cursor-pointer hover:bg-accent/30",
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={() => !disabled && !hasFiles && openFileDialog()}
    >
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label={`Upload ${category} file`}
        disabled={disabled}
      />

      {hasFiles ? (
        <div className="flex w-full flex-col gap-3">
          {/* Header with Add More button */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-medium">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={disabled}
            >
              <Upload className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
              Add more
            </Button>
          </div>

          {/* Grid Layout for Files */}
          <div className={cn(
            "grid gap-3 p-2",
            size === 'small' 
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" // small size
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"  // default size
          )}>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="relative aspect-square rounded-md border bg-accent"
              >
                {/* File Preview */}
                <div className="flex items-center justify-center absolute inset-0 bottom-14 bg-muted/30 rounded-md overflow-hidden">
                  {previewUrls[file.id] ? (
                    // Image preview
                    <img
                      src={previewUrls[file.id]}
                      alt={file.name}
                      className="size-full object-cover"
                    />
                  ) : file.type.includes('pdf') ? (
                    // PDF
                    <FaRegFilePdf className="h-10 w-10 text-red-500" />
                  ) : file.type.includes('doc') ? (
                    // DOC
                    <FaRegFileWord className="h-10 w-10 text-blue-500" />
                  ) : (
                    // Other files
                    <FileText className="h-10 w-10 text-gray-500" />
                  )}
                </div>

                {/* Delete Button */}
                {onDeleteFile && file.status !== 'uploading' && (
                  <Button
                    type="button"
                    onClick={() => onDeleteFile(file.id)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                  >
                    <X className="size-3.5" />
                  </Button>
                )}

                {/* Progress Overlay */}
                {(file.status === 'uploading' || file.status === 'waiting') && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-3 p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="w-full space-y-2">
                      <Progress value={file.progress} className="h-2 w-full" />
                      <span className="text-sm font-medium block text-center">{file.progress}%</span>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                {file.status === 'completed' && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}

                {file.status === 'error' && (
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1.5">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}

                {/* File Info Tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2.5 backdrop-blur-sm">
                  <p className="text-xs font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center gap-3 text-center p-8">
          <div className="rounded-full bg-muted p-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>

          <div>
            <p className="font-medium text-base">
              {isDragging ? 'Drop files here' : title}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {showDragHint && (
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Drag and drop files here or click to browse</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Supports PDF and DOCX files (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}