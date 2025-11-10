import React from 'react';
import { ProfessionalResumeData } from '../types/resume';

interface ProfessionalTemplateProps {
  data: ProfessionalResumeData;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <span><strong>Mobile:</strong> {data.personalInfo.phone}</span>
          <span><strong>Email:</strong> <span className="text-blue-600">{data.personalInfo.email}</span></span>
          {data.personalInfo.github && (
            <span><strong>Github:</strong> <span className="text-blue-600">{data.personalInfo.github}</span></span>
          )}
          {data.personalInfo.linkedin && (
            <span><strong>LinkedIn:</strong> <span className="text-blue-600">{data.personalInfo.linkedin}</span></span>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-800 border-b-2 border-gray-300 pb-1 mb-3">
          SKILLS
        </h2>
        <div className="space-y-2 text-sm">
          {data.skills.languages && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Languages:</span>
              <span>{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.machineLearning && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Machine Learning & AI:</span>
              <span>{data.skills.machineLearning.join(', ')}</span>
            </div>
          )}
          {data.skills.tools && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Tools and Frameworks:</span>
              <span>{data.skills.tools.join(', ')}</span>
            </div>
          )}
          {data.skills.databases && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Databases & Cloud:</span>
              <span>{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.versionControl && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Version Control:</span>
              <span>{data.skills.versionControl.join(', ')}</span>
            </div>
          )}
          {data.skills.coreConcepts && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Core Concepts:</span>
              <span>{data.skills.coreConcepts.join(', ')}</span>
            </div>
          )}
          {data.skills.softSkills && (
            <div className="flex">
              <span className="font-semibold text-blue-700 w-32">Soft Skills:</span>
              <span>{data.skills.softSkills.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-gray-300 pb-1 mb-3">
            EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-blue-700">{exp.company} | {exp.location}</h3>
                  <p className="font-semibold italic">{exp.position}</p>
                </div>
                <span className="text-sm font-semibold">{exp.duration}</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-gray-300 pb-1 mb-3">
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-blue-700">{project.name}</h3>
                <span className="text-sm font-semibold">{project.duration}</span>
              </div>
              <p className="text-sm font-semibold italic mb-2">
                Tech | {project.technologies.join(', ')}
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                {project.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certificates Section */}
      {data.certificates && data.certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-gray-300 pb-1 mb-3">
            CERTIFICATES
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {data.certificates.map((cert, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  <strong>{cert.name}</strong> - {cert.url ? (
                    <span className="text-blue-600">{cert.issuer}</span>
                  ) : cert.issuer}
                </span>
                <span className="font-semibold">{cert.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements Section */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-gray-300 pb-1 mb-3">
            ACHIEVEMENTS
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {data.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;