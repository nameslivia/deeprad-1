'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UploadZone } from '@/components/paper-review/upload-zone';
import { FileItem } from '../file-item';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';

export function Step2_JournalSelection() {
  const { setSelectedJournal, uploadedFiles, addFiles, removeFile } =
    usePaperReviewStore();
  const [searchValue, setSearchValue] = useState('');

  const authorGuideFiles = uploadedFiles.filter((f) => f.category === 'authorGuide');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      setSelectedJournal(value);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          SELECT A JOURNAL OR LOAD THE AUTHOR GUIDE
        </h1>
        <p className="mt-4 text-muted-foreground">
          Choose a journal from our database or upload the author guide for AI policy
          transparency and formatting requirements
        </p>
      </div>

      {/* Journal Search */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Search for a journal</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Type journal name (e.g., Nature, Science, PLOS ONE)..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchValue && (
          <p className="text-sm text-muted-foreground">
            Selected journal: <span className="font-medium">{searchValue}</span>
          </p>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Author Guide Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Upload Author Guide</label>
        <UploadZone
          category="authorGuide"
          accept=".pdf,.docx,.doc"
          multiple={false}
          onFilesSelected={(files) => addFiles(files, 'authorGuide')}
          title="Upload Author Guide"
          subtitle="PDF or DOCX format with journal guidelines"
        />
      </div>

      {/* Uploaded Author Guide */}
      {authorGuideFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Uploaded Author Guide</h3>
          {authorGuideFiles.map((file) => (
            <FileItem key={file.id} file={file} onDelete={removeFile} />
          ))}
        </div>
      )}

      <div className="rounded-lg bg-muted/50 p-4">
        <h3 className="font-medium">About AI Policy Transparency</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Scholia will analyze the journal&apos;s AI policy and ensure your manuscript
          complies with their requirements for AI-assisted writing disclosure and
          formatting guidelines.
        </p>
      </div>
    </div>
  );
}

