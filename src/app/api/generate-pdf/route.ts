"use server";

import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator } from '../../../html-pdf-generator';
import type { ResumeData } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const data: ResumeData = await request.json();
    
    // Create a new HTML PDF generator with the provided data
    const generator = new HTMLPDFGenerator(data);
    
    // Generate PDF
    const buffer = await generator.generate();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.name.replace(/\s+/g, '_')}_resume.pdf"`,
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