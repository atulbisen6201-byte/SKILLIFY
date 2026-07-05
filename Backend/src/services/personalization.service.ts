import { prisma } from '../prisma/client.js';

interface CareerConfig {
  title: string;
  company: string;
  skills: string[];
  salary: string;
  description: string;
}

const CAREERS: CareerConfig[] = [
  {
    title: 'Product Manager',
    company: 'Tech Giants',
    skills: ['Product Strategy', 'Agile', 'UX Design', 'Roadmapping', 'Product Design', 'Project Management', 'Leadership', 'TypeScript'],
    salary: '$120K - $180K',
    description: 'Lead product strategy, align stakeholders, manage requirements, and design wireframes.',
  },
  {
    title: 'Full Stack Developer',
    company: 'SaaS Platforms',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git', 'PostgreSQL', 'SQL', 'REST API', 'Docker'],
    salary: '$100K - $150K',
    description: 'Build backend microservices and modern React user interfaces with full database integration.',
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Scale',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Bash', 'Linux', 'Go', 'Prometheus'],
    salary: '$110K - $170K',
    description: 'Design CI/CD pipelines, configure Kubernetes clusters, and automate cloud deployments.',
  },
  {
    title: 'Data Analyst',
    company: 'Analytics Co',
    skills: ['Python', 'SQL', 'PostgreSQL', 'Excel', 'Tableau', 'Statistics', 'Data Analysis'],
    salary: '$80K - $120K',
    description: 'Perform data modeling, configure databases, run sql queries, and build Tableau dashboards.',
  },
  {
    title: 'UX Designer',
    company: 'Design Studios',
    skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Product Design', 'React'],
    salary: '$90K - $140K',
    description: 'Conduct user research, design wireframes in Figma, and build prototypes.',
  },
];

export async function getLatestResume(userId: string) {
  return prisma.resume.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      education: true,
      experience: true,
      projects: true,
    },
  });
}

export async function getPersonalizationData(userId: string) {
  const resume = await getLatestResume(userId);

  if (!resume) {
    return {
      hasResume: false,
      message: 'No resume uploaded. Please upload a resume to personalize all platform features.',
      missingFeatures: ['Name', 'Email', 'Education', 'Skills', 'Experience'],
      dashboard: {
        profileCompletion: 10,
        strengths: [],
        weaknesses: ['No resume file found'],
        careerSummary: 'No career summary available.',
        missingSkills: [],
      },
      jobs: [],
      learning: [],
      projects: [],
      interview: [],
      roadmap: [],
      resumeAnalysis: {
        atsScore: 0,
        missingKeywords: [],
        suggestions: ['Please upload your resume to start AI ATS analysis.'],
      },
      skillGap: [],
      careerSuggestions: [],
      portfolio: [],
      certificates: [],
    };
  }

  // Parse skills
  let userSkills: string[] = [];
  try {
    if (resume.skills.startsWith('[')) {
      userSkills = JSON.parse(resume.skills) as string[];
    } else {
      userSkills = resume.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  } catch {
    userSkills = resume.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  const userSkillsLower = new Set(userSkills.map((s) => s.toLowerCase()));

  // Calculate completion percentage
  let completion = 20; // Base score for having resume file
  if (resume.fullName) completion += 10;
  if (resume.email) completion += 10;
  if (resume.phone) completion += 10;
  if (resume.location) completion += 5;
  if (resume.summary) completion += 10;
  if (userSkills.length > 0) completion += 15;
  if (resume.education.length > 0) completion += 10;
  if (resume.experience.length > 0) completion += 10;

  // Compute strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (userSkills.length > 6) strengths.push('Large technical skill repertoire');
  if (resume.experience.length >= 2) strengths.push('Multiple years of verified professional history');
  if (resume.projects.length > 0) strengths.push('Practical portfolio projects listed');
  if (resume.linkedin || resume.website) strengths.push('Professional online footprint linked');

  if (userSkills.length < 4) weaknesses.push('Sparse technical skills list');
  if (resume.experience.length === 0) weaknesses.push('No direct professional experience listed');
  if (!resume.summary) weaknesses.push('Missing professional summary statement');
  if (!resume.location) weaknesses.push('No contact location details');

  // Match Careers
  const matchedCareers = CAREERS.map((career) => {
    const requiredLower = career.skills.map((s) => s.toLowerCase());
    const matched = requiredLower.filter((s) => userSkillsLower.has(s));
    const missing = career.skills.filter((s) => !userSkillsLower.has(s.toLowerCase()));

    const matchPercentage = requiredLower.length > 0
      ? Math.round((matched.length / requiredLower.length) * 100)
      : 0;

    const finalMatch = Math.max(matchPercentage, 35); // base minimum

    return {
      title: career.title,
      company: career.company,
      match: finalMatch,
      salary: career.salary,
      description: career.description,
      missingSkills: missing,
    };
  }).sort((a, b) => b.match - a.match);

  // Identify all missing skills across top matches
  const topMatchesMissing = matchedCareers.slice(0, 2).flatMap((c) => c.missingSkills);
  const uniqueMissingSkills = Array.from(new Set(topMatchesMissing)).slice(0, 6);

  // Learning / Courses recommendation
  // Load courses and recommend those matching missing skills
  const allCourses = await prisma.course.findMany({
    include: { skill: true },
  });

  const recommendedCourses = allCourses.filter((course) => {
    const courseSkill = course.skill?.title || '';
    // Recommend if the course covers a missing skill
    return uniqueMissingSkills.some(
      (ms) => ms.toLowerCase().includes(courseSkill.toLowerCase()) || courseSkill.toLowerCase().includes(ms.toLowerCase())
    );
  }).slice(0, 4);

  // Fallback courses if db is empty or no direct matches
  if (recommendedCourses.length === 0 && allCourses.length > 0) {
    recommendedCourses.push(...allCourses.slice(0, 2));
  }

  // Recommended Projects
  const recommendedProjects = [];
  if (userSkillsLower.has('react') || userSkillsLower.has('javascript')) {
    recommendedProjects.push({
      title: 'Real-Time Collaboration Dashboard',
      difficulty: 'Intermediate',
      description: 'Integrate WebSockets with React and state managers to sync tasks in real time.',
      technologies: 'React, Socket.io, Tailwind CSS',
    });
  }
  if (userSkillsLower.has('node.js') || userSkillsLower.has('express')) {
    recommendedProjects.push({
      title: 'Dockerized Microservices Gateway',
      difficulty: 'Advanced',
      description: 'Construct a microservices gateway routing request payloads through containerized Node APIs.',
      technologies: 'Node.js, Docker, Redis, Express',
    });
  }
  if (recommendedProjects.length === 0) {
    recommendedProjects.push({
      title: 'RESTful API Task Planner',
      difficulty: 'Beginner',
      description: 'Design and deploy a backend task management scheduler API.',
      technologies: 'JavaScript, Node.js, Express, SQLite',
    });
  }

  // Interview Questions
  const currentRole = resume.experience[0]?.position || 'Software Engineer';
  const targetRole = matchedCareers[0]?.title || 'Senior Software Engineer';
  const interviewQuestions = [
    `Since your resume lists your current role as ${currentRole} and your target trajectory is ${targetRole}, how do you manage dependencies and microservice bounds when working on project integrations?`,
    `You have experienced database queries with ${userSkills.slice(0, 3).join(', ')}. How do you optimize query performance and handle schema migrations in production?`,
  ];
  if (resume.projects[0]) {
    interviewQuestions.push(
      `In your "${resume.projects[0].name}" project, what was the most difficult architectural bottleneck you encountered, and how did you resolve it?`
    );
  } else {
    interviewQuestions.push(
      `Can you walk us through how you design code structure for scalability in a new SaaS deployment?`
    );
  }

  // Roadmap Steps
  const roadmapSteps = uniqueMissingSkills.map((skill, index) => {
    return {
      step: index + 1,
      skill,
      action: `Take tutorials and build small portfolio utility models covering ${skill}.`,
      estimate: `${(index + 1) * 3} weeks`,
    };
  });

  // Resume Analysis
  const actionVerbsUsage = ['architected', 'led', 'built', 'deployed', 'developed', 'created', 'managed', 'configured'];
  const resumeTextLower = `${resume.fullName} ${resume.summary} ${resume.experience.map(e => e.description).join(' ')}`.toLowerCase();
  const matchedVerbs = actionVerbsUsage.filter(v => resumeTextLower.includes(v));
  
  const suggestions = [];
  if (matchedVerbs.length < 3) {
    suggestions.push('Integrate more action-oriented power verbs like "Architected", "Spearheaded", or "Optimized" into your experience bullet points.');
  }
  if (userSkills.length < 5) {
    suggestions.push('Increase your technical keyword density by listing additional databases, libraries, or deployment tools.');
  }
  if (!resume.linkedin) {
    suggestions.push('Add your LinkedIn profile link to improve recruiter click-through rates.');
  }

  return {
    hasResume: true,
    fullName: resume.fullName,
    email: resume.email,
    phone: resume.phone,
    location: resume.location || 'Not Listed',
    skills: userSkills,
    education: resume.education,
    experience: resume.experience,
    projects: resume.projects,
    missingData: {
      internships: resume.experience.some(e => e.position.toLowerCase().includes('intern')) ? 'Present' : 'Not listed',
      languages: 'Only English listed',
    },
    dashboard: {
      profileCompletion: Math.min(completion, 100),
      strengths,
      weaknesses,
      careerSummary: resume.summary || 'Detail-oriented professional specializing in engineering development.',
      missingSkills: uniqueMissingSkills,
    },
    jobs: matchedCareers,
    learning: recommendedCourses,
    projectsRecommendations: recommendedProjects,
    interview: interviewQuestions,
    roadmap: roadmapSteps,
    resumeAnalysis: {
      atsScore: resume.score || 75,
      missingKeywords: uniqueMissingSkills,
      actionVerbs: matchedVerbs,
      suggestions: suggestions.length > 0 ? suggestions : ['Format and keyword density look exceptional!'],
    },
    skillGap: uniqueMissingSkills.map((skill, index) => ({
      skill,
      priority: index === 0 ? 'High' : index < 3 ? 'Medium' : 'Low',
      marketDemand: 'Very High',
    })),
    careerSuggestions: matchedCareers.slice(0, 3),
    portfolio: [
      {
        recommendation: 'Highlight your microservices background',
        suggestion: `Showcase a code repository containing your ${userSkills.slice(0, 3).join('/')} stack.`,
      },
    ],
    certificates: uniqueMissingSkills.slice(0, 2).map(skill => ({
      title: `${skill} Professional Certification`,
      provider: skill.toLowerCase().includes('aws') ? 'Amazon' : 'Udemy / Coursera',
    })),
  };
}

export async function generateMentorReply(userId: string, inputMessage: string, language = 'en') {
  const resume = await getLatestResume(userId);
  const name = resume?.fullName || 'Explorer';
  const skills = resume?.skills ? resume.skills.split(',').map(s => s.trim()).slice(0, 5).join(', ') : 'general development';
  const currentRole = resume?.experience[0]?.position || 'Software developer';

  const lower = inputMessage.toLowerCase();
  
  // Custom response logic simulating AI engine using resume context
  let reply = '';
  
  if (language === 'hi') {
    if (lower.includes('skill') || lower.includes('gap') || lower.includes('missing')) {
      reply = `नमस्ते ${name}! आपके रिज्यूम के अनुसार आपके पास ${skills} जैसे स्किल्स हैं। हालांकि, मार्केट की मांग के अनुसार आपको Kubernetes या Cloud DevOps जैसी स्किल्स सीखनी चाहिए।`;
    } else if (lower.includes('roadmap') || lower.includes('learn') || lower.includes('study')) {
      reply = `हैलो ${name}, आपके लिए एक कस्टमाइज्ड रोडमैप तैयार है। पहले Step में आपको Microservices Architecture और Docker/Kubernetes को 3 हफ्तों में सीखना चाहिए।`;
    } else if (lower.includes('interview') || lower.includes('question') || lower.includes('prep')) {
      reply = `नमस्ते! आपकी ${currentRole} भूमिका के आधार पर, यहाँ एक महत्वपूर्ण इंटरव्यू प्रश्न है: 'अपने रिज्यूम में उल्लेखित प्रोजेक्ट्स में आपने स्केलेबिलिटी और डेटाबेस लोड को कैसे हैंडल किया?'`;
    } else {
      reply = `नमस्ते ${name}! मैं आपका AI करियर मेंटर हूँ। आपके पास ${skills} में बढ़िया अनुभव है। आप मुझसे अपने करियर, इंटरव्यू की तैयारी या स्किल्स गैप के बारे में कुछ भी पूछ सकते हैं।`;
    }
  } else {
    if (lower.includes('skill') || lower.includes('gap') || lower.includes('missing')) {
      reply = `Hello ${name}! Analyzing your resume, your core strengths lie in ${skills}. To match modern full-stack/SaaS requirements, you should bridge the gap in container orchestration (Kubernetes) and cloud configuration management (Terraform).`;
    } else if (lower.includes('roadmap') || lower.includes('learn') || lower.includes('study')) {
      reply = `Hi ${name}, here is your personal roadmap recommendation. Given your background as a ${currentRole}, we recommend focusing first on distributed caching (Redis) and CI/CD pipelines over the next 4 weeks.`;
    } else if (lower.includes('interview') || lower.includes('question') || lower.includes('prep')) {
      reply = `Hello! Based on your target goals and your profile listing ${skills}, try preparing this: 'Explain how you design fault-tolerant REST APIs, and what strategies you use to handle data integrity in PostgreSQL?'`;
    } else {
      reply = `Hello ${name}! As your AI mentor, I see you have solid experience as a ${currentRole} with skills in ${skills}. Ask me anything about improving your resume, preparing for mock interviews, or finding matching career paths!`;
    }
  }

  return reply;
}
