"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileImage, File as FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    type: string;
    icon: string;
    size: string;
    date: string;
    owner: {
      name: string;
      avatar?: string;
    };
  } | null;
  onDownload?: () => void;
}

export function FilePreviewModal({
  open,
  onOpenChange,
  file,
  onDownload,
}: FilePreviewModalProps) {
  if (!file) return null;

  const getFileTypeIcon = (icon: string) => {
    switch (icon) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "word":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "figma":
        return <FileIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <FileImage className="h-8 w-8 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (icon: string) => {
    switch (icon) {
      case "pdf":
        return <Badge variant="destructive">PDF</Badge>;
      case "word":
        return <Badge variant="info">DOC</Badge>;
      case "figma":
        return <Badge className="bg-purple-500 text-white">FIGMA</Badge>;
      default:
        return <Badge variant="outline">FILE</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">{file.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-background">
              {getFileTypeIcon(file.icon)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{file.name}</span>
                {getFileTypeBadge(file.icon)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Size:</span> {file.size}
                </div>
                <div>
                  <span className="font-medium">Modified:</span> {file.date}
                </div>
                <div>
                  <span className="font-medium">Owner:</span> {file.owner.name}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {file.icon.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/20">
            <div className="text-center">
              {getFileTypeIcon(file.icon)}
              <p className="mt-4 text-sm text-muted-foreground">
                Preview not available for this file type
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Download the file to view its contents
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={onDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
