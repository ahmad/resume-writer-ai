'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ResumeData } from '../../types';
import { getUserJobs, JobData } from '../../lib/firestore';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface ResumeListProps {
  resumes: Array<ResumeData & { id: string; updatedAt: unknown }>;
  onCreateNew: () => void;
  onEditResume: (resumeId: string) => void;
  onDeleteResume: (resumeId: string) => void;
  onDuplicateResume: (resumeId: string) => void;
  onGenerateAIResume: () => void;
  onSetDefaultResume: (resumeId: string) => void;
}

export default function ResumeList({ 
  resumes, 
  onCreateNew, 
  onEditResume, 
  onDeleteResume,
  onDuplicateResume,
  onGenerateAIResume,
  onSetDefaultResume
}: ResumeListProps) {
  const { user } = useAuth();
  const [aiJobs, setAiJobs] = useState<Array<JobData & { id: string }>>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const loadAIJobs = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingJobs(true);
    try {
      const jobs = await getUserJobs(user.uid);
      setAiJobs(jobs);
    } catch (error) {
      console.error('Error loading AI jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [user]);

  useEffect(() => {
    loadAIJobs();
  }, [loadAIJobs]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Regular Resumes Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">My Resumes</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and edit your professional resumes</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onGenerateAIResume}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Generate AI Resume
            </button>
            <button
              onClick={onCreateNew}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New
            </button>
          </div>
        </div>

        {/* Resume List */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-sm text-gray-600 mb-4">Create your first professional resume to get started</p>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`bg-white rounded-lg border transition-colors ${resume.isDefault ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {/* Resume Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {resume.resumeName || 'Untitled Resume'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {resume.title || 'No title specified'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Default Resume Selector */}
                    <button
                      title={resume.isDefault ? 'Default Resume' : 'Set as Default'}
                      onClick={() => onSetDefaultResume(resume.id)}
                      className={`focus:outline-none ${resume.isDefault ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      aria-label={resume.isDefault ? 'Default Resume' : 'Set as Default'}
                    >
                      <svg className="w-6 h-6" fill={resume.isDefault ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.873 6.9-1.002L12 2.5l3.093 6.747 6.9 1.002-5 4.873 1.179 6.873z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditResume(resume.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit Resume"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDuplicateResume(resume.id)}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Duplicate Resume"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Resume"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Resume Content Preview */}
                <div className="p-4">
                  <div className="space-y-2">
                    {resume.name && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Name:</span>
                        <span className="text-sm text-gray-900">{resume.name}</span>
                      </div>
                    )}
                    {resume.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Email:</span>
                        <span className="text-sm text-gray-900">{resume.email}</span>
                      </div>
                    )}
                    {resume.experience && resume.experience.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Experience:</span>
                        <span className="text-sm text-gray-900">{resume.experience.length} position{resume.experience.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {resume.education && resume.education.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Education:</span>
                        <span className="text-sm text-gray-900">{resume.education.length} degree{resume.education.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Jobs Section */}
      {aiJobs.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">AI-Generated Resumes</h2>
            <p className="text-sm text-gray-600">Resumes tailored for specific job applications</p>
          </div>
          
          {isLoadingJobs ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-blue-600 text-lg">Loading AI jobs...</span>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors block"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {job.selectedResume.resumeName || 'Untitled Resume'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status || 'pending')}`}> 
                        {getStatusIcon(job.status || 'pending')}
                        {job.status || 'pending'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {job.selectedResume.title || 'No title specified'}
                    </p>
                    
                    {job.jobDescription && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {job.jobDescription.substring(0, 100)}...
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {formatDate(job.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 