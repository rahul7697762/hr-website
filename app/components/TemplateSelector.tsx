import React from "react";
import { useNavigate } from "react-router-dom";
import { ResumeTemplate } from "../contexts";

// 🧱 Type-safe prop interface
interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

// 🖼️ Template previews
import template0 from "../../images/resume_templates-images-0.jpg";
import template1 from "../../images/resume_templates-images-1.jpg";
import template2 from "../../images/resume_templates-images-2.jpg";
import template3 from "../../images/resume_templates-images-3.jpg";
import template4 from "../../images/resume_templates-images-4.jpg";
import template5 from "../../images/resume_templates-images-5.jpg";
import template6 from "../../images/resume_templates-images-6.jpg";
import template7 from "../../images/resume_templates-images-7.jpg";
import template8 from "../../images/resume_templates-images-8.jpg";
import template9 from "../../images/resume_templates-images-9.jpg";

// 🎨 Template metadata
const templates = [
  { id: "classic" as ResumeTemplate, name: "Professional with Photo", preview: template0, accent: "border-blue-400 hover:border-blue-600" },
  { id: "modern" as ResumeTemplate, name: "Modern Executive", preview: template1, accent: "border-purple-400 hover:border-purple-600" },
  { id: "minimal" as ResumeTemplate, name: "Minimal Professional", preview: template2, accent: "border-gray-400 hover:border-gray-600" },
  { id: "creative" as ResumeTemplate, name: "Creative Designer", preview: template3, accent: "border-pink-400 hover:border-pink-600" },
  { id: "executive" as ResumeTemplate, name: "Executive Premium", preview: template4, accent: "border-indigo-400 hover:border-indigo-600" },
  { id: "tech" as ResumeTemplate, name: "Tech Professional", preview: template5, accent: "border-blue-500 hover:border-blue-700" },
  { id: "academic" as ResumeTemplate, name: "Academic Scholar", preview: template6, accent: "border-gray-500 hover:border-gray-700" },
  { id: "designer" as ResumeTemplate, name: "Designer Portfolio", preview: template7, accent: "border-pink-500 hover:border-pink-700" },
  { id: "startup" as ResumeTemplate, name: "Startup Dynamic", preview: template8, accent: "border-green-500 hover:border-green-700" },
  { id: "corporate" as ResumeTemplate, name: "Corporate Standard", preview: template9, accent: "border-slate-500 hover:border-slate-700" },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
}) => {
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId: ResumeTemplate) => {
    onTemplateChange(templateId);
    // Auto-navigate after selection
    setTimeout(() => navigate("/resume-builder"), 400); // short delay for UX smoothness
  };

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
        Choose a Resume Template
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id
                ? `${template.accent} border-opacity-100 scale-105`
                : "border-gray-200 dark:border-slate-600 hover:border-gray-400"
            }`}
          >
            <div className="w-full h-40 overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
              />
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 text-center">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {template.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {template.accent}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
