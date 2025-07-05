"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { ResumeData, CoverLetter } from "../types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfile } from "@/components/auth/UserProfile";
import ResumeSelector from "@/components/resume/ResumeSelector";
import ResumePreview from "@/components/ResumePreview";
import CoverLetterPreview from "@/components/CoverLetter";

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
  const [resumeData, setResumeData] = useState({} as ResumeData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetter>({
    date: new Date().toISOString().slice(0, 10),
    recipientName: "Hiring Manager",
    recipientTitle: "Software Engineer",
    companyName: "Tech Corp",
    content: "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position at Tech Corp. With a strong background in full-stack development and a passion for building scalable applications, I am excited about the opportunity to contribute to your team.\n\nMy experience includes:\n- Developing and maintaining robust web applications using React, Node.js, and PostgreSQL.\n- Implementing RESTful APIs and integrating third-party services.\n- Collaborating with cross-functional teams to deliver high-quality software solutions.\n\nI am particularly drawn to this role because of its focus on innovation and the chance to work on cutting-edge technologies. I am eager to bring my problem-solving skills and dedication to Tech Corp.\n\nThank you for considering my application. I look forward to discussing this opportunity with you.\n\nSincerely,\n[Your Name]\n[Your LinkedIn Profile]\n[Your Email]\n[Your Phone]",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [showResumeSelector, setShowResumeSelector] = useState(false);

  useEffect(() => {
    // Show resume selector if no resume is selected
    if (!selectedResume) {
      setShowResumeSelector(true);
    }
  }, [selectedResume]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedResume) return;
    
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
        body: JSON.stringify({ 
          jobDescription: userMessage,
          resumeData: selectedResume 
        }),
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

  const handleResumeSelect = (resumeData: ResumeData) => {
    setSelectedResume(resumeData);
    setResumeData(resumeData);
    setShowResumeSelector(false);
  };

  const handleCancelResumeSelection = () => {
    setShowResumeSelector(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Profile */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">AI Resume Builder</h1>
              <Link 
                href="/builder"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Advanced Builder →
              </Link>
            </div>
            <UserProfile />
          </div>
        </div>

        {showResumeSelector ? (
          <ResumeSelector 
            onResumeSelect={handleResumeSelect}
            onCancel={handleCancelResumeSelection}
          />
        ) : (
          <>
            {/* Selected Resume Info */}
            {selectedResume && (
              <div className="bg-blue-50 border-b border-blue-200">
                <div className="max-w-6xl mx-auto px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-900">
                        Using resume: {selectedResume.name || 'Untitled Resume'}
                      </span>
                      {selectedResume.title && (
                        <span className="text-sm text-blue-700">({selectedResume.title})</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowResumeSelector(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Change Resume
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                      disabled={isLoading || !input.trim() || !selectedResume}
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
          </>
        )}

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
