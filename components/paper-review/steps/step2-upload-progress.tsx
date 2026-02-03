'use client';

import { useEffect } from 'react';
import { FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';
import { uploadFiles } from '@/lib/api/paperReviewApi';
import { formatFileSize } from '@/lib/paperReviewUtils';

export function Step2_UploadProgress() {
  const {
    uploadedFiles,
    updateFileProgress,
    updateFileStatus,
    setStep,
    canProceedToStep3
  } = usePaperReviewStore();

  useEffect(() => {
    // Start upload simulation when component mounts
    const filesToUpload = uploadedFiles.filter((f) => f.status === 'idle');

    if (filesToUpload.length > 0) {
      uploadFiles(filesToUpload, updateFileProgress, updateFileStatus);
    }
  }, []); // Only run once on mount

  const completedCount = uploadedFiles.filter((f) => f.status === 'completed').length;
  const totalCount = uploadedFiles.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Waiting
          </Badge>
        );
      case 'uploading':
        return (
          <Badge className="gap-1 bg-blue-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Upload completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">UPLOADING FILES</h1>
        <p className="mt-2 text-muted-foreground">
          Please wait while we upload your files
        </p>
      </div>

      <div className="space-y-4">
        {uploadedFiles.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  {getStatusBadge(file.status)}
                </div>

                {(file.status === 'uploading' || file.status === 'waiting') && (
                  <div className="space-y-2">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-right text-xs text-muted-foreground">
                      {file.progress}%
                    </p>
                  </div>
                )}

                {file.status === 'completed' && (
                  <Progress value={100} className="h-2 [&>*]:bg-green-500" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Uploading files... ({completedCount}/{totalCount} completed)
        </p>
      </div>
    </div>
  );
}
