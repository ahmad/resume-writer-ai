import { CoverLetter, ResumeData } from "@/types";
import { downloadPDF, generateCoverLetterFilename } from "@/utils/pdf";
import { LoadingOverlay } from "./common/LoadingOverlay";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function CoverLetterPreview({ data, resumeData, isLoading }: { data: CoverLetter; resumeData: ResumeData; isLoading: boolean }) {
    const { error, handleError, clearError } = useErrorHandler();

    const handleDownload = async () => {
      try {
        clearError();
        const filename = generateCoverLetterFilename(data.recipientName);
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
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download PDF
          </button>
        </div>
  
                <div className="space-y-4">
            <div className="text-right text-sm text-gray-600">
              {data.date}
            </div>
            
            <div className="space-y-2">
              <div className="font-semibold">{data.recipientName}</div>
              <div>{data.recipientTitle}</div>
              <div>{data.companyName}</div>
            </div>
            
            <div className="mt-6 leading-relaxed whitespace-pre-wrap">
              {data.content}
            </div>
            
            <div className="mt-8 text-sm text-gray-600">
              <div>Sincerely,</div>
              <div className="mt-2">
                <div>{resumeData.name}</div>
                <div>{resumeData.email}</div>
                <div>{resumeData.phone}</div>
              </div>
            </div>
          </div>
      </div>
    );
  }