'use client';

import React from 'react';
import type { ResumeTemplate } from '../../html-pdf-generator';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = React.memo(({ 
  selectedTemplate, 
  onTemplateChange, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Resume Template:</label>
      <select
        value={selectedTemplate}
        onChange={(e) => onTemplateChange(e.target.value as ResumeTemplate)}
        className="text-black border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="modern">Modern Template</option>
        <option value="ats-friendly">ATS-Friendly Template</option>
      </select>
      <div className="text-xs text-gray-500 mt-1">
        {selectedTemplate === 'modern' ? (
          <span>Modern design with colors and styling</span>
        ) : (
          <span>Clean, simple format optimized for ATS systems</span>
        )}
      </div>
    </div>
  );
});

TemplateSelector.displayName = 'TemplateSelector';

export default TemplateSelector; 