import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  text = 'Loading...',
  className = ''
}) => {
  if (!isLoading) return null;
  
  return (
    <div className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10 ${className}`}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}; 