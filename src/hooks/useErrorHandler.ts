import { useState, useCallback } from 'react';

export interface FormValidationError {
  field: string;
  message: string;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<FormValidationError[]>([]);
  
  const handleError = useCallback((error: unknown, fallbackMessage?: string) => {
    const message = error instanceof Error ? error.message : fallbackMessage || 'An error occurred';
    setError(message);
    console.error('Error:', error);
  }, []);
  
  const handleValidationError = useCallback((field: string, message: string) => {
    setValidationErrors(prev => [...prev.filter(e => e.field !== field), { field, message }]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setValidationErrors([]);
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors(prev => prev.filter(e => e.field !== field));
  }, []);
  
  const getFieldError = useCallback((field: string) => {
    return validationErrors.find(e => e.field === field)?.message;
  }, [validationErrors]);

  const hasErrors = error !== null || validationErrors.length > 0;
  
  return { 
    error, 
    validationErrors,
    handleError, 
    handleValidationError,
    clearError, 
    clearFieldError,
    getFieldError,
    hasErrors
  };
}; 