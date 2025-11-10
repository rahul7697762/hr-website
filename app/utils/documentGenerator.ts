import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ProfessionalResumeData } from '../types/resume';
import { ResumeData } from '../contexts/ResumeContext';

// PDF Generation using html2canvas and jsPDF
export const generatePDF = async (elementId: string, filename: string = 'resume') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// DOC Generation using docx library
export const generateDOC = async (data: ProfessionalResumeData, filename: string = 'resume') => {
  try {
    const doc = new Document({
      sections: [
        {
          children: [
            // Header with name
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personalInfo.fullName,
                  bold: true,
                  size: 32,
                  color: '1f4e79',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
            }),

            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `Mobile: ${data.personalInfo.phone} | `,
                  size: 20,
                }),
                new TextRun({
                  text: `Email: ${data.personalInfo.email}`,
                  size: 20,
                  color: '0066cc',
                }),
                ...(data.personalInfo.github ? [
                  new TextRun({
                    text: ` | GitHub: ${data.personalInfo.github}`,
                    size: 20,
                    color: '0066cc',
                  })
                ] : []),
                ...(data.personalInfo.linkedin ? [
                  new TextRun({
                    text: ` | LinkedIn: ${data.personalInfo.linkedin}`,
                    size: 20,
                    color: '0066cc',
                  })
                ] : []),
              ],
              spacing: { after: 300 },
            }),

            // Skills Section
            new Paragraph({
              children: [
                new TextRun({
                  text: 'SKILLS',
                  bold: true,
                  size: 24,
                  color: '1f4e79',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            // Skills content
            ...Object.entries(data.skills).map(([category, skills]) => {
              if (!skills || skills.length === 0) return null;
              return new Paragraph({
                children: [
                  new TextRun({
                    text: `${category.replace(/([A-Z])/g, ' $1').trim()}: `,
                    bold: true,
                    size: 20,
                    color: '1f4e79',
                  }),
                  new TextRun({
                    text: skills.join(', '),
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              });
            }).filter(Boolean),

            // Experience Section
            ...(data.experience.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'EXPERIENCE',
                    bold: true,
                    size: 24,
                    color: '1f4e79',
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              ...data.experience.flatMap(exp => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.company} | ${exp.location}`,
                      bold: true,
                      size: 20,
                      color: '1f4e79',
                    }),
                    new TextRun({
                      text: `\t${exp.duration}`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.position,
                      italics: true,
                      bold: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                ...exp.description.map(desc => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${desc}`,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 50 },
                  })
                ),
              ]),
            ] : []),

            // Projects Section
            ...(data.projects.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'PROJECTS',
                    bold: true,
                    size: 24,
                    color: '1f4e79',
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              ...data.projects.flatMap(project => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.name,
                      bold: true,
                      size: 20,
                      color: '1f4e79',
                    }),
                    new TextRun({
                      text: `\t${project.duration}`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 50 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Tech | ${project.technologies.join(', ')}`,
                      italics: true,
                      bold: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                ...project.description.map(desc => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${desc}`,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 50 },
                  })
                ),
              ]),
            ] : []),

            // Certificates Section
            ...(data.certificates.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CERTIFICATES',
                    bold: true,
                    size: 24,
                    color: '1f4e79',
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              ...data.certificates.map(cert => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${cert.name} - ${cert.issuer}`,
                      bold: true,
                      size: 20,
                    }),
                    new TextRun({
                      text: `\t${cert.date}`,
                      bold: true,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 50 },
                })
              ),
            ] : []),

            // Achievements Section
            ...(data.achievements.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'ACHIEVEMENTS',
                    bold: true,
                    size: 24,
                    color: '1f4e79',
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              ...data.achievements.map(achievement => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${achievement}`,
                      size: 20,
                    }),
                  ],
                  spacing: { after: 50 },
                })
              ),
            ] : []),
          ],
        },
      ],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  } catch (error) {
    console.error('Error generating DOC:', error);
    throw new Error('Failed to generate DOC');
  }
};

// Convert basic ResumeData to ProfessionalResumeData format
const convertBasicToProfessional = (basicData: ResumeData): ProfessionalResumeData => {
  // Parse skills from string to categorized format
  const skillsArray = basicData.skills ? basicData.skills.split('\n').filter(s => s.trim()) : [];
  
  // Parse experience from string to structured format
  const experienceArray = basicData.experience ? [{
    company: 'Experience',
    position: '',
    location: '',
    duration: '',
    description: basicData.experience.split('\n').filter(s => s.trim())
  }] : [];

  // Parse education from string to structured format
  const educationAsProject = basicData.education ? [{
    name: 'Education',
    duration: '',
    technologies: [],
    description: basicData.education.split('\n').filter(s => s.trim())
  }] : [];

  return {
    personalInfo: {
      fullName: basicData.fullName || '',
      email: basicData.email || '',
      phone: basicData.phone || '',
      location: basicData.address || '',
    },
    skills: {
      languages: skillsArray,
    },
    experience: experienceArray,
    projects: educationAsProject,
    certificates: [],
    achievements: []
  };
};

// DOC Generation for basic resume data
export const generateBasicDOC = async (basicData: ResumeData, filename: string = 'resume') => {
  const professionalData = convertBasicToProfessional(basicData);
  return generateDOC(professionalData, filename);
};

// Print function (for browser's print dialog)
export const printResume = () => {
  window.print();
};