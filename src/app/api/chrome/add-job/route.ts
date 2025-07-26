
import { NextResponse } from 'next/server';
import { saveJobData, getDefaultResume } from '@/lib/firestore';
import { JobData } from '@/lib/firestore';

export async function POST(request: Request) {
    const { userId, jobDescription, url } = await request.json();

  if (!jobDescription || !url) {
    return NextResponse.json({ error: 'Missing jobDescription or url' }, { status: 400 });
  }

  try {
    const selectedResume = await getDefaultResume(userId);

    if (!selectedResume) {
      return NextResponse.json({ error: 'Missing default resume!' }, { status: 400 });
    }

    const jobData: Omit<JobData, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'aiResume' | 'aiCoverLetter'> = {
      jobDescription,
      jobUrl: url,
      selectedResume,
    };
    const jobId = await saveJobData(userId, jobData);
    return NextResponse.json({ message: 'Job added successfully', jobId }, { status: 200 });
  } catch (error) {
    console.error('Error saving job data:', error);
    return NextResponse.json({ error: 'Failed to add job' }, { status: 500 });
  }
}
