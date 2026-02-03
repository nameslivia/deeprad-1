import type { ManuscriptType, PaperSection } from '@/types/paperReview';

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Format manuscript type for display
export function formatManuscriptType(type: ManuscriptType): string {
  const typeMap: Record<ManuscriptType, string> = {
    'original-research': 'Original Research',
    'review-article': 'Review Article',
    'case-report': 'Case Report',
    'letter-to-editor': 'Letter to Editor',
    'meta-analysis': 'Meta-Analysis'
  };
  return typeMap[type];
}

// Format section name for display
export function formatSectionName(section: PaperSection): string {
  const sectionMap: Record<PaperSection, string> = {
    abstract: 'ABSTRACT',
    introduction: 'INTRODUCTION',
    methods: 'METHODS',
    results: 'RESULTS',
    discussion: 'DISCUSSION',
    conclusion: 'CONCLUSION',
    'tables-figures': 'TABLES & FIGURES'
  };
  return sectionMap[section];
}

// Get file icon based on file type
export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'FileText';
  if (ext === 'docx' || ext === 'doc') return 'FileText';
  return 'File';
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
