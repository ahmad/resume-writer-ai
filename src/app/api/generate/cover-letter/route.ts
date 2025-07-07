"use server";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { cleanAIResponse, GEMINI_KEY, GEMINI_MODEL } from '@/lib/ai';



function generateCoverLetterPrompt(jobDescription: string, resumeData: Record<string, unknown>) {
    return `
Act as an expert cover letter writer. Your task is to create a compelling cover letter for the job application based on the job description and resume information provided.

1. Resume Information:
${JSON.stringify(resumeData)}

2. Job Description:
${jobDescription}

3. Your Task:

Create a professional cover letter that:
- Addresses the hiring manager appropriately (use "Dear Hiring Manager" if no specific name is provided)
- Opens with a strong hook that connects your background to the role
- Demonstrates your understanding of the company and position
- Highlights your most relevant experience and achievements from your resume
- Shows enthusiasm for the opportunity
- Closes with a call to action
- Uses a professional tone throughout

4. Output Format:

Return the cover letter in the following JSON format:
{
  "recipientName": "Hiring Manager",
  "recipientTitle": "[Job Title from description]",
  "companyName": "[Company name extracted from description]",
  "content": "Dear Hiring Manager,\n\n[Your cover letter content here with proper paragraphs separated by \\n\\n]",
  "date": "[Current date in YYYY-MM-DD format]"
}

5. Important Notes:
- Make the content specific to the job description
- Use information from the resume to support your claims
- Keep it concise but comprehensive (around 300-400 words)
- Use proper business letter formatting
- *DO NOT CHANGE THE FORMAT OF THE JSON OBJECT UNDER ANY CIRCUMSTANCES!*
    `;
}

export async function POST(request: NextRequest) {
    try {
        const { jobDescription, resumeData } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Resume data is required' 
                }, 
                { status: 400 }
            );
        }

        if (!jobDescription) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Job description is required' 
                }, 
                { status: 400 }
            );
        }

        const genai = new GoogleGenAI({
            apiKey: GEMINI_KEY,
        });

        // Generate cover letter
        const coverLetterResponse = await genai.models.generateContent({
            model: GEMINI_MODEL,
            contents: generateCoverLetterPrompt(jobDescription, resumeData),
            config: {
                responseMimeType: "application/json",
            }
        });

        // Extract and clean the cover letter response
        const rawCoverLetterText = coverLetterResponse.text || JSON.stringify(coverLetterResponse);
        const cleanedCoverLetterText = cleanAIResponse(rawCoverLetterText);
        
        let parsedCoverLetter;
        try {
            parsedCoverLetter = JSON.parse(cleanedCoverLetterText);
        } catch (parseError) {
            console.error('Failed to parse cover letter response as JSON:', parseError);
            parsedCoverLetter = {
                recipientName: "Hiring Manager",
                recipientTitle: "Software Engineer",
                companyName: "Company",
                content: "Dear Hiring Manager,\n\nI am writing to express my interest in the position. Please see my attached resume for my qualifications.\n\nSincerely,\n[Your Name]",
                date: new Date().toISOString().slice(0, 10)
            };
        }
        
        return NextResponse.json({ 
            success: true, 
            content: parsedCoverLetter
        });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to generate cover letter' 
            }, 
            { status: 500 }
        );
    }
}
