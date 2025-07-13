'use client';

import { useState } from 'react';
import { ResumeData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import type { ResumeTemplate } from "../html-pdf-generator";
import TemplateSelector from "./resume/TemplateSelector";
import { downloadPDF, generateResumeFilename } from "@/utils/pdf";
import { LoadingOverlay } from "./common/LoadingOverlay";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useResumeOperations } from "@/hooks/useResumeOperations";

export default function ResumePreview({ data, isLoading }: { data: ResumeData; isLoading: boolean }) {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');
  const { saveResume, isSaving } = useResumeOperations();
  const { error, handleError, clearError } = useErrorHandler();

  if (Object.keys(data).length === 0) {
    return <div>No data</div>;
  }

  const handleDownload = async () => {
    try {
      clearError();
      const filename = generateResumeFilename(data.resumeName, data.name, selectedTemplate);
      await downloadPDF({ 
        type: 'resume', 
        data,
        template: selectedTemplate 
      }, filename);
    } catch (error) {
      handleError(error, 'Failed to generate PDF. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      handleError(new Error('Please log in to save your resume.'));
      return;
    }

    try {
      clearError();
      await saveResume(data);
      alert('Resume saved successfully!');
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl text-gray-900 text-sm relative">
      <LoadingOverlay isLoading={isLoading} text="Generating your resume..." />
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            disabled={isSaving || !user}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-4">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          className="max-w-xs"
        />
      </div>

      <div className="text-blue-700 font-semibold mb-2">{data.title}</div>
      <div className="mb-2 text-xs text-gray-500">{data.location} | {data.email} | {data.phone}</div>
      <div className="mb-4 text-xs text-gray-500">
        <a href={`https://linkedin.com/${data.linkedin}`} className="underline mr-2">LinkedIn</a>
        <a href={`https://${data.website}`} className="underline">Website</a>
      </div>
      <div className="mb-4 text-gray-700">{data.summary}</div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Skills</div>
        <div className="">
          {Object.keys(data.skills).map((item) => {
            return (
              <div key={item} className="mb-1 flex gap-1">
                <div className="w-1/4 font-semibold mb-1">{item}</div>
                <div className="w-3/4 flex gap-1">
                  {data.skills[item].map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Projects</div>
        <ul className="list-disc ml-6">
          {data.projects.map((proj) => (
            <li key={proj.title} className="mb-1">
              <span className="font-semibold">{proj.title}:</span> {proj.description} {" "}
              <a href={proj.link.href} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">{proj.link.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">Experience</div>
        {data.experience.map((exp) => (
          <div key={exp.title + exp.company} className="mb-2">
            <div className="font-semibold">{exp.title}, {exp.company}</div>
            <div className="text-xs text-gray-500 mb-1">{exp.period} | {exp.location}</div>
            <ul className="list-disc ml-6">
              {exp.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <div className="font-semibold mb-1">Education</div>
        {data.education.map((edu) => (
          <div key={edu.degree + edu.school} className="mb-1">
            <span className="font-semibold">{edu.degree}</span>, {edu.school} <span className="text-xs text-gray-500">({edu.year})</span>
          </div>
        ))}
      </div>
    </div>
  );
}