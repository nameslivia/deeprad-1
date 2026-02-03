// Paper review type definitions

export type ManuscriptType =
  | 'original-research'
  | 'review-article'
  | 'case-report'
  | 'letter-to-editor'
  | 'meta-analysis';

export type UploadStatus = 'idle' | 'waiting' | 'uploading' | 'completed' | 'error';

export type FileCategory = 'manuscript' | 'references' | 'prompt' | 'authorGuide';

export type PaperSection =
  | 'abstract'
  | 'introduction'
  | 'methods'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'tables-figures';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  status: UploadStatus;
  progress: number;
  file?: File;
}

export interface SectionContent {
  original: string;
  revised: string;
}

export interface ReviewResults {
  sections: Record<PaperSection, SectionContent>;
  proSearchData: {
    status: 'pending' | 'in-progress' | 'completed';
    progress: number;
    findings: string[];
  };
}

export interface UploadZoneProps {
  category: FileCategory;
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  title: string;
  subtitle?: string;
}

export interface FileItemProps {
  file: UploadedFile;
  onDelete: (id: string) => void;
}

export interface ComparisonPanelProps {
  section: PaperSection;
  original: string;
  revised: string;
  onRegenerate: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}
