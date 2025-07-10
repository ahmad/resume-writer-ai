'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserProfile } from '@/components/auth/UserProfile';
import AdvancedResumeBuilder from '@/components/resume/AdvancedResumeBuilder';
import Link from 'next/link';

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Profile */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">ResumeOracle</h1>
              <Link 
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Home
              </Link>
            </div>
            <UserProfile />
          </div>
        </div>

        <AdvancedResumeBuilder />
      </div>
    </ProtectedRoute>
  );
} 