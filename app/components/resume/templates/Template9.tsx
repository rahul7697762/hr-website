import React from "react";
import { ResumeData, ResumeColor } from "../../../types/resume";

interface TemplateProps {
  data: ResumeData;
  color: ResumeColor;
}

const Template9: React.FC<TemplateProps> = ({ data, color }) => {
  const { contact, objective, education, projects, certifications } = data;

  return (
    <div className="w-[850px] mx-auto bg-white text-gray-900 font-sans p-10 shadow-md border border-gray-200">
      {/* ===== HEADER ===== */}
      <header className="border-b-2 pb-4 mb-6 text-center" style={{ borderColor: color.primary }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide">{contact.name}</h1>
        <h3 className="text-lg font-medium mt-1" style={{ color: color.primary }}>
          {contact.position || "Chemist"}
        </h3>
      </header>

      {/* ===== PROFESSIONAL SUMMARY ===== */}
      {objective && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{objective}</p>
        </section>
      )}

      {/* ===== CONTACT INFO ===== */}
      <section className="mb-6 text-sm text-gray-700">
        <h2
          className="text-lg font-semibold uppercase mb-2 border-b pb-1"
          style={{ borderColor: color.primary, color: color.primary }}
        >
          Contact Information
        </h2>
        <div className="space-y-1">
          {contact.phone && (
            <p>
              <b>Phone:</b> {contact.phone}
            </p>
          )}
          {contact.email && (
            <p>
              <b>Email:</b> {contact.email}
            </p>
          )}
          {contact.linkedin && (
            <p>
              <b>LinkedIn:</b> {contact.linkedin}
            </p>
          )}
          {contact.address && (
            <p>
              <b>Address:</b> {contact.address}
            </p>
          )}
        </div>
      </section>

      {/* ===== EDUCATION ===== */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Education
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            {education.map((edu, i) => (
              <div key={i}>
                <p className="font-semibold">
                  {edu.course} — <span className="italic">{edu.institution}</span>{" "}
                  <span className="text-gray-500">({edu.year})</span>
                </p>
                {edu.description && (
                  <p className="text-gray-600 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== PROJECTS ===== */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Research & Projects
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            {projects.map((p, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900">{p.title || p.name}</h4>
                {p.duration && (
                  <p className="text-gray-500 text-xs mb-1">{p.duration}</p>
                )}
                <p className="text-gray-700">{p.description}</p>
                {p.link && (
                  <a
                    href={p.link}
                    className="text-blue-600 text-xs underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== AWARDS / CERTIFICATIONS ===== */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Notable Awards & Certifications
          </h2>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {certifications.map((cert, i) => (
              <li key={i}>
                {cert.course || cert.name} —{" "}
                <span className="italic">{cert.institution || cert.issuer}</span>
                {cert.year && <span className="text-gray-500"> ({cert.year})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Template9;
