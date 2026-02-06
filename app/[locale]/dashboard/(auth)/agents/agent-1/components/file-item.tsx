'use client';

import { FileText, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/paperReviewUtils';
import type { FileItemProps } from '@/types/paperReview';

export function FileItem({ file, onDelete }: FileItemProps) {
  return (
    <Card className="p-3 hover:shadow-md transition-all duration-200 hover:border-primary/50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(file.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

