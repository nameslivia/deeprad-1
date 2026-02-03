import { create } from 'zustand';
import type {
  ManuscriptType,
  UploadedFile,
  ReviewResults,
  FileCategory,
  UploadStatus
} from '@/types/paperReview';
import { generateId } from '@/lib/paperReviewUtils';

interface PaperReviewStore {
  // State
  currentStep: 1 | 2 | 3 | 4 | 5;
  manuscriptType: ManuscriptType | null;
  uploadedFiles: UploadedFile[];
  selectedJournal: string | null;
  reviewResults: ReviewResults | null;
  isProcessing: boolean;

  // Actions
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setManuscriptType: (type: ManuscriptType) => void;
  addFiles: (files: File[], category: FileCategory) => void;
  removeFile: (id: string) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadStatus) => void;
  setSelectedJournal: (journal: string) => void;
  setReviewResults: (results: ReviewResults) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;

  // Computed
  canProceedToStep2: () => boolean;
  canProceedToStep3: () => boolean;
}

export const usePaperReviewStore = create<PaperReviewStore>((set, get) => ({
  // Initial state
  currentStep: 1,
  manuscriptType: null,
  uploadedFiles: [],
  selectedJournal: null,
  reviewResults: null,
  isProcessing: false,

  // Actions
  setStep: (step) => set({ currentStep: step }),

  setManuscriptType: (type) => set({ manuscriptType: type }),

  addFiles: (files, category) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      category,
      status: 'idle',
      progress: 0,
      file
    }));
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, ...newFiles] }));
  },

  removeFile: (id) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id)
    })),

  updateFileProgress: (id, progress) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((f) =>
        f.id === id ? { ...f, progress } : f
      )
    })),

  updateFileStatus: (id, status) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((f) =>
        f.id === id ? { ...f, status } : f
      )
    })),

  setSelectedJournal: (journal) => set({ selectedJournal: journal }),

  setReviewResults: (results) => set({ reviewResults: results }),

  setProcessing: (processing) => set({ isProcessing: processing }),

  reset: () =>
    set({
      currentStep: 1,
      manuscriptType: null,
      uploadedFiles: [],
      selectedJournal: null,
      reviewResults: null,
      isProcessing: false
    }),

  // Computed
  canProceedToStep2: () => {
    const { uploadedFiles, manuscriptType } = get();
    const hasManuscript = uploadedFiles.some((f) => f.category === 'manuscript');
    return manuscriptType !== null && hasManuscript;
  },

  canProceedToStep3: () => {
    const { uploadedFiles } = get();
    return uploadedFiles.every((f) => f.status === 'completed');
  }
}));
