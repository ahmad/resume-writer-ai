'use client';

import { getUserGeneratedResumes, JobData, updateAIResume } from "@/lib/firestore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { use, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { ResumeData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeForm from "@/components/resume/ResumeForm";

export default function GeneratePage({ params }: { params: Promise<{ jobId: string }>}) {
    const { jobId } = use(params);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<JobData | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<'original' | 'ai'>('ai');
    const [isEditing, setIsEditing] = useState(false);
    const [editedResume, setEditedResume] = useState<ResumeData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            if (!user?.uid) {
                console.log('User not authenticated, skipping fetch');
                setIsLoading(false);
                return;
            }

            try {
                const resume = await getUserGeneratedResumes(user.uid, jobId);

                if (!resume) {
                    setIsLoading(false);
                    return;
                }

                console.log("Job", resume);
                setJob(resume);
            } catch (error) {
                console.error('Error fetching resume:', error);
            } finally {
                setIsLoading(false);
            }
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

    console.log("currentResume",currentResume);

    const handleEditResume = () => {
        if (selectedVersion === 'ai' && job.aiResume) {
            setEditedResume(job.aiResume);
            setIsEditing(true);
        }
    };

    const handleSaveResume = async () => {
        if (!editedResume || !user) return;

        setIsSaving(true);
        try {
            await updateAIResume(user.uid, jobId, editedResume);
            // Update the local state
            setJob(prev => prev ? { ...prev, aiResume: editedResume } : null);
            setIsEditing(false);
            setShowPreview(false);
            alert('Resume saved successfully!');
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Error saving resume. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedResume(null);
        setShowPreview(false);
    };

    const handleResumeDataChange = (newData: Partial<ResumeData>) => {
        if (editedResume) {
            setEditedResume(prev => prev ? { ...prev, ...newData } : null);
        }
    };
            
    return (
        <ProtectedRoute>
            <AppLayout 
                showBackButton={true} 
                backButtonHref="/builder" 
                backButtonText="← Back to Builder"
                pageTitle={job.selectedResume.resumeName}
            >
                <div className="py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Resume for Job Application
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {job.selectedResume.resumeName}
                            </p>
                            {job.jobUrl && (
                                <div className="flex items-center gap-3">
                                    <a
                                        href={job.jobUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Original Job Posting
                                    </a>
                                    <span className="text-sm text-gray-500">
                                        Opens in new tab
                                    </span>
                                </div>
                            )}
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
                                        {selectedVersion === 'ai' && job.aiResume && (
                                            <button
                                                onClick={handleEditResume}
                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                            >
                                                Edit AI Resume
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resume Content */}
                    {isEditing && editedResume ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Edit AI Enhanced Resume
                                </h2>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveResume}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                            {showPreview ? (
                                <ResumePreview data={editedResume} isLoading={false} />
                            ) : (
                                <ResumeForm
                                    data={editedResume}
                                    onChange={handleResumeDataChange}
                                />
                            )}
                        </div>
                    ) : currentResume ? (
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
            </AppLayout>
        </ProtectedRoute>
    )
}