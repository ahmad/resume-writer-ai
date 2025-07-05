"use client";
import { useState, useRef, useEffect } from "react";
import { defaultResumeData } from "../resume-config";
import type { ResumeData, CoverLetter } from "../types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfile } from "@/components/auth/UserProfile";
import { ResumeManager } from "@/components/resume/ResumeManager";

function CoverLetterPreview({ data, resumeData, isLoading }: { data: CoverLetter; resumeData: ResumeData; isLoading: boolean }) {
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

function ResumePreview({ data, isLoading }: { data: ResumeData; isLoading: boolean }) {
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    const data = await response.json();
    console.log(data);
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

function TabbedPreview({ 
  resumeData, 
  coverLetterData, 
  isLoading, 
  activeTab, 
  onTabChange 
}: { 
  resumeData: ResumeData; 
  coverLetterData: CoverLetter; 
  isLoading: boolean; 
  activeTab: 'resume' | 'cover-letter'; 
  onTabChange: (tab: 'resume' | 'cover-letter') => void; 
}) {
  return (
    <div className="w-full max-w-4xl">
      {/* Tab Navigation */}
      <div className="flex mb-6 bg-white rounded-lg shadow-sm p-1">
        <button
          onClick={() => onTabChange('resume')}
          className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition ${
            activeTab === 'resume'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Resume
        </button>
        <button
          onClick={() => onTabChange('cover-letter')}
          className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition ${
            activeTab === 'cover-letter'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Cover Letter
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'resume' ? (
        <ResumePreview data={resumeData} isLoading={isLoading} />
      ) : (
        <CoverLetterPreview data={coverLetterData} resumeData={resumeData} isLoading={isLoading} />
      )}
    </div>
  );
}

function ChatPopup({ messages, isOpen, onClose }: { 
  messages: Array<{ sender: string; text: string }>; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg text-black font-semibold">Chat History</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome! Paste your job description and I'll help you customize your resume." },
  ]);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetter>({
    date: new Date().toISOString().slice(0, 10),
    recipientName: "Hiring Manager",
    recipientTitle: "Software Engineer",
    companyName: "Tech Corp",
    content: "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at Tech Corp. With a strong background in full-stack development and a passion for building scalable applications, I am excited about the opportunity to contribute to your team.\n\nMy experience includes:\n- Developing and maintaining robust web applications using React, Node.js, and PostgreSQL.\n- Implementing RESTful APIs and integrating third-party services.\n- Collaborating with cross-functional teams to deliver high-quality software solutions.\n\nI am particularly drawn to this role because of its focus on innovation and the chance to work on cutting-edge technologies. I am eager to bring my problem-solving skills and dedication to Tech Corp.\n\nThank you for considering my application. I look forward to discussing this opportunity with you.\n\nSincerely,\n[Your Name]\n[Your LinkedIn Profile]\n[Your Email]\n[Your Phone]",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages((msgs) => [
      ...msgs,
      { sender: "user", text: userMessage },
    ]);
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Add AI response to messages
      setMessages((msgs) => [
        ...msgs,
        { sender: "system", text: "I've analyzed your job description and updated both your resume and cover letter to better match the requirements." },
        { sender: "system", text: data.content.resume.changeSummary },
      ]);
      
      if (data.content.resume) {
        setResumeData(data.content.resume as ResumeData);
      }
      if (data.content.coverLetter) {
        setCoverLetterData(data.content.coverLetter as CoverLetter);
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      setMessages((msgs) => [
        ...msgs,
        { sender: "system", text: "Sorry, there was an error processing your request. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Profile */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Resume Writer AI</h1>
            <div className="flex items-center gap-4">
              <ResumeManager 
                currentResume={resumeData} 
                onLoadResume={setResumeData} 
              />
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              <textarea
                className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Paste your job description here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                style={{ minHeight: '120px', maxHeight: '200px' }}
              />
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <span>Chat History</span>
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {messages.length - 1}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="flex justify-center items-center min-h-[calc(100vh-180px)] px-4 py-8">
          <TabbedPreview 
            resumeData={resumeData} 
            coverLetterData={coverLetterData} 
            isLoading={isLoading} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        {/* Chat Popup */}
        <ChatPopup 
          messages={messages} 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      </div>
    </ProtectedRoute>
  );
}
