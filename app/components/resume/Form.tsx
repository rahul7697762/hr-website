import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ResumeData, ResumeColor } from "../../types/resume";

// === Template Thumbnails ===
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

const templates = [
  { id: 0, name: "Professional with Photo", image: template0 },
  { id: 1, name: "Modern Executive", image: template1 },
  { id: 2, name: "Minimal Professional", image: template2 },
  { id: 3, name: "Creative Designer", image: template3 },
  { id: 4, name: "Executive Premium", image: template4 },
  { id: 5, name: "Tech Professional", image: template5 },
  { id: 6, name: "Academic Scholar", image: template6 },
  { id: 7, name: "Designer Portfolio", image: template7 },
  { id: 8, name: "Startup Dynamic", image: template8 },
  { id: 9, name: "Corporate Standard", image: template9 },
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

  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState(safeData.skills.join(","));
  const [tools, setTools] = useState(safeData.tools.join(","));
  const [interests, setInterests] = useState(safeData.interests.join(","));

  // --- File Handling ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const parsed = JSON.parse(event.target.result);
        setData({ ...defaultResume, ...parsed });
      }
    };
    reader.readAsText(file);
  };

  const handleFileDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume.json";
    link.click();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      <div className="mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {/* === Template Selection === */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Choose Template</h3>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showTemplates ? "Hide Templates" : "Show Templates"}
          </button>
        </div>

        {showTemplates && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`border rounded-lg p-2 cursor-pointer hover:shadow-md transition ${
                  selectedTemplate === t.id
                    ? "border-blue-600 ring-2 ring-blue-300"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-center text-sm mt-1 font-medium">{t.name}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-sm">
          Selected:{" "}
          <strong>{templates[selectedTemplate]?.name || "None"}</strong>
        </p>
      </div>

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

      {/* === File Actions === */}
      <div className="flex gap-3 flex-wrap mb-8">
        <button
          onClick={() => jsonFileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload JSON
        </button>
        <button
          onClick={handleFileDownload}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Download JSON
        </button>
        <button
          onClick={() => photoFileInputRef.current?.click()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Upload Photo
        </button>
        <input
          ref={jsonFileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          hidden
        />
        <input
          ref={photoFileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          hidden
        />
      </div>

      {/* === Contact Section === */}
      <Section
        title="Contact Information"
        content={
          <>
            {Object.keys(safeData.contact).map((field) => (
              <div key={field} className="flex flex-col mb-2">
                <label className="text-sm font-medium capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={(safeData.contact as any)[field] || ""}
                  onChange={handleContactChange}
                  className="border rounded px-2 py-1 text-sm"
                />
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
          <textarea
            rows={4}
            value={safeData.objective}
            onChange={(e) => setData({ ...data, objective: e.target.value })}
            className="border rounded w-full p-2 text-sm"
          />
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
        <div key={i} className="flex flex-wrap gap-2 mb-2">
          {fields.map((field) => (
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
          ))}
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
