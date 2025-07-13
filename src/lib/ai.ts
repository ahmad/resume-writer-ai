/**
 * Cleans AI response text by removing hidden characters, markdown formatting,
 * and other artifacts that might be present in AI-generated content
 */
export function cleanAIResponse(text: string): string {
    if (!text) return text;
    
    return text
        // Remove zero-width characters and other invisible characters
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        // Remove common AI artifacts and markdown formatting
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^```\s*/g, '')
        // Remove any leading/trailing whitespace
        .trim()
        // Remove any BOM characters
        .replace(/^\uFEFF/, '')
        // Remove any control characters except tabs
        .replace(/[\x00-\x08\x0A\x0B\x0C\x0E-\x1F\x7F]/g, '');
}


import { config } from '../config/environment';

export const GEMINI_KEY: string = config.ai.model ? process.env.GOOGLE_API_KEY! : '';
export const GEMINI_MODEL: string = config.ai.model;

if (!GEMINI_KEY) {
    throw new Error('GOOGLE_API_KEY is not set');
}

if (!GEMINI_MODEL) {
    throw new Error('GEMINI_MODEL is not set');
}