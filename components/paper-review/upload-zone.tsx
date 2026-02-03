'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UploadZoneProps } from '@/types/paperReview';

export function UploadZone({
  category,
  accept,
  multiple = false,
  onFilesSelected,
  disabled = false,
  title,
  subtitle
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(multiple ? files : [files[0]]);
      }
    },
    [disabled, multiple, onFilesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return (
    <Card
      className={cn(
        'relative cursor-pointer border-2 border-dashed transition-all hover:border-primary/50',
        isDragging && 'border-primary bg-primary/5',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
        id={`upload-${category}`}
      />
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-full bg-muted p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Drag and drop files here or click to browse</span>
        </div>
        <p className="text-xs text-muted-foreground">Supports PDF and DOCX files</p>
      </div>
    </Card>
  );
}
