
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8">
            ResumeOracle
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create professional resumes and cover letters with AI-powered tailoring for your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Building
            </Link>
            <Link
              href="/register"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-500 font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-16">
            Everything you need to land your dream job
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* AI Resume Builder */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Resume Builder</h3>
              <p className="text-gray-600 leading-relaxed">
                Create professional resumes with our intuitive builder. Add experience, skills, and education with ease.
              </p>
            </div>

            {/* AI Resume Tailoring */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">AI Tailoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Let AI customize your resume for specific job descriptions to increase your chances of getting hired.
              </p>
            </div>

            {/* Cover Letter Generator */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Cover Letters</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate compelling cover letters tailored to your resume and the specific job you're applying for.
              </p>
            </div>

            {/* PDF Export */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">PDF Export</h3>
              <p className="text-gray-600 leading-relaxed">
                Download your resumes and cover letters as professional PDF files ready for job applications.
              </p>
            </div>

            {/* Job Tracking */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Job Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep track of your job applications with AI-enhanced resumes and original job descriptions.
              </p>
            </div>

            {/* Templates */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from modern and ATS-friendly templates designed to help you stand out to employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-16">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-medium text-white">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create</h3>
              <p className="text-gray-600 leading-relaxed">
                Build your resume with our intuitive editor. Add your experience, skills, and education.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-medium text-white">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tailor</h3>
              <p className="text-gray-600 leading-relaxed">
                Paste a job description and let AI customize your resume to match the requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-medium text-white">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Download your tailored resume and cover letter as professional PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-16">
            Key features
          </h2>
          
          <div className="space-y-16">
            {/* AI Resume Tailoring */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-light text-gray-900 mb-6">AI-Powered Resume Tailoring</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our AI analyzes job descriptions and automatically optimizes your resume to match specific requirements, keywords, and company culture.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Keyword Optimization</h4>
                      <p className="text-sm text-gray-600">Incorporates relevant keywords from job descriptions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Achievement-Focused</h4>
                      <p className="text-sm text-gray-600">Highlights quantifiable achievements and results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">ATS Compatible</h4>
                      <p className="text-sm text-gray-600">Ensures your resume passes through Applicant Tracking Systems</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-white p-8 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-6">How to use AI tailoring:</h4>
                <ol className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                    <span>Select an existing resume from your dashboard</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                    <span>Paste the job description and click "Generate AI Resume"</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                    <span>Review and edit the AI-generated resume as needed</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
                    <span>Download your tailored resume as a professional PDF</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Cover Letter Generator */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-light text-gray-900 mb-6">Smart Cover Letter Generator</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Generate compelling cover letters that perfectly complement your resume and address specific job requirements.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Resume Integration</h4>
                      <p className="text-sm text-gray-600">Uses your resume data to create consistent messaging</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Professional Format</h4>
                      <p className="text-sm text-gray-600">Proper business letter format with your contact information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Customizable</h4>
                      <p className="text-sm text-gray-600">Edit and personalize the generated content to match your voice</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-white p-8 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-6">Cover letter process:</h4>
                <ol className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                    <span>Select your resume and paste the job description</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                    <span>AI generates a tailored cover letter using your experience</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                    <span>Review and edit the content to match your preferences</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
                    <span>Download as a professional PDF ready for submission</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-16">
            Professional templates
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Modern Template</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                A contemporary design with clean typography and professional styling that stands out to hiring managers.
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Professional color scheme</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Clean, modern layout</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Perfect for creative industries</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">ATS-Friendly Template</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Optimized for Applicant Tracking Systems with simple formatting and clear structure.
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Standard fonts (Times New Roman)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Simple, clean formatting</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span>Ideal for corporate positions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-8">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of job seekers using ResumeOracle to create winning resumes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/builder"
              className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Try Resume Builder
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
