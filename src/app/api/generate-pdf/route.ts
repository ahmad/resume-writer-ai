"use server";

import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator, CoverLetterPDFGenerator } from '../../../html-pdf-generator';
import type { ResumeData, CoverLetter } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    let buffer: Buffer;
    let filename: string;
    
    if (type === 'resume') {
      const resumeData = data as ResumeData;
      const generator = new HTMLPDFGenerator(resumeData);
      buffer = await generator.generate();
      filename = `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`;
    } else if (type === 'cover-letter') {
      const coverLetterData = data as CoverLetter;
      // For cover letter, we need resume data for the signature
      // This is a simplified approach - in a real app you might want to pass resume data separately
      const generator = new CoverLetterPDFGenerator(coverLetterData, {
        changeSummary: '',
        name: 'Ahmad Amin',
        email: 'info@ahmadamin.com',
        phone: '+1(347) 527-8553',
        title: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
        summary: '',
        skills: {},
        experience: [],
        education: [],
        projects: []
      });
      buffer = await generator.generate();
      filename = `${coverLetterData.recipientName.replace(/\s+/g, '_')}_cover_letter.pdf`;
    } else {
      throw new Error('Invalid type specified. Must be "resume" or "cover-letter"');
    }
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 