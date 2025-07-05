'use client';

import React from 'react';
import { ResumeData } from '../../types';

interface ResumeListProps {
  resumes: Array<ResumeData & { id: string; updatedAt: unknown }>;
  onCreateNew: () => void;
  onEditResume: (resumeId: string) => void;
  onDeleteResume: (resumeId: string) => void;
  onDuplicateResume: (resumeId: string) => void;
}

export default function ResumeList({ 
  resumes, 
  onCreateNew, 
  onEditResume, 
  onDeleteResume,
  onDuplicateResume
}: ResumeListProps) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-gray-600 mt-1">Manage and edit your professional resumes</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Resume
        </button>
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
  );
} 