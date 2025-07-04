import puppeteer from 'puppeteer';
import type { ResumeData } from './types';

export class HTMLPDFGenerator {
  private data: ResumeData;

  constructor(data: ResumeData) {
    this.data = data;
  }

  private generateHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${this.data.name} - Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 40px;
              font-size: 10px;
              line-height: 1.4;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .contact {
              font-size: 10px;
              color: #666;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-header {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .experience-item {
              margin-bottom: 15px;
            }
            .job-title {
              font-size: 12px;
              font-weight: bold;
              display: inline-block;
              width: 60%;
            }
            .period {
              font-size: 10px;
              text-align: right;
              display: inline-block;
              width: 40%;
            }
            .company {
              font-size: 11px;
              font-weight: bold;
              color: #2563eb;
              display: inline-block;
              width: 60%;
            }
            .location {
              font-size: 10px;
              text-align: right;
              display: inline-block;
              width: 40%;
            }
            .bullets {
              margin-left: 20px;
              margin-top: 5px;
            }
            .bullet {
              margin-bottom: 3px;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            .skill {
              background: #e6f3ff;
              color: #2563eb;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 9px;
            }
            .project-item {
              margin-bottom: 15px;
            }
            .project-title {
              font-size: 12px;
              font-weight: bold;
              display: inline-block;
              width: 70%;
            }
            .project-link {
              font-size: 10px;
              color: #2563eb;
              text-align: right;
              display: inline-block;
              width: 30%;
            }
            .project-description {
              margin-top: 5px;
            }
            .education-item {
              margin-bottom: 10px;
            }
            .degree {
              font-size: 11px;
              font-weight: bold;
            }
            .school-info {
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${this.data.name}</div>
            <div class="title">${this.data.title}</div>
            <div class="contact">${this.data.email} • ${this.data.phone} • ${this.data.website}</div>
          </div>

          <div class="section">
            <div class="section-header">SUMMARY</div>
            <div>${this.data.summary}</div>
          </div>

          <div class="section">
            <div class="section-header">SKILLS</div>
            <div class="skills">
              ${Object.keys(this.data.skills).map(key => `
                <div class="skill-category">
                  <div class="skill-category-header">${key}</div>
                  <div class="skill-list">
                    ${this.data.skills[key].map(skill => `<span class="skill">${skill}</span>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-header">EXPERIENCE</div>
            ${this.data.experience.map(exp => `
              <div class="experience-item">
                <div>
                  <span class="job-title">${exp.title}</span>
                  <span class="period">${exp.period}</span>
                </div>
                <div>
                  <span class="company">${exp.company}</span>
                  <span class="location">${exp.location}</span>
                </div>
                <div class="bullets">
                  ${exp.bullets.map(bullet => `<div class="bullet">• ${bullet}</div>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-header">PROJECTS</div>
            ${this.data.projects.map(project => `
              <div class="project-item">
                <div>
                  <span class="project-title">${project.title}</span>
                  <span class="project-link">${project.link.label}</span>
                </div>
                <div class="project-description">${project.description}</div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-header">EDUCATION</div>
            ${this.data.education.map(edu => `
              <div class="education-item">
                <div class="degree">${edu.degree}</div>
                <div class="school-info">${edu.school} • ${edu.location} • ${edu.year}</div>
              </div>
            `).join('')}
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