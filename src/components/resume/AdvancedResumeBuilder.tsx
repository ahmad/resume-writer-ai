'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ResumeData } from '../../types';
import { saveResumeData, getResumeData, getUserResumes, deleteResume, duplicateResume, saveJobData } from '../../lib/firestore';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import ResumeList from './ResumeList';
import AIResumeGenerator from './AIResumeGenerator';



export interface Resume extends ResumeData {
  id: string;
  updatedAt: unknown;
}

export default function AdvancedResumeBuilder() {
  const { user } = useAuth();
  
  const getDefaultResumeData = (): ResumeData => ({
    changeSummary: '',
    resumeName: '',
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    website: '',
    summary: '',
    skills: {},
    experience: [],
    education: [],
    projects: []
  });

  const [resumeData, setResumeData] = useState<ResumeData>(getDefaultResumeData());
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [userResumes, setUserResumes] = useState<Array<Resume>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'list'>('list');
  const [isSaving, setIsSaving] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

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

  // Load user's resumes on component mount
  useEffect(() => {
    if (user) {
      loadUserResumes();
    }
  }, [user, loadUserResumes]);

  const handleCreateNew = () => {
    setResumeData(getDefaultResumeData());
    setCurrentResumeId(null);
    setViewMode('form');
  };

  const handleEditResume = async (resumeId: string) => {
    setIsLoading(true);
    try {
      const resume = await getResumeData(resumeId);
      if (resume) {
        setResumeData(resume);
        setCurrentResumeId(resumeId);
        setViewMode('form');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResume = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const resumeId = await saveResumeData(user.uid, resumeData, currentResumeId || undefined);
      setCurrentResumeId(resumeId);
      await loadUserResumes(); // Refresh the list
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    setIsLoading(true);
    try {
      await deleteResume(resumeId);
      await loadUserResumes(); // Refresh the list
      if (currentResumeId === resumeId) {
        setCurrentResumeId(null);
        setResumeData(getDefaultResumeData());
      }
      alert('Resume deleted successfully!');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Error deleting resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateResume = async (resumeId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await duplicateResume(user.uid, resumeId);
      await loadUserResumes(); // Refresh the list
      alert('Resume duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating resume:', error);
      alert('Error duplicating resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...newData }));
  };

  const handleGenerateAIResume = () => {
    setShowAIGenerator(true);
  };

  const handleAIGenerate = async (data: {
    jobDescription: string;
    selectedResume: ResumeData;
    jobUrl?: string;
  }) => {
    if (!user) return;

    try {
      // Save job data to Firestore
      await saveJobData(user.uid, {
        jobDescription: data.jobDescription,
        selectedResume: data.selectedResume,
        jobUrl: data.jobUrl
      });
      
    } catch (error) {
      console.error('Error saving job data:', error);
      alert('Error submitting job. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access the resume builder</h2>
          <p className="text-gray-600">You need to be authenticated to create and manage your resumes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Advanced Resume Builder</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                My Resumes
              </button>
              <button
                onClick={() => setViewMode('form')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'form' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'preview' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <ResumeList
                resumes={userResumes}
                onGenerateAIResume={handleGenerateAIResume}
                onCreateNew={handleCreateNew}
                onEditResume={handleEditResume}
                onDeleteResume={handleDeleteResume}
                onDuplicateResume={handleDuplicateResume}
              />
            )}

            {viewMode === 'form' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentResumeId ? 'Edit Resume' : 'Create New Resume'}
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveResume}
                      disabled={isSaving}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Resume'}
                    </button>
                  </div>
                </div>
                <ResumeForm
                  data={resumeData}
                  onChange={handleDataChange}
                />
              </div>
            )}

            {viewMode === 'preview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Resume Preview</h2>
                  <button
                    onClick={() => setViewMode('form')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Back to Editor
                  </button>
                </div>
                <ResumePreview data={resumeData} isLoading={isLoading} />
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Resume Generator Popover */}
      <AIResumeGenerator
        resumes={userResumes}
        onGenerate={handleAIGenerate}
        onClose={() => setShowAIGenerator(false)}
        isOpen={showAIGenerator}
      />
    </div>
  );
} 