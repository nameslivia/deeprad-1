'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Check, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePaperReviewStore } from '@/lib/stores/paperReviewStore';
import { getReviewResults, simulateProSearch, exportPDF, exportWord } from '@/lib/api/paperReviewApi';
import { formatSectionName } from '@/lib/paperReviewUtils';
import type { PaperSection } from '@/types/paperReview';
import { toast } from 'sonner';
import { GrDocumentPdf } from "react-icons/gr";
import { FaFileWord } from "react-icons/fa";

export function Step4_AIReviewResults() {
  const { reviewResults, setReviewResults } = usePaperReviewStore();
  const [proSearchOpen, setProSearchOpen] = useState(true);
  const [proSearchProgress, setProSearchProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<PaperSection>('abstract');
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [tabsEnabled, setTabsEnabled] = useState(false);
  const [canGetResults, setCanGetResults] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [sectionContentGenerated, setSectionContentGenerated] = useState<Record<PaperSection, boolean>>({
    abstract: false,
    introduction: false,
    methods: false,
    results: false,
    discussion: false,
    conclusion: false,
    'tables-figures': false
  });
  const [currentGeneratingSection, setCurrentGeneratingSection] = useState<PaperSection | null>(null);

  const sections: PaperSection[] = [
    'abstract',
    'introduction',
    'methods',
    'results',
    'discussion',
    'conclusion',
    'tables-figures'
  ];

  useEffect(() => {
    // Start Pro Search simulation on mount
    simulateProSearch(
      (progress) => setProSearchProgress(progress),
      () => {
        // Enable tabs immediately after Pro Search completes
        setTabsEnabled(true);
      }
    );

    // Enable "Get Your Review Result" button after 3 minutes
    const timer = setTimeout(() => {
      setCanGetResults(true);
    }, 180000); // 3 minutes = 180000ms

    return () => clearTimeout(timer);
  }, []);

  // Auto-load review results when tabs are enabled
  useEffect(() => {
    if (tabsEnabled && !reviewResults) {
      handleGetResults();
    }
  }, [tabsEnabled, reviewResults]);

  // Simulate section content generation
  useEffect(() => {
    if (!reviewResults) return;

    // Start generating content for sections sequentially
    let currentIndex = 0;
    
    const generateNextSection = () => {
      if (currentIndex >= sections.length) {
        setCurrentGeneratingSection(null);
        return;
      }

      const section = sections[currentIndex];
      setCurrentGeneratingSection(section);

      // Simulate generation time (random between 30-60 seconds per section)
      const generationTime = 30000 + Math.random() * 30000;
      
      setTimeout(() => {
        setSectionContentGenerated(prev => ({
          ...prev,
          [section]: true
        }));
        currentIndex++;
        generateNextSection();
      }, generationTime);
    };

    generateNextSection();
  }, [reviewResults]);

  const handleGetResults = async () => {
    setIsLoadingResults(true);
    try {
      const results = await getReviewResults('mock-id');
      setReviewResults(results);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const blob = await exportPDF('mock-results-id');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `review-simulation-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF Generated', {
        description: 'Your review simulation has been downloaded.'
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Failed to generate PDF. Please try again.'
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    try {
      const blob = await exportWord('mock-results-id');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revised-manuscript-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Word Document Generated', {
        description: 'Your revised manuscript has been downloaded.'
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'Failed to generate Word document. Please try again.'
      });
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleRegenerateSection = (section: PaperSection) => {
    // TODO: Implement regenerate logic
    console.log('Regenerating section:', section);
  };

  const handleAcceptChanges = (section: PaperSection) => {
    // TODO: Implement accept changes logic
    console.log('Accepting changes for section:', section);
  };

  const handleRejectChanges = (section: PaperSection) => {
    // TODO: Implement reject changes logic
    console.log('Rejecting changes for section:', section);
  };

  const proSearchCompleted = proSearchProgress === 100;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">COMMENTS AND SUGGESTIONS ON YOUR WORK</h1>
        <p className="mt-2 text-muted-foreground">
          AI-powered review results and manuscript improvements
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={handleExportPDF}
          disabled={!canGetResults || isExportingPDF}
          size="lg"
        >
          {isExportingPDF ? (
            'Generating PDF...'
          ) : (
            <>
              <GrDocumentPdf className="mr-2 h-4 w-4" />
              Get Your Review Result
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          disabled={!canGetResults || isExportingWord}
          onClick={handleExportWord}
        >
          {isExportingWord ? (
            'Generating Word...'
          ) : (
            <>
              <FaFileWord className="mr-2 h-4 w-4" />
              Get Your Revised Manuscript
            </>
          )}
        </Button>
      </div>

      {/* Pro Search Collapsible */}
      <Collapsible open={proSearchOpen} onOpenChange={setProSearchOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="font-semibold">Pro Search</span>
            <Badge variant={proSearchCompleted ? 'default' : 'secondary'}>
              {proSearchCompleted ? 'Completed' : 'In Progress'}
            </Badge>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Searching literature...</span>
              <span className="font-medium">{proSearchProgress}%</span>
            </div>
            <Progress value={proSearchProgress} />
          </div>
          {reviewResults && (
            <ul className="space-y-2 text-sm">
              {reviewResults.proSearchData.findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Section Tabs and Comparison */}
      {(
        <Tabs
          value={activeSection}
          onValueChange={(value) => setActiveSection(value as PaperSection)}
          className="space-y-4"
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {sections.map((section) => {
              const isGenerating = currentGeneratingSection === section;
              const isGenerated = sectionContentGenerated[section];
              const isEnabled = tabsEnabled;

              return (
                <TabsTrigger
                  key={section}
                  value={section}
                  disabled={!isEnabled}
                  className="whitespace-nowrap relative"
                >
                  {formatSectionName(section)}
                  {isGenerating && (
                    <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  )}
                  {isGenerated && (
                    <Check className="ml-2 h-3 w-3 text-green-500" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section} value={section} className="space-y-4">
              {!sectionContentGenerated[section] ? (
                <div className="flex items-center justify-center rounded-lg border p-12">
                  <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">
                      {currentGeneratingSection === section
                        ? 'Generating content...'
                        : 'Waiting to generate...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Original Column */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Original</h3>
                    </div>
                    <div className="rounded-lg border p-4">
                      <ComparisonText
                        text={reviewResults.sections[section].original}
                        type="original"
                      />
                    </div>
                  </div>

                  {/* Revised Column */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Revised (editable)</h3>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRegenerateSection(section)}
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAcceptChanges(section)}
                          title="Accept changes"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectChanges(section)}
                          title="Reject changes"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <ComparisonText
                        text={reviewResults.sections[section].revised}
                        type="revised"
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

// Helper component for highlighting text differences
function ComparisonText({ text, type }: { text: string; type: 'original' | 'revised' }) {
  // Parse the text with markup tags: <del>, <mod>, <add>
  const parseText = (str: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regex to match markup tags
    const regex = /<(del|mod|add)>(.*?)<\/\1>/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${key++}`}>{str.substring(currentIndex, match.index)}</span>
        );
      }

      // Add styled text based on tag type
      const tag = match[1];
      const content = match[2];

      if (tag === 'del' && type === 'original') {
        // Red strikethrough for deletions (only in original)
        parts.push(
          <span
            key={`del-${key++}`}
            className="bg-red-100 text-red-700 line-through dark:bg-red-900/30 dark:text-red-300"
          >
            {content}
          </span>
        );
      } else if (tag === 'mod' && type === 'original') {
        // Yellow highlight for modifications (only in original)
        parts.push(
          <span
            key={`mod-${key++}`}
            className="bg-yellow-100 dark:bg-yellow-900/30"
          >
            {content}
          </span>
        );
      } else if (tag === 'add' && type === 'revised') {
        // Green highlight for additions (only in revised)
        parts.push(
          <span
            key={`add-${key++}`}
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
          >
            {content}
          </span>
        );
      } else {
        // Just show the content without styling if tag doesn't match context
        parts.push(<span key={`plain-${key++}`}>{content}</span>);
      }

      currentIndex = regex.lastIndex;
    }

    // Add remaining text
    if (currentIndex < str.length) {
      parts.push(<span key={`text-${key++}`}>{str.substring(currentIndex)}</span>);
    }

    return parts;
  };

  return <p className="text-sm leading-relaxed whitespace-pre-wrap">{parseText(text)}</p>;
}