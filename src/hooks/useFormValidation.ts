import { useState, useCallback } from 'react';
import { FormValidationError } from './useErrorHandler';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<FormValidationError[]>([]);

  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return `${field} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === '') return null;

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `${field} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${field} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${field} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: Record<string, string>): boolean => {
    const newErrors: FormValidationError[] = [];

    Object.keys(rules).forEach(field => {
      const value = data[field] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors.push({ field, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [rules, validateField]);

  const validateSingleField = useCallback((field: string, value: string): boolean => {
    const error = validateField(field, value);
    
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      if (error) {
        return [...filtered, { field, message: error }];
      }
      return filtered;
    });

    return !error;
  }, [validateField]);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => prev.filter(e => e.field !== field));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors.find(e => e.field === field)?.message;
  }, [errors]);

  const hasErrors = errors.length > 0;

  return {
    errors,
    validateForm,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasErrors
  };
}; 