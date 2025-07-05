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

function generateResumePrompt(jobDescription: string) {
    return `
Act as an expert resume writer and career coach. Your task is to take my current resume and the job description for a position I am targeting and create a new, updated version of my resume that is highly tailored to this specific role.

1. My Current Resume:
${JSON.stringify(defaultResumeData)}

2. The Job Description:
${jobDescription}

3. Your Task and Desired Output:

First, thoroughly analyze the job description to identify the key keywords, required skills (both hard and soft), qualifications, and the company's core values or mission if mentioned.

Next, critically evaluate my current resume against this analysis.

Then, rewrite my resume with the following goals:

Compelling Professional Summary: Create a powerful and concise professional summary (3-4 sentences) that immediately highlights my most relevant qualifications and experience for this specific job. It should be tailored to grab the hiring manager's attention.

Optimized Experience Section: For each relevant role in my experience section, rewrite the bullet points to:

Incorporate keywords from the job description naturally.

Focus on accomplishments rather than just duties. Quantify my achievements with metrics and data wherever possible (e.g., "Increased sales by 15%," "Managed a budget of $500,000," "Reduced project completion time by 20%").

Use strong action verbs to start each bullet point.

Align my described experiences directly with the responsibilities and requirements outlined in the job description.

Targeted Skills Section: Create a "Skills" section that is organized and directly reflects the most important skills mentioned in the job description. You can categorize them (e.g., Technical Skills, Soft Skills, Certifications) if it makes sense for my profession.

Overall Tone and Professionalism: Ensure the entire resume has a professional, confident, and modern tone. The formatting should be clean and easy to read.

4. Output Format:

Return the updated resume in the same JSON format as my current resume.

Finally, after providing the updated resume, please also provide a brief summary where you explain why you made certain changes. This will help me understand the strategy behind the updates and prepare me for an interview. For example, explain why you chose a particular phrasing or how a certain bullet point now better reflects a key requirement of the job. This section should be in the same JSON format as the resume in the changeSummary property.

5. Important Notes:

- Do not change the format of the resume.
- Do not lie about my skills or experience.
- Do not change the order of the experience.
- Do not change the format of the resume.
- *DO NOT CHANGE THE FORMAT OF THE JSON OBJECT UNDER ANY CIRCUMSTANCES!*
    `;
}

function generateCoverLetterPrompt(jobDescription: string, resumeData: any) {
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
        const { jobDescription } = await request.json();

        const genai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });

        // Generate resume
        const resumeResponse = await genai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: generateResumePrompt(jobDescription),
            config: {
                responseMimeType: "application/json",
            }
        });

        // Extract and clean the resume response
        const rawResumeText = resumeResponse.text || JSON.stringify(resumeResponse);
        const cleanedResumeText = cleanAIResponse(rawResumeText);
        
        let parsedResume;
        try {
            parsedResume = JSON.parse(cleanedResumeText);
        } catch (parseError) {
            console.error('Failed to parse resume response as JSON:', parseError);
            parsedResume = { rawResponse: cleanedResumeText };
        }

        // Generate cover letter using the updated resume data
        const coverLetterResponse = await genai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: generateCoverLetterPrompt(jobDescription, parsedResume),
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
            content: {
                resume: parsedResume,
                coverLetter: parsedCoverLetter
            }
        });
    } catch (error) {
        console.error('Error generating resume and cover letter:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to generate resume and cover letter' 
            }, 
            { status: 500 }
        );
    }
} 