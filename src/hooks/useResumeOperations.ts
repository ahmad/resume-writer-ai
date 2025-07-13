import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ResumeData } from '../types';
import { 
  saveResumeData, 
  getResumeData, 
  getUserResumes, 
  deleteResume, 
  duplicateResume 
} from '../lib/firestore';
import { useErrorHandler } from './useErrorHandler';

export const useResumeOperations = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  
  const saveResume = useCallback(async (resumeData: ResumeData, resumeId?: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsSaving(true);
    clearError();
    
    try {
      const id = await saveResumeData(user.uid, resumeData, resumeId);
      return id;
    } catch (err) {
      handleError(err, 'Failed to save resume');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [user, handleError, clearError]);

  const loadResume = useCallback(async (resumeId: string): Promise<ResumeData | null> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    clearError();
    
    try {
      const resume = await getResumeData(resumeId);
      return resume;
    } catch (err) {
      handleError(err, 'Failed to load resume');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError, clearError]);

  const loadUserResumes = useCallback(async (): Promise<Array<ResumeData & { id: string; updatedAt: unknown }>> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    clearError();
    
    try {
      const resumes = await getUserResumes(user.uid);
      return resumes;
    } catch (err) {
      handleError(err, 'Failed to load resumes');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError, clearError]);

  const deleteResumeById = useCallback(async (resumeId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    clearError();
    
    try {
      await deleteResume(resumeId);
    } catch (err) {
      handleError(err, 'Failed to delete resume');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError, clearError]);

  const duplicateResumeById = useCallback(async (resumeId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    clearError();
    
    try {
      const newId = await duplicateResume(user.uid, resumeId);
      return newId;
    } catch (err) {
      handleError(err, 'Failed to duplicate resume');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError, clearError]);
  
  return { 
    saveResume, 
    loadResume, 
    loadUserResumes, 
    deleteResumeById, 
    duplicateResumeById,
    isLoading, 
    isSaving,
    error 
  };
}; 