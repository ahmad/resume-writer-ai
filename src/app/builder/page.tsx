'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import AdvancedResumeBuilder from '@/components/resume/AdvancedResumeBuilder';

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <AppLayout showBackButton={true} backButtonHref="/" backButtonText="← Home">
        <AdvancedResumeBuilder />
      </AppLayout>
    </ProtectedRoute>
  );
} 