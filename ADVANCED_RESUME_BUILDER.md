# Advanced Resume Builder

The Advanced Resume Builder is a comprehensive tool that allows users to create and customize professional resumes with full control over every field. This feature complements the existing AI-powered resume builder by providing manual editing capabilities.

## Features

### 🔧 **Complete Customization**
- Edit every field of your resume including personal information, skills, experience, education, and projects
- Add, remove, and reorder sections as needed
- Customize skill categories and individual skills
- Manage multiple bullet points for each work experience

### 📱 **User-Friendly Interface**
- Tabbed interface for easy navigation between different sections
- Real-time preview of changes
- Intuitive form controls with proper validation
- Responsive design that works on all devices

### 💾 **Firebase Integration**
- Automatic saving to Firebase Firestore
- Multiple resume management
- User authentication required for data persistence
- Real-time synchronization across devices

### 👀 **Live Preview**
- Instant preview of resume changes
- Professional formatting
- Print-ready layout
- Export to PDF capability

## How to Use

### 1. **Access the Advanced Builder**
- Click the "Advanced Builder" tab in the header navigation
- This switches from the AI-powered builder to the manual editor

### 2. **Create a New Resume**
- Click "Create New Resume" to start with a template
- Or edit an existing resume from your saved list

### 3. **Edit Resume Sections**

#### **Basic Information**
- Full name, professional title, location
- Contact information (email, phone)
- Social links (LinkedIn, GitHub, website)
- Professional summary
- Change summary for tracking modifications

#### **Skills**
- Add custom skill categories
- Add/remove individual skills within each category
- Reorder skills as needed

#### **Work Experience**
- Job title, company, period, location
- Multiple bullet points for responsibilities and achievements
- Add/remove experience entries

#### **Education**
- Degree, school, location, year
- Add multiple education entries
- Remove entries as needed

#### **Projects**
- Project title and description
- Link to project (optional)
- Add/remove project entries

### 4. **Save and Manage**
- Click "Save Resume" to store changes in Firebase
- View all your saved resumes in the list view
- Edit or delete existing resumes
- Switch between different resume versions

### 5. **Preview and Export**
- Use the "Preview" tab to see the final formatted resume
- Download as PDF using the existing PDF generation feature

## Technical Implementation

### **Components**
- `AdvancedResumeBuilder.tsx` - Main container component
- `ResumeForm.tsx` - Comprehensive form with tabbed sections
- `ResumePreview.tsx` - Live preview component
- `ResumeList.tsx` - Resume management interface

### **Data Structure**
Uses the `ResumeData` interface from `src/types.ts`:
```typescript
interface ResumeData {
  changeSummary: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: { [key: string]: string[] };
  experience: Experience[];
  education: Education[];
  projects: Project[];
}
```

### **Firebase Integration**
- `saveResumeData()` - Save resume to Firestore
- `getResumeData()` - Retrieve single resume
- `getUserResumes()` - Get all user resumes
- `deleteResume()` - Remove resume from database

### **State Management**
- Local state for form data
- Real-time updates as user types
- Automatic saving with user confirmation
- Loading states for better UX

## Benefits

1. **Complete Control** - Users can customize every aspect of their resume
2. **Professional Templates** - Start with well-designed templates
3. **Multiple Versions** - Create different resumes for different job types
4. **Cloud Storage** - Access resumes from anywhere
5. **Real-time Preview** - See changes instantly
6. **Export Options** - Download as PDF for job applications

## Future Enhancements

- Resume templates and themes
- Collaborative editing
- Version history and comparison
- Integration with job boards
- ATS optimization suggestions
- Cover letter builder integration 