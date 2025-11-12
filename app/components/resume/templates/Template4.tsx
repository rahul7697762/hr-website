import React from "react";
import { ResumeData, ResumeColor } from "../../../types/resume";

interface TemplateProps {
  data: ResumeData;
  color: ResumeColor;
}

const Template4: React.FC<TemplateProps> = ({ data, color }) => {
  const { contact, objective, education, skills, languages, experience } = data;

  return (
    <div className="w-[900px] mx-auto bg-white font-sans text-gray-900 flex">
      {/* ===== LEFT SIDEBAR ===== */}
      <aside
        className="w-[35%] bg-gray-900 text-white p-6 flex flex-col justify-start items-center relative"
        style={{ backgroundColor: color.background }}
      >
        {/* PHOTO */}
        {contact.photoUrl && (
          <div className="relative mb-4">
            <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img
                src={contact.photoUrl}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}

        {/* ABOUT ME */}
        <section className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2 border-b border-gray-500 inline-block">
            About Me
          </h3>
          <p className="text-sm text-gray-200 mt-2 leading-relaxed">{objective}</p>
        </section>

        {/* CONTACT */}
        <section className="w-full mb-6">
          <div className="space-y-2 text-sm text-gray-200">
            {contact.phone && (
              <p className="flex items-center gap-2">
                📞 <span>{contact.phone}</span>
              </p>
            )}
            {contact.email && (
              <p className="flex items-center gap-2">
                ✉️ <span>{contact.email}</span>
              </p>
            )}
            {contact.linkedin && (
              <p className="flex items-center gap-2">
                📍 <span>{contact.linkedin}</span>
              </p>
            )}
          </div>
        </section>

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <section className="w-full mb-6">
            <h4 className="text-base font-semibold border-b border-gray-500 pb-1 mb-2">
              Language
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
              {languages.map((l, i) => (
                <li key={i}>{l.language}</li>
              ))}
            </ul>
          </section>
        )}

        {/* EXPERTISE */}
        {skills && skills.length > 0 && (
          <section className="w-full">
            <h4 className="text-base font-semibold border-b border-gray-500 pb-1 mb-2">
              Expertise
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
              {skills.slice(0, 6).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="w-[65%] p-8 relative">
        {/* HEADER BANNER */}
        <div
          className="absolute top-0 left-0 w-full h-32"
          style={{ backgroundColor: color.primary }}
        ></div>

        {/* HEADER TEXT */}
        <header className="relative z-10 mt-10 mb-6 text-white pl-8">
          <h1 className="text-3xl font-bold uppercase">{contact.name}</h1>
          <h3 className="text-lg font-medium mt-1">
            {contact.position || "Product Designer"}
          </h3>
        </header>

        {/* EXPERIENCE SECTION */}
        {experience && experience.length > 0 && (
          <section className="mb-6 mt-8">
            <h2
              className="text-lg font-semibold uppercase mb-2 border-b pb-1"
              style={{ borderColor: color.primary, color: color.primary }}
            >
              Experience
            </h2>
            <div className="space-y-4 text-sm text-gray-800">
              {experience.map((exp, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-gray-900">{exp.company}</h4>
                  <p className="text-gray-600">{exp.year}</p>
                  <p className="text-gray-700 mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h2
              className="text-lg font-semibold uppercase mb-2 border-b pb-1"
              style={{ borderColor: color.primary, color: color.primary }}
            >
              Education
            </h2>
            <div className="space-y-2 text-sm text-gray-800">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold text-gray-900">{edu.course}</p>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SUMMARY */}
        <section className="mb-4">
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Skills Summary
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span>Design Process</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color.primary, width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span>Project Management</span>
                <span>81%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color.primary, width: "81%" }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Template4;
