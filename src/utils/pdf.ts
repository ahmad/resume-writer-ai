export interface PDFDownloadData {
  type: 'resume' | 'cover-letter';
  data: any;
  template?: string;
}

export const downloadPDF = async (data: PDFDownloadData, filename: string): Promise<void> => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generateResumeFilename = (resumeName: string, name: string, template: string): string => {
  const baseName = resumeName || name || 'resume';
  return `${baseName.replace(/\s+/g, '_')}_resume_${template}.pdf`;
};

export const generateCoverLetterFilename = (recipientName: string): string => {
  return `${recipientName.replace(/\s+/g, '_')}_cover_letter.pdf`;
}; 