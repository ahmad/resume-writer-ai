'use client';

import React, { useState } from 'react';
import { ResumeData } from '../../types';
import type { ResumeTemplate } from '../../html-pdf-generator';
import TemplateSelector from './TemplateSelector';
import { downloadPDF, generateResumeFilename } from '@/utils/pdf';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface ResumePreviewProps {
  data: ResumeData;
  isLoading: boolean
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Header with Template Selection and Download Button */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
            <p className="text-xl text-gray-700 mb-3">{data.title}</p>
          </div>
          <div className="flex flex-col gap-3">
            {/* Template Selection */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>{data.location}</span>
          <span>•</span>
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.phone}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-blue-600 mt-2">
          {data.linkedin && (
            <a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {data.linkedin}
            </a>
          )}
          {data.github && (
            <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {data.github}
            </a>
          )}
          {data.website && (
            <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {data.website}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {Object.keys(data.skills).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="space-y-4">
            {Object.entries(data.skills).map(([category, skills]) => (
              <div key={category}>
                <h3 className="font-medium text-gray-800 mb-1">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(skill => skill.trim()).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.period}</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <span className="text-sm text-gray-600">{exp.location}</span>
                </div>
                {exp.bullets.filter(bullet => bullet.trim()).length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-sm">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  {project.link.href && (
                    <a
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {project.link.label || 'View Project'}
                    </a>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">{edu.year}</span>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-gray-700">{edu.school}</p>
                  <span className="text-sm text-gray-600">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Summary */}
      {data.changeSummary && data.changeSummary.trim() && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Changes</h2>
          <p className="text-gray-700 text-sm italic">{data.changeSummary}</p>
        </div>
      )}
    </div>
  );
} 