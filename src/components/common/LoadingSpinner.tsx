import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  color?: 'blue' | 'white' | 'green';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    green: 'border-green-500'
  };
  
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
}; 