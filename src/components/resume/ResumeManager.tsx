'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveResume, getUserResumes, deleteResume, ResumeData } from '@/lib/firestore';
import { defaultResumeData } from '@/resume-config';
import type { ResumeData as LocalResumeData } from '@/types';

interface ResumeManagerProps {
  currentResume: LocalResumeData;
  onLoadResume: (resume: LocalResumeData) => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({ currentResume, onLoadResume }) => {
  const { user } = useAuth();
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadSavedResumes();
    }
  }, [user]);

  const loadSavedResumes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const resumes = await getUserResumes(user.uid);
      setSavedResumes(resumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    if (!user || !saveTitle.trim()) return;

    try {
      setLoading(true);
      const resumeData: ResumeData = {
        userId: user.uid,
        userName: user.displayName || user.email || 'Unknown User',
        title: saveTitle.trim(),
        content: JSON.stringify(currentResume),
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      await saveResume(resumeData);
      setSaveTitle('');
      setShowSaveModal(false);
      await loadSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadResume = (resume: ResumeData) => {
    try {
      const parsedResume = JSON.parse(resume.content) as LocalResumeData;
      onLoadResume(parsedResume);
      setShowLoadModal(false);
    } catch (error) {
      console.error('Error parsing resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await deleteResume(resumeId);
      await loadSavedResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowSaveModal(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
      >
        Save Resume
      </button>
      <button
        onClick={() => setShowLoadModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
      >
        Load Resume
      </button>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Save Resume</h3>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Enter resume title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResume}
                disabled={loading || !saveTitle.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Load Resume</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : savedResumes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved resumes found</p>
            ) : (
              <div className="space-y-2">
                {savedResumes.map((resume) => (
                                     <div
                     key={resume.id}
                     className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                   >
                     <div>
                       <div className="font-medium">{resume.title}</div>
                       <div className="text-sm text-gray-500">
                         {resume.updatedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                         {resume.userName && ` • ${resume.userName}`}
                       </div>
                     </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadResume(resume)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => resume.id && handleDeleteResume(resume.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 