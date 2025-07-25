'use client';

import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Skill Category Component
interface SortableSkillCategoryProps {
  id: string;
  category: string;
  skills: string[];
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onUpdateSkills: (category: string, skills: string[]) => void;
  onRemoveCategory: (category: string) => void;
  onRemoveSkill: (category: string, skillIndex: number) => void;
  onAddSkill: (category: string) => void;
}

function SortableSkillCategory({
  id,
  category,
  skills,
  onUpdateCategory,
  onUpdateSkills,
  onRemoveCategory,
  onRemoveSkill,
  onAddSkill,
}: SortableSkillCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg p-4 bg-white ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 select-none"
          >
            ⋮⋮
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => onUpdateCategory(category, e.target.value)}
            className="text-lg font-medium border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 text-black"
          />
        </div>
        <button
          onClick={() => onRemoveCategory(category)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      <SortableSkillsList
        category={category}
        skills={skills}
        onUpdateSkills={onUpdateSkills}
        onRemoveSkill={onRemoveSkill}
        onAddSkill={onAddSkill}
      />
    </div>
  );
}

// Sortable Skills List Component
interface SortableSkillsListProps {
  category: string;
  skills: string[];
  onUpdateSkills: (category: string, skills: string[]) => void;
  onRemoveSkill: (category: string, skillIndex: number) => void;
  onAddSkill: (category: string) => void;
}

