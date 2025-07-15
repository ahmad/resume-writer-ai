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
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ResumeData } from '../types';

// Job data interface
export interface JobData {
  id?: string;
  userId: string;
  jobDescription: string;
  aiResume?: ResumeData;
  aiCoverLetter?: string;
  selectedResume: ResumeData;
  jobUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

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


export const getUserGeneratedResumes = async (userId: string, jobId: string): Promise<JobData | null> => {
  if (!userId || !jobId) {
    console.error('Invalid userId or jobId provided:', { userId, jobId });
    throw new Error('Invalid userId or jobId provided');
  }

  try {
    const jobRef = doc(db, 'users', userId, 'jobs', jobId);
    const jobDoc = await getDoc(jobRef);
    
    if (!jobDoc.exists()) {
      console.log(`Job document ${jobId} not found for user ${userId}`);
      return null;
    }

    const jobData = jobDoc.data();
    if (!jobData) {
      console.log(`Job document ${jobId} exists but has no data for user ${userId}`);
      return null;
    }

    return jobData as JobData;
  } catch (error) {
    console.error('Error fetching job data:', error);
    throw error;
  }
}

// Get a single resume by ID
export const getResumeData = async (resumeId: string): Promise<ResumeData | null> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeSnap = await getDoc(resumeRef);
  
  if (resumeSnap.exists()) {
    const data = resumeSnap.data();
    // Remove Firestore metadata before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, createdAt: _createdAt, updatedAt: _updatedAt, ...resumeData } = data;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, createdAt: _createdAt, ...resumeData } = data;
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

// Duplicate a resume
export const duplicateResume = async (userId: string, resumeId: string): Promise<string> => {
  const originalResume = await getResumeData(resumeId);
  if (!originalResume) {
    throw new Error('Resume not found');
  }

  // Create a copy with a new name
  const duplicatedResume: ResumeData = {
    ...originalResume,
    resumeName: `${originalResume.resumeName || 'Untitled Resume'} (Copy)`,
    changeSummary: ''
  };

  // Save the duplicated resume
  return await saveResumeData(userId, duplicatedResume);
};

// Save user preferences
export const saveUserPreferences = async (userId: string, preferences: unknown): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    preferences,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<unknown> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().preferences || {};
  }
  return {};
};

// Save job data for AI resume generation
export const saveJobData = async (userId: string, jobData: Omit<JobData, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (jobData.jobUrl === undefined) {
    jobData.jobUrl = '';
  }
  
  const now = Timestamp.now();
  const jobWithMetadata: JobData = {
    ...jobData,
    userId,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  // Save to user's jobs collection
  const jobsRef = collection(db, 'users', userId, 'jobs');
  const newJobRef = doc(jobsRef);
  await setDoc(newJobRef, jobWithMetadata);
  
  // Also save to global queue collection with job document ID
  const queueRef = collection(db, 'jobQueue');
  const queueJobRef = doc(queueRef);
  const queueJobData = {
    ...jobWithMetadata,
    jobDocumentId: newJobRef.id, // Include the job document ID
    queueId: queueJobRef.id,
    createdAt: now,
    updatedAt: now
  };
  await setDoc(queueJobRef, queueJobData);
  
  return newJobRef.id;
};

// Get all jobs for a user
export const getUserJobs = async (userId: string): Promise<Array<JobData & { id: string }>> => {
  const jobsRef = collection(db, 'users', userId, 'jobs');
  const q = query(
    jobsRef,
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const jobs: Array<JobData & { id: string }> = [];
  
  querySnapshot.forEach((doc) => {
    jobs.push({ 
      id: doc.id, 
      ...doc.data() 
    } as JobData & { id: string });
  });
  
  return jobs;
};

// Update job status
export const updateJobStatus = async (userId: string, jobId: string, status: JobData['status']): Promise<void> => {
  const jobRef = doc(db, 'users', userId, 'jobs', jobId);
  await updateDoc(jobRef, {
    status,
    updatedAt: Timestamp.now()
  });
};

// Update AI resume in job data
export const updateAIResume = async (userId: string, jobId: string, aiResume: ResumeData): Promise<void> => {
  const jobRef = doc(db, 'users', userId, 'jobs', jobId);
  await updateDoc(jobRef, {
    aiResume,
    updatedAt: Timestamp.now()
  });
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