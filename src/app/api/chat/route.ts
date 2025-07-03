"use server";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { defaultResumeData } from '../../../resume-config'

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
        const { jobDescription } = await request.json();

        const genai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const response = await genai.models.generateContent({
            model: "gemini-2.5-pro", // gemini-2.5-flash
            contents: `You are a resume builder!
            
            I will give you my current resume and a job description.

            Update the resume and return it in the same format as the current resume.

            Your goal is to make the resume more relevant to the job description.
            You can change to summary. You can update the experience bullet points to be more relevant to the job description. 
            Add keywords to the experience bullet points to make it more relevant to the job description.

            Do not change the format of the resume.
            Do not lie about my skills or experience.
            Do not change the order of the experience.

            Here is my current resume:
            ${JSON.stringify(defaultResumeData)}
            
            Here is the job description is: ${jobDescription}`,
            config: {
                responseMimeType: "application/json",
            }

            // config: {
            //     responseMimeType: "application/json",
            //     responseSchema: {
            //         type: "object",
            //         properties: {
            //             summary: {
            //                 type: "string",
            //             }
            //         },
            //     }
            // },
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