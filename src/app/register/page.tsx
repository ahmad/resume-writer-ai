'use client';

import React from 'react';
import { AuthPage } from '@/components/auth/AuthPage';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return <AuthPage onSuccess={handleAuthSuccess} initialMode="register" />;
} 