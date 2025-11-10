import React, { useState } from 'react';
import { ProfessionalResumeData } from '../../types/resume';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    github?: string;
    linkedin?: string;
    location?: string;
  };
  skills: {
    languages?: string[];
    machineLearning?: string[];
    tools?: string[];
    databases?: string[];
    versionControl?: string[];
    coreConcepts?: string[];
    softSkills?: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    duration: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    duration: string;
    technologies: string[];
    description: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  achievements: string[];
}

interface ProfessionalResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ProfessionalResumeForm: React.FC<ProfessionalResumeFormProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const updateData = (section: string, field: string, value: any) => {
    const newData = { ...data };
    if (section === 'personalInfo') {
      (newData.personalInfo as any)[field] = value;
    } else if (section === 'skills') {
      (newData.skills as any)[field] = value;
    } else {
      (newData as any)[section] = value;
    }
    onChange(newData);
  };

  const addArrayItem = (section: string, item: any) => {
    const newData = { ...data };
    (newData as any)[section] = [...(newData as any)[section], item];
    onChange(newData);
  };

  const removeArrayItem = (section: string, index: number) => {
    const newData = { ...data };
    (newData as any)[section] = (newData as any)[section].filter((_: any, i: number) => i !== index);
    onChange(newData);
  };

  const updateArrayItem = (section: string, index: number, item: any) => {
    const newData = { ...data };
    (newData as any)[section][index] = item;
    onChange(newData);
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'achievements', label: 'Achievements' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
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

      <div className="p-6">
        {/* Personal Information */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updateData('personalInfo', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updateData('personalInfo', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updateData('personalInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={data.personalInfo.location || ''}
                  onChange={(e) => updateData('personalInfo', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="text"
                  value={data.personalInfo.github || ''}
                  onChange={(e) => updateData('personalInfo', 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin || ''}
                  onChange={(e) => updateData('personalInfo', 'linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            {Object.entries(data.skills).map(([skillType, skills]) => (
              <div key={skillType}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {skillType.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <textarea
                  value={Array.isArray(skills) ? skills.join(', ') : ''}
                  onChange={(e) => updateData('skills', skillType, e.target.value.split(', ').filter(s => s.trim()))}
                  placeholder="Enter skills separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {activeSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
              <button
                onClick={() => addArrayItem('experience', {
                  company: '',
                  position: '',
                  location: '',
                  duration: '',
                  description: ['']
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>
            {data.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateArrayItem('experience', index, { ...exp, company: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => updateArrayItem('experience', index, { ...exp, position: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => updateArrayItem('experience', index, { ...exp, location: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => updateArrayItem('experience', index, { ...exp, duration: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Description (one point per line)"
                  value={exp.description.join('\n')}
                  onChange={(e) => updateArrayItem('experience', index, { 
                    ...exp, 
                    description: e.target.value.split('\n').filter(d => d.trim()) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <button
                  onClick={() => removeArrayItem('experience', index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Experience
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <button
                onClick={() => addArrayItem('projects', {
                  name: '',
                  duration: '',
                  technologies: [],
                  description: ['']
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
            {data.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={project.duration}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, duration: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateArrayItem('projects', index, { 
                    ...project, 
                    technologies: e.target.value.split(', ').filter(t => t.trim()) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <textarea
                  placeholder="Description (one point per line)"
                  value={project.description.join('\n')}
                  onChange={(e) => updateArrayItem('projects', index, { 
                    ...project, 
                    description: e.target.value.split('\n').filter(d => d.trim()) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <button
                  onClick={() => removeArrayItem('projects', index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Project
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        {activeSection === 'certificates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Certificates</h3>
              <button
                onClick={() => addArrayItem('certificates', {
                  name: '',
                  issuer: '',
                  date: '',
                  url: ''
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Certificate
              </button>
            </div>
            {data.certificates.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Certificate Name"
                    value={cert.name}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Issuer"
                    value={cert.issuer}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, issuer: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={cert.date}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, date: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="URL (optional)"
                    value={cert.url || ''}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, url: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('certificates', index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Certificate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeSection === 'achievements' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              <button
                onClick={() => addArrayItem('achievements', '')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Achievement
              </button>
            </div>
            {data.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  placeholder="Achievement description"
                  value={achievement}
                  onChange={(e) => updateArrayItem('achievements', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  onClick={() => removeArrayItem('achievements', index)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalResumeForm;