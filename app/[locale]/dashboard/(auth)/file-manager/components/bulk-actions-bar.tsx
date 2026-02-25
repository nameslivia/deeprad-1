"use client";

import { Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileManagerStore } from "../stores/file-manager-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BulkActionsBarProps {
  onDownloadSelected?: () => void;
  onDeleteSelected?: () => void;
  className?: string;
}

export function BulkActionsBar({
  onDownloadSelected,
  onDeleteSelected,
  className,
}: BulkActionsBarProps) {
  const { selectedFileIds, clearSelection } = useFileManagerStore();
  const selectedCount = selectedFileIds.size;

  if (selectedCount === 0) return null;

  const handleDownload = () => {
    onDownloadSelected?.();
    toast.success(`Preparing ${selectedCount} file(s) for download...`);
  };

  const handleDelete = () => {
    onDeleteSelected?.();
    toast.success(`${selectedCount} file(s) deleted`);
    clearSelection();
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4",
        className
      )}
      style={{ animation: "slide-up 300ms ease-out" }}>
      <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {selectedCount}
          </span>
          <span>selected</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button
          size="sm"
          variant="ghost"
          onClick={clearSelection}
          className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
