'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ResumeData } from '../../types';
import { getUserResumes } from '../../lib/firestore';

interface ResumeSelectorProps {
  onResumeSelect: (resumeData: ResumeData) => void;
  onCancel: () => void;
}

export default function ResumeSelector({ onResumeSelect, onCancel }: ResumeSelectorProps) {
  const { user } = useAuth();
  const [userResumes, setUserResumes] = useState<Array<ResumeData & { id: string; updatedAt: unknown }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const loadUserResumes = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const resumes = await getUserResumes(user.uid);
      setUserResumes(resumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserResumes();
    }
  }, [user, loadUserResumes]);

  const handleResumeSelect = () => {
    if (!selectedResumeId) return;
    
    const selectedResume = userResumes.find(resume => resume.id === selectedResumeId);
    if (selectedResume) {
      // Remove the id and updatedAt from the resume data before passing it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, updatedAt: _updatedAt, ...resumeData } = selectedResume;
      onResumeSelect(resumeData);
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = (timestamp as { toDate?: () => Date }).toDate ? (timestamp as { toDate: () => Date }).toDate() : new Date(timestamp as string | number | Date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
          <p className="text-gray-600">You need to be authenticated to access your resumes.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Resume</h2>
          <p className="text-gray-600">
            Choose one of your existing resumes to use with the AI Builder. The AI will customize this resume based on the job description you provide.
          </p>
        </div>

        <div className="p-6">
          {userResumes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
              <p className="text-gray-600 mb-6">
                You don&apos;t have any saved resumes yet. Please create a resume first using the Advanced Builder.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {userResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedResumeId === resume.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedResumeId(resume.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="radio"
                            name="resume"
                            checked={selectedResumeId === resume.id}
                            onChange={() => setSelectedResumeId(resume.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <h3 className="font-semibold text-gray-900">
                            {resume.resumeName || 'Untitled Resume'}
                          </h3>
                          {resume.title && (
                            <span className="text-sm text-gray-500">({resume.title})</span>
                          )}
                        </div>
                        
                        <div className="ml-6 space-y-2">
                          {/* Contact Info Preview */}
                          <div className="text-sm text-gray-600">
                            {resume.email && <span className="mr-4">{resume.email}</span>}
                            {resume.phone && <span className="mr-4">{resume.phone}</span>}
                            {resume.location && <span>{resume.location}</span>}
                          </div>

                          {/* Experience Preview */}
                          {resume.experience && resume.experience.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Experience:</span>{' '}
                              {resume.experience.slice(0, 2).map((exp, index) => (
                                <span key={index}>
                                  {exp.title} at {exp.company}
                                  {index < Math.min(2, resume.experience.length - 1) && ', '}
                                </span>
                              ))}
                              {resume.experience.length > 2 && (
                                <span className="text-gray-500">
                                  {' '}and {resume.experience.length - 2} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Last updated: {formatDate(resume.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResumeSelect}
                  disabled={!selectedResumeId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Use Selected Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 