import type { UploadedFile, ReviewResults, PaperSection } from '@/types/paperReview';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for review results with markup for changes
// Format: <del>deleted text</del>, <mod>modified text</mod>, <add>added text</add>
const mockSectionContent: Record<PaperSection, { original: string; revised: string }> = {
  abstract: {
    original:
      'Background: This study investigates the effects of <del>novel</del><mod>therapeutic</mod> approaches in treating chronic conditions. Methods: We conducted a <del>randomized controlled trial</del> with 200 patients over 12 months. Results: Significant improvements were observed in patient outcomes with minimal adverse effects. Conclusion: The <del>novel</del> approach shows <mod>promise</mod> for clinical application.',
    revised:
      'Background: This study investigates the effects of <add>innovative</add> therapeutic approaches in treating chronic conditions<add>, addressing a critical gap in current treatment paradigms</add>. Methods: We conducted a <add>rigorous</add> randomized controlled trial with 200 patients over 12 months<add>, employing standardized assessment protocols</add>. Results: Significant improvements were observed in patient outcomes <add>(p < 0.001)</add> with minimal adverse effects<add>, demonstrating both efficacy and safety</add>. Conclusion: The <add>innovative</add> approach shows <add>substantial</add> promise for clinical application <add>and warrants further investigation in diverse patient populations</add>.'
  },
  introduction: {
    original:
      'Chronic conditions affect millions of people worldwide. Current treatments have <del>limitations</del>. This study aims to evaluate a <del>new</del> approach.',
    revised:
      'Chronic conditions affect millions of people worldwide<add>, imposing significant burdens on healthcare systems and patients\' quality of life</add>. Current treatments<add>, while beneficial,</add> have <add>notable</add> limitations <add>including side effects, compliance issues, and variable efficacy across patient populations</add>. This study aims to <add>systematically</add> evaluate a <add>novel therapeutic</add> approach <add>that addresses these limitations through targeted intervention strategies</add>.'
  },
  methods: {
    original:
      'We recruited 200 patients from three <del>hospitals</del>. Patients were randomized into treatment and control groups. Follow-up assessments were conducted monthly.',
    revised:
      'We recruited 200 patients from three <add>tertiary care</add> hospitals <add>between January 2022 and December 2023, following institutional review board approval</add>. Patients <add>meeting predefined inclusion criteria</add> were randomized into treatment and control groups <add>using computer-generated random sequences</add>. Follow-up assessments were conducted monthly <add>using validated measurement instruments, with blinded assessors to minimize bias</add>.'
  },
  results: {
    original:
      '<del>Treatment</del> group showed <mod>better</mod> outcomes. Side effects were minimal. Patient satisfaction was <mod>high</mod>.',
    revised:
      '<add>The treatment</add> group <add>demonstrated significantly</add> better outcomes <add>compared to controls (mean difference: 23.5 points, 95% CI: 18.2-28.8, p < 0.001)</add>. Side effects were minimal<add>, with only 3.2% of patients reporting mild adverse events</add>. Patient satisfaction <add>scores were notably</add> high <add>(mean: 8.7/10, SD: 1.2), indicating strong treatment acceptability</add>.'
  },
  discussion: {
    original:
      'Our findings <del>suggest</del> that the <del>new</del> treatment is effective. This aligns with <mod>previous research</mod>. Future studies should examine long-term effects.',
    revised:
      'Our findings <add>provide compelling evidence</add> that the <add>novel</add> treatment <add>approach is highly</add> effective <add>in improving patient outcomes</add>. This aligns with <add>and extends</add> previous research <add>by demonstrating both short-term efficacy and excellent safety profiles. The observed improvements can be attributed to the treatment\'s targeted mechanism of action</add>. Future studies should examine long-term effects <add>beyond 12 months and evaluate generalizability across diverse patient populations and healthcare settings</add>.'
  },
  conclusion: {
    original:
      'The study <del>demonstrates</del> that the <del>new</del> treatment is safe and effective. It <mod>could be used</mod> in clinical practice.',
    revised:
      'The study <add>provides robust evidence demonstrating</add> that the <add>novel</add> treatment <add>approach is both</add> safe and <add>highly</add> effective <add>for treating chronic conditions. Based on these findings, the intervention shows considerable promise for integration</add> into clinical practice<add>, pending validation through larger-scale, multicenter trials. Healthcare providers should consider this approach as a viable treatment option for appropriate patient populations</add>.'
  },
  'tables-figures': {
    original: 'Table 1 <mod>shows</mod> baseline characteristics. Figure 1 <mod>displays</mod> outcome trends.',
    revised:
      'Table 1 <add>presents comprehensive</add> baseline characteristics <add>of study participants, demonstrating successful randomization with no significant between-group differences</add>. Figure 1 <add>illustrates</add> outcome trends <add>over the 12-month study period, clearly depicting the divergence between treatment and control groups beginning at month 3 and progressively increasing through study completion</add>.'
  }
};

// Upload files with progress simulation
export async function uploadFiles(
  files: UploadedFile[],
  onProgress: (fileId: string, progress: number) => void,
  onStatusChange: (fileId: string, status: 'waiting' | 'uploading' | 'completed' | 'error') => void
): Promise<{ success: boolean; fileIds: string[] }> {
  const fileIds: string[] = [];

  for (const file of files) {
    // Set to waiting
    onStatusChange(file.id, 'waiting');
    await delay(500);

    // Start uploading
    onStatusChange(file.id, 'uploading');

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      onProgress(file.id, progress);
      await delay(200);
    }

    // Mark as completed
    onStatusChange(file.id, 'completed');
    fileIds.push(file.id);
  }

  return { success: true, fileIds };
}

// Process manuscript and generate review results
export async function processManuscript(
  manuscriptId: string,
  references: string[],
  journal?: string
): Promise<{ success: boolean; resultsId: string }> {
  // Simulate processing delay
  await delay(2000);

  return {
    success: true,
    resultsId: `review-${Date.now()}`
  };
}

// Get review results
export async function getReviewResults(resultsId: string): Promise<ReviewResults> {
  // Simulate API delay
  await delay(1000);

  return {
    sections: mockSectionContent,
    proSearchData: {
      status: 'completed',
      progress: 100,
      findings: [
        'Found 15 relevant references in PubMed',
        'Identified 3 similar studies with comparable methodologies',
        'Detected potential improvements in methodology section',
        'Suggested enhancements for discussion and conclusion sections'
      ]
    }
  };
}

// Simulate Pro Search progress
export async function simulateProSearch(
  onProgress: (progress: number) => void,
  onComplete: () => void
): Promise<void> {
  // Simulate search progress
  for (let progress = 0; progress <= 100; progress += 5) {
    onProgress(progress);
    await delay(300);
  }
  onComplete();
}

// Export as PDF
export async function exportPDF(resultsId: string): Promise<Blob> {
  // Simulate PDF generation
  await delay(1500);

  // Create a mock PDF blob (in real implementation, this would be actual PDF data)
  const mockPdfContent = 'Mock PDF content for review simulation';
  return new Blob([mockPdfContent], { type: 'application/pdf' });
}

// Export as Word document
export async function exportWord(resultsId: string): Promise<Blob> {
  // Simulate Word document generation
  await delay(1500);

  // Create a mock Word blob (in real implementation, this would be actual DOCX data)
  const mockWordContent = 'Mock Word content for revised manuscript';
  return new Blob([mockWordContent], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
}
