# Resume Writer AI

A modern web application that helps users create professional resumes and cover letters using AI assistance. Built with Next.js and powered by Google's Generative AI.

## Features

- **AI-Powered Resume Generation**: Automatically generate professional resumes based on user input
- **Cover Letter Creation**: AI-assisted cover letter writing tailored to specific job applications
- **Multiple Resume Templates**: Choose from various resume templates and layouts
- **Drag-and-Drop Builder**: Advanced resume builder with intuitive drag-and-drop interface
- **PDF Export**: Export your resumes and cover letters in professional PDF format
- **User Authentication**: Secure user accounts with Firebase authentication
- **Cloud Storage**: Save and manage multiple resumes using Firebase Cloud Storage
- **Real-time Preview**: See changes to your resume in real-time as you edit
- **Job-Specific Recommendations**: Get AI-powered recommendations for job applications

## Technology Stack

- **Frontend Framework**: Next.js 15.3 with React 19
- **Authentication & Database**: Firebase
- **AI Integration**: Google Generative AI
- **Styling**: TailwindCSS
- **PDF Generation**: jsPDF and Puppeteer
- **Drag and Drop**: dnd-kit
- **Type Safety**: TypeScript
- **Development Tools**: ESLint, TurboRepo

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- Firebase account and project setup
- Google AI API key

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with the following variables:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/src/app` - Next.js application routes and API endpoints
- `/src/components` - Reusable React components
- `/src/contexts` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/lib` - Core functionality and service integrations
- `/src/utils` - Utility functions and helpers
- `/src/types` - TypeScript type definitions

## Building for Production

```bash
# Create production build
npm run build
# or
yarn build

# Start production server
npm run start
# or
yarn start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.
