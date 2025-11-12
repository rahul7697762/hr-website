import React, { useState } from 'react';

const templates = [
  { id: 0, name: 'Professional with Photo', image: '/images/resume_templates-images-0.jpg', description: 'Clean layout with photo header, perfect for corporate roles' },
  { id: 1, name: 'Modern Executive', image: '/images/resume_templates-images-1.jpg', description: 'Contemporary two-column design with elegant styling' },
  { id: 2, name: 'Minimal Professional', image: '/images/resume_templates-images-2.jpg', description: 'Simple and clean, emphasizes content over design' },
  { id: 3, name: 'Creative Designer', image: '/images/resume_templates-images-3.jpg', description: 'Bold layout with visual elements for creative fields' },
  { id: 4, name: 'Executive Premium', image: '/images/resume_templates-images-4.jpg', description: 'Sophisticated design for senior leadership positions' },
  { id: 5, name: 'Tech Professional', image: '/images/resume_templates-images-5.jpg', description: 'Modern layout optimized for tech and IT roles' },
  { id: 6, name: 'Academic Scholar', image: '/images/resume_templates-images-6.jpg', description: 'Traditional format ideal for academic and research positions' },
  { id: 7, name: 'Designer Portfolio', image: '/images/resume_templates-images-7.jpg', description: 'Visual-focused design to showcase creative work' },
  { id: 8, name: 'Startup Dynamic', image: '/images/resume_templates-images-8.jpg', description: 'Energetic and modern design for startup culture' },
  { id: 9, name: 'Corporate Standard', image: '/images/resume_templates-images-9.jpg', description: 'Classic professional format for large corporations' }
];

interface TemplateSelectionProps {
  onTemplateSelect: (templateId: number) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate !== null) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 px-5">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl md:text-4xl font-bold mb-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">
            Choose Your Resume Template
          </h1>
          <p className="text-lg max-w-[800px] mx-auto leading-relaxed opacity-95">
            Select a professional template that matches your industry and personal style.
            Each template is designed to help you stand out while maintaining readability.
          </p>
        </div>
        {/* Continue Button */}
        <div className="text-center p-8 bg-white rounded-2xl shadow-md">
          {selectedTemplate !== null ? (
            <div>
              <p className="text-lg text-gray-800 mb-5">
                Selected: <strong className="text-indigo-500 font-semibold">{templates[selectedTemplate].name}</strong>
              </p>
              <button 
                className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
                onClick={handleContinue}
              >
                Continue to Resume Builder →
              </button>
            </div>
          ) : (
            <p className="text-lg text-gray-600 m-0 italic">
              Please select a template to continue
            </p>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-2 hover:shadow-2xl ${
                selectedTemplate === template.id 
                  ? 'border-4 border-indigo-500 shadow-[0_12px_24px_rgba(102,126,234,0.4)] -translate-y-2' 
                  : 'border-4 border-transparent'
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="relative h-[700px] md:h-[500px] lg:h-[700px] overflow-hidden bg-gray-100">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-content')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-content absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-50';
                      fallback.innerHTML = `
                        <div class="text-6xl mb-4">📄</div>
                        <div class="text-lg font-medium">Template ${template.id + 1}</div>
                        <div class="text-sm">Preview not available</div>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-indigo-500/85 flex items-center justify-center animate-[fadeIn_0.3s_ease]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl text-indigo-500 font-bold animate-[scaleIn_0.3s_ease]">
                      ✓
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2.5">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed m-0">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default TemplateSelection;
