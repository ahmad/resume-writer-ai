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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Welcome back to Resume Writer AI' : 'Join Resume Writer AI to get started'}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
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