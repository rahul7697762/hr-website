import React, { useState, useRef } from "react";
import Link from "next/link";
import { ResumeData, ResumeColor } from "../../types/resume";
import AIRephraseButton from "./AIRephraseButton";

// === Template Thumbnails ===
const templates = [
  { id: 0, name: "Professional with Photo", image: "/images/resume_templates-images-0.jpg" },
  { id: 1, name: "Modern Executive", image: "/images/resume_templates-images-1.jpg" },
  { id: 2, name: "Minimal Professional", image: "/images/resume_templates-images-2.jpg" },
  { id: 3, name: "Creative Designer", image: "/images/resume_templates-images-3.jpg" },
  { id: 4, name: "Executive Premium", image: "/images/resume_templates-images-4.jpg" },
  { id: 5, name: "Tech Professional", image: "/images/resume_templates-images-5.jpg" },
  { id: 6, name: "Academic Scholar", image: "/images/resume_templates-images-6.jpg" },
  { id: 7, name: "Designer Portfolio", image: "/images/resume_templates-images-7.jpg" },
  { id: 8, name: "Startup Dynamic", image: "/images/resume_templates-images-8.jpg" },
  { id: 9, name: "Corporate Standard", image: "/images/resume_templates-images-9.jpg" },
];

interface FormProps {
  data: ResumeData;
  setData: (data: ResumeData) => void;
  preset: ResumeColor[];
  setColor: (color: ResumeColor) => void;
  selectedTemplate: number;
  setSelectedTemplate: (id: number) => void;
}

// Default structure (safety net)
const defaultResume: ResumeData = {
  contact: {
    name: "",
    position: "",
    photoUrl: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    address: "",
  },
  objective: "",
  education: [],
  experience: [],
  skills: [],
  certifications: [],
  references: [],
  languages: [],
  tools: [],
  interests: [],
};

