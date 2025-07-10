'use client';

import React, { useState, useEffect } from 'react';
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
}

export default function ResumeList({ 
  resumes, 
  onCreateNew, 
  onEditResume, 
  onDeleteResume,
  onDuplicateResume,
  onGenerateAIResume
}: ResumeListProps) {
  const { user } = useAuth();
  const [aiJobs, setAiJobs] = useState<Array<JobData & { id: string }>>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const loadAIJobs = async () => {
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
  };

  useEffect(() => {
    loadAIJobs();
  }, [user]);

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
    <div className="space-y-12">
      {/* Regular Resumes Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
            <p className="text-gray-600 mt-1">Manage and edit your professional resumes</p>
          </div>
          <div className="flex gap-2">

          <button
            onClick={onGenerateAIResume}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Generate AI Resume
          </button>

          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Resume
          </button>
          </div>
        </div>

        {/* Resume List */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first professional resume to get started</p>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Resume Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {resume.resumeName || 'Untitled Resume'}
                    </h3>
                    <div className="flex space-x-2">
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
                  <p className="text-gray-600 text-sm mb-2">
                    {resume.title || 'No title specified'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Last updated: {formatDate(resume.updatedAt)}
                  </p>
                </div>

                {/* Resume Preview */}
                <div className="p-6">
                  <div className="space-y-3">
                    {/* Contact Info Preview */}
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">Contact</div>
                      <div className="space-y-1">
                        {resume.email && (
                          <div className="text-gray-800 truncate">{resume.email}</div>
                        )}
                        {resume.phone && (
                          <div className="text-gray-800 truncate">{resume.phone}</div>
                        )}
                        {resume.location && (
                          <div className="text-gray-800 truncate">{resume.location}</div>
                        )}
                      </div>
                    </div>

                    {/* Experience Preview */}
                    {resume.experience.length > 0 && (
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">Experience</div>
                        <div className="space-y-1">
                          {resume.experience.slice(0, 2).map((exp, index) => (
                            <div key={index} className="text-gray-800 truncate">
                              {exp.title} at {exp.company}
                            </div>
                          ))}
                          {resume.experience.length > 2 && (
                            <div className="text-gray-500 text-xs">
                              +{resume.experience.length - 2} more positions
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills Preview */}
                    {Object.keys(resume.skills).length > 0 && (
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(resume.skills).slice(0, 3).map(([category, skills]) =>
                            skills.slice(0, 2).map((skill, index) => (
                              <span
                                key={`${category}-${index}`}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))
                          )}
                          {Object.values(resume.skills).flat().length > 6 && (
                            <span className="text-gray-500 text-xs">+more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => onEditResume(resume.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Jobs Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Jobs</h2>
            <p className="text-gray-600 mt-1">Track your AI-generated resume requests</p>
          </div>
          <button
            onClick={loadAIJobs}
            disabled={isLoadingJobs}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoadingJobs ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </div>
            )}
          </button>
        </div>

        {/* AI Jobs List */}
        {aiJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI jobs yet</h3>
            <p className="text-gray-600 mb-6">Generate your first AI-tailored resume to see it here</p>
            <button
              onClick={onGenerateAIResume}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Generate AI Resume
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {aiJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.selectedResume.resumeName || 'Untitled Resume'}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Created: {formatDate(job.createdAt)}
                      </p>
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Job Posting
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Job Description Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Job Description</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm text-gray-800 line-clamp-3">
                        {job.jobDescription.length > 200 
                          ? `${job.jobDescription.substring(0, 200)}...` 
                          : job.jobDescription
                        }
                      </p>
                    </div>
                  </div>

                  {/* Status-specific actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Last updated: {formatDate(job.updatedAt)}
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'completed' && (
                        <Link href={`/jobs/${job.id}`} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                          
                          View Result
                        </Link>
                      )}
                      {job.status === 'failed' && (
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors">
                          Retry
                        </button>
                      )}
                      {(job.status === 'pending' || job.status === 'processing') && (
                        <div className="text-xs text-gray-500">
                          Processing your request...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 