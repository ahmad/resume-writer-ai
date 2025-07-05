import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { ResumeData } from '../types';

// Legacy resume data interface (keeping for backward compatibility)
export interface LegacyResumeData {
  id?: string;
  userId: string;
  userName?: string;
  title: string;
  content: string;
  jobDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create or update a resume with the new structure
export const saveResumeData = async (userId: string, resumeData: ResumeData, resumeId?: string): Promise<string> => {
  const now = Timestamp.now();
  const resumeWithMetadata = {
    ...resumeData,
    userId,
    createdAt: now,
    updatedAt: now
  };

  if (resumeId) {
    // Update existing resume
    const resumeRef = doc(db, 'resumes', resumeId);
    await updateDoc(resumeRef, {
      ...resumeData,
      updatedAt: now
    });
    return resumeId;
  } else {
    // Create new resume
    const resumesRef = collection(db, 'resumes');
    const newResumeRef = doc(resumesRef);
    await setDoc(newResumeRef, resumeWithMetadata);
    return newResumeRef.id;
  }
};

// Get a single resume by ID
export const getResumeData = async (resumeId: string): Promise<ResumeData | null> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeSnap = await getDoc(resumeRef);
  
  if (resumeSnap.exists()) {
    const data = resumeSnap.data();
    // Remove Firestore metadata before returning
    const { userId, createdAt, updatedAt, ...resumeData } = data;
    return resumeData as ResumeData;
  }
  return null;
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<Array<ResumeData & { id: string; updatedAt: Timestamp }>> => {
  const resumesRef = collection(db, 'resumes');
  const q = query(
    resumesRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const resumes: Array<ResumeData & { id: string; updatedAt: Timestamp }> = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const { userId, createdAt, ...resumeData } = data;
    resumes.push({ 
      id: doc.id, 
      ...resumeData 
    } as ResumeData & { id: string; updatedAt: Timestamp });
  });
  
  return resumes;
};

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
};

// Save user preferences
export const saveUserPreferences = async (userId: string, preferences: any): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    preferences,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<any> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().preferences || {};
  }
  return {};
};

// Legacy functions for backward compatibility
export const saveResume = async (resumeData: LegacyResumeData): Promise<void> => {
  const now = Timestamp.now();
  const resumeWithTimestamps = {
    ...resumeData,
    updatedAt: now,
    createdAt: resumeData.createdAt || now
  };

  if (resumeData.id) {
    // Update existing resume
    const resumeRef = doc(db, 'resumes', resumeData.id);
    await updateDoc(resumeRef, resumeWithTimestamps);
  } else {
    // Create new resume
    const resumesRef = collection(db, 'resumes');
    await setDoc(doc(resumesRef), resumeWithTimestamps);
  }
};

export const getResume = async (resumeId: string): Promise<LegacyResumeData | null> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeSnap = await getDoc(resumeRef);
  
  if (resumeSnap.exists()) {
    return { id: resumeSnap.id, ...resumeSnap.data() } as LegacyResumeData;
  }
  return null;
}; 