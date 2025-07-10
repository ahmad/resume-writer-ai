'use client';

import { getUserGeneratedResumes, JobData } from "@/lib/firestore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { use, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { ResumeData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import ResumePreview from "@/components/resume/ResumePreview";

export default function GeneratePage({ params }: { params: Promise<{ jobId: string }>}) {
    const { jobId } = use(params);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<JobData | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<'original' | 'ai'>('ai');

    useEffect(() => {
        const fetchResume = async () => {
            const resume = await getUserGeneratedResumes(user?.uid || '', jobId);

            if (!resume) {
                setIsLoading(false);
                return;
            }

            console.log(resume);
            setJob(resume);
            setIsLoading(false);
        }

        fetchResume();
    }, [jobId, user?.uid]);

    if (isLoading) {
        return <Loading />;
    }

    if (!job) {
        return <div>Resume not found</div>;
    }

    const currentResume = selectedVersion === 'ai' ? job.aiResume : job.selectedResume;
    const hasAiVersion = !!job.aiResume;
            
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Resume for Job Application
                        </h1>
                        <p className="text-gray-600">
                            {job.selectedResume.resumeName}
                        </p>
                    </div>

                    {/* Version Toggle */}
                    {hasAiVersion && (
                        <div className="mb-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            Resume Version
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Choose between your original resume and the AI-enhanced version
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => setSelectedVersion('original')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                selectedVersion === 'original'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Original
                                        </button>
                                        <button
                                            onClick={() => setSelectedVersion('ai')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                selectedVersion === 'ai'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            AI Enhanced
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resume Preview */}
                    {currentResume ? (
                        <ResumePreview data={currentResume} isLoading={false} />
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {selectedVersion === 'ai' ? 'AI Enhanced Resume' : 'Original Resume'} Not Available
                            </h3>
                            <p className="text-gray-600">
                                {selectedVersion === 'ai' 
                                    ? 'The AI-enhanced version of your resume is not yet available. Please check back later.'
                                    : 'The original resume data is not available.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Job Description (if available) */}
                    {job.jobDescription && (
                        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Job Description
                            </h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {job.jobDescription}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}