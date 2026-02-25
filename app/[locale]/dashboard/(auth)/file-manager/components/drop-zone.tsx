"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileManagerStore } from "../stores/file-manager-store";
import { toast } from "sonner";

interface DropZoneProps {
  onFilesDropped?: (files: File[]) => void;
  className?: string;
  children?: React.ReactNode;
}

export function DropZone({ onFilesDropped, className, children }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { addUpload, updateUploadProgress, completeUpload } = useFileManagerStore();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const simulateUpload = useCallback(
    (file: File) => {
      addUpload(file.name);
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          completeUpload(file.name, true);
          setTimeout(() => {
            toast.success(`${file.name} uploaded successfully`);
          }, 500);
        } else {
          updateUploadProgress(file.name, progress);
        }
      }, 300);
    },
    [addUpload, updateUploadProgress, completeUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesDropped?.(files);
        
        // Simulate upload for each file
        files.forEach((file) => {
          simulateUpload(file);
        });

        toast.success(`${files.length} file(s) added to upload queue`);
      }
    },
    [onFilesDropped, simulateUpload]
  );

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-transparent",
        className
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}>
      {children}
      
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-primary">
            <UploadCloud className="h-12 w-12 animate-bounce" />
            <p className="text-lg font-semibold">Drop files here to upload</p>
          </div>
        </div>
      )}
    </div>
  );
}
