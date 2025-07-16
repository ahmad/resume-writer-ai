'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthPageProps {
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, initialMode = 'login' }) => {
  const isLogin = initialMode === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            {isLogin ? 'Welcome back to ResumeOracle' : 'Join ResumeOracle to get started'}
          </p>
        </div>

        <div className="bg-white py-6 px-4 rounded-lg border border-gray-200">
          {initialMode ? (
            <LoginForm
              onSuccess={onSuccess}
            />
          ) : (
            <SignupForm
              onSuccess={onSuccess}
            />
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="text-center">
          {isLogin ? (
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 