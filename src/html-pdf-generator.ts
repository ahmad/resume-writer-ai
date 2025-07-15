import puppeteer from 'puppeteer';
import type { ResumeData } from './types';

export type ResumeTemplate = 'modern' | 'ats-friendly';

export class HTMLPDFGenerator {
  private data: ResumeData;
  private template: ResumeTemplate;

  constructor(data: ResumeData, template: ResumeTemplate = 'modern') {
    this.data = data;
    this.template = template;
  }

  private generateHTML(): string {
    if (this.template === 'ats-friendly') {
      return this.generateATSFriendlyHTML();
    }
    return this.generateModernHTML();
  }

  private generateATSFriendlyHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${this.data.name} - Resume</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
            
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 0;
              padding: 20px;
              background-color: white;
              color: #000000;
              font-size: 12px;
              line-height: 1.4;
            }
            
            .resume-container {
              background-color: white;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header-section {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000000;
              padding-bottom: 15px;
            }
            
            .name {
              font-size: 24px;
              font-weight: 700;
              color: #000000;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            
            .title {
              font-size: 16px;
              font-weight: 400;
              color: #000000;
              margin-bottom: 10px;
            }
            
            .contact-info {
              font-size: 12px;
              color: #000000;
              margin-bottom: 5px;
            }
            
            .section {
              margin-bottom: 15px;
            }
            
            .section-title {
              font-size: 14px;
              font-weight: 700;
              color: #000000;
              margin-bottom: 8px;
              text-transform: uppercase;
              border-bottom: 1px solid #000000;
              padding-bottom: 2px;
            }
            
            .summary {
              color: #000000;
              margin-bottom: 15px;
              font-size: 12px;
              text-align: justify;
            }
            
            .skills-section {
              margin-bottom: 15px;
            }
            
            .skill-category {
              margin-bottom: 8px;
            }
            
            .skill-category-name {
              font-weight: 700;
              font-size: 12px;
              margin-bottom: 3px;
            }
            
            .skill-list {
              font-size: 12px;
              color: #000000;
            }
            
            .experience-item {
              margin-bottom: 12px;
            }
            
            .job-header {
              font-weight: 700;
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .job-meta {
              font-size: 12px;
              color: #000000;
              margin-bottom: 5px;
              font-style: italic;
            }
            
            .job-bullets {
              margin-left: 20px;
              list-style-type: disc;
            }
            
            .job-bullet {
              font-size: 12px;
              color: #000000;
              margin-bottom: 2px;
            }
            
            .project-item {
              margin-bottom: 8px;
            }
            
            .project-title {
              font-weight: 700;
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .project-description {
              font-size: 12px;
              color: #000000;
              margin-left: 20px;
            }
            
            .education-item {
              margin-bottom: 8px;
            }
            
            .degree {
              font-weight: 700;
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .school-info {
              font-size: 12px;
              color: #000000;
              font-style: italic;
            }
            
            @media print {
              body {
                background-color: white;
                padding: 0;
              }
              
              .resume-container {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header-section">
              <div class="name">${this.data.name}</div>
              <div class="title">${this.data.title}</div>
              <div class="contact-info">${this.data.location} | ${this.data.email} | ${this.data.phone}</div>
              ${this.data.linkedin ? `<div class="contact-info">LinkedIn: ${this.data.linkedin}</div>` : ''}
              ${this.data.github ? `<div class="contact-info">GitHub: ${this.data.github}</div>` : ''}
              ${this.data.website ? `<div class="contact-info">Website: ${this.data.website}</div>` : ''}
            </div>
            
            ${this.data.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <div class="summary">${this.data.summary}</div>
            </div>
            ` : ''}
            
            ${Object.keys(this.data.skills).length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
              ${Object.keys(this.data.skills).map(key => `
                <div class="skill-category">
                  <div class="skill-category-name">${key}:</div>
                  <div class="skill-list">${this.data.skills[key].filter(skill => skill.trim()).join(', ')}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${this.data.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              ${this.data.experience.map(exp => `
                <div class="experience-item">
                  <div class="job-header">${exp.title}</div>
                  <div class="job-meta">${exp.company} | ${exp.period} | ${exp.location}</div>
                  ${exp.bullets.filter(bullet => bullet.trim()).length > 0 ? `
                    <ul class="job-bullets">
                      ${exp.bullets.filter(bullet => bullet.trim()).map(bullet => `<li class="job-bullet">${bullet}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${this.data.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${this.data.projects.map(project => `
                <div class="project-item">
                  <div class="project-title">${project.title}</div>
                  <div class="project-description">${project.description}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${this.data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${this.data.education.map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree}</div>
                  <div class="school-info">${edu.school} | ${edu.year} | ${edu.location}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;
  }

  private generateModernHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${this.data.name} - Resume</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 24px;
              background-color: #f9fafb;
              color: #111827;
              font-size: 12px;
              line-height: 1.5;
            }
            
            .resume-container {
              background-color: white;
              border-radius: 0;
              padding: 24px;
              max-width: 800px;
              margin: 0 auto;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            .header-section {
              margin-bottom: 10px;
            }
            
            .name {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 0px;
            }
            
            .title {
              font-size: 16px;
              font-weight: 600;
              color: #1d4ed8;
              margin-bottom: 0px;
            }
            
            .contact-info {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 0px;
            }
            
            .links {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 10px;
            }
            
            .links a {
              color: #1d4ed8;
              text-decoration: underline;
              margin-right: 8px;
            }
            
            .summary {
              color: #374151;
              margin-bottom: 16px;
              font-size: 12px;
            }
            
            .section {
              margin-bottom: 16px;
            }
            
            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 4px;
            }
            
            .skills-grid {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            
            .skill-category {
              display: flex;
              gap: 4px;
            }
            
            .skill-category-name {
              width: 25%;
              font-weight: 600;
              font-size: 12px;
            }
            
            .skill-tags {
              width: 75%;
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
            }
            
            .skill-tag {
              background-color: #dbeafe;
              color: #1e40af;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
            }
            
            .project-item {
              margin-bottom: 4px;
            }
            
            .project-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 2px;
            }
            
            .project-title {
              font-weight: 600;
              font-size: 12px;
            }
            
            .project-link {
              color: #1d4ed8;
              text-decoration: underline;
              font-size: 11px;
            }
            
            .project-description {
              font-size: 11px;
              color: #374151;
              margin-left: 16px;
            }
            
            .experience-item {
              margin-bottom: 8px;
            }
            
            .job-header {
              font-weight: 600;
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .job-meta {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            
            .job-bullets {
              margin-left: 16px;
              list-style-type: disc;
            }
            
            .job-bullet {
              font-size: 12px;
              color: #374151;
              margin-bottom: 2px;
            }
            
            .education-item {
              margin-bottom: 4px;
            }
            
            .degree {
              font-weight: 600;
              font-size: 12px;
            }
            
            .school-info {
              font-size: 11px;
              color: #6b7280;
            }
            
            @media print {
              body {
                background-color: white;
                padding: 0;
              }
              
              .resume-container {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header-section">
              <div class="name">${this.data.name}</div>
              <div class="title">${this.data.title}</div>
              <div class="contact-info">${this.data.location} | ${this.data.email} | ${this.data.phone}</div>
              <div class="links">
                <a href="https://${this.data.linkedin}">${this.data.linkedin}</a>
                <a href="https://${this.data.linkedin}">${this.data.github}</a>
                <a href="https://${this.data.website}">${this.data.website}</a>
              </div>
            </div>
            
            <div class="summary">${this.data.summary}</div>
            
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills-grid">
                ${Object.keys(this.data.skills).map(key => `
                  <div class="skill-category">
                    <div class="skill-category-name">${key}</div>
                    <div class="skill-tags">
                      ${this.data.skills[key].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            
            <div class="section">
              <div class="section-title">Experience</div>
              ${this.data.experience.map(exp => `
                <div class="experience-item">
                  <div class="job-header">${exp.title}, ${exp.company}</div>
                  <div class="job-meta">${exp.period} | ${exp.location}</div>
                  <ul class="job-bullets">
                    ${exp.bullets.map(bullet => `<li class="job-bullet">${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <div class="section-title">Education</div>
              ${this.data.education.map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree}</div>
                  <div class="school-info">${edu.school} (${edu.year})</div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async generate(): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      const html = this.generateHTML();
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '40px',
          bottom: '40px',
          left: '40px',
          right: '40px'
        },
        printBackground: true
      });
      
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}

export class CoverLetterPDFGenerator {
  private data: string;
  private resumeData: ResumeData;

  constructor(data: string, resumeData: ResumeData) {
    this.data = data;
    this.resumeData = resumeData;
  }

  private generateHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Cover Letter</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 24px;
              background-color: #f9fafb;
              color: #111827;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .cover-letter-container {
              background-color: white;
              border-radius: 12px;
              padding: 24px;
              max-width: 800px;
              margin: 0 auto;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            
            .header-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;
              margin-top: 24px;
            }
            
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
            }
            
            .date {
              text-align: left;
            }
            
            .recipient-section {
              margin-bottom: 24px;
            }
            
            .recipient-name {
              margin-bottom: 4px;
            }
            
            .recipient-title {
              margin-bottom: 4px;
            }
            
            
            .content {
              color: #374151;
              line-height: 1.6;
              white-space: pre-wrap;
              margin-bottom: 32px;
            }
            
            
            @media print {
              body {
                background-color: white;
                padding: 0;
              }
              
              .cover-letter-container {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="cover-letter-container">
            <div class="title">Ahmad Amin</div>
            <div class="contact-info">${this.resumeData.email}</div>
            <div class="contact-info">${this.resumeData.phone}</div>

            
            <div class="content">${this.data}</div>
            
            <div class="signature-section">
              <div>Sincerely,</div>
              <div class="signature-name">${this.resumeData.name}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async generate(): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      const html = this.generateHTML();
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '40px',
          bottom: '40px',
          left: '40px',
          right: '40px'
        },
        printBackground: true
      });
      
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
} 