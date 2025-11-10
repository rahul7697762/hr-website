import { ProfessionalResumeData } from '../types/resume';

export const sampleProfessionalResumeData: ProfessionalResumeData = {
  personalInfo: {
    fullName: "Rahul",
    email: "rahulsaini11204@gmail.com",
    phone: "+91-6398792951",
    github: "github.com/rahul76977692/",
    linkedin: "linkedin.com/in/rahul12345/",
    location: "Remote"
  },
  skills: {
    languages: ["Python", "C++"],
    machineLearning: [
      "Supervised & Unsupervised Learning",
      "NLP",
      "CNN",
      "OpenCV",
      "AI agent Expert"
    ],
    tools: [
      "Linux",
      "TensorFlow",
      "Node.js",
      "Flask",
      "Streamlit",
      "Docker",
      "React.js",
      "nSn",
      "retell ai",
      "Vapi AI"
    ],
    databases: ["PostgreSQL", "MySQL", "DBMS", "Firebase"],
    versionControl: ["Git", "GitHub", "VScode"],
    coreConcepts: [
      "Data Structures & Algorithm",
      "OOPS",
      "Operating Systems (OS)",
      "Computer Networks (CN)"
    ],
    softSkills: [
      "Problem-Solving",
      "Team Collaboration",
      "Adaptability",
      "Project Management"
    ]
  },
  experience: [
    {
      company: "Bitlance Tech Hub Private Limited",
      position: "AI Agent Developer Intern & AI Executive",
      location: "Remote",
      duration: "Oct'2025 – Present",
      description: [
        "Developed and deployed AI voice agents using LLM, Retell AI, Vapi AI, LangChain, Node.js, Supabase, WhatsApp API",
        "Integrated AI agents with nSn, Supabase, and WhatsApp automation for end-to-end business workflows.",
        "Collaborated with product teams to enhance real-time decision systems, improving automation efficiency by 30%.",
        "Transitioned into an AI Executive role to lead AI-driven automation projects and mentor new interns on AI agent development."
      ]
    }
  ],
  projects: [
    {
      name: "PrepWise-AI-Powered Interview Practice Platform",
      duration: "June'2025 - July'2025",
      technologies: ["Next.js", "TypeScript", "Gemini", "Firebase", "Vapi AI"],
      description: [
        "Built an interactive platform using React (Next.js) for voice-based interview practice with real-time feedback.",
        "Designed dashboards to communicate with integrated Firebase authentication with a serverless backend.",
        "Experimented with cutting-edge AI APIs and integrated modern frontend libraries to enhance UI performance and user experience."
      ]
    },
    {
      name: "Crop Guidance System",
      duration: "Aug'2025 – sep'2025",
      technologies: [
        "React.js",
        "Firebase",
        "Flask API",
        "Weather API",
        "Machine Learning (CatBoost, LightGBM,CNN)"
      ],
      description: [
        "Developed an ML-powered crop guidance system recommending optimal crops based on soil, weather, and regional data, achieving ~80% prediction accuracy.",
        "Integrated image-based crop disease detection using CNN & OpenCV, classifying common crop diseases with ~92% accuracy and suggesting treatment options.",
        "Integrated a Machine Learning model with Flask API for real-time crop predictions.",
        "Incorporated real-time market data to provide price trends and demand insights for better decision-making.",
        "Implemented a voice-enabled chatbot to answer farmers' queries on crops, soil health, and best practices.",
        "Used Firebase to store and retrieve personalized crop recommendations, enabling seamless front-end interaction with React.js."
      ]
    }
  ],
  certificates: [
    {
      name: "TCP/IP and Advanced Topics",
      issuer: "Coursera",
      date: "Nov'2024",
      url: "Coursera"
    },
    {
      name: "Packet Switching Networks and Algorithms",
      issuer: "Coursera",
      date: "Nov'2024",
      url: "Coursera"
    },
    {
      name: "Introduction to Hardware and Operating Systems",
      issuer: "Coursera",
      date: "Sep'2024",
      url: "Coursera"
    },
    {
      name: "Data Structures and Algorithms (72 hours)",
      issuer: "Iamneo",
      date: "Dec'2024"
    },
    {
      name: "Object Oriented Programming (72 hours)",
      issuer: "Iamneo",
      date: "Dec'2024"
    }
  ],
  achievements: [
    "Solved over 300 Data Structures and Algorithms problems on LeetCode, maintaining a solving streak of more than 51 days.",
    "Secured 11th rank in a national-level Web Development competition organized by CipherSchools.",
    "Participated in Smart India Hackathon (SIH 2025), contributing to an AI-driven project proposal focused on real-world problem-solving and innovation."
  ]
};

export const emptyProfessionalResumeData: ProfessionalResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    location: ""
  },
  skills: {
    languages: [],
    machineLearning: [],
    tools: [],
    databases: [],
    versionControl: [],
    coreConcepts: [],
    softSkills: []
  },
  experience: [],
  projects: [],
  certificates: [],
  achievements: []
};