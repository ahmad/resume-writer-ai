"use server";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { cleanAIResponse, GEMINI_KEY, GEMINI_MODEL } from '@/lib/ai';


function generateResumePrompt(jobDescription: string, resumeData: Record<string, unknown>) {
    return `
Act as an expert resume writer and career coach. Your task is to take my current resume and the job description for a position I am targeting and create a new, updated version of my resume that is highly tailored to this specific role.

1. My Current Resume:
${JSON.stringify(resumeData)}

2. The Job Description:
${jobDescription}

3. Your Task and Desired Output:

First, thoroughly analyze the job description to identify the key keywords, required skills (both hard and soft), qualifications, and the company's core values or mission if mentioned.

Next, critically evaluate my current resume against this analysis.

Then, rewrite my resume with the following goals:
*Important: The languague used should read like a human wrote it AND not AI generated.*
*Important: The resume should be in the same language as the job description.*
*Important: Each jobs/experiences should have at least 3 bullet points.*

Compelling Professional Summary: Create a powerful and concise professional summary (3-4 sentences, 50 words max) that immediately highlights my most relevant qualifications and experience for this specific job. It should be tailored to grab the hiring manager's attention.

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

        // Generate resume
        const resumeResponse = await genai.models.generateContent({
            model: GEMINI_MODEL,
            contents: generateResumePrompt(jobDescription, resumeData),
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
        
        return NextResponse.json({ 
            success: true, 
            content: parsedResume
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
