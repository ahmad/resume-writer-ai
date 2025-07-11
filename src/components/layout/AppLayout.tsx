'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '@/components/auth/UserProfile';

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
  pageTitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showBackButton = false,
  backButtonHref = '/',
  backButtonText = '← Home',
  pageTitle
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Profile */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">ResumeOracle</h1>
            {showBackButton && (
              <Link 
                href={backButtonHref}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {backButtonText}
              </Link>
            )}
            {pageTitle && (
              <span className="text-sm text-gray-500">• {pageTitle}</span>
            )}
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}; 