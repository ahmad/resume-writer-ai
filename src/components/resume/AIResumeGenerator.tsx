'use client';

import React, { useState } from 'react';
import { Resume } from './AdvancedResumeBuilder';

interface AIResumeGeneratorProps {
  resumes: Array<Resume>;
  onGenerate: (data: {
    jobDescription: string;
    selectedResume: Resume;
    jobUrl?: string;
  }) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AIResumeGenerator({ 
  resumes, 
  onGenerate, 
  onClose, 
  isOpen 
}: AIResumeGeneratorProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim() || !selectedResume) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate({
        jobDescription: jobDescription.trim(),
        selectedResume,
        jobUrl: jobUrl.trim() || undefined
      });
      
      // Reset form
      setJobDescription('');
      setSelectedResume(null);
      setJobUrl('');
      onClose();
    } catch (error) {
      console.error('Error generating AI resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatResumeName = (resume: Resume) => {
    return resume.resumeName || resume.name || 'Untitled Resume';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate AI-Tailored Resume</h2>
            <p className="text-sm text-gray-600 mt-1">
              Let AI customize your resume for a specific job description
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resume Selection */}
          <div>
            <label htmlFor="resume-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Resume to Tailor *
            </label>
            <select
              id="resume-select"
              value={selectedResume?.id || ''}
              onChange={(e) => {
                const resume = resumes.find(r => r.id === e.target.value);
                setSelectedResume(resume || null);
              }}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {formatResumeName(resume)}
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                You need to create a resume first before using AI generation.
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here. Include requirements, responsibilities, and any specific keywords..."
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The more detailed the job description, the better the AI can tailor your resume.
            </p>
          </div>

          {/* Job URL (Optional) */}
          <div>
            <label htmlFor="job-url" className="block text-sm font-medium text-gray-700 mb-2">
              Job URL (Optional)
            </label>
            <input
              type="url"
              id="job-url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Providing the job URL helps AI understand the company context better.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !jobDescription.trim() || !selectedResume}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate AI Resume</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 