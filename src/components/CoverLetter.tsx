import { ResumeData } from "@/types";
import { downloadPDF, generateCoverLetterFilename } from "@/utils/pdf";
import { LoadingOverlay } from "./common/LoadingOverlay";
import { Button } from "./common/Button";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function CoverLetterPreview({ data, resumeData, isLoading }: { data: string; resumeData: ResumeData; isLoading: boolean }) {
    const { error, handleError, clearError } = useErrorHandler();

    const handleDownload = async () => {
      try {
        clearError();
        const filename = generateCoverLetterFilename(resumeData.name);
        await downloadPDF({ type: 'cover-letter', data }, filename);
      } catch (error) {
        handleError(error, 'Failed to generate PDF. Please try again.');
      }
    };
  
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl text-gray-900 text-sm relative">
        <LoadingOverlay isLoading={isLoading} text="Generating your cover letter..." />
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cover Letter</h2>
          <Button
            variant="success"
            onClick={handleDownload}
            disabled={isLoading}
          >
            Download PDF
          </Button>
        </div>
  
                <div className="space-y-4">
            
            <div className="mt-6 leading-relaxed whitespace-pre-wrap">
              {data}
            </div>
            
          </div>
      </div>
    );
  }