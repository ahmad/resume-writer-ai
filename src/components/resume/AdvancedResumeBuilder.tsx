'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ResumeData } from '../../types';
import { saveJobData } from '../../lib/firestore';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import ResumeList from './ResumeList';
import AIResumeGenerator from './AIResumeGenerator';
import { useResumeOperations } from '@/hooks/useResumeOperations';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';
import { useUIState } from '@/contexts/UIStateContext';



export interface Resume extends ResumeData {
  id: string;
  updatedAt: unknown;
}

export default function AdvancedResumeBuilder() {
  const { user } = useAuth();
  const { 
    saveResume, 
    loadResume, 
    loadUserResumes, 
    deleteResumeById, 
    duplicateResumeById,
    isLoading, 
    isSaving,
    error 
  } = useResumeOperations();
  const { clearError } = useErrorHandler();
  const { showNotification } = useUIState();
  
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
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'list'>('list');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const loadUserResumesData = useCallback(async () => {
    if (!user) return;
    
    try {
      const resumes = await loadUserResumes();
      setUserResumes(resumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  }, [user, loadUserResumes]);

  // Load user's resumes on component mount
  useEffect(() => {
    if (user) {
      loadUserResumesData();
    }
  }, [user, loadUserResumesData]);

  const handleCreateNew = () => {
    setResumeData(getDefaultResumeData());
    setCurrentResumeId(null);
    setViewMode('form');
  };

  const handleEditResume = async (resumeId: string) => {
    try {
      const resume = await loadResume(resumeId);
      if (resume) {
        setResumeData(resume);
        setCurrentResumeId(resumeId);
        setViewMode('form');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleSaveResume = async () => {
    if (!user) return;

    try {
      clearError();
      const resumeId = await saveResume(resumeData, currentResumeId || undefined);
      setCurrentResumeId(resumeId);
      await loadUserResumesData(); // Refresh the list
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Resume saved successfully!'
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Error saving resume. Please try again.'
      });
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResumeById(resumeId);
      await loadUserResumesData(); // Refresh the list
      if (currentResumeId === resumeId) {
        setCurrentResumeId(null);
        setResumeData(getDefaultResumeData());
      }
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Resume deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Error deleting resume. Please try again.'
      });
    }
  };

  const handleDuplicateResume = async (resumeId: string) => {
    if (!user) return;

    try {
      await duplicateResumeById(resumeId);
      await loadUserResumesData(); // Refresh the list
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Resume duplicated successfully!'
      });
    } catch (error) {
      console.error('Error duplicating resume:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Error duplicating resume. Please try again.'
      });
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
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                My Resumes
              </Button>
              <Button
                variant={viewMode === 'form' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('form')}
                size="sm"
              >
                Editor
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('preview')}
                size="sm"
              >
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
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
                    <Button
                      variant="success"
                      onClick={handleSaveResume}
                      disabled={isSaving}
                      loading={isSaving}
                      loadingText="Saving..."
                    >
                      Save Resume
                    </Button>
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
                  <Button
                    variant="primary"
                    onClick={() => setViewMode('form')}
                    size="sm"
                  >
                    Back to Editor
                  </Button>
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