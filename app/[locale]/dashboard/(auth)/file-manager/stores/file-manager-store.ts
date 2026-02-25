"use client";

import { create } from "zustand";

export type ViewMode = "grid" | "list";

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

interface FileManagerState {
  // View preferences
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selection
  selectedFileIds: Set<string>;
  toggleFileSelection: (fileId: string) => void;
  selectAllFiles: (fileIds: string[]) => void;
  clearSelection: () => void;
  isFileSelected: (fileId: string) => boolean;

  // Upload tracking
  uploadProgress: Map<string, UploadProgress>;
  addUpload: (fileName: string) => void;
  updateUploadProgress: (fileName: string, progress: number) => void;
  completeUpload: (fileName: string, success: boolean) => void;
  removeUpload: (fileName: string) => void;
  clearUploads: () => void;
}

export const useFileManagerStore = create<FileManagerState>((set, get) => ({
  // View preferences
  viewMode: "list",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Selection
  selectedFileIds: new Set(),
  toggleFileSelection: (fileId) =>
    set((state) => {
      const newSet = new Set(state.selectedFileIds);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return { selectedFileIds: newSet };
    }),
  selectAllFiles: (fileIds) =>
    set({ selectedFileIds: new Set(fileIds) }),
  clearSelection: () => set({ selectedFileIds: new Set() }),
  isFileSelected: (fileId) => get().selectedFileIds.has(fileId),

  // Upload tracking
  uploadProgress: new Map(),
  addUpload: (fileName) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      newMap.set(fileName, {
        fileName,
        progress: 0,
        status: "uploading",
      });
      return { uploadProgress: newMap };
    }),
  updateUploadProgress: (fileName, progress) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      const current = newMap.get(fileName);
      if (current) {
        newMap.set(fileName, { ...current, progress });
      }
      return { uploadProgress: newMap };
    }),
  completeUpload: (fileName, success) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      const current = newMap.get(fileName);
      if (current) {
        newMap.set(fileName, {
          ...current,
          progress: 100,
          status: success ? "success" : "error",
        });
      }
      return { uploadProgress: newMap };
    }),
  removeUpload: (fileName) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      newMap.delete(fileName);
      return { uploadProgress: newMap };
    }),
  clearUploads: () => set({ uploadProgress: new Map() }),
}));