const Form: React.FC<FormProps> = ({
  data,
  setData,
  preset,
  setColor,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const safeData = { ...defaultResume, ...data };
  const [showTemplates, setShowTemplates] = useState(false);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState((safeData.skills || []).join(","));
  const [tools, setTools] = useState((safeData.tools || []).join(","));
  const [interests, setInterests] = useState((safeData.interests || []).join(","));



  // --- Photo Upload Handler ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }
    
    setData({
      ...data,
      contact: { ...data.contact, photoUrl: URL.createObjectURL(file) },
    });
  };

  // --- Contact Handler ---
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      contact: { ...data.contact, [e.target.name]: e.target.value },
    });
  };

  // --- Dynamic Section Update ---
  const addRow = <K extends keyof ResumeData>(key: K, row: any) => {
    const temp = [...((data[key] as any[]) || []), row];
    setData({ ...data, [key]: temp });
  };

  const removeRow = <K extends keyof ResumeData>(key: K, index: number) => {
    const temp = (data[key] as any[]).filter((_, i) => i !== index);
    setData({ ...data, [key]: temp });
  };

  const handleRowChange = <K extends keyof ResumeData>(
    key: K,
    index: number,
    field: string,
    value: string
  ) => {
    const temp = [...((data[key] as any[]) || [])];
    temp[index][field] = value;
    setData({ ...data, [key]: temp });
  };

  const handleArrayUpdate = (key: keyof ResumeData, value: string) => {
    setData({ ...data, [key]: value.split(",").map((v) => v.trim()) });
  };

  return (
    <div className="p-6 bg-gray-50 text-gray-800 rounded-md">
      
     
        
        

      {/* === Color Picker === */}
      <div className="mb-6">
        <p className="font-medium mb-2">Select Color Scheme:</p>
        <div className="flex gap-3 flex-wrap">
          {preset.map((item, key) => (
            <div
              key={key}
              className="w-8 h-8 rounded-full cursor-pointer shadow border border-gray-300"
              style={{ backgroundColor: item.primary }}
              onClick={() => setColor(item)}
            ></div>
          ))}
        </div>
      </div>



      {/* === Contact Section === */}
      <Section
        title="Contact Information"
        content={
          <>
            {/* Photo Upload Section */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Profile Photo</label>
              <div className="flex items-center gap-4">
                {safeData.contact.photoUrl && (
                  <div className="relative">
                    <img
                      src={safeData.contact.photoUrl}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                    />
                    <button
                      onClick={() => setData({
                        ...data,
                        contact: { ...data.contact, photoUrl: "" }
                      })}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                      title="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => photoFileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    {safeData.contact.photoUrl ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  <p className="text-xs text-gray-500">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                hidden
              />
            </div>

            {/* Contact Fields */}
            {Object.keys(safeData.contact).map((field) => (
              <div key={field} className="flex flex-col mb-2">
                <label className="text-sm font-medium capitalize">{field}</label>
                {field === 'photoUrl' ? (
                  <input
                    type="text"
                    name={field}
                    value={(safeData.contact as any)[field] || ""}
                    onChange={handleContactChange}
                    className="border rounded px-2 py-1 text-sm bg-gray-100"
                    placeholder="Photo URL (or use upload button above)"
                    readOnly
                  />
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={(safeData.contact as any)[field] || ""}
                    onChange={handleContactChange}
                    className="border rounded px-2 py-1 text-sm"
                  />
                )}
              </div>
            ))}
          </>
        }
      />

      {/* === Simple Text Areas === */}
      <SimpleTextArea
        title="Skills"
        value={skills}
        onChange={setSkills}
        onUpdate={() => handleArrayUpdate("skills", skills)}
      />
      <SimpleTextArea
        title="Tools"
        value={tools}
        onChange={setTools}
        onUpdate={() => handleArrayUpdate("tools", tools)}
      />
      <SimpleTextArea
        title="Interests"
        value={interests}
        onChange={setInterests}
        onUpdate={() => handleArrayUpdate("interests", interests)}
      />

      {/* === Objective === */}
      <Section
        title="About Me / Objective"
        content={
          <div>
            <textarea
              rows={4}
              value={safeData.objective}
              onChange={(e) => setData({ ...data, objective: e.target.value })}
              className="border rounded w-full p-2 text-sm mb-2"
            />
            <AIRephraseButton
              text={safeData.objective || ''}
              section="objective"
              onApply={(newText) => setData({ ...data, objective: newText })}
            />
          </div>
        }
      />

      {/* === Dynamic Sections === */}
      <SectionEditor
        title="Education"
        section="education"
        fields={["year", "course", "institution", "description"]}
        data={safeData}
        addRow={addRow}
        removeRow={removeRow}
        handleRowChange={handleRowChange}
      />
      <SectionEditor
        title="Experience"
        section="experience"
        fields={["year", "company", "position", "description"]}
        data={safeData}
        addRow={addRow}
        removeRow={removeRow}
        handleRowChange={handleRowChange}
      />
      <SectionEditor
        title="Certifications"
        section="certifications"
        fields={["year", "course", "institution", "description"]}
        data={safeData}
        addRow={addRow}
        removeRow={removeRow}
        handleRowChange={handleRowChange}
      />
      <SectionEditor
        title="References"
        section="references"
        fields={["name", "desig", "phone", "email"]}
        data={safeData}
        addRow={addRow}
        removeRow={removeRow}
        handleRowChange={handleRowChange}
      />
      <SectionEditor
        title="Languages"
        section="languages"
        fields={["language", "level"]}
        data={safeData}
        addRow={addRow}
        removeRow={removeRow}
        handleRowChange={handleRowChange}
      />
    </div>
  );
};

// --- Reusable Components ---
const Section = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => (
  <div className="mb-6">
    <hr className="mb-3" />
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    {content}
  </div>
);

const SimpleTextArea = ({
  title,
  value,
  onChange,
  onUpdate,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onUpdate: () => void;
}) => (
  <div className="mb-6">
    <hr className="mb-3" />
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    <textarea
      rows={2}
      className="border rounded w-full p-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button
      onClick={onUpdate}
      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Update {title}
    </button>
  </div>
);

const SectionEditor = ({
  title,
  section,
  fields,
  data,
  addRow,
  removeRow,
  handleRowChange,
}: {
  title: string;
  section: keyof ResumeData;
  fields: string[];
  data: ResumeData;
  addRow: <K extends keyof ResumeData>(key: K, row: any) => void;
  removeRow: <K extends keyof ResumeData>(key: K, index: number) => void;
  handleRowChange: <K extends keyof ResumeData>(
    key: K,
    index: number,
    field: string,
    value: string
  ) => void;
}) => {
  const rows = (data[section] as any[]) || [];

  return (
    <div className="mb-6">
      <hr className="mb-3" />
      <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
      {rows.map((row, i) => (
        <div key={i} className="mb-4 p-3 bg-gray-50 rounded border">
          <div className="flex flex-wrap gap-2 mb-2">
            {fields.map((field) => (
              field === 'description' ? (
                <div key={field} className="w-full">
                  <textarea
                    placeholder={field}
                    value={row[field] || ""}
                    onChange={(e) =>
                      handleRowChange(section, i, field, e.target.value)
                    }
                    rows={3}
                    className="border rounded px-2 py-1 text-sm w-full mb-2"
                  />
                  <AIRephraseButton
                    text={row[field] || ''}
                    section={`${title} description`}
                    onApply={(newText) => handleRowChange(section, i, field, newText)}
                  />
                </div>
              ) : (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={row[field] || ""}
                  onChange={(e) =>
                    handleRowChange(section, i, field, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]"
                />
              )
            ))}
          </div>
          <button
            onClick={() => removeRow(section, i)}
            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => {
          const emptyRow = Object.fromEntries(fields.map((f) => [f, ""]));
          addRow(section, emptyRow);
        }}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add {title}
      </button>
    </div>
  );
};

export default Form;