function SortableSkillsList({
  category,
  skills,
  onUpdateSkills,
  onRemoveSkill,
  onAddSkill,
}: SortableSkillsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = skills.findIndex((_, index) => `skill-${category}-${index}` === active.id);
      const newIndex = skills.findIndex((_, index) => `skill-${category}-${index}` === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSkills = arrayMove(skills, oldIndex, newIndex);
        onUpdateSkills(category, newSkills);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={skills.map((_, index) => `skill-${category}-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <SortableSkillItem
              key={`skill-${category}-${index}`}
              id={`skill-${category}-${index}`}
              skill={skill}
              onUpdate={(value) => {
                const newSkills = [...skills];
                newSkills[index] = value;
                onUpdateSkills(category, newSkills);
              }}
              onRemove={() => onRemoveSkill(category, index)}
            />
          ))}
          <button
            onClick={() => onAddSkill(category)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Skill
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Sortable Skill Item Component
interface SortableSkillItemProps {
  id: string;
  skill: string;
  onUpdate: (value: string) => void;
  onRemove: () => void;
}

function SortableSkillItem({ id, skill, onUpdate, onRemove }: SortableSkillItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 ${isDragging ? 'bg-blue-50 rounded-md p-1' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 select-none"
      >
        ⋮⋮
      </div>
      <input
        type="text"
        value={skill}
        onChange={(e) => onUpdate(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
      />
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-800"
      >
        ×
      </button>
    </div>
  );
}

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string>('basic');

  const updateField = (field: keyof ResumeData, value: string) => {
    onChange({ [field]: value });
  };

  const updateSkills = (category: string, skills: string[]) => {
    const newSkills = { ...data.skills, [category]: skills };
    onChange({ skills: newSkills });
  };

  const addSkillCategory = () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName && !data.skills[categoryName]) {
      const newSkills = { ...data.skills, [categoryName]: [] };
      onChange({ skills: newSkills });
    }
  };

  const addSkillToCategory = (category: string) => {
    const newSkills = { ...data.skills };
    newSkills[category] = [...newSkills[category], ''];
    onChange({ skills: newSkills });
  };

  const updateSkillCategory = (oldCategory: string, newCategory: string) => {
    const newSkills = { ...data.skills };
    delete newSkills[oldCategory];
    newSkills[newCategory] = data.skills[oldCategory];
    onChange({ skills: newSkills });
  };

  const removeSkillCategory = (category: string) => {
    const newSkills = { ...data.skills };
    delete newSkills[category];
    onChange({ skills: newSkills });
  };

  const removeSkillFromCategory = (category: string, skillIndex: number) => {
    const newSkills = { ...data.skills };
    newSkills[category] = newSkills[category].filter((_, i) => i !== skillIndex);
    onChange({ skills: newSkills });
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const categories = Object.keys(data.skills);
      const oldIndex = categories.indexOf(active.id as string);
      const newIndex = categories.indexOf(over?.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCategories = arrayMove(categories, oldIndex, newIndex);
        const newSkills: Record<string, string[]> = {};
        newCategories.forEach(category => {
          newSkills[category] = data.skills[category];
        });
        onChange({ skills: newSkills });
      }
    }
  };

  const categorySensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateExperience = (index: number, experience: Experience) => {
    const newExperience = [...data.experience];
    newExperience[index] = experience;
    onChange({ experience: newExperience });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      title: '',
      company: '',
      period: '',
      location: '',
      bullets: ['']
    };
    onChange({ experience: [...data.experience, newExperience] });
  };

  const removeExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    onChange({ experience: newExperience });
  };

  const updateEducation = (index: number, education: Education) => {
    const newEducation = [...data.education];
    newEducation[index] = education;
    onChange({ education: newEducation });
  };

  const addEducation = () => {
    const newEducation: Education = {
      degree: '',
      school: '',
      location: '',
      year: ''
    };
    onChange({ education: [...data.education, newEducation] });
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    onChange({ education: newEducation });
  };

  const updateProjects = (index: number, project: Project) => {
    const newProjects = [...data.projects];
    newProjects[index] = project;
    onChange({ projects: newProjects });
  };

  const addProject = () => {
    const newProject: Project = {
      title: '',
      description: '',
      link: { label: '', href: '' }
    };
    onChange({ projects: [...data.projects, newProject] });
  };

  const removeProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    onChange({ projects: newProjects });
  };

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume Name</label>
                <input
                  type="text"
                  value={data.resumeName}
                  onChange={(e) => updateField('resumeName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="e.g., Software Engineer Resume, Marketing Manager Resume"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  value={data.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  value={data.github}
                  onChange={(e) => updateField('github', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={data.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Change Summary</label>
              <textarea
                value={data.changeSummary}
                onChange={(e) => updateField('changeSummary', e.target.value)}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Describe any changes made to this resume..."
              />
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Drag the ⋮⋮ handle to reorder categories and skills
                </p>
              </div>
              <button
                onClick={addSkillCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>

            <DndContext
              sensors={categorySensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={Object.keys(data.skills)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {Object.entries(data.skills).map(([category, skills]) => (
                    <SortableSkillCategory
                      key={category}
                      id={category}
                      category={category}
                      skills={skills}
                      onUpdateCategory={updateSkillCategory}
                      onUpdateSkills={(category, newSkills) => {
                        updateSkills(category, newSkills);
                      }}
                      onRemoveCategory={removeSkillCategory}
                      onRemoveSkill={(category, skillIndex) => {
                        removeSkillFromCategory(category, skillIndex);
                      }}
                      onAddSkill={addSkillToCategory}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
              <button
                onClick={addExperience}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>

            {data.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-gray-900">Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, { ...exp, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, { ...exp, company: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(index, { ...exp, period: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, { ...exp, location: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities & Achievements</label>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start space-x-2 mb-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...exp.bullets];
                          newBullets[bulletIndex] = e.target.value;
                          updateExperience(index, { ...exp, bullets: newBullets });
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <button
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
                          updateExperience(index, { ...exp, bullets: newBullets });
                        }}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateExperience(index, { ...exp, bullets: [...exp.bullets, ''] });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>

            {data.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-gray-900">Education #{index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, { ...edu, school: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, { ...edu, location: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, { ...edu, year: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>

            {data.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-gray-900">Project #{index + 1}</h4>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProjects(index, { ...project, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProjects(index, { ...project, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link Label</label>
                      <input
                        type="text"
                        value={project.link.label}
                        onChange={(e) => updateProjects(index, { 
                          ...project, 
                          link: { ...project.link, label: e.target.value }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link URL</label>
                      <input
                        type="url"
                        value={project.link.href}
                        onChange={(e) => updateProjects(index, { 
                          ...project, 
                          link: { ...project.link, href: e.target.value }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 