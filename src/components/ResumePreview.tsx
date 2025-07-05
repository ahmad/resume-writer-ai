import { ResumeData } from "@/types";

export default function ResumePreview({ data, isLoading }: { data: ResumeData; isLoading: boolean }) {
    const handleDownload = async () => {
      try {
        // Create a blob URL for the PDF
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'resume', data }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name.replace(/\s+/g, '_')}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    };
  
    const getRecommendations = async () => {
     try {
      const response: Response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData: data })
      });
  
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
  
      const responseData = await response.json();
      console.log(responseData);
     } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
     }
    };
  
        return (
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl text-gray-900 text-sm relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 font-medium">Generating your resume...</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={getRecommendations}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Recommendations
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download PDF
            </button>
          </div>
        </div>
        <div className="text-blue-700 font-semibold mb-2">{data.title}</div>
        <div className="mb-2 text-xs text-gray-500">{data.location} | {data.email} | {data.phone}</div>
        <div className="mb-4 text-xs text-gray-500">
          <a href={`https://linkedin.com/${data.linkedin}`} className="underline mr-2">LinkedIn</a>
          <a href={`https://${data.website}`} className="underline">Website</a>
        </div>
        <div className="mb-4 text-gray-700">{data.summary}</div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Skills</div>
          <div className="">
            {Object.keys(data.skills).map((item) => {
              return (
                <div key={item} className="mb-1 flex gap-1">
                  <div className="w-1/4 font-semibold mb-1">{item}</div>
                  <div className="w-3/4 flex gap-1">
                    {data.skills[item].map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Projects</div>
          <ul className="list-disc ml-6">
            {data.projects.map((proj) => (
              <li key={proj.title} className="mb-1">
                <span className="font-semibold">{proj.title}:</span> {proj.description} {" "}
                <a href={proj.link.href} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">{proj.link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Experience</div>
          {data.experience.map((exp) => (
            <div key={exp.title + exp.company} className="mb-2">
              <div className="font-semibold">{exp.title}, {exp.company}</div>
              <div className="text-xs text-gray-500 mb-1">{exp.period} | {exp.location}</div>
              <ul className="list-disc ml-6">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <div className="font-semibold mb-1">Education</div>
          {data.education.map((edu) => (
            <div key={edu.degree + edu.school} className="mb-1">
              <span className="font-semibold">{edu.degree}</span>, {edu.school} <span className="text-xs text-gray-500">({edu.year})</span>
            </div>
          ))}
        </div>
      </div>
    );
  }