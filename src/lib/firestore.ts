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

// Resume data interface
export interface ResumeData {
  id?: string;
  userId: string;
  userName?: string;
  title: string;
  content: string;
  jobDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create or update a resume
export const saveResume = async (resumeData: ResumeData): Promise<void> => {
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

// Get a single resume by ID
export const getResume = async (resumeId: string): Promise<ResumeData | null> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeSnap = await getDoc(resumeRef);
  
  if (resumeSnap.exists()) {
    return { id: resumeSnap.id, ...resumeSnap.data() } as ResumeData;
  }
  return null;
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<ResumeData[]> => {
  const resumesRef = collection(db, 'resumes');
  const q = query(
    resumesRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const resumes: ResumeData[] = [];
  
  querySnapshot.forEach((doc) => {
    resumes.push({ id: doc.id, ...doc.data() } as ResumeData);
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