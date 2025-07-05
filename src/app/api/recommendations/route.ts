"use server";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * Cleans AI response text by removing hidden characters, markdown formatting,
 * and other artifacts that might be present in AI-generated content
 */
function cleanAIResponse(text: string): string {
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

export async function POST(request: NextRequest) {
    try {
        const { resumeData } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Resume data is required' 
                }, 
                { status: 400 }
            );
        }

        const genai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const response = await genai.models.generateContent({
            model: "gemini-2.5-pro", // gemini-2.5-flash
            contents: `
            You are a hiring manager. You are given a resume and are tasked with providing recommendations on how to improve the resume.

            You will return a JSON object with the following properties:
            - changeSummary: A summary of the changes made to the resume.
            - recommendations: An array of recommendations for the resume.

            Here is my current resume:
            ${JSON.stringify(resumeData)}`,
            config: {
                responseMimeType: "application/json",
            }
        });

        // Extract and clean the response content
        const rawResponseText = response.text || JSON.stringify(response);
        const cleanedResponseText = cleanAIResponse(rawResponseText);
        
        // Parse the cleaned JSON response
        let parsedContent;
        try {
            parsedContent = JSON.parse(cleanedResponseText);
        } catch (parseError) {
            console.error('Failed to parse cleaned response as JSON:', parseError);
            // If parsing fails, return the cleaned text as a fallback
            return NextResponse.json({ 
                success: true, 
                content: { rawResponse: cleanedResponseText } 
            });
        }
        
        return NextResponse.json({ 
            success: true, 
            content: parsedContent 
        });
    } catch (error) {
        console.error('Error generating resume:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to generate resume' 
            }, 
            { status: 500 }
        );
    }
} 