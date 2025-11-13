import React, { useState, useEffect } from "react";
import Form from "../components/resume/Form";
import Resume from "../components/resume/Resume";
import AISuggestions from "../components/AISuggestions";
import DownloadDropdown from "../components/resume/DownloadDropdown";
import { ResumeData, ResumeColor } from "../types/resume";
import { ResumeService, useAutoSave } from "../services/resumeService";
import { useAuth } from "../contexts/AuthContext";

// 🎨 Color Presets
const colorPresets: ResumeColor[] = [
  { primary: "#667eea", background: "#764ba2", skills: "#9f7aea" },
  { primary: "#4f46e5", background: "#7c3aed", skills: "#8b5cf6" },
  { primary: "#6b7280", background: "#4b5563", skills: "#9ca3af" },
  { primary: "#10b981", background: "#3b82f6", skills: "#14b8a6" },
  { primary: "#f59e0b", background: "#ef4444", skills: "#fb923c" },
  { primary: "#ec4899", background: "#f43f5e", skills: "#f472b6" },
];

// 🧱 Initial Resume Data
const initialData: ResumeData = {
  contact: {
    name: "Your Name",
    position: "Web Designer",
    photoUrl: "",
    phone: "+123-456-7890",
    email: "hello@example.com",
    linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourname",
    address: "City, Country",
  },
  objective:
    "Creative and detail-oriented web designer with a passion for clean, user-centered design. Seeking opportunities to bring modern design and usability principles to impactful digital projects.",
  skills: [
    "Web Design Tools",
    "Front-End Development",
    "UI/UX Design",
    "Version Control",
    "Color Theory",
    "Typography",
    "SEO Fundamentals",
    "Web Accessibility",
  ],
  tools: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
  languages: [{ language: "English", level: 5 }, { language: "Spanish", level: 3 }],
  interests: ["Photography", "Travel", "Reading", "Music"],
  education: [
    {
      year: "2020 - 2023",
      course: "Master of IT Management",
      institution: "Wardiere University",
      achievements:
        "Focused on digital transformation and user experience management in web systems.",
    },
    {
      year: "2016 - 2020",
      course: "Bachelor of Art and Design",
      institution: "Borcelle University",
      achievements:
        "Studied creative design, typography, and interaction design principles.",
    },
  ],
  experience: [
    {
      year: "2020 - 2023",
      company: "Wardiere Company",
      position: "Web Designer",
      description:
        "Designed and developed responsive websites using Figma and React. Collaborated with developers and stakeholders to improve usability and brand consistency.",
    },
    {
      year: "2018 - 2020",
      company: "Borcelle Studio",
      position: "Junior Web Designer",
      description:
        "Supported senior designers with UI/UX mockups, visual assets, and client communication.",
    },
  ],
  certifications: [
    {
      year: "2022",
      course: "Certified Web Designer",
      institution: "Design Institute",
      description: "Awarded for excellence in creative digital design.",
    },
  ],
  projects: [
    {
      title: "E-commerce Website",
      link: "",
      description:
        "Developed a full-stack e-commerce platform with integrated payment system and admin dashboard using React and Node.js.",
    },
  ],
  workshops: [{ year: "2023", description: "Advanced UI/UX Workshop at TechHub" }],
  activities: [
    {
      title: "Design Community Leader",
    },
  ],
  references: [
    {
      name: "Niranjan Devi",
      desig: "CEO, Wardiere Company",
      phone: "123-456-7890",
      email: "reference@company.com",
    },
    {
      name: "Aarya Agarwal",
      desig: "HR Head, Wardiere Company",
      phone: "123-456-7890",
      email: "reference@company.com",
    },
  ],
};

interface ResumeBuilderProps {
  selectedTemplate?: number;
  onBackToTemplates?: () => void;
  resumeId?: number;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  selectedTemplate = 0,
  onBackToTemplates,
  resumeId,
}) => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [color, setColor] = useState<ResumeColor>(colorPresets[0]);
  const [template, setTemplate] = useState<number>(selectedTemplate);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<number | undefined>();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  
  // Load existing resume if resumeId is provided
  useEffect(() => {
    const loadExistingResume = async () => {
      if (resumeId) {
        try {
          setIsLoading(true);
          const resume = await ResumeService.getResume(resumeId);
          setData(resume.resume_data);
          setTemplate(resume.template_id);
          if (resume.color_scheme) {
            setColor(resume.color_scheme);
          }
          setCurrentResumeId(resume.resume_id);
        } catch (error) {
          console.error('Failed to load resume:', error);
          setSaveStatus('error');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingResume();
  }, [resumeId]);
  
  // Auto-save functionality
  const { isSaving, lastSaved, lastSavedId } = useAutoSave(
    data,
    template,
    color,
    user?.user_id?.toString(),
    30000 // Auto-save every 30 seconds
  );

  // Update current resume ID when auto-save creates a new resume
  useEffect(() => {
    if (lastSavedId && lastSavedId !== currentResumeId) {
      setCurrentResumeId(lastSavedId);
    }
  }, [lastSavedId, currentResumeId]);

  // Update save status based on auto-save state
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    } else if (lastSaved) {
      setSaveStatus('saved');
      // Clear the saved status after 3 seconds
      const timeout = setTimeout(() => setSaveStatus(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSaving, lastSaved]);

  const handleApplySuggestion = (section: keyof ResumeData, newValue: string) => {
    setData(prev => ({
      ...prev,
      [section]: newValue
    }));
  };

  const handleManualSave = async () => {
    try {
      setSaveStatus('saving');
      console.log('Manual save started with:', {
        hasData: !!data,
        template,
        hasColor: !!color,
        userId: user?.user_id,
        currentResumeId
      });
      
      const savedResume = await ResumeService.autoSave(
        data,
        template,
        color,
        user?.user_id?.toString(),
        currentResumeId
      );
      
      console.log('Manual save successful:', savedResume);
      setCurrentResumeId(savedResume.resume_id);
      setSaveStatus('saved');
      
      // Show success message
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveStatus('error');
      
      // Show error for longer to help with debugging
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">Loading your resume...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5">
      {onBackToTemplates && (
        <div className="max-w-[1800px] mx-auto mb-5">
          <button 
            className="px-6 py-3 bg-white text-indigo-600 border-2 border-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-white hover:-translate-x-1 shadow-sm"
            onClick={onBackToTemplates}
          >
            ← Change Template
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[700px_1fr] xl:grid-cols-[800px_1fr] gap-5 max-w-[2000px] mx-auto">
        {/* Left Side - Form */}
        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[calc(100vh-40px)]">
          <Form
            data={data}
            setData={setData}
            preset={colorPresets}
            setColor={setColor}
            selectedTemplate={template}
            setSelectedTemplate={setTemplate}
          />
        </div>

        {/* Right Side - Preview */}
        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[calc(100vh-40px)]">
          <div className="flex justify-between items-center p-5 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 m-0">Live Preview</h2>
              {/* Save Status Indicator */}
              {saveStatus && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  saveStatus === 'saving' ? 'bg-blue-100 text-blue-700' :
                  saveStatus === 'saved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {saveStatus === 'saving' && (
                    <>
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      Saved {lastSaved && new Date(lastSaved).toLocaleTimeString()}
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      Save failed
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {/* Manual Save Button */}
              <button 
                className="px-4 py-2 bg-blue-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleManualSave}
                disabled={isSaving}
              >
                💾 Save Now
              </button>
              
              {/* Debug Test Buttons - Remove in production */}
              
              <button 
                className={`px-5 py-2.5 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${
                  showAISuggestions 
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 shadow-[0_6px_12px_rgba(16,185,129,0.3)]' 
                    : 'bg-gradient-to-r from-green-500 to-teal-500'
                }`}
                onClick={() => setShowAISuggestions(!showAISuggestions)}
              >
                🤖 AI Suggestions
              </button>
              <DownloadDropdown data={data} templateId={template} />
            </div>
          </div>

          {/* AI Suggestions Panel */}
          {showAISuggestions && (
            <div className="px-5 mb-5 animate-[slideDown_0.3s_ease]">
              <AISuggestions 
                resumeData={data as any} 
                onApplySuggestion={handleApplySuggestion as any}
              />
            </div>
          )}

          {/* Resume Preview */}
          <div className="w-full flex justify-center">
            <Resume data={data} color={color} selectedTemplate={template} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
