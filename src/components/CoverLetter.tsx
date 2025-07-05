import { CoverLetter, ResumeData } from "@/types";

export default function CoverLetterPreview({ data, resumeData, isLoading }: { data: CoverLetter; resumeData: ResumeData; isLoading: boolean }) {
    const handleDownload = async () => {
      try {
        // Create a blob URL for the PDF
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'cover-letter', data }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.recipientName.replace(/\s+/g, '_')}_cover_letter.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    };
  
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl text-gray-900 text-sm relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 font-medium">Generating your cover letter...</p>
            </div>
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