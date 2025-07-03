// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import { ResumeData } from './types';
// import { DesignConfig } from './design-config';

// export class ResumeGenerator {
//   private doc: InstanceType<typeof PDFDocument>;
//   private data: ResumeData;

//   constructor(data: ResumeData) {
//     this.data = data;
//     this.doc = new PDFDocument({
//       size: 'A4',
//       margins: {
//         top: DesignConfig.layout.margin,
//         bottom: DesignConfig.layout.margin,
//         left: DesignConfig.layout.margin,
//         right: DesignConfig.layout.margin
//       }
//     });
//   }

//   private addLine(): void {
//     // Save the current graphics state
//     this.doc.save();
    
//     // Reset any drawing state that might cause unwanted borders
//     this.doc.lineWidth(0);
//     this.doc.strokeColor('black');
    
//     // Just add spacing without any drawing operations
//     this.doc.moveDown(DesignConfig.spacing.lineSpacing);
    
//     // Restore the graphics state
//     this.doc.restore();
//   }

//   generateToStream(): NodeJS.ReadableStream {
//     this.addHeader();
//     this.addSummary();
//     this.addSkills();
//     this.addExperience();
//     this.addProjects();
//     this.addEducation();

//     // Finalize the PDF
//     this.doc.end();
    
//     return this.doc;
//   }

//   generate(outputPath: string): void {
//     // Pipe the PDF to a file
//     this.doc.pipe(fs.createWriteStream(outputPath));

//     this.generateToStream();
//   }

//   private addHeader(): void {
//     // Name - large and bold
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.large)
//       .text(this.data.name, { align: 'center', characterSpacing: DesignConfig.characterSpacing.default, width: DesignConfig.layout.pageWidth });


//     this.doc.fillColor(DesignConfig.colors.accent);

//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.header)
//       .text(this.data.title, { align: 'center', characterSpacing: DesignConfig.characterSpacing.default, width: DesignConfig.layout.pageWidth });

//     this.doc.fillColor(DesignConfig.colors.primary);

//     // Contact information - smaller font
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.body)
//       .moveDown(DesignConfig.spacing.lineSpacing);

//     const contactInfo = `${this.data.email} • ${this.data.phone} • ${this.data.website}`;
//     this.doc.text(contactInfo, { align: 'center', width: DesignConfig.layout.pageWidth, characterSpacing: DesignConfig.characterSpacing.default });

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);

//     // this.addLine();

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }

//   private addSummary(): void {
//     // Section header
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.sectionHeader)
//       .fillColor(DesignConfig.colors.accent)
//       .text('SUMMARY', { align: 'left', characterSpacing: DesignConfig.characterSpacing.sectionHeader, width: DesignConfig.layout.pageWidth });

//     this.doc.fillColor(DesignConfig.colors.primary);

//     // this.doc.moveDown(0.5);
//     this.addLine();

//     // Summary text
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.body)
//       .text(this.data.summary, { 
//         align: 'left',
//         width: DesignConfig.layout.pageWidth,
//         lineGap: DesignConfig.lineGap.body,
//         characterSpacing: DesignConfig.characterSpacing.default
//       });

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }

//   private addSkills(): void {
//     // Section header
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.sectionHeader)
//       .fillColor(DesignConfig.colors.accent)
//       .text('SKILLS', { align: 'left', characterSpacing: DesignConfig.characterSpacing.sectionHeader, width: DesignConfig.layout.pageWidth });

//     this.doc.fillColor(DesignConfig.colors.primary);

//     // this.doc.moveDown(0.5);
//     this.addLine();



//     const skills = this.data.skills.join(' • ');
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.body)
//       .text(skills, { align: 'left', width: DesignConfig.layout.pageWidth, lineGap: DesignConfig.lineGap.body, characterSpacing: DesignConfig.characterSpacing.default });


//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }

//   private addExperience(): void {
//     // Section header
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.sectionHeader)
//       .fillColor(DesignConfig.colors.accent)
//       .text('EXPERIENCE', { align: 'left', characterSpacing: DesignConfig.characterSpacing.sectionHeader, width: DesignConfig.layout.pageWidth });

//     this.doc.fillColor(DesignConfig.colors.primary);

//     this.addLine();

//     this.data.experience.forEach((exp, index) => {
//       // Job title and company
//       this.doc
//         .font(DesignConfig.fonts.bold)
//         .fontSize(DesignConfig.fontSize.subheader)
//         .text(exp.title, { align: 'left', characterSpacing: DesignConfig.characterSpacing.default, continued: true });

//       // Period and location
//       this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.body)
//       .text(exp.period, { align: 'right', characterSpacing: DesignConfig.characterSpacing.default });

//       this.doc.moveDown(DesignConfig.spacing.lineSpacing);

//       this.doc
//         .fillColor(DesignConfig.colors.accent)
//         .font(DesignConfig.fonts.bold)
//         .fontSize(DesignConfig.fontSize.body)
//         .text(exp.company, { align: 'left', characterSpacing: DesignConfig.characterSpacing.default, continued: true });

//       this.doc.fillColor(DesignConfig.colors.primary);

//       this.doc
//         .font(DesignConfig.fonts.regular)
//         .fontSize(DesignConfig.fontSize.body)
//         .text(exp.location, { align: 'right', characterSpacing: DesignConfig.characterSpacing.default });

//       this.doc.moveDown(DesignConfig.spacing.lineSpacing);

//       // Bullet points
//       exp.bullets.forEach(bullet => {
//         this.doc
//           .font(DesignConfig.fonts.regular)
//           .fontSize(DesignConfig.fontSize.body)
//           .list([bullet], {
//             indent: 10,
//             bulletIndent: 20,
//             bulletRadius: 2,
//             characterSpacing: DesignConfig.characterSpacing.default,
//             lineGap: DesignConfig.lineGap.bullet
//           });
//       });

//       if (index < this.data.experience.length - 1) {
//         this.doc.moveDown(DesignConfig.spacing.lineSpacing);
//       }
//     });

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }

//   private addEducation(): void {
//     // Section header
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.sectionHeader)
//       .fillColor(DesignConfig.colors.accent)
//       .text('EDUCATION', { align: 'left', characterSpacing: DesignConfig.characterSpacing.sectionHeader, width: DesignConfig.layout.pageWidth });

//     this.doc.fillColor(DesignConfig.colors.primary);

//     // this.doc.moveDown(0.5);
//     this.addLine();

//     this.data.education.forEach(edu => {
//       // Degree and school
//       this.doc
//         .font(DesignConfig.fonts.bold)
//         .fontSize(DesignConfig.fontSize.body)
//         .text(edu.degree, { align: 'left', characterSpacing: DesignConfig.characterSpacing.default, width: DesignConfig.layout.pageWidth });

//       this.doc.moveDown(DesignConfig.spacing.lineSpacing);
//       // School, location, and year
//       this.doc
//         .font(DesignConfig.fonts.regular)
//         .fontSize(DesignConfig.fontSize.body)
//         .text(`${edu.school} • ${edu.location} • ${edu.year}`, { align: 'left', characterSpacing: DesignConfig.characterSpacing.default, width: DesignConfig.layout.pageWidth });
//     });

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }

//   private addProjects(): void {
//     // Section header
//     this.doc
//       .font(DesignConfig.fonts.regular)
//       .fontSize(DesignConfig.fontSize.sectionHeader)
//       .fillColor(DesignConfig.colors.accent)
//       .text('PROJECTS', { align: 'left', characterSpacing: DesignConfig.characterSpacing.sectionHeader, width: DesignConfig.layout.pageWidth });
  
//     this.doc.fillColor(DesignConfig.colors.primary);

//     this.addLine();

//     this.data.projects.forEach(project => {
  
//       this.doc
//         .font(DesignConfig.fonts.bold)
//         .fontSize(DesignConfig.fontSize.subheader)
//         .text(project.title, { 
//           align: 'left', 
//           characterSpacing: DesignConfig.characterSpacing.default, 
//           width: DesignConfig.layout.pageWidth, 
//           continued: true,
//           lineGap: DesignConfig.lineGap.body
//         });

//         this.doc
//         .font(DesignConfig.fonts.regular)
//         .fontSize(DesignConfig.fontSize.body)
//         .fillColor(DesignConfig.colors.accent)
//         .text(project.link.label, { 
//           align: 'right', 
//           characterSpacing: DesignConfig.characterSpacing.default, 
//           width: DesignConfig.layout.pageWidth,
//           link: project.link.href
//         });

//         this.doc.fillColor(DesignConfig.colors.primary);


//         this.doc.moveDown(DesignConfig.spacing.lineSpacing);
//         this.doc
//         .font(DesignConfig.fonts.regular)
//         .fontSize(DesignConfig.fontSize.body)
//         .text(project.description, { 
//           align: 'left', 
//           characterSpacing: DesignConfig.characterSpacing.default, 
//           width: DesignConfig.layout.pageWidth,
//           lineGap: DesignConfig.lineGap.bullet
//         });


//         this.doc.moveDown(DesignConfig.spacing.lineSpacing);
//     });

//     this.doc.moveDown(DesignConfig.spacing.sectionSpacing);
//   }
// } 