'use client';

import { getUserGeneratedResumes, JobData, updateAIResume, requeueJob } from "@/lib/firestore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { use, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { ResumeData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeForm from "@/components/resume/ResumeForm";
import CoverLetterPreview from "@/components/CoverLetter";

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
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [isReprocessing, setIsReprocessing] = useState(false);

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

    const handleReprocess = async () => {
        if (!user || !jobId) return;
        setIsReprocessing(true);
        try {
            await requeueJob(user.uid, jobId);
            setJob(prev => prev ? { ...prev, status: 'pending' } : prev);
            alert('Job re-queued for processing!');
        } catch (error) {
            console.error('Error re-queuing job:', error);
            alert('Failed to re-queue job. Please try again.');
        } finally {
            setIsReprocessing(false);
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
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Simple Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {job.selectedResume.resumeName}
                        </h1>
                        {job.jobUrl && (
                            <a
                                href={job.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                            >
                                View job posting
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>

                    {/* Minimal Controls */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {hasAiVersion && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedVersion('original')}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        selectedVersion === 'original'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Original
                                </button>
                                <button
                                    onClick={() => setSelectedVersion('ai')}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        selectedVersion === 'ai'
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    AI Enhanced
                                </button>
                            </div>
                        )}
                        {/* Reprocess Button: show if job is not pending or processing */}
                        {job.status !== 'pending' && job.status !== 'processing' && (
                            <button
                                onClick={handleReprocess}
                                disabled={isReprocessing}
                                className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isReprocessing ? 'Reprocessing...' : 'Reprocess'}
                            </button>
                        )}
                        
                        {selectedVersion === 'ai' && job.aiResume && (
                            <button
                                onClick={handleEditResume}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Edit
                            </button>
                        )}

                        {job.aiCoverLetter && (
                            <button
                                onClick={() => setShowCoverLetter(!showCoverLetter)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    showCoverLetter
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {showCoverLetter ? 'Hide Cover Letter' : 'Cover Letter'}
                            </button>
                        )}
                    </div>

                    {/* Resume Content */}
                    {isEditing && editedResume ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Editing Resume
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        {showPreview ? 'Edit' : 'Preview'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveResume}
                                        disabled={isSaving}
                                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
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
                        <div className="text-center py-12 text-gray-500">
                            <p>
                                {selectedVersion === 'ai' 
                                    ? 'AI Enhanced Resume not available'
                                    : 'Original Resume not available'
                                }
                            </p>
                        </div>
                    )}

                    {/* Cover Letter Content */}
                    {showCoverLetter && job.aiCoverLetter && (
                        <div className="mt-8">
                            <CoverLetterPreview 
                                data={job.aiCoverLetter} 
                                resumeData={currentResume || job.selectedResume} 
                                isLoading={false} 
                            />
                        </div>
                    )}

                    {/* Job Description */}
                    {job.jobDescription && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                                Job Description
                            </h3>
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {job.jobDescription}
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    )
}