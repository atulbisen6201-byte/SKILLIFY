// src/app/career-recommendation/data/careersData.ts

export interface Topic {
  title: string;
  isCompleted?: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  importance: 'Low' | 'Medium' | 'High' | 'Critical';
  learningTime: string;
  progress: number;
  topics: string[];
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  skills: string[];
  miniProjects: string[];
  completionBadge: string;
}

export interface ProjectItem {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsUsed: string[];
  estimatedTime: string;
  preview: string; // URL or styled CSS indicator
  demoUrl: string;
  githubUrl: string;
  outcomes: string[];
}

export interface ResourceItem {
  title: string;
  author: string;
  url: string;
  difficulty: string;
  thumbnail: string;
}

export interface CertificateItem {
  name: string;
  provider: string;
  difficulty: string;
  duration: string;
  recognition: string;
  url: string;
}

export interface InterviewCategory {
  category: string;
  questionsCount: number;
  difficulty: string;
  questions: Array<{ q: string; a: string }>;
}

export interface CompanyHiring {
  name: string;
  logo: string; // Small SVG or text representation
  status: 'Active' | 'Highly Active' | 'Selective';
  avgSalary: string;
  openRoles: number;
  careersUrl: string;
}

export interface SalaryPoint {
  level: string;
  salary: string;
}

export interface SalaryCountry {
  name: string;
  salary: string;
}

export interface SalaryTrend {
  year: string;
  salary: number;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TimelineMonth {
  month: string;
  skills: string[];
  projects: string[];
  milestones: string[];
}

export interface Career {
  id: number;
  name: string;
  icon: string;
  progress: number;
  averageSalary: string;
  learningDuration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  demand: 'Moderate' | 'High' | 'Very High' | 'Explosive';
  description: string;
  hiringCompanies: string[]; // mini lists of logos shown in the header
  overview: {
    roleDescription: string;
    whatRoleDoes: string[];
    futureScope: string;
    industries: string[];
    pros: string[];
    cons: string[];
    responsibilities: string[];
    education: string;
  };
  skills: Skill[];
  roadmap: RoadmapPhase[];
  progressStats: {
    streak: number;
    weeklyGoal: string;
    xp: number;
    badges: string[];
  };
  projects: {
    beginner: ProjectItem[];
    intermediate: ProjectItem[];
    advanced: ProjectItem[];
  };
  resources: {
    youtube: ResourceItem[];
    documentation: ResourceItem[];
    books: ResourceItem[];
    courses: ResourceItem[];
    blogs: ResourceItem[];
    communities: ResourceItem[];
  };
  certifications: CertificateItem[];
  interviewQuestions: InterviewCategory[];
  resumeGuide: {
    checklist: string[];
    atsTips: string[];
  };
  portfolioGuide: {
    sections: string[];
    checklists: string[];
  };
  companiesDetails: CompanyHiring[];
  jobRoles: string[];
  salaryInsights: {
    experience: SalaryPoint[];
    country: SalaryCountry[];
    trend: SalaryTrend[];
    highestPaying: Array<{ company: string; salary: string }>;
  };
  timeline: TimelineMonth[];
  faqs: FAQItem[];
}

export const careersData: Career[] = [
  {
    id: 1,
    name: 'Frontend Developer',
    icon: 'Code',
    progress: 30,
    averageSalary: '$80k – $120k',
    learningDuration: '6 – 12 months',
    difficulty: 'Medium',
    demand: 'Very High',
    description: 'Build modern, responsive, and interactive user interfaces using web technologies like HTML, CSS, JavaScript, and React.',
    hiringCompanies: ['Google', 'Meta', 'Amazon', 'Vercel'],
    overview: {
      roleDescription: 'A Frontend Developer focuses on the visual and interactive elements of a website or web application. They bridge the gap between UI design and backend engineering, translating visual mockups into functional code.',
      whatRoleDoes: [
        'Develop user-facing features using React, Next.js, and TypeScript',
        'Optimize application speed, scalability, and cross-browser responsiveness',
        'Collaborate with UX/UI designers and Backend developers to align on user experience flows',
        'Maintain system accessibility compliance (WCAG) and write clean, semantic HTML structures'
      ],
      futureScope: 'With the rise of serverless architectures (Next.js, Remix) and highly specialized user-experiences, frontend engineering remains one of the fastest growing fields in tech, transitioning into Fullstack roles and AI-driven interfaces.',
      industries: ['SaaS & Cloud Software', 'E-commerce', 'Fintech', 'Edtech', 'Digital Agencies'],
      pros: [
        'Immediate visual feedback on your work makes learning satisfying',
        'Thriving ecosystem with plenty of open-source frameworks and community support',
        'High demand for remote work opportunities'
      ],
      cons: [
        'Fast-paced ecosystem requires constant learning of new tooling',
        'Cross-device testing and browser compatibility quirks can be tedious',
        'Higher competition for entry-level positions'
      ],
      responsibilities: [
        'Writing clean, modular components in React & Tailwind CSS',
        'Integrating GraphQL and REST API endpoints into application state',
        'Designing state management stores using Redux Toolkit or Zustand',
        'Conducting UI responsiveness testing and layout reviews'
      ],
      education: 'Self-taught developers are highly common. Having portfolio projects, solid JavaScript mastery, and specialized framework knowledge is valued more than formal computer science degrees.'
    },
    skills: [
      {
        name: 'HTML',
        icon: 'FileCode2',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '2 weeks',
        progress: 100,
        topics: ['Semantic HTML', 'Forms & Validations', 'Accessibility (WCAG)', 'SEO Metadata', 'DOM Structure']
      },
      {
        name: 'CSS',
        icon: 'Layers',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '4 weeks',
        progress: 80,
        topics: ['Flexbox & Grid Layouts', 'Responsive Media Queries', 'CSS Variables', 'Animations & Keyframes', 'Tailwind CSS']
      },
      {
        name: 'JavaScript',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '8 weeks',
        progress: 60,
        topics: ['Variables & Scopes', 'Arrow Functions', 'DOM Manipulation', 'ES6+ Syntax', 'Async/Await & Promises']
      },
      {
        name: 'React',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 20,
        topics: ['Functional Components', 'Hooks (useState, useEffect)', 'Routing (React Router)', 'State Management (Zustand)', 'API Fetching']
      },
      {
        name: 'TypeScript',
        icon: 'Code',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 10,
        topics: ['Static Typing', 'Interfaces & Types', 'Generics', 'React Component Types', 'Strict Null Checks']
      },
      {
        name: 'Git & GitHub',
        icon: 'GitBranch',
        difficulty: 'Beginner',
        importance: 'High',
        learningTime: '1 week',
        progress: 40,
        topics: ['Commits & Branches', 'Merge Conflicts', 'Pull Requests', 'GitHub Actions CI/CD']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Basic Web Development',
        duration: '4-6 weeks',
        skills: ['HTML5 Syntax', 'CSS Layouts', 'Responsive Web Design'],
        miniProjects: ['Personal Portfolio Site', 'Responsive Landing Page'],
        completionBadge: 'Web Basics Certificate'
      },
      {
        phase: 'Phase 2',
        title: 'JavaScript Fundamentals',
        duration: '6-8 weeks',
        skills: ['Vanilla JS Core', 'DOM Manipulation', 'API Integrations'],
        miniProjects: ['Interactive Todo App', 'Weather Forecast API Dashboard'],
        completionBadge: 'JS Specialist'
      },
      {
        phase: 'Phase 3',
        title: 'React Component Architecture',
        duration: '8-10 weeks',
        skills: ['JSX', 'React Hooks', 'Zustand State Management'],
        miniProjects: ['E-Commerce Product Grid', 'Collaborative Note Taker'],
        completionBadge: 'React Architect'
      },
      {
        phase: 'Phase 4',
        title: 'TypeScript & Next.js Ecosystem',
        duration: '6-8 weeks',
        skills: ['TypeScript Typings', 'Next.js App Router', 'Server Side Rendering'],
        miniProjects: ['SaaS Dashboard Mockup', 'Dynamic Blog Platform'],
        completionBadge: 'Advanced Frontend Professional'
      }
    ],
    progressStats: {
      streak: 5,
      weeklyGoal: '8 / 10 hours completed',
      xp: 1450,
      badges: ['First Code Commit', 'React Explorer', 'Responsive Master']
    },
    projects: {
      beginner: [
        {
          title: 'Premium Dark Landing Page',
          difficulty: 'Beginner',
          skillsUsed: ['HTML', 'CSS Grid', 'Flexbox'],
          estimatedTime: '8 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/landing',
          githubUrl: 'https://github.com/example/landing',
          outcomes: ['Master responsive CSS layout designs', 'Work with modern visual styles']
        }
      ],
      intermediate: [
        {
          title: 'Crypto Tracker Dashboard',
          difficulty: 'Intermediate',
          skillsUsed: ['React', 'Tailwind CSS', 'REST API', 'Recharts'],
          estimatedTime: '20 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/crypto',
          githubUrl: 'https://github.com/example/crypto',
          outcomes: ['State management with hooks', 'Live polling with API integration', 'Interactive graphing']
        }
      ],
      advanced: [
        {
          title: 'Real-time Project Planner',
          difficulty: 'Advanced',
          skillsUsed: ['Next.js', 'TypeScript', 'Socket.io', 'PostgreSQL'],
          estimatedTime: '40 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/planner',
          githubUrl: 'https://github.com/example/planner',
          outcomes: ['WebSockets collaboration synchronization', 'Type-safe database operations', 'Complex responsive layouts']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Learn React in 10 Hours', author: 'Programming with Mosh', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'React Documentation', author: 'React Team', url: 'https://react.dev', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', url: 'https://eloquentjavascript.net', difficulty: 'Intermediate', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Next.js App Router Masterclass', author: 'Vercel Academy', url: 'https://nextjs.org/learn', difficulty: 'Advanced', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Overreacted.io', author: 'Dan Abramov', url: 'https://overreacted.io', difficulty: 'Advanced', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Reactiflux Discord', author: 'Community', url: 'https://reactiflux.com', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Meta Front-End Developer Professional Certificate', provider: 'Meta', difficulty: 'Beginner-to-Intermediate', duration: '7 months', recognition: 'High', url: 'https://coursera.org' },
      { name: 'freeCodeCamp Front End Development Libraries', provider: 'freeCodeCamp', difficulty: 'Intermediate', duration: '300 hours', recognition: 'Global', url: 'https://freecodecamp.org' }
    ],
    interviewQuestions: [
      {
        category: 'HTML & CSS',
        questionsCount: 15,
        difficulty: 'Easy',
        questions: [
          { q: 'What is semantic HTML and why is it important?', a: 'Semantic HTML uses tags that accurately describe the meaning of the content, which improves SEO, readability, and accessibility.' },
          { q: 'Explain the difference between absolute, relative, and fixed positioning.', a: 'Relative positions relative to its normal position, absolute relative to its nearest positioned ancestor, and fixed relative to the viewport.' }
        ]
      },
      {
        category: 'JavaScript & React',
        questionsCount: 20,
        difficulty: 'Medium',
        questions: [
          { q: 'What is the Virtual DOM in React?', a: 'An in-memory representation of the real DOM. React updates the Virtual DOM first, runs a diff, and only updates changed items in the real DOM for high performance.' },
          { q: 'Explain closures in JavaScript.', a: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment), allowing it to access outer scopes even after the outer function has finished.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Add live URLs to GitHub and Vercel/Netlify for all projects',
        'Highlight UI performance optimizations (e.g. "Reduced bundle load by 25%")',
        'Focus bullet points on results and UI metrics rather than lists of technologies'
      ],
      atsTips: [
        'Include keywords like React, TypeScript, Responsive Design, WCAG Accessibility, and Next.js',
        'Avoid complex columns or fancy icons in the PDF parsing template'
      ]
    },
    portfolioGuide: {
      sections: ['Hero Section', 'About Me', 'Core Skills Layout', 'Featured Projects', 'Certifications Showcase', 'Contact Form'],
      checklists: [
        'Include high-resolution mockup screenshots of websites',
        'Showcase interactive demos directly inside the web page',
        'List code repositories for easy inspection'
      ]
    },
    companiesDetails: [
      { name: 'Google', logo: 'G', status: 'Selective', avgSalary: '$130k', openRoles: 14, careersUrl: 'https://careers.google.com' },
      { name: 'Meta', logo: 'M', status: 'Active', avgSalary: '$140k', openRoles: 9, careersUrl: 'https://careers.meta.com' },
      { name: 'Vercel', logo: '▲', status: 'Highly Active', avgSalary: '$125k', openRoles: 5, careersUrl: 'https://vercel.com/careers' }
    ],
    jobRoles: [
      'Junior Frontend Developer',
      'React Engineer',
      'UI/UX Developer',
      'Senior Frontend Architect',
      'Product Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$70,000' },
        { level: '2-5 Years (Mid)', salary: '$105,000' },
        { level: '5+ Years (Senior)', salary: '$155,000' }
      ],
      country: [
        { name: 'United States', salary: '$115,000' },
        { name: 'United Kingdom', salary: '£65,000' },
        { name: 'Germany', salary: '€75,000' },
        { name: 'India', salary: '₹1,500,000' }
      ],
      trend: [
        { year: '2022', salary: 98000 },
        { year: '2023', salary: 104000 },
        { year: '2024', salary: 112000 },
        { year: '2025', salary: 118000 }
      ],
      highestPaying: [
        { company: 'Netflix', salary: '$170,000' },
        { company: 'Airbnb', salary: '$162,000' },
        { company: 'Stripe', salary: '$158,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['HTML5 Semantic Structure', 'CSS Basics', 'Media Queries'], projects: ['Recipe Listing Card', 'E-commerce Landing Page'], milestones: ['Able to write fully responsive layouts'] },
      { month: 'Month 2', skills: ['CSS Flexbox & Grid', 'Bootstrap/Tailwind', 'Sass basics'], projects: ['SaaS Landing Dashboard Mockup'], milestones: ['Complete clean layouts under 3 hours'] },
      { month: 'Month 3', skills: ['JS Syntax', 'DOM Selectors', 'Interactive UI logic'], projects: ['Calculator App', 'Weather forecast polling dashboard'], milestones: ['Create interactive sites and call API endpoints'] },
      { month: 'Month 4', skills: ['React Props & State', 'React Hooks', 'Zustand basics'], projects: ['Note Taking App', 'Personal task tracker'], milestones: ['Structure complex application state in React'] },
      { month: 'Month 5', skills: ['TypeScript typings', 'Next.js App router', 'Tailwind theme specs'], projects: ['Mini SaaS platform', 'Interactive board game'], milestones: ['Launch fast static and dynamic sites'] },
      { month: 'Month 6', skills: ['Git branching', 'Testing libraries', 'ATS CV formatting'], projects: ['Job Board Portal', 'Complete portfolio build'], milestones: ['Job ready with real project proof'] }
    ],
    faqs: [
      { q: 'How long does it take to learn Frontend Development?', a: 'Typically 6 to 12 months of dedicated daily practice. Focus on core JavaScript first before starting React.' },
      { q: 'Do I need a degree to get hired?', a: 'No, portfolio sites displaying live, responsive apps and solid GitHub repositories are widely accepted.' },
      { q: 'Can I get a job without commercial experience?', a: 'Yes. Building complex open-source contributions or high-quality freelance-scale client projects counts.' }
    ]
  },
  {
    id: 2,
    name: 'Backend Developer',
    icon: 'Database',
    progress: 45,
    averageSalary: '$90k – $130k',
    learningDuration: '8 – 14 months',
    difficulty: 'Medium',
    demand: 'High',
    description: 'Design, build, and maintain server-side application logic, databases, microservices, and secure API protocols.',
    hiringCompanies: ['Amazon', 'Netflix', 'Stripe', 'Supabase'],
    overview: {
      roleDescription: 'A Backend Developer architectes the engines that power client applications. They focus on database models, server execution performance, data validation, user authorization, and secure information routing.',
      whatRoleDoes: [
        'Build APIs using Express, NestJS, Python FastAPIs, or Go Lang',
        'Model database structures using PostgreSQL, MongoDB, or Prisma ORMs',
        'Implement authentication schemas via JSON Web Tokens (JWT) and OAuth2',
        'Manage caching engines like Redis to boost request dispatch times'
      ],
      futureScope: 'Server backend engineering is shifting heavily towards Serverless Edge routing, Cloud database APIs, containerization (Docker, Kubernetes), and AI service integrations.',
      industries: ['Enterprise Tech', 'Banking & Fintech', 'Logistics', 'Healthcare Systems'],
      pros: [
        'Focus on engineering patterns, caching strategies, and algorithms over visual tweaks',
        'Highly valued and stable career path with great progression models',
        'Clear verification metrics (test coverage, request latency, database query speed)'
      ],
      cons: [
        'Debugging abstract system leaks and memory failures can be tough',
        'Need to learn networking, DevOps, security, and multiple protocols (REST, GraphQL, gRPC)',
        'System outages require immediate troubleshooting'
      ],
      responsibilities: [
        'Developing microservices scaling across Kubernetes clusters',
        'Designing secure schema migrations for relational databases',
        'Writing unit and integration endpoint tests (Jest, Supertest)',
        'Securing connections with cryptographic protocols and headers'
      ],
      education: 'A background in Computer Science or engineering fundamentals is helpful, though developers with clean API code designs and strong database optimization records get hired regularly.'
    },
    skills: [
      {
        name: 'Node.js & Express',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 80,
        topics: ['Node Event Loop', 'Express Middleware', 'Route controllers', 'Error handling', 'JWT Authentication']
      },
      {
        name: 'SQL Databases',
        icon: 'Database',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '5 weeks',
        progress: 50,
        topics: ['PostgreSQL queries', 'Schema design & relations', 'Indexes', 'Migrations', 'Prisma ORM']
      },
      {
        name: 'NoSQL Databases',
        icon: 'Database',
        difficulty: 'Beginner',
        importance: 'Medium',
        learningTime: '3 weeks',
        progress: 40,
        topics: ['MongoDB schemas', 'Mongoose aggregations', 'Document models']
      },
      {
        name: 'API Protocols',
        icon: 'Code',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 30,
        topics: ['REST guidelines', 'GraphQL fields & Resolvers', 'gRPC streams', 'WebSocket events']
      },
      {
        name: 'Testing & Security',
        icon: 'Shield',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 25,
        topics: ['Jest Unit Tests', 'Integration testing', 'CORS & helmet security', 'OAuth 2.0 flow']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Server-side Basics',
        duration: '4-6 weeks',
        skills: ['Node.js basics', 'HTTP Request lifecycle', 'Routing parameters'],
        miniProjects: ['Basic URL Shortener API', 'Terminal Task Planner Manager'],
        completionBadge: 'Server Architect Basics'
      },
      {
        phase: 'Phase 2',
        title: 'Database Mastery & Schemas',
        duration: '6-8 weeks',
        skills: ['SQL relational design', 'PostgreSQL operations', 'Prisma ORM models'],
        miniProjects: ['Multi-category forum API database', 'E-commerce transactional database backend'],
        completionBadge: 'Database Modeler'
      },
      {
        phase: 'Phase 3',
        title: 'Auth & Secure Connections',
        duration: '4-5 weeks',
        skills: ['JWT keys security', 'Bcrypt password hashing', 'Session models'],
        miniProjects: ['Secured user workspace portal API', 'Payment gateway webhooks handler'],
        completionBadge: 'Security Guard'
      },
      {
        phase: 'Phase 4',
        title: 'Scale & Caching microservices',
        duration: '6-8 weeks',
        skills: ['Docker containers', 'Redis caching', 'Kafka event broker streams'],
        miniProjects: ['Live chat WebSockets gateway server', 'Scalable background email dispatch worker'],
        completionBadge: 'Advanced backend builder'
      }
    ],
    progressStats: {
      streak: 12,
      weeklyGoal: '10 / 12 hours completed',
      xp: 2600,
      badges: ['Database wizard', 'Secured API deployer', 'Docker pilot']
    },
    projects: {
      beginner: [
        {
          title: 'Notes REST API',
          difficulty: 'Beginner',
          skillsUsed: ['Node.js', 'Express', 'SQLite'],
          estimatedTime: '10 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/notes-api',
          githubUrl: 'https://github.com/example/notes-api',
          outcomes: ['Design clean REST endpoint verbs', 'Configure local SQLite storage']
        }
      ],
      intermediate: [
        {
          title: 'Collab Workspace Backend',
          difficulty: 'Intermediate',
          skillsUsed: ['NestJS', 'PostgreSQL', 'JWT', 'Redis'],
          estimatedTime: '24 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/collab-back',
          githubUrl: 'https://github.com/example/collab-back',
          outcomes: ['Develop robust user workspace auth systems', 'Store dashboard assets caching in Redis']
        }
      ],
      advanced: [
        {
          title: 'Edge Microservice Event bus',
          difficulty: 'Advanced',
          skillsUsed: ['Go', 'Kafka', 'Docker', 'gRPC'],
          estimatedTime: '45 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/eventbus',
          githubUrl: 'https://github.com/example/eventbus',
          outcomes: ['High-throughput message pipeline streams', 'Containerize node microservices with Docker network mapping']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Node.js Backend course', author: 'FreeCodeCamp', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'PostgreSQL Manual', author: 'PG Team', url: 'https://postgresql.org/docs', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', url: 'https://www.oreilly.com', difficulty: 'Advanced', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Database Bootcamp', author: 'Stephen Grider', url: 'https://udemy.com', difficulty: 'Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Netflix Tech Blog', author: 'Netflix Eng', url: 'https://netflixtechblog.com', difficulty: 'Advanced', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Dev.to Backend tag', author: 'Dev community', url: 'https://dev.to', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'AWS Certified Developer Associate', provider: 'Amazon Web Services', difficulty: 'Intermediate', duration: '3 months', recognition: 'High', url: 'https://aws.amazon.com' },
      { name: 'MongoDB Certified Developer', provider: 'MongoDB', difficulty: 'Intermediate', duration: '2 months', recognition: 'Global', url: 'https://mongodb.com' }
    ],
    interviewQuestions: [
      {
        category: 'Databases',
        questionsCount: 12,
        difficulty: 'Medium',
        questions: [
          { q: 'Explain the ACID properties of transactional databases.', a: 'Atomicity (all or nothing), Consistency (preserves integrity), Isolation (concurrent execution safeguards), and Durability (persistence guaranteed).' },
          { q: 'What is the purpose of database indexes and when should you avoid them?', a: 'Indexes speed up select queries, but they slow down writes (insert, update, delete) because index records need updating as well.' }
        ]
      },
      {
        category: 'APIs & Security',
        questionsCount: 18,
        difficulty: 'Hard',
        questions: [
          { q: 'What is the difference between SQL injection and CSRF attacks?', a: 'SQL injection injects malicious SQL statements to read/modify DB records. CSRF tricks a logged-in user browser into executing unwanted commands in a trusted app context.' },
          { q: 'Explain how Node.js event loop functions.', a: 'Node.js is single-threaded using an event loop to handle non-blocking asynchronous callbacks by delegating heavy OS operations to a background Libuv thread pool.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Include statistics of database query latency reductions (e.g. "Reduced query response from 400ms to 50ms")',
        'Highlight microservices and server layouts you designed',
        'Demonstrate API test suite coverage metrics (e.g. "Maintained 95% Jest test coverage")'
      ],
      atsTips: [
        'Add keywords like Node.js, PostgreSQL, REST APIs, Microservices, Caching, Docker, and AWS',
        'Detail your backend architectural decisions explicitly'
      ]
    },
    portfolioGuide: {
      sections: ['Architecture Overview', 'API Endpoint Swagger Docs', 'Database ERD Diagram schemas', 'CI/CD pipeline logs', 'Performance load test metrics'],
      checklists: [
        'Add a visual map illustrating how user requests pass from gateway to backend microservices',
        'Include a live API swagger portal'
      ]
    },
    companiesDetails: [
      { name: 'Amazon', logo: 'A', status: 'Active', avgSalary: '$140k', openRoles: 25, careersUrl: 'https://amazon.jobs' },
      { name: 'Stripe', logo: 'S', status: 'Highly Active', avgSalary: '$150k', openRoles: 11, careersUrl: 'https://stripe.com/jobs' }
    ],
    jobRoles: [
      'Backend Engineer',
      'API Architect',
      'Database Engineer',
      'Systems Programmer',
      'Cloud Architect'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$78,000' },
        { level: '2-5 Years (Mid)', salary: '$118,000' },
        { level: '5+ Years (Senior)', salary: '$165,000' }
      ],
      country: [
        { name: 'United States', salary: '$125,000' },
        { name: 'United Kingdom', salary: '£72,000' },
        { name: 'Germany', salary: '€82,000' },
        { name: 'India', salary: '₹1,800,000' }
      ],
      trend: [
        { year: '2022', salary: 105000 },
        { year: '2023', salary: 114000 },
        { year: '2024', salary: 122000 },
        { year: '2025', salary: 128000 }
      ],
      highestPaying: [
        { company: 'Netflix', salary: '$180,000' },
        { company: 'Stripe', salary: '$168,000' },
        { company: 'Apple', salary: '$164,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Node.js basics', 'HTTP methods', 'JSON formats'], projects: ['Basic Server Logger'], milestones: ['Creating simple local servers'] },
      { month: 'Month 2', skills: ['Express API controllers', 'Middleware specs'], projects: ['Task API Planner'], milestones: ['Constructing REST endpoints'] },
      { month: 'Month 3', skills: ['PostgreSQL syntax', 'Relational design', 'Prisma ORM'], projects: ['Blog API with SQL backend'], milestones: ['Modeling relations and indexing tables'] },
      { month: 'Month 4', skills: ['Password Hashing', 'JWT Token keys', 'Sessions configurations'], projects: ['Secured Accounts API'], milestones: ['Securing routes from unauthorized requests'] },
      { month: 'Month 5', skills: ['Redis Cache operations', 'Dockerizing containers'], projects: ['Performance Caching gateway'], milestones: ['Minimizing response latency and virtualization'] },
      { month: 'Month 6', skills: ['System design specs', 'Integration tests'], projects: ['Scalable chat service', 'Full portfolio deployment'], milestones: ['Production deployment setup complete'] }
    ],
    faqs: [
      { q: 'Is Java or Python better than Node for backend?', a: 'All are highly productive. Node is excellent for real-time applications; Python is preferred for AI/data tasks; Java is standard in major enterprise systems.' },
      { q: 'Why is database indexing important?', a: 'Indexing speeds up query reads significantly by pointing queries directly to records, avoiding a slow sequential scan of the database.' }
    ]
  },
  {
    id: 3,
    name: 'Full Stack Developer',
    icon: 'Layers',
    progress: 55,
    averageSalary: '$95k – $140k',
    learningDuration: '10 – 18 months',
    difficulty: 'Hard',
    demand: 'Very High',
    description: 'Master both client-side and server-side engineering, building end-to-end applications with database integration.',
    hiringCompanies: ['Vercel', 'Supabase', 'Stripe', 'Google'],
    overview: {
      roleDescription: 'A Full Stack Developer handles both the frontend (UI/UX) and backend (server, databases, APIs) of an application. They are versatile engineers who understand the complete web stack, enabling them to build features end-to-end independently.',
      whatRoleDoes: [
        'Develop responsive user interfaces using frameworks like Next.js, React, and Tailwind CSS',
        'Build secure, robust backend APIs using Node.js, Express, or serverless functions',
        'Design database models and execute SQL/NoSQL schemas (PostgreSQL, Supabase, MongoDB)',
        'Deploy applications, configure CI/CD pipelines, and manage cloud hosting environments'
      ],
      futureScope: 'The growth of full-stack meta-frameworks (Next.js, Remix, SvelteKit) and serverless databases has made Full Stack Developers highly crucial for startups and enterprise agile teams.',
      industries: ['SaaS & Cloud Startups', 'E-commerce Platforms', 'Fintech', 'Digital Product Studios'],
      pros: [
        'Highly versatile, making you extremely employable in startups',
        'Able to build complete side projects and MVPs from scratch',
        'Deep understanding of how frontend and backend collaborate'
      ],
      cons: [
        'High cognitive load – must stay updated on both frontend and backend tooling',
        'Can be a "jack of all trades, master of none" if not specialized in key areas',
        'Harder learning curve for absolute beginners'
      ],
      responsibilities: [
        'Architecting component libraries and managing client-side state',
        'Building relational database models and drafting optimized query pipelines',
        'Implementing user authentication (JWT, OAuth) and managing API keys securely',
        'Dockerizing applications and writing workflow pipelines (GitHub Actions)'
      ],
      education: 'A computer science degree is beneficial but not required. A robust portfolio showing fully deployed full-stack web applications with authentication, live databases, and API integrations is highly valued.'
    },
    skills: [
      {
        name: 'React & Next.js',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 80,
        topics: ['Server Components (RSC)', 'App Router', 'Client-side Hooks', 'Zustand State', 'API Routes']
      },
      {
        name: 'Node.js & Express',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '5 weeks',
        progress: 70,
        topics: ['REST APIs', 'Middleware Architectures', 'Error Handling', 'Authentication & JWT', 'WebSockets']
      },
      {
        name: 'PostgreSQL & ORMs',
        icon: 'Database',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '4 weeks',
        progress: 60,
        topics: ['Relational Schema Design', 'Indexes & Joins', 'Prisma ORM', 'Supabase Client', 'Migrations']
      },
      {
        name: 'DevOps & Deployment',
        icon: 'GitBranch',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 40,
        topics: ['Vercel & Netlify Deployment', 'Docker Containers', 'CI/CD Pipelines', 'GitHub Actions', 'AWS S3 Storage']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Advanced Frontend Foundations',
        duration: '6-8 weeks',
        skills: ['React Hooks', 'Tailwind CSS Layouts', 'TypeScript Typings'],
        miniProjects: ['Dashboard Layout UI', 'Portfolio Site with Tailwind'],
        completionBadge: 'Advanced Frontend Professional'
      },
      {
        phase: 'Phase 2',
        title: 'Backend & Relational DBs',
        duration: '8-10 weeks',
        skills: ['Node.js Servers', 'Express API Routing', 'PostgreSQL Mappings'],
        miniProjects: ['E-commerce REST API', 'Note Taking Database App'],
        completionBadge: 'Backend Architect'
      },
      {
        phase: 'Phase 3',
        title: 'Full Stack Integration & Auth',
        duration: '6-8 weeks',
        skills: ['JWT Authentication', 'Next.js App Router API', 'Prisma Schema Modeling'],
        miniProjects: ['SaaS Task Manager with User Auth', 'Collaborative Doc Planner'],
        completionBadge: 'Full Stack Integrator'
      },
      {
        phase: 'Phase 4',
        title: 'CI/CD, Docker & Production',
        duration: '6 weeks',
        skills: ['Docker Images', 'GitHub Actions Automation', 'AWS S3 Integrations'],
        miniProjects: ['Real-Time Chat App Deployed on Docker', 'Video Hosting Portal'],
        completionBadge: 'Production Ready Full Stack Engineer'
      }
    ],
    progressStats: {
      streak: 8,
      weeklyGoal: '10 / 12 hours completed',
      xp: 2150,
      badges: ['Database Creator', 'API Developer', 'Next.js Deployer']
    },
    projects: {
      beginner: [
        {
          title: 'Dynamic Contact Manager',
          difficulty: 'Beginner',
          skillsUsed: ['React', 'Local Storage', 'CSS Flexbox'],
          estimatedTime: '10 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/contacts',
          githubUrl: 'https://github.com/example/contacts',
          outcomes: ['Handle React state events', 'Utilize client-side persistent storage']
        }
      ],
      intermediate: [
        {
          title: 'SaaS Invoicing Portal',
          difficulty: 'Intermediate',
          skillsUsed: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
          estimatedTime: '30 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/invoices',
          githubUrl: 'https://github.com/example/invoices',
          outcomes: ['Develop database schemas and relations', 'Write secure Server Actions', 'Implement PDF invoice generation']
        }
      ],
      advanced: [
        {
          title: 'Real-time Collaborative Kanban',
          difficulty: 'Advanced',
          skillsUsed: ['Next.js', 'Socket.io', 'Supabase', 'Tailwind CSS'],
          estimatedTime: '50 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/kanban',
          githubUrl: 'https://github.com/example/kanban',
          outcomes: ['Synchronize collaborative cards across boards', 'Set up real-time DB trigger notifications', 'Handle clean visual drag-and-drop state']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Full Stack React & Node Tutorial', author: 'JavaScript Mastery', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'Next.js Official Docs', author: 'Vercel Team', url: 'https://nextjs.org/docs', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Fullstack React: The Complete Guide', author: 'Anthony Accomazzo', url: 'https://amazon.com', difficulty: 'Intermediate', thumbnail: 'book' }
      ],
      courses: [
        { title: 'The Complete 2026 Web Development Bootcamp', author: 'Angela Yu', url: 'https://udemy.com', difficulty: 'Beginner', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Lee Robinson Tech Blog', author: 'Lee Robinson', url: 'https://leerob.io', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Supabase Discord Server', author: 'Supabase', url: 'https://supabase.com', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Meta Full-Stack Developer Professional Certificate', provider: 'Meta', difficulty: 'Beginner-to-Intermediate', duration: '8 months', recognition: 'High', url: 'https://coursera.org' },
      { name: 'AWS Certified Solutions Architect – Associate', provider: 'Amazon Web Services', difficulty: 'Intermediate', duration: '3 months', recognition: 'Global', url: 'https://aws.amazon.com' }
    ],
    interviewQuestions: [
      {
        category: 'Next.js & React',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'What is the difference between Server Components and Client Components in Next.js?', a: 'Server Components render on the server, resulting in smaller bundle sizes and faster initial loads. Client Components are hydrated on the client, enabling interactive UI interactions using hooks like useState and useEffect.' },
          { q: 'Explain Hydration in React.', a: 'Hydration is the process of attaching event listeners and reactivity to the static HTML sent by the server, transforming static page markup into an interactive React application.' }
        ]
      },
      {
        category: 'Backend & Relational DBs',
        questionsCount: 12,
        difficulty: 'Medium',
        questions: [
          { q: 'What is an N+1 query problem and how do you resolve it?', a: 'An N+1 query problem occurs when your application executes one initial query to fetch records, and then executes an additional query for each of the N returned records to fetch their relation. Solve it by using eager loading (e.g. "include" in Prisma or "JOIN" in SQL).' },
          { q: 'What is the role of CORS in web applications?', a: 'Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page, unless the server explicitly permits it using headers.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'List 2-3 fully deployed full-stack web applications with live links',
        'Quantify achievements (e.g. "Reduced API latency by 35% with Redis")',
        'Highlight the full range of skills from layout design to schema migrations'
      ],
      atsTips: [
        'Include keywords like Next.js, React, Node.js, PostgreSQL, TypeScript, REST API, Git, Docker, and AWS',
        'Format the PDF with clean bullet points and headings'
      ]
    },
    portfolioGuide: {
      sections: ['Featured Full Stack Projects', 'API Design Showcases', 'Database Schema Maps (ERDs)', 'DevOps Stack Overview'],
      checklists: [
        'Include credentials for guest test accounts so recruiters can test features easily',
        'Link directly to the specific GitHub repositories for your backend and frontend code'
      ]
    },
    companiesDetails: [
      { name: 'Vercel', logo: '▲', status: 'Highly Active', avgSalary: '$125k', openRoles: 6, careersUrl: 'https://vercel.com/careers' },
      { name: 'Supabase', logo: 'S', status: 'Active', avgSalary: '$120k', openRoles: 4, careersUrl: 'https://supabase.com/careers' },
      { name: 'Stripe', logo: 'S', status: 'Active', avgSalary: '$145k', openRoles: 8, careersUrl: 'https://stripe.com/jobs' }
    ],
    jobRoles: [
      'Full Stack Engineer',
      'Software Engineer',
      'MERN Stack Developer',
      'Next.js Developer',
      'Technical Co-founder'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$75,000' },
        { level: '2-5 Years (Mid)', salary: '$112,000' },
        { level: '5+ Years (Senior)', salary: '$160,000' }
      ],
      country: [
        { name: 'United States', salary: '$120,000' },
        { name: 'United Kingdom', salary: '£70,000' },
        { name: 'Germany', salary: '€80,000' },
        { name: 'India', salary: '₹1,600,000' }
      ],
      trend: [
        { year: '2022', salary: 102000 },
        { year: '2023', salary: 110000 },
        { year: '2024', salary: 118000 },
        { year: '2025', salary: 124000 }
      ],
      highestPaying: [
        { company: 'Netflix', salary: '$175,000' },
        { company: 'Stripe', salary: '$165,000' },
        { company: 'Vercel', salary: '$155,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['HTML5 Syntax', 'CSS Layouts', 'Flexbox & Grid'], projects: ['Personal Profile Page', 'E-commerce Product Layout'], milestones: ['Able to design layouts cleanly'] },
      { month: 'Month 2', skills: ['JavaScript Syntax', 'DOM Manipulation', 'ES6+ Features'], projects: ['Interactive Calculator', 'Vanilla JS Todo List'], milestones: ['Handle user events and change DOM states'] },
      { month: 'Month 3', skills: ['React Components', 'State and Props', 'React Hooks'], projects: ['Weather API Search App', 'Simple Task Dashboard'], milestones: ['Develop components and handle API fetching in React'] },
      { month: 'Month 4', skills: ['Node.js basics', 'Express Routing', 'REST API rules'], projects: ['Task Planner REST API', 'URL Shortener API'], milestones: ['Build a local server API endpoint with custom routing'] },
      { month: 'Month 5', skills: ['PostgreSQL queries', 'Schema design', 'Prisma ORM integration'], projects: ['Blog API with SQL Database', 'E-commerce Admin Backend'], milestones: ['Design relational schemas and manage DB operations'] },
      { month: 'Month 6', skills: ['Next.js Framework', 'App Router', 'Vercel Deployment'], projects: ['SaaS Full Stack App with Authentication', 'Portfolio Portal'], milestones: ['Deploy complete SaaS products to production with live DBs'] }
    ],
    faqs: [
      { q: 'How long does it take to learn Full Stack development?', a: 'Typically 10 to 18 months of consistent daily work. It is recommended to build confidence in frontend code before writing backend servers.' },
      { q: 'What database should I learn first?', a: 'PostgreSQL is highly recommended as it is the industry standard for relational databases. MongoDB is a great next step for NoSQL.' }
    ]
  },
  {
    id: 4,
    name: 'Python Developer',
    icon: 'FileCode2',
    progress: 20,
    averageSalary: '$85k – $125k',
    learningDuration: '6 – 10 months',
    difficulty: 'Easy',
    demand: 'High',
    description: 'Learn Python syntax, script automations, build web scrapers, and develop APIs using Django or FastAPI.',
    hiringCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
    overview: {
      roleDescription: 'A Python Developer writes backend services, scripts automated pipelines, extracts data, and develops web applications using Python. Known for its clean and readable syntax, Python is the language of choice for scripting, data pipelines, and server backends.',
      whatRoleDoes: [
        'Build web application backends and APIs using FastAPI, Django, or Flask',
        'Write scripts to automate repetitive tasks and manage system configurations',
        'Extract and parse data using libraries like BeautifulSoup and Scrapy',
        'Integrate databases, third-party APIs, and manage server logic deployments'
      ],
      futureScope: 'Python remains extremely popular due to its dominance in data science, machine learning integrations, backend microservices, and general engineering automation tools.',
      industries: ['Tech & SaaS startups', 'Data Analytics Firms', 'Finance & Quantitative Labs', 'E-commerce Services'],
      pros: [
        'Clean, human-readable syntax that makes it easy for beginners to write',
        'Massive standard libraries and active community packages (PyPI)',
        'Extremely versatile - used in web dev, data science, and automation alike'
      ],
      cons: [
        'Slower runtime execution compared to compiled languages like Go, Rust, or C++',
        'Dynamic typing can lead to runtime errors in large scale applications if not tested properly',
        'Requires learning frameworks like Django to do web development effectively'
      ],
      responsibilities: [
        'Writing clean, pep8-compliant Python code',
        'Designing database schemas and executing migration workflows (Alembic, Django Migrations)',
        'Writing modular tests (pytest) to maintain backend coverage',
        'Configuring web scrapers and parsing HTML data pipelines safely'
      ],
      education: 'Self-taught and bootcamp developers are highly common. A solid GitHub repository demonstrating clean, structured scripts, web scrapers, or APIs is sufficient to secure junior interviews.'
    },
    skills: [
      {
        name: 'Python Core Syntax',
        icon: 'FileCode2',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '4 weeks',
        progress: 80,
        topics: ['Data Types & Structures', 'Control Flow & Loops', 'Functions & Arguments', 'OOP Concepts', 'File Handling']
      },
      {
        name: 'FastAPI & Django',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 40,
        topics: ['FastAPI Routing', 'Pydantic Models', 'Django ORM', 'Middlewares', 'JWT Auth in Python']
      },
      {
        name: 'Databases (SQL & ORMs)',
        icon: 'Database',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 30,
        topics: ['SQLite & PostgreSQL', 'SQLAlchemy Models', 'Migrations', 'CRUD Queries']
      },
      {
        name: 'Scraping & Automation',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'Medium',
        learningTime: '3 weeks',
        progress: 50,
        topics: ['BeautifulSoup Scraping', 'Requests Library', 'Selenium Automations', 'Cron Jobs', 'Regular Expressions']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Python Core & Scripting',
        duration: '4-6 weeks',
        skills: ['Python Basics', 'OOP Paradigms', 'Error Handling'],
        miniProjects: ['Log File Parser', 'Bulk File Renamer Script'],
        completionBadge: 'Python Scripting Associate'
      },
      {
        phase: 'Phase 2',
        title: 'Databases & Web APIs',
        duration: '6-8 weeks',
        skills: ['SQL Basics', 'FastAPI Web Basics', 'Pydantic Validation'],
        miniProjects: ['Recipe API with SQLite', 'Weather CLI Tool'],
        completionBadge: 'FastAPI Builder'
      },
      {
        phase: 'Phase 3',
        title: 'Django Web Framework',
        duration: '6-8 weeks',
        skills: ['Django Models', 'Admin Panel Settings', 'User Authentication'],
        miniProjects: ['Multi-User Blog Portal', 'Local E-Commerce Site'],
        completionBadge: 'Django Developer'
      },
      {
        phase: 'Phase 4',
        title: 'Scraping & DevOps Integration',
        duration: '4 weeks',
        skills: ['BeautifulSoup Scrapers', 'Dockerizing Python apps', 'Github Actions'],
        miniProjects: ['Crypto Price Web Scraper', 'Dockerized Django API'],
        completionBadge: 'Python Professional'
      }
    ],
    progressStats: {
      streak: 3,
      weeklyGoal: '6 / 8 hours completed',
      xp: 850,
      badges: ['CLI Programmer', 'FastAPI Explorer']
    },
    projects: {
      beginner: [
        {
          title: 'Command Line Password Generator',
          difficulty: 'Beginner',
          skillsUsed: ['Python', 'Random Module', 'CLI Args'],
          estimatedTime: '4 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/cli-pass',
          githubUrl: 'https://github.com/example/cli-pass',
          outcomes: ['Work with Python libraries', 'Handle command-line script arguments']
        }
      ],
      intermediate: [
        {
          title: 'Stock Market Scraper & API',
          difficulty: 'Intermediate',
          skillsUsed: ['Python', 'FastAPI', 'BeautifulSoup', 'SQLite'],
          estimatedTime: '15 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/stock-scrape',
          githubUrl: 'https://github.com/example/stock-scrape',
          outcomes: ['Extract data from live financial sites', 'Expose scraped records via secure FastAPI endpoints']
        }
      ],
      advanced: [
        {
          title: 'Collaborative Real-time Wiki',
          difficulty: 'Advanced',
          skillsUsed: ['Django', 'Channels (WebSockets)', 'Redis', 'PostgreSQL'],
          estimatedTime: '35 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/wiki',
          githubUrl: 'https://github.com/example/wiki',
          outcomes: ['Configure WebSockets in Django', 'Cache wiki page lookups in Redis', 'Implement granular role permissions']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Python for Beginners Full Course', author: 'Programming with Mosh', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'Python Official Documentation', author: 'Python PSF', url: 'https://docs.python.org', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Automate the Boring Stuff with Python', author: 'Al Sweigart', url: 'https://automatetheboringstuff.com', difficulty: 'Beginner', thumbnail: 'book' }
      ],
      courses: [
        { title: '100 Days of Code: The Complete Python Pro Bootcamp', author: 'Angela Yu', url: 'https://udemy.com', difficulty: 'Beginner-to-Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Real Python Tutorials', author: 'Real Python Eng', url: 'https://realpython.com', difficulty: 'All levels', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'r/learnpython subreddit', author: 'Community', url: 'https://reddit.com/r/learnpython', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Certified Associate in Python Programming (PCAP)', provider: 'OpenEDG Python Institute', difficulty: 'Intermediate', duration: '2 months', recognition: 'High', url: 'https://pythoninstitute.org' },
      { name: 'Django Certified Developer', provider: 'Django Association', difficulty: 'Intermediate', duration: '2 months', recognition: 'Medium', url: 'https://coursera.org' }
    ],
    interviewQuestions: [
      {
        category: 'Core Python',
        questionsCount: 15,
        difficulty: 'Easy',
        questions: [
          { q: 'What is the difference between list and tuple in Python?', a: 'Lists are mutable (can be changed after creation) and are defined using brackets []. Tuples are immutable (cannot be changed after creation) and are defined using parentheses ().' },
          { q: 'Explain lists comprehensions in Python.', a: 'List comprehension is a concise syntactic structure to create lists from existing iterables. For example: [x*x for x in range(5)] creates [0, 1, 4, 9, 16].' }
        ]
      },
      {
        category: 'Web & Databases',
        questionsCount: 10,
        difficulty: 'Medium',
        questions: [
          { q: 'What is the difference between FastAPI and Django?', a: 'FastAPI is a lightweight micro-framework designed specifically for building fast, high-performance APIs with automatic Swagger docs. Django is a full-featured, "batteries-included" web framework containing its own ORM, admin panel, and template engine.' },
          { q: 'Explain the role of Python GIL (Global Interpreter Lock).', a: 'The GIL is a mutex lock that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. It means Python multi-threading is not parallel for CPU-bound tasks.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Include GitHub links to scripts, scraper tools, or web backends built',
        'Detail database models and query performance improvements',
        'State testing suite coverage metrics'
      ],
      atsTips: [
        'Include keywords like Python, FastAPI, Django, PostgreSQL, Scripting, REST API, Git, Docker, and Pytest',
        'Use standard font headers for ATS parsing scripts'
      ]
    },
    portfolioGuide: {
      sections: ['Automation Script Projects', 'API Documentation Showcases', 'Data Engineering Scrapers'],
      checklists: [
        'Include clear README setup guides so readers can run scripts in virtual environments',
        'Include screenshots or terminal recordings showing scrapers running'
      ]
    },
    companiesDetails: [
      { name: 'Google', logo: 'G', status: 'Selective', avgSalary: '$135k', openRoles: 18, careersUrl: 'https://careers.google.com' },
      { name: 'Meta', logo: 'M', status: 'Active', avgSalary: '$140k', openRoles: 12, careersUrl: 'https://careers.meta.com' },
      { name: 'Microsoft', logo: 'MS', status: 'Active', avgSalary: '$130k', openRoles: 15, careersUrl: 'https://careers.microsoft.com' }
    ],
    jobRoles: [
      'Python Developer',
      'Backend Engineer',
      'Automation Engineer',
      'Django Developer',
      'Data Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$70,000' },
        { level: '2-5 Years (Mid)', salary: '$102,000' },
        { level: '5+ Years (Senior)', salary: '$148,000' }
      ],
      country: [
        { name: 'United States', salary: '$110,000' },
        { name: 'United Kingdom', salary: '£64,000' },
        { name: 'Germany', salary: '€74,000' },
        { name: 'India', salary: '₹1,200,000' }
      ],
      trend: [
        { year: '2022', salary: 92000 },
        { year: '2023', salary: 98000 },
        { year: '2024', salary: 106000 },
        { year: '2025', salary: 112000 }
      ],
      highestPaying: [
        { company: 'Google', salary: '$150,000' },
        { company: 'Meta', salary: '$148,000' },
        { company: 'Netflix', salary: '$160,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Python Syntax', 'Variables & Loops', 'Basic Datatypes'], projects: ['Text adventure game', 'Local CSV file parser'], milestones: ['Run python scripts locally and parse data inputs'] },
      { month: 'Month 2', skills: ['OOP concepts', 'Classes & Inheritances', 'Libraries management'], projects: ['Library inventory system'], milestones: ['Manage objects state structures in code'] },
      { month: 'Month 3', skills: ['Web Scraping', 'BeautifulSoup APIs', 'Regular Expressions'], projects: ['Real estate web prices scraper'], milestones: ['Extract and clean text records from HTML pages'] },
      { month: 'Month 4', skills: ['SQL queries', 'SQLite files', 'FastAPI fundamentals'], projects: ['Inventory catalog REST API'], milestones: ['Deploy simple REST backends with database storage'] },
      { month: 'Month 5', skills: ['Django architecture', 'Django Admin', 'Django ORM'], projects: ['Blog Platform with database panel'], milestones: ['Manage complex configurations databases with Django'] },
      { month: 'Month 6', skills: ['Testing with pytest', 'Dockerizing Python backends'], projects: ['E-commerce admin backend deployed', 'Portfolio build'], milestones: ['Dockerize and host complete Python APIs with clean test suites'] }
    ],
    faqs: [
      { q: 'Is Python suitable for large enterprise backends?', a: 'Yes. Giants like Instagram, Spotify, and YouTube are built heavily on Python. Using static typing libraries (like Pydantic and mypy) helps scale codebases.' },
      { q: 'How long does it take to learn Python?', a: 'Core syntax takes 4 to 6 weeks. Building backend APIs and learning web frameworks takes an additional 4 to 6 months of practice.' }
    ]
  },
  {
    id: 5,
    name: 'Java Developer',
    icon: 'Coffee',
    progress: 40,
    averageSalary: '$90k – $135k',
    learningDuration: '8 – 14 months',
    difficulty: 'Medium',
    demand: 'High',
    description: 'Learn object-oriented systems with Java, build corporate backends using Spring Boot, and manage enterprise databases.',
    hiringCompanies: ['Oracle', 'Microsoft', 'Amazon', 'Google'],
    overview: {
      roleDescription: 'A Java Developer designs, builds, and maintains corporate backend software, high-throughput microservices, and databases using Java. Renowned for its safety, predictability, and performance, Java is the enterprise back-bone for banks, insurance, and large cloud systems.',
      whatRoleDoes: [
        'Develop scalable, robust backend services using Spring Boot and Hibernate ORM',
        'Model enterprise relational schemas in Oracle Database, PostgreSQL, or MySQL',
        'Implement microservices architectures and coordinate API routes inside containers',
        'Write high-coverage unit tests using JUnit, Mockito, and configure build tools (Maven, Gradle)'
      ],
      futureScope: 'Java remains extremely stable. Enterprise migrations to cloud-native microservices ensure consistent demand for skilled Spring Boot developers.',
      industries: ['Financial Institutions & Banking', 'Enterprise SaaS Solutions', 'Insurance Systems', 'Telecom Infrastructure'],
      pros: [
        'Highly stable and long-term career growth with strong entry options',
        'Strong object-oriented architecture patterns make code maintainable at scale',
        'Extremely active ecosystem with high-performance frameworks (Spring, Micronaut)'
      ],
      cons: [
        'Verbosity – requires writing more boilerplate code compared to languages like Python or Go',
        'Steep initial learning curve for absolute beginners',
        'Enterprise legacy codebases can be complex to maintain and migrate'
      ],
      responsibilities: [
        'Writing clean, modular, object-oriented Java code',
        'Designing secure RESTful and gRPC enterprise APIs',
        'Writing integration endpoints and unit tests (JUnit, Mockito)',
        'Managing application configurations and container allocations (Docker)'
      ],
      education: 'A computer science or related engineering degree is highly preferred in enterprise environments, though self-taught developers with strong portfolio projects and certifications are frequently hired.'
    },
    skills: [
      {
        name: 'Java SE Core',
        icon: 'Coffee',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 85,
        topics: ['Data Types & OOP Concepts', 'Collections Framework', 'Exception Handling', 'Java Streams API', 'Concurrency & Threads']
      },
      {
        name: 'Spring Boot',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '8 weeks',
        progress: 60,
        topics: ['Spring IoC & DI', 'Spring Boot MVC', 'Spring Data JPA', 'Spring Security', 'Microservices Routing']
      },
      {
        name: 'Databases & ORMs',
        icon: 'Database',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '5 weeks',
        progress: 50,
        topics: ['SQL Schema Joins', 'Hibernate & JPA Mapping', 'Query Performance', 'Transactions Management']
      },
      {
        name: 'Build tools & Testing',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 45,
        topics: ['Maven Build Cycles', 'JUnit Testing', 'Mockito Mocks', 'Gradle Configurations', 'Git Versioning']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Java OOP Foundations',
        duration: '6-8 weeks',
        skills: ['Java Core Syntax', 'OOP Principles', 'Collections Framework'],
        miniProjects: ['Bank Accounts CLI Manager', 'School Directory Tracker'],
        completionBadge: 'Java SE Specialist'
      },
      {
        phase: 'Phase 2',
        title: 'Build Tools & SQL Mappings',
        duration: '6 weeks',
        skills: ['Maven Dependencies', 'PostgreSQL Basics', 'JDBC Connections'],
        miniProjects: ['Local Inventory Database App', 'Task Manager CLI'],
        completionBadge: 'Enterprise Data Modeler'
      },
      {
        phase: 'Phase 3',
        title: 'Spring Boot & Web APIs',
        duration: '8-10 weeks',
        skills: ['Spring Boot Controllers', 'JPA Relations', 'Spring Security JWT'],
        miniProjects: ['E-Commerce Product API', 'User Auth Billing Backend'],
        completionBadge: 'Spring Boot Specialist'
      },
      {
        phase: 'Phase 4',
        title: 'Microservices & Containers',
        duration: '6 weeks',
        skills: ['Docker Images', 'Spring Cloud Config', 'Eureka Discovery Services'],
        miniProjects: ['Microservice Booking Platform', 'Log Event Bus API'],
        completionBadge: 'Advanced Java Architect'
      }
    ],
    progressStats: {
      streak: 6,
      weeklyGoal: '8 / 10 hours completed',
      xp: 1850,
      badges: ['Java SE Master', 'Spring MVC Coder']
    },
    projects: {
      beginner: [
        {
          title: 'Secure GradeBook Console App',
          difficulty: 'Beginner',
          skillsUsed: ['Java SE', 'Collections', 'Encryption'],
          estimatedTime: '12 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/gradebook',
          githubUrl: 'https://github.com/example/gradebook',
          outcomes: ['Understand Java collection flows', 'Implement basic file system operations']
        }
      ],
      intermediate: [
        {
          title: 'Enterprise Book Store Backend',
          difficulty: 'Intermediate',
          skillsUsed: ['Spring Boot', 'Spring Data JPA', 'PostgreSQL', 'Maven'],
          estimatedTime: '25 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/bookstore',
          githubUrl: 'https://github.com/example/bookstore',
          outcomes: ['Expose production-ready REST endpoints', 'Connect databases using Hibernate ORM mapper']
        }
      ],
      advanced: [
        {
          title: 'Scalable Booking Microservices',
          difficulty: 'Advanced',
          skillsUsed: ['Spring Cloud', 'PostgreSQL', 'Docker', 'Mockito', 'Kafka'],
          estimatedTime: '45 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/booking-cloud',
          githubUrl: 'https://github.com/example/booking-cloud',
          outcomes: ['Build independent microservices scaling in Docker', 'Establish event-based messages messaging', 'Mock services for clean JUnit integration tests']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Spring Boot Tutorial for Beginners', author: 'Amigoscode', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'Java Documentation', author: 'Oracle Team', url: 'https://docs.oracle.com', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Effective Java', author: 'Joshua Bloch', url: 'https://amazon.com', difficulty: 'Advanced', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Java Masterclass: Spring Boot & Cloud', author: 'Chad Darby', url: 'https://udemy.com', difficulty: 'Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Baeldung Java Guides', author: 'Eugen Paraschiv', url: 'https://baeldung.com', difficulty: 'All levels', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Oracle Java Developers Community', author: 'Oracle Corp', url: 'https://oracle.com', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Oracle Certified Professional: Java SE Developer', provider: 'Oracle', difficulty: 'Intermediate-to-Advanced', duration: '3 months', recognition: 'High', url: 'https://education.oracle.com' },
      { name: 'Spring Certified Professional', provider: 'Broadcom / VMware', difficulty: 'Advanced', duration: '2 months', recognition: 'Global', url: 'https://spring.io' }
    ],
    interviewQuestions: [
      {
        category: 'Core Java & Threads',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'What is the difference between JVM, JRE, and JDK?', a: 'JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) bundles JVM with standard class libraries to run programs. JDK (Java Development Kit) contains JRE and developer tooling like compiler javac to build programs.' },
          { q: 'What is thread-safety and how is it achieved in Java?', a: 'Thread-safety ensures code functions correctly under concurrent executions. Achieve it using synchronized blocks, Volatile variables, or Lock classes from java.util.concurrent.' }
        ]
      },
      {
        category: 'Spring Boot & DBs',
        questionsCount: 12,
        difficulty: 'Hard',
        questions: [
          { q: 'Explain Inversion of Control (IoC) and Dependency Injection (DI) in Spring.', a: 'IoC means the control of creating and managing object lifecycles is delegated to the Spring Framework. DI is the mechanism where the framework injects the dependent objects into a class (e.g. via constructor injection).' },
          { q: 'What is the difference between Lazy and Eager loading in Hibernate JPA?', a: 'Lazy loading delays fetching relational children records from the database until they are explicitly read in code. Eager loading fetches all child records in a single database query using SQL joins, which is faster but memory intensive.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Highlight microservices and API architectures built',
        'State database schema migration experience explicitly',
        'Detail testing metrics like Mockito mock setups and coverage percentages'
      ],
      atsTips: [
        'Include keywords like Java, Spring Boot, Hibernate, JPA, Microservices, Maven, Mockito, SQL, and Docker',
        'Use simple bullet layout lists for easy scanning'
      ]
    },
    portfolioGuide: {
      sections: ['Microservices Diagrams', 'Enterprise Database ERD Schemas', 'API Integration Showcases'],
      checklists: [
        'Include architecture maps demonstrating how microservices communicate',
        'Provide API endpoints specifications using Swagger/OpenAPI details'
      ]
    },
    companiesDetails: [
      { name: 'Oracle', logo: 'O', status: 'Selective', avgSalary: '$135k', openRoles: 20, careersUrl: 'https://careers.oracle.com' },
      { name: 'Amazon', logo: 'A', status: 'Active', avgSalary: '$140k', openRoles: 25, careersUrl: 'https://amazon.jobs' },
      { name: 'Google', logo: 'G', status: 'Active', avgSalary: '$138k', openRoles: 14, careersUrl: 'https://careers.google.com' }
    ],
    jobRoles: [
      'Java Engineer',
      'Enterprise Backend Developer',
      'Spring Boot Developer',
      'Microservices Architect',
      'Systems Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$75,000' },
        { level: '2-5 Years (Mid)', salary: '$110,000' },
        { level: '5+ Years (Senior)', salary: '$155,000' }
      ],
      country: [
        { name: 'United States', salary: '$118,000' },
        { name: 'United Kingdom', salary: '£68,000' },
        { name: 'Germany', salary: '€78,000' },
        { name: 'India', salary: '₹1,300,000' }
      ],
      trend: [
        { year: '2022', salary: 100000 },
        { year: '2023', salary: 106000 },
        { year: '2024', salary: 114000 },
        { year: '2025', salary: 120000 }
      ],
      highestPaying: [
        { company: 'Apple', salary: '$155,000' },
        { company: 'Goldman Sachs', salary: '$152,000' },
        { company: 'Oracle', salary: '$148,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Java Core Syntax', 'OOP Concepts', 'Data Structures'], projects: ['Command Line Bank Terminal', 'Student Registration Script'], milestones: ['Write compilation-safe Java classes'] },
      { month: 'Month 2', skills: ['Java Collections Framework', 'File I/O operations'], projects: ['Secure File Encoder CLI'], milestones: ['Manipulate advanced memory collections'] },
      { month: 'Month 3', skills: ['Relational DB Basics', 'SQL Joins', 'JDBC Connections'], projects: ['Inventory SQL Logger CLI'], milestones: ['Interact with databases in Java SE'] },
      { month: 'Month 4', skills: ['Maven Build Cycle', 'Spring Boot Core Controllers'], projects: ['Recipe Catalog API Backend'], milestones: ['Construct web server endpoints in Spring Boot'] },
      { month: 'Month 5', skills: ['Spring Data JPA', 'Hibernate ORM mappings', 'Security Auth'], projects: ['E-Commerce Catalog Auth Service'], milestones: ['Connect production relational databases with Hibernate mapping'] },
      { month: 'Month 6', skills: ['Microservices discovery Eureka', 'Dockerizing Java applications', 'Portfolio build'], projects: ['Scalable Booking Platform Deployed', 'Portfolio Site'], milestones: ['Package and deploy multi-container Java architectures'] }
    ],
    faqs: [
      { q: 'Is Java still relevant in 2026?', a: 'Absolutely. Java is the backbone of most financial, insurance, and enterprise architectures, ensuring steady hiring and competitive salary scales.' },
      { q: 'How long does it take to learn Spring Boot?', a: 'Once you master Java core and database query mappings, building Web APIs in Spring Boot takes about 6 to 8 weeks.' }
    ]
  },
  {
    id: 6,
    name: 'AI Engineer',
    icon: 'Brain',
    progress: 15,
    averageSalary: '$110k – $180k',
    learningDuration: '12 – 24 months',
    difficulty: 'Hard',
    demand: 'Explosive',
    description: 'Build predictive machine learning models, fine-tune neural networks, and integrate LLM APIs into dynamic products.',
    hiringCompanies: ['OpenAI', 'Google', 'Meta', 'Amazon'],
    overview: {
      roleDescription: 'An AI Engineer focuses on developing, deploying, and optimizing machine learning models, fine-tuning neural networks, and integrating Large Language Models (LLMs) into applications. They bridge the gap between AI research labs and practical software development to deploy smart user experiences.',
      whatRoleDoes: [
        'Design and deploy machine learning pipelines using PyTorch and TensorFlow',
        'Integrate Generative AI models and orchestrate LLMs using LangChain or LlamaIndex',
        'Build Retrieval-Augmented Generation (RAG) pipelines with Vector Databases (Pinecone, Chroma)',
        'Fine-tune deep learning models for custom tasks and configure model evaluation workflows'
      ],
      futureScope: 'Generative AI and Agentic structures are growing rapidly, creating massive opportunities for engineers who can scale model deployments and optimize GPU operations.',
      industries: ['Tech & AI Research Labs', 'Fintech Predictive Analytics', 'Automated Healthcare', 'Autonomous Operations'],
      pros: [
        'Highest average starting salaries in the technology industry',
        'Work on cutting-edge features that redefine product experiences',
        'Explosive demand with high levels of remote work flexibility'
      ],
      cons: [
        'Steep learning curve – requires strong algebra, calculus, and statistics foundations',
        'Computation cost – training and evaluating models requires expensive GPU infrastructures',
        'Fast-paced ecosystem – tools and methodologies change almost weekly'
      ],
      responsibilities: [
        'Writing optimized Python data pipelines (pandas, numpy)',
        'Fine-tuning deep neural networks on custom datasets',
        'Configuring prompt layouts and embedding evaluations',
        'Setting up MLOps pipelines (MLflow, Weights & Biases) to track model metrics'
      ],
      education: 'A background in Computer Science, Mathematics, or Data Science is highly valued. However, building impressive agentic applications and fine-tuning models on GitHub counts more than formal degrees.'
    },
    skills: [
      {
        name: 'Math & Machine Learning Core',
        icon: 'Brain',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '8 weeks',
        progress: 60,
        topics: ['Linear Algebra & Calculus', 'Probability & Statistics', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation Metrics']
      },
      {
        name: 'Deep Learning & PyTorch',
        icon: 'Layers',
        difficulty: 'Advanced',
        importance: 'Critical',
        learningTime: '8 weeks',
        progress: 30,
        topics: ['Neural Network Architectures', 'Backpropagation & Optimizers', 'PyTorch Framework', 'Computer Vision Basics', 'Transformers & NLP']
      },
      {
        name: 'Generative AI Stack',
        icon: 'Code',
        difficulty: 'Advanced',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 15,
        topics: ['LLM APIs & Prompt Engineering', 'LangChain & Agentic Frameworks', 'Vector Databases (Pinecone)', 'Retrieval-Augmented Generation (RAG)', 'Model Fine-tuning']
      },
      {
        name: 'MLOps & Deployments',
        icon: 'Cloud',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 10,
        topics: ['Model Packaging (Docker)', 'Cloud Deployments (AWS/GCP)', 'MLflow Tracking', 'APIs Integration (FastAPI)']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Math & Python Foundations',
        duration: '8 weeks',
        skills: ['Python Data Stack', 'Linear Algebra & Statistics', 'Exploratory Data Analysis'],
        miniProjects: ['Data Analysis Dashboard', 'House Price Prediction Model'],
        completionBadge: 'AI Foundations Certificate'
      },
      {
        phase: 'Phase 2',
        title: 'Classical Machine Learning',
        duration: '8 weeks',
        skills: ['Supervised Learning Algorithms', 'Scikit-Learn Framework', 'Feature Engineering'],
        miniProjects: ['Customer Churn Classifier', 'Movie Recommendation System'],
        completionBadge: 'Machine Learning Specialist'
      },
      {
        phase: 'Phase 3',
        title: 'Deep Learning & PyTorch',
        duration: '10 weeks',
        skills: ['Neural Networks', 'PyTorch Operations', 'CNNs & Sequence Models'],
        miniProjects: ['Handwritten Digit Recognizer', 'Image Classifier PyTorch'],
        completionBadge: 'Deep Learning Practitioner'
      },
      {
        phase: 'Phase 4',
        title: 'GenAI, LLMs & Vector DBs',
        duration: '8 weeks',
        skills: ['Transformers', 'RAG Deployments', 'LangChain Agents', 'Vector Mappings'],
        miniProjects: ['PDF AI Chat Assistant (RAG)', 'Fine-tuned Sentiment Agent'],
        completionBadge: 'Advanced GenAI Engineer'
      }
    ],
    progressStats: {
      streak: 2,
      weeklyGoal: '4 / 10 hours completed',
      xp: 450,
      badges: ['Data Explorer', 'Model Trainer']
    },
    projects: {
      beginner: [
        {
          title: 'Spam Email Classifier',
          difficulty: 'Beginner',
          skillsUsed: ['Python', 'Scikit-Learn', 'Pandas'],
          estimatedTime: '10 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/spam-class',
          githubUrl: 'https://github.com/example/spam-class',
          outcomes: ['Clean and tokenize text inputs', 'Train Naive Bayes model with Scikit-learn']
        }
      ],
      intermediate: [
        {
          title: 'Custom Doc QA AI (RAG)',
          difficulty: 'Intermediate',
          skillsUsed: ['Python', 'LangChain', 'Pinecone', 'FastAPI'],
          estimatedTime: '24 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/doc-qa',
          githubUrl: 'https://github.com/example/doc-qa',
          outcomes: ['Chunk and embed textual doc data', 'Store vectors embeddings in Pinecone DB', 'Expose querying API via FastAPI']
        }
      ],
      advanced: [
        {
          title: 'Autonomous Coding Agent',
          difficulty: 'Advanced',
          skillsUsed: ['Python', 'OpenAI API', 'Docker API', 'LlamaIndex'],
          estimatedTime: '50 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/coder-agent',
          githubUrl: 'https://github.com/example/coder-agent',
          outcomes: ['Design agent loop with tool integrations', 'Execute generated scripts inside isolated Docker containers sandbox', 'Implement reflection loops to fix compilation errors']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Deep Learning Specialization Tutorials', author: 'Andrew Ng', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'PyTorch Official Documentation', author: 'PyTorch Team', url: 'https://pytorch.org/docs', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', author: 'Aurélien Géron', url: 'https://amazon.com', difficulty: 'Intermediate', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Generative AI with Large Language Models', author: 'DeepLearning.AI', url: 'https://coursera.org', difficulty: 'Advanced', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Hugging Face Blog', author: 'Hugging Face Eng', url: 'https://huggingface.co/blog', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'EleutherAI Discord Server', author: 'Community', url: 'https://eleuther.ai', difficulty: 'Advanced', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Google Professional Machine Learning Engineer', provider: 'Google Cloud', difficulty: 'Advanced', duration: '3 months', recognition: 'High', url: 'https://cloud.google.com' },
      { name: 'AWS Certified Machine Learning – Specialty', provider: 'Amazon Web Services', difficulty: 'Advanced', duration: '3 months', recognition: 'Global', url: 'https://aws.amazon.com' }
    ],
    interviewQuestions: [
      {
        category: 'Machine Learning Concepts',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'Explain the difference between Overfitting and Underfitting, and how to resolve them.', a: 'Overfitting occurs when a model learns the noise in training data, performing poorly on unseen data. Resolve it via regularization, dropout, or gathering more training data. Underfitting occurs when the model is too simple to learn the data structure. Resolve it by increasing model capacity or training longer.' },
          { q: 'What is the role of Vector Embeddings in GenAI?', a: 'Vector Embeddings represent textual or media tokens as high-dimensional floats, mapping semantic relations so that similar concepts reside closer together in space. They are key for semantic search and RAG pipelines.' }
        ]
      },
      {
        category: 'Deep Learning & Agents',
        questionsCount: 10,
        difficulty: 'Hard',
        questions: [
          { q: 'Explain the Self-Attention mechanism in Transformers.', a: 'Self-Attention allows a model to weigh the importance of different tokens in a sequence relative to other tokens, dynamically focusing on relevant context regardless of distance.' },
          { q: 'How does Retrieval-Augmented Generation (RAG) differ from Fine-Tuning?', a: 'RAG fetches external, real-time context dynamically to append to the prompt context, which is cheap and prevents hallucinations. Fine-tuning adjusts the actual weights of the neural network to learn specific styles or domains, which is expensive but permanent.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Highlight deployed AI projects with links to demo videos or code',
        'State experience with specific vector databases and LLM APIs',
        'Detail model optimizations (e.g. "Reduced inference latency by 40% with quantization")'
      ],
      atsTips: [
        'Include keywords like Python, PyTorch, Generative AI, LLMs, LangChain, Pinecone, RAG, and MLOps',
        'Avoid multi-column tables in PDF CV templates'
      ]
    },
    portfolioGuide: {
      sections: ['GenAI Application Showcases', 'Machine Learning Models Repository', 'Data Engineering Pipelines'],
      checklists: [
        'Include detailed system architecture diagrams explaining your RAG or Agent loops',
        'Provide a live web client demo link for testing agent capabilities'
      ]
    },
    companiesDetails: [
      { name: 'OpenAI', logo: 'O', status: 'Highly Active', avgSalary: '$180k', openRoles: 15, careersUrl: 'https://openai.com/careers' },
      { name: 'Google', logo: 'G', status: 'Active', avgSalary: '$150k', openRoles: 25, careersUrl: 'https://careers.google.com' },
      { name: 'Meta', logo: 'M', status: 'Active', avgSalary: '$155k', openRoles: 18, careersUrl: 'https://careers.meta.com' }
    ],
    jobRoles: [
      'AI Engineer',
      'Machine Learning Engineer',
      'GenAI Solutions Builder',
      'NLP Specialist',
      'Data Scientist'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$95,000' },
        { level: '2-5 Years (Mid)', salary: '$145,000' },
        { level: '5+ Years (Senior)', salary: '$210,000' }
      ],
      country: [
        { name: 'United States', salary: '$145,000' },
        { name: 'United Kingdom', salary: '£85,000' },
        { name: 'Germany', salary: '€95,000' },
        { name: 'India', salary: '₹1,800,000' }
      ],
      trend: [
        { year: '2022', salary: 110000 },
        { year: '2023', salary: 125000 },
        { year: '2024', salary: 140000 },
        { year: '2025', salary: 155000 }
      ],
      highestPaying: [
        { company: 'OpenAI', salary: '$220,000' },
        { company: 'NVIDIA', salary: '$210,000' },
        { company: 'Anthropic', salary: '$205,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Python Syntax', 'NumPy & Pandas Operations', 'Exploratory Data Analysis'], projects: ['Sales data visualization', 'Clean raw text dataset'], milestones: ['Manipulate tabular arrays and draw clean stats plots'] },
      { month: 'Month 2', skills: ['Linear Algebra', 'Statistics & Probabilities', 'Scikit-Learn basics'], projects: ['House prices linear regression predictor'], milestones: ['Evaluate linear and logistic models baseline accuracy'] },
      { month: 'Month 3', skills: ['Supervised Classifiers', 'Unsupervised Clusters', 'Feature Eng'], projects: ['Bank churn classification trees', 'Customer segmentation clusters'], milestones: ['Optimize training features and select algorithms'] },
      { month: 'Month 4', skills: ['Neural Networks core', 'PyTorch Tensors APIs', 'Backpropagation'], projects: ['Digit image classifier neural network'], milestones: ['Train dense and convolutional neural nets from scratch'] },
      { month: 'Month 5', skills: ['Generative AI models', 'Prompt templates', 'Vector DB Pinecone integrations'], projects: ['Personal PDF AI RAG Chat Bot'], milestones: ['Deploy vector indexing search query databases'] },
      { month: 'Month 6', skills: ['LangChain Agents', 'Docker Model containers', 'FastAPI packaging', 'Portfolio build'], projects: ['Autonomous SQL query database bot', 'Portfolio site'], milestones: ['Host multi-agent web backend containers on GCP/AWS clouds'] }
    ],
    faqs: [
      { q: 'Do I need a PhD to become an AI Engineer?', a: 'No. While research roles require advanced academic degrees, AI Engineering is focused on applying and deploying AI models to products, where software engineering skills are valued most.' },
      { q: 'Which language is best for AI development?', a: 'Python is the absolute industry standard due to PyTorch, TensorFlow, and HuggingFace libraries. Learn Python thoroughly.' }
    ]
  },
  {
    id: 7,
    name: 'Cloud Engineer',
    icon: 'Cloud',
    progress: 25,
    averageSalary: '$100k – $150k',
    learningDuration: '8 – 14 months',
    difficulty: 'Medium',
    demand: 'High',
    description: 'Architect secure cloud infrastructures, build container configurations, and manage virtual network firewalls.',
    hiringCompanies: ['Amazon', 'Microsoft', 'Google', 'Cloudflare'],
    overview: {
      roleDescription: 'A Cloud Engineer designs, deploys, and manages secure, scalable infrastructure on public cloud platforms like AWS, Microsoft Azure, or GCP. They specialize in Infrastructure as Code (IaC), identity access controls, container configurations, and cost optimizations to ensure high availability.',
      whatRoleDoes: [
        'Deploy cloud infrastructure using Infrastructure as Code tools like Terraform',
        'Configure virtual private networks (VPCs), subnets, firewalls, and routing tables',
        'Manage user access controls and permissions using Cloud IAM configurations',
        'Build and package application runtime environments in Docker containers'
      ],
      futureScope: 'Enterprises continue to migrate legacy servers to cloud-native platforms, driving constant demand for cloud specialists who understand security, container orchestration, and serverless architecture.',
      industries: ['Enterprise SaaS Software', 'Financial Cloud Portals', 'Healthcare Cloud Systems', 'Streaming & E-commerce Platforms'],
      pros: [
        'Highly valued specialization with excellent salary growth potential',
        'Work on structural architecture design rather than coding UI components',
        'Clear professional certification paths (AWS, Google, Azure)'
      ],
      cons: [
        'Steep learning curve – requires understanding networking, security, and multiple cloud ecosystems',
        'Security compliance audits can be complex and strict to implement',
        'Unplanned cloud expenses can occur if resources are configured poorly'
      ],
      responsibilities: [
        'Writing clean, declarative Terraform configuration modules',
        'Configuring secure VPC networks, firewalls, and security groups',
        'Setting up automated cloud backup and recovery workflows',
        'Monitoring system resource usage and optimizing cluster allocations'
      ],
      education: 'A computer science degree is helpful, but industry cloud certifications (e.g. AWS Solutions Architect) and a strong portfolio demonstrating automated cloud deployments using Terraform are highly respected.'
    },
    skills: [
      {
        name: 'AWS Core Services',
        icon: 'Cloud',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 70,
        topics: ['EC2 & S3 Basics', 'VPC & Networking Rules', 'IAM User Permissions', 'RDS Databases', 'CloudWatch Monitoring']
      },
      {
        name: 'Infrastructure as Code',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '5 weeks',
        progress: 50,
        topics: ['Terraform Syntax', 'Terraform Modules', 'State Management', 'Variable Declarations', 'Resource Outputs']
      },
      {
        name: 'Containers & Docker',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 40,
        topics: ['Dockerfiles Writing', 'Docker Image Registries', 'Multi-stage Builds', 'Docker Compose Routing']
      },
      {
        name: 'Cloud Security & Access',
        icon: 'Shield',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 35,
        topics: ['IAM Policies Configurations', 'SSL/TLS Configurations', 'VPC Peering Connections', 'KMS Key Cryptography']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Linux Systems & Shell CLI',
        duration: '5 weeks',
        skills: ['Linux Navigation commands', 'Bash Scripting Automations', 'SSH keys settings'],
        miniProjects: ['Bulk Log Backup Script', 'Automated Server Setup CLI'],
        completionBadge: 'Linux Associate Cert'
      },
      {
        phase: 'Phase 2',
        title: 'AWS Cloud Foundations',
        duration: '6 weeks',
        skills: ['AWS Console Navigation', 'EC2 Server allocation', 'S3 bucket policies'],
        miniProjects: ['Static Web Hosting Portal', 'EC2 instance monitor tool'],
        completionBadge: 'AWS Certified Cloud Practitioner'
      },
      {
        phase: 'Phase 3',
        title: 'Infrastructure as Code (Terraform)',
        duration: '6 weeks',
        skills: ['Terraform Resource mapping', 'State variables configuration', 'VPC Network mapping'],
        miniProjects: ['Deploy Automated Multi-AZ VPC', 'Auto-scaling EC2 web pool'],
        completionBadge: 'Terraform Certified Associate'
      },
      {
        phase: 'Phase 4',
        title: 'Docker Containers & Cloud Scaling',
        duration: '5 weeks',
        skills: ['Docker build steps', 'AWS ECS/EKS Container Deployments', 'IAM Access Keys'],
        miniProjects: ['Containerized API Hosted on AWS ECS', 'Automated VPC Deployment pipeline'],
        completionBadge: 'Cloud Engineer Professional'
      }
    ],
    progressStats: {
      streak: 4,
      weeklyGoal: '6 / 8 hours completed',
      xp: 1100,
      badges: ['Infrastructure Architect', 'VPC Networker']
    },
    projects: {
      beginner: [
        {
          title: 'Automated Log Backup Script',
          difficulty: 'Beginner',
          skillsUsed: ['Linux', 'Bash Scripting', 'SSH Keys'],
          estimatedTime: '8 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/backup',
          githubUrl: 'https://github.com/example/backup',
          outcomes: ['Write shell automation scripts', 'Compress and archive log directories securely']
        }
      ],
      intermediate: [
        {
          title: 'Terraform VPC Infrastructure',
          difficulty: 'Intermediate',
          skillsUsed: ['Terraform', 'AWS Cloud', 'Networking', 'Git'],
          estimatedTime: '18 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/vpc-tf',
          githubUrl: 'https://github.com/example/vpc-tf',
          outcomes: ['Deploy custom Multi-AZ VPC network using Terraform', 'Configure public/private subnets and route tables']
        }
      ],
      advanced: [
        {
          title: 'Containerized API Cluster',
          difficulty: 'Advanced',
          skillsUsed: ['Docker', 'AWS ECS', 'Terraform', 'GitHub Actions', 'PostgreSQL'],
          estimatedTime: '40 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/cluster',
          githubUrl: 'https://github.com/example/cluster',
          outcomes: ['Package application API into multi-stage Docker image', 'Deploy container stack on AWS ECS', 'Set up GitHub Actions CI/CD to push updates']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'AWS Solutions Architect Associate Course', author: 'FreeCodeCamp', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'AWS Architecture Guidelines', author: 'Amazon Web Services', url: 'https://aws.amazon.com/architecture', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Terraform: Up & Running', author: 'Yevgeniy Brikman', url: 'https://amazon.com', difficulty: 'Intermediate', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Ultimate AWS Certified Solutions Architect', author: 'Stephane Maarek', url: 'https://udemy.com', difficulty: 'Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'HashiCorp Developer Blog', author: 'HashiCorp', url: 'https://hashicorp.com/blog', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'r/aws subreddit', author: 'Community', url: 'https://reddit.com/r/aws', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'AWS Certified Solutions Architect – Associate', provider: 'Amazon Web Services', difficulty: 'Intermediate', duration: '3 months', recognition: 'High', url: 'https://aws.amazon.com' },
      { name: 'Google Cloud Certified Associate Cloud Engineer', provider: 'Google Cloud', difficulty: 'Intermediate', duration: '2 months', recognition: 'Global', url: 'https://cloud.google.com' }
    ],
    interviewQuestions: [
      {
        category: 'Networking & AWS',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'What is a VPC subnet and what is the difference between a public and private subnet?', a: 'A Subnet is a split range of IP addresses within a Virtual Private Cloud (VPC). A public subnet has a route to an Internet Gateway, allowing external network traffic. A private subnet does not route directly to the Internet Gateway, keeping servers isolated from the public internet.' },
          { q: 'Explain the difference between security groups and network ACLs in AWS.', a: 'Security groups operate at the instance level, are stateful (automatically allow return traffic), and permit allow rules only. Network ACLs (NACLs) operate at the subnet level, are stateless (require explicit inbound and outbound rules), and support both allow and deny rules.' }
        ]
      },
      {
        category: 'IaC & Containers',
        questionsCount: 10,
        difficulty: 'Hard',
        questions: [
          { q: 'What is the purpose of the Terraform state file and how should you secure it?', a: 'The Terraform state file tracks resources metadata and real-world configurations mappings. Secure it by storing it in a remote backend (like AWS S3) with encryption at rest and state locking enabled via DynamoDB.' },
          { q: 'What is the purpose of Docker multi-stage builds?', a: 'Multi-stage builds allow developers to use temporary intermediate containers to compile dependencies, and then copy only the compiled static binaries into the final lightweight production image, drastically reducing build sizes.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'List 2-3 cloud deployments created via Terraform, linking to GitHub configs',
        'Detail networking and access controls you designed',
        'State cloud cost-saving achievements (e.g. "Reduced monthly AWS bills by 20%")'
      ],
      atsTips: [
        'Include keywords like AWS, Terraform, Docker, Cloud, VPC, IAM, Linux, Kubernetes, and VPC Peering',
        'Use simple bullet layout configurations'
      ]
    },
    portfolioGuide: {
      sections: ['Infrastructure Topology Charts', 'Terraform Code Modules', 'Docker Configuration Files'],
      checklists: [
        'Include diagrams mapping public/private cloud subnets and gateways',
        'Ensure Terraform scripts on GitHub have credentials replaced with variables'
      ]
    },
    companiesDetails: [
      { name: 'Amazon', logo: 'A', status: 'Active', avgSalary: '$140k', openRoles: 25, careersUrl: 'https://amazon.jobs' },
      { name: 'Google', logo: 'G', status: 'Active', avgSalary: '$145k', openRoles: 10, careersUrl: 'https://careers.google.com' },
      { name: 'Cloudflare', logo: 'C', status: 'Highly Active', avgSalary: '$130k', openRoles: 6, careersUrl: 'https://cloudflare.com/careers' }
    ],
    jobRoles: [
      'Cloud Engineer',
      'Infrastructure Architect',
      'AWS Administrator',
      'Cloud Solutions Architect',
      'Systems Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$78,000' },
        { level: '2-5 Years (Mid)', salary: '$108,000' },
        { level: '5+ Years (Senior)', salary: '$158,000' }
      ],
      country: [
        { name: 'United States', salary: '$120,000' },
        { name: 'United Kingdom', salary: '£72,000' },
        { name: 'Germany', salary: '€82,000' },
        { name: 'India', salary: '₹1,400,000' }
      ],
      trend: [
        { year: '2022', salary: 100000 },
        { year: '2023', salary: 108000 },
        { year: '2024', salary: 116000 },
        { year: '2025', salary: 122000 }
      ],
      highestPaying: [
        { company: 'Google', salary: '$152,000' },
        { company: 'Amazon', salary: '$148,000' },
        { company: 'Netflix', salary: '$165,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Linux commands', 'Bash Scripting automations', 'SSH connections'], projects: ['Bulk Log Compresser', 'Cron automated backup script'], milestones: ['Script custom automations on Linux servers'] },
      { month: 'Month 2', skills: ['Cloud Concepts EC2', 'S3 Buckets policies', 'Security groups basics'], projects: ['Static Site hosting on AWS'], milestones: ['Configure basic servers and security parameters on cloud console'] },
      { month: 'Month 3', skills: ['Terraform syntax', 'Terraform Resource creation', 'State Management'], projects: ['VPC deployment Terraform script'], milestones: ['Deploy network infrastructures programmatically via IaC'] },
      { month: 'Month 4', skills: ['Docker containers configurations', 'Docker compose orchestration'], projects: ['Multi-container Docker application setup'], milestones: ['Virtualize application runtime stacks using Dockerfiles'] },
      { month: 'Month 5', skills: ['Cloud IAM policies', 'SSL/TLS routing settings', 'ELB Load Balancers'], projects: ['Auto-scaling EC2 web application cluster'], milestones: ['Configure load balancers and secure access gateways'] },
      { month: 'Month 6', skills: ['CI/CD pipeline automation', 'ECS cloud deployment', 'Portfolio build'], projects: ['Containerized application deployed', 'Portfolio Site'], milestones: ['Automate cloud container deployments using GitHub Actions'] }
    ],
    faqs: [
      { q: 'What cloud provider should I learn first?', a: 'AWS is highly recommended as it holds the largest market share. Learning AWS makes transitioning to Azure or Google Cloud much easier.' },
      { q: 'How long does it take to become a Cloud Engineer?', a: 'For individuals with basic IT and networking foundations, it typically takes 8 to 14 months of dedicated practice.' }
    ]
  },
  {
    id: 8,
    name: 'Cyber Security',
    icon: 'Shield',
    progress: 35,
    averageSalary: '$95k – $145k',
    learningDuration: '10 – 18 months',
    difficulty: 'Hard',
    demand: 'Very High',
    description: 'Learn ethical hacking, secure system architectures, run penetration tests, and analyze network threats.',
    hiringCompanies: ['CrowdStrike', 'Microsoft', 'Google', 'IBM'],
    overview: {
      roleDescription: 'A Cybersecurity Specialist protects systems, networks, and data from digital attacks. They design secure architectures, perform penetration tests to locate vulnerabilities, monitor security centers (SOCs) for active threats, and ensure organization policy compliance.',
      whatRoleDoes: [
        'Perform penetration tests and vulnerabilities assessments using tools like Nmap, Metasploit, and Burp Suite',
        'Monitor security events (SIEM logs) and coordinate incident response protocols',
        'Audit networking structures (TCP/IP packets) to detect unauthorized activities',
        'Configure cryptographic protocols to protect data in transit and at rest'
      ],
      futureScope: 'With the growth of cloud systems, remote work access gateways, and AI-powered cyber-threats, cybersecurity remains a top-priority, highly stable engineering career.',
      industries: ['Financial Platforms & Banks', 'Consulting & Threat Intel Firms', 'Defense & Public Agencies', 'Enterprise Cloud SaaS'],
      pros: [
        'High salary scales with exceptional job security',
        'Engaging work – solving complex, real-world security challenges',
        'Strong industry-standard certification pathways (Security+, CEH, OSCP)'
      ],
      cons: [
        'High stress – protecting critical production infrastructure from live attacks',
        'Requires continuous updates on the threat landscape and newly disclosed exploits (CVEs)',
        'Complex network logs auditing can be tedious'
      ],
      responsibilities: [
        'Conducting vulnerability assessments on web backends and networks',
        'Configuring SIEM alert thresholds to identify threat patterns',
        'Responding to security breaches and compiling post-incident reports',
        'Auditing IAM policies and ensuring security best practices compliance'
      ],
      education: 'A background in Computer Science or Networking is beneficial. However, practical project experience on platforms like HackTheBox/TryHackMe and certifications (CompTIA Security+) carry significant weight in the hiring process.'
    },
    skills: [
      {
        name: 'Networking & Linux core',
        icon: 'Shield',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 80,
        topics: ['TCP/IP Network Protocols', 'DNS & Routing rules', 'Linux Command line administration', 'Bash scripting basics', 'Wireshark Packet Analysis']
      },
      {
        name: 'Penetration Testing & Hacking',
        icon: 'Code',
        difficulty: 'Advanced',
        importance: 'High',
        learningTime: '8 weeks',
        progress: 40,
        topics: ['Nmap Port Scanning', 'Metasploit exploit scripts', 'Burp Suite web audits', 'SQL Injection execution', 'OWASP Top 10 vulnerabilities']
      },
      {
        name: 'SOC & Log Analysis',
        icon: 'Layers',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '5 weeks',
        progress: 30,
        topics: ['SIEM concepts Splunk', 'Log analysis filters', 'Incident Response guides', 'Firewall Configurations']
      },
      {
        name: 'Cryptography & IAM',
        icon: 'Shield',
        difficulty: 'Intermediate',
        importance: 'Medium',
        learningTime: '4 weeks',
        progress: 50,
        topics: ['Symmetric/Asymmetric Encryption', 'Hashing algorithms MD5/SHA', 'SSL/TLS Certificate routing', 'Access Control Policies']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Networking & Systems Basics',
        duration: '6 weeks',
        skills: ['Subnet configurations', 'TCP/IP handshake', 'Linux command flags'],
        miniProjects: ['Network Port Scanner CLI', 'Automated User Accounts manager script'],
        completionBadge: 'Security Foundations Cert'
      },
      {
        phase: 'Phase 2',
        title: 'Security Core & Audits',
        duration: '6 weeks',
        skills: ['Firewall setup', 'Wireshark packet filters', 'CIA Triad rules'],
        miniProjects: ['Intrusion alert logger', 'Wireshark log analyzer report'],
        completionBadge: 'CompTIA Security+'
      },
      {
        phase: 'Phase 3',
        title: 'Ethical Hacking (Offensive Security)',
        duration: '10 weeks',
        skills: ['OWASP Web Exploits', 'SQLi concepts', 'Metasploit payloads'],
        miniProjects: ['Web vulnerability scanner', 'Vulnerable VM Root compromise'],
        completionBadge: 'Ethical Hacker Associate'
      },
      {
        phase: 'Phase 4',
        title: 'Cloud Security & Incident Response',
        duration: '6 weeks',
        skills: ['IAM policies audits', 'SIEM Splunk logging filters', 'Incident Response documentation'],
        miniProjects: ['Docker Container Security Audit', 'SOC Incident Report Compile'],
        completionBadge: 'Advanced Security Professional'
      }
    ],
    progressStats: {
      streak: 5,
      weeklyGoal: '8 / 10 hours completed',
      xp: 1550,
      badges: ['Wireshark Auditor', 'System Defender']
    },
    projects: {
      beginner: [
        {
          title: 'Network Port Scanner',
          difficulty: 'Beginner',
          skillsUsed: ['Python', 'Sockets', 'Networking'],
          estimatedTime: '8 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/scanner',
          githubUrl: 'https://github.com/example/scanner',
          outcomes: ['Verify active ports on a target IP', 'Report active TCP connection banners']
        }
      ],
      intermediate: [
        {
          title: 'Intrusion Detection Log Filter',
          difficulty: 'Intermediate',
          skillsUsed: ['Linux', 'Bash Scripting', 'RegEx', 'SIEM Splunk'],
          estimatedTime: '18 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/ids-log',
          githubUrl: 'https://github.com/example/ids-log',
          outcomes: ['Parse Apache logs for SQLi attacks', 'Trigger automated email alerts on breach parameters']
        }
      ],
      advanced: [
        {
          title: 'Multi-stage Docker Audit Tool',
          difficulty: 'Advanced',
          skillsUsed: ['Docker Security', 'Python', 'CVE Databases APIs', 'Linux'],
          estimatedTime: '35 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/docker-audit',
          githubUrl: 'https://github.com/example/docker-audit',
          outcomes: ['Scan Docker files for security issues', 'Cross-reference package lists with active CVE exploits databases', 'Compile detailed markdown vulnerability logs']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Cyber Security Full Course for Beginners', author: 'FreeCodeCamp', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'OWASP Top 10 Web Security Risks', author: 'OWASP Foundation', url: 'https://owasp.org', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'The Web Application Hacker\'s Handbook', author: 'Dafydd Stuttard', url: 'https://amazon.com', difficulty: 'Advanced', thumbnail: 'book' }
      ],
      courses: [
        { title: 'CompTIA Security+ Exam Preparation', author: 'Jason Dion', url: 'https://udemy.com', difficulty: 'Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Krebs on Security', author: 'Brian Krebs', url: 'https://krebsonsecurity.com', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Hack The Box Forums', author: 'HTB Team', url: 'https://hackthebox.com', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'CompTIA Security+', provider: 'CompTIA', difficulty: 'Beginner-to-Intermediate', duration: '2 months', recognition: 'High', url: 'https://comptia.org' },
      { name: 'Certified Ethical Hacker (CEH)', provider: 'EC-Council', difficulty: 'Intermediate', duration: '3 months', recognition: 'Global', url: 'https://eccouncil.org' }
    ],
    interviewQuestions: [
      {
        category: 'Networking & Systems',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'Explain the three-way handshake process in TCP.', a: 'The handshake establishes a connection: 1. Client sends SYN (Synchronize) packet. 2. Server responds with SYN-ACK (Synchronize-Acknowledge) packet. 3. Client replies with ACK (Acknowledge) packet.' },
          { q: 'What is the difference between Symmetric and Asymmetric encryption?', a: 'Symmetric encryption uses the same single key to encrypt and decrypt data, making it fast but difficult to share keys securely. Asymmetric encryption uses a public key to encrypt and a separate private key to decrypt, which is more secure but slower.' }
        ]
      },
      {
        category: 'Web Audits & Exploits',
        questionsCount: 10,
        difficulty: 'Hard',
        questions: [
          { q: 'What is SQL Injection (SQLi) and how do you protect web backends from it?', a: 'SQLi is a vulnerability where malicious SQL commands are executed via form input fields. Protect backends by using Parameterized Queries (Prepared Statements) or ORMs, which treat input strictly as string literals, not executable SQL commands.' },
          { q: 'What is the OWASP Top 10?', a: 'The OWASP Top 10 is a regularly updated list detailing the most critical security risks facing web applications globally, such as broken access control, cryptographic failures, and injection attacks.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Detail HackTheBox or TryHackMe milestones and ranks',
        'State scripting automation tools you wrote, linking to GitHub configs',
        'Include experience with specific SIEM frameworks or firewall setups'
      ],
      atsTips: [
        'Include keywords like Cybersecurity, Security+, CEH, Wireshark, Penetration Testing, OWASP, Linux, Splunk, and Cryptography',
        'Avoid complex formatting tables in CV templates'
      ]
    },
    portfolioGuide: {
      sections: ['Write-ups of compromised vulnerable machines', 'Security Scripting repositories', 'Network topology designs'],
      checklists: [
        'Do not share sensitive company info in machine write-ups',
        'Provide clear explanations of the code structures'
      ]
    },
    companiesDetails: [
      { name: 'CrowdStrike', logo: 'CS', status: 'Highly Active', avgSalary: '$140k', openRoles: 10, careersUrl: 'https://crowdstrike.jobs' },
      { name: 'IBM', logo: 'I', status: 'Active', avgSalary: '$120k', openRoles: 8, careersUrl: 'https://careers.ibm.com' },
      { name: 'Microsoft', logo: 'MS', status: 'Active', avgSalary: '$135k', openRoles: 12, careersUrl: 'https://careers.microsoft.com' }
    ],
    jobRoles: [
      'Security Analyst',
      'L1 SOC Analyst',
      'Penetration Tester',
      'Ethical Hacker',
      'Information Security Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$72,000' },
        { level: '2-5 Years (Mid)', salary: '$105,000' },
        { level: '5+ Years (Senior)', salary: '$150,000' }
      ],
      country: [
        { name: 'United States', salary: '$115,000' },
        { name: 'United Kingdom', salary: '£68,000' },
        { name: 'Germany', salary: '€78,000' },
        { name: 'India', salary: '₹1,200,000' }
      ],
      trend: [
        { year: '2022', salary: 95000 },
        { year: '2023', salary: 102000 },
        { year: '2024', salary: 110000 },
        { year: '2025', salary: 118000 }
      ],
      highestPaying: [
        { company: 'CrowdStrike', salary: '$140,000' },
        { company: 'Google', salary: '$138,000' },
        { company: 'Microsoft', salary: '$135,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Linux System folders', 'Bash scripting syntax', 'Network IP Subnets'], projects: ['Automated server setup script', 'Port checking utility'], milestones: ['Able to write shell automations on Linux servers'] },
      { month: 'Month 2', skills: ['TCP/IP Handshake rules', 'Wireshark packet filters', 'DNS settings'], projects: ['Wireshark packet logs analysis report'], milestones: ['Identify threat patterns from TCP dump packets'] },
      { month: 'Month 3', skills: ['Security policies standard', 'Firewalls rules configs', 'Access lists'], projects: ['Secure VM hosting network setup'], milestones: ['Create custom firewall policies and block ports'] },
      { month: 'Month 4', skills: ['OWASP Top 10 rules', 'Nmap port scan options', 'Burp Suite intercept'], projects: ['Web application vulnerability audit'], milestones: ['Identify XSS and SQL injection vulnerabilities in web clients'] },
      { month: 'Month 5', skills: ['Metasploit execution', 'Exploiting local virtual machines', 'Privilege Escalation'], projects: ['Root compromise of a target Linux VM'], milestones: ['Gain access privileges on unpatched systems securely'] },
      { month: 'Month 6', skills: ['SIEM Splunk filtering', 'Incident response frameworks', 'Portfolio build'], projects: ['Incident Response SOC logs audit', 'Portfolio Site'], milestones: ['Draft complete vulnerability logs reports and compile portfolios'] }
    ],
    faqs: [
      { q: 'Do I need programming skills for Cybersecurity?', a: 'Basic scripting (Python or Bash) is highly recommended to automate audits and parse logs efficiently, though deep software engineering is not required for analyst roles.' },
      { q: 'How long does it take to prepare for Security+?', a: 'With focused daily study, it typically takes 6 to 10 weeks of study to pass the exam.' }
    ]
  },
  {
    id: 9,
    name: 'Data Analyst',
    icon: 'BarChart2',
    progress: 50,
    averageSalary: '$70k – $110k',
    learningDuration: '4 – 8 months',
    difficulty: 'Easy',
    demand: 'High',
    description: 'Transform database logs, run SQL queries, compile python statistics, and build visual dashboards in Tableau or PowerBI.',
    hiringCompanies: ['McKinsey', 'Google', 'Amazon', 'Meta'],
    overview: {
      roleDescription: 'A Data Analyst transforms raw transaction logs and database records into clean tables and dashboards. They use SQL to query data, Python to execute statistical tests, and tools like Tableau or PowerBI to build interactive business dashboards.',
      whatRoleDoes: [
        'Write complex SQL queries to extract and aggregate transaction records',
        'Clean raw data files and perform exploratory analyses in Python (Pandas)',
        'Design interactive business dashboards in Tableau or PowerBI',
        'Conduct A/B testing statistical checks and write data reports for managers'
      ],
      futureScope: 'Data-driven decision making is critical for modern SaaS and e-commerce companies, ensuring consistent demand for analysts who can bridge business questions and raw data databases.',
      industries: ['E-commerce Services', 'Business Consulting', 'Fintech Analytics Labs', 'Marketing Agencies'],
      pros: [
        'Relatively lower coding barrier compared to backend or compiler engineering',
        'High visibility – your dashboards directly guide management decisions',
        'Active and helpful community with clear Google certification paths'
      ],
      cons: [
        'Data cleaning – sorting through messy, unformatted spreadsheet files takes up most of your time',
        'Can feel repetitive if you are repeatedly generating similar reports for different teams',
        'Requires strong communication skills to explain numbers to non-technical stakeholders'
      ],
      responsibilities: [
        'Writing optimized SQL queries joining multiple transaction tables',
        'Cleaning database nulls and formatting columns in Pandas',
        'Designing interactive charts and KPI dashboards in Tableau',
        'Compiling weekly performance reports and presenting trends to managers'
      ],
      education: 'Self-taught developers and career switchers are highly common. Having interactive dashboards published in Tableau Public and clean data scripts on GitHub is highly effective in securing entry-level roles.'
    },
    skills: [
      {
        name: 'SQL (Structured Queries)',
        icon: 'Database',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '4 weeks',
        progress: 90,
        topics: ['SELECT & WHERE filters', 'JOIN operations (Inner, Outer)', 'GROUP BY aggregations', 'Subqueries & CTEs', 'Window Functions']
      },
      {
        name: 'Python Data Stack',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 60,
        topics: ['Pandas DataFrames', 'NumPy Arrays', 'Matplotlib & Seaborn plots', 'Cleaning missing values', 'Data merging & reshaping']
      },
      {
        name: 'Data Visualization (Tableau/PowerBI)',
        icon: 'BarChart2',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '4 weeks',
        progress: 70,
        topics: ['Connecting data sources', 'Interactive filters creation', 'KPI card layouts', 'Publishing dashboards']
      },
      {
        name: 'Statistics & A/B testing',
        icon: 'Brain',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '4 weeks',
        progress: 40,
        topics: ['Mean, Median, Standard Deviation', 'Hypothesis p-value checks', 'A/B Testing layouts', 'Correlation analysis']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'SQL & Database Queries',
        duration: '4-6 weeks',
        skills: ['SQL Joins', 'Aggregations', 'Subqueries'],
        miniProjects: ['Sales Database Analysis Report', 'HR Records Aggregate Tool'],
        completionBadge: 'SQL Data Specialist'
      },
      {
        phase: 'Phase 2',
        title: 'Python for Data Cleaning',
        duration: '6 weeks',
        skills: ['Pandas DataFrames', 'Matplotlib plotting', 'Null cleaning'],
        miniProjects: ['Clean and Analyze Survey CSV File', 'Weather Data Exploratory Script'],
        completionBadge: 'Python Data Analyst'
      },
      {
        phase: 'Phase 3',
        title: 'Dashboards & Visualizations',
        duration: '4-5 weeks',
        skills: ['Tableau KPI setup', 'Calculated fields', 'Dashboard layouts'],
        miniProjects: ['Interactive COVID-19 Tracker Dashboard', 'E-commerce Revenue Portal'],
        completionBadge: 'Tableau Certified Associate'
      },
      {
        phase: 'Phase 4',
        title: 'Business Stats & A/B Tests',
        duration: '4 weeks',
        skills: ['Hypothesis check p-value', 'A/B Test evaluations', 'Presentation slides'],
        miniProjects: ['Marketing Campaign A/B Test Review', 'Data Analyst Portfolio'],
        completionBadge: 'Professional Data Analyst'
      }
    ],
    progressStats: {
      streak: 4,
      weeklyGoal: '4 / 8 hours completed',
      xp: 1050,
      badges: ['SQL Query Expert', 'Dashboard Publisher']
    },
    projects: {
      beginner: [
        {
          title: 'IMDb Movie SQL Analysis',
          difficulty: 'Beginner',
          skillsUsed: ['SQL', 'PostgreSQL', 'Data Aggregation'],
          estimatedTime: '6 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/imdb-sql',
          githubUrl: 'https://github.com/example/imdb-sql',
          outcomes: ['Query highest grossing movies matching criteria', 'Join directors tables with revenue figures']
        }
      ],
      intermediate: [
        {
          title: 'E-commerce Customer Retention Dashboard',
          difficulty: 'Intermediate',
          skillsUsed: ['Python', 'Pandas', 'Tableau', 'Excel'],
          estimatedTime: '15 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/retention-tb',
          githubUrl: 'https://github.com/example/retention-tb',
          outcomes: ['Clean custom transaction logs in Pandas', 'Publish interactive customer cohort charts in Tableau Public']
        }
      ],
      advanced: [
        {
          title: 'Marketing Campaign A/B Test Auditor',
          difficulty: 'Advanced',
          skillsUsed: ['Python', 'SciPy Statistics', 'Jupyter Notebooks', 'Seaborn'],
          estimatedTime: '24 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/ab-test',
          githubUrl: 'https://github.com/example/ab-test',
          outcomes: ['Validate sample sizes for test parameters', 'Run Chi-Squared and t-tests in SciPy', 'Compile detailed Jupyter notebook findings report']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'Data Analyst Bootcamp Full Course', author: 'Alex The Analyst', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'Pandas Reference Manual', author: 'Pandas Team', url: 'https://pandas.pydata.org', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'Python for Data Analysis', author: 'Wes McKinney', url: 'https://amazon.com', difficulty: 'Intermediate', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Google Data Analytics Professional Certificate', author: 'Google Career Certs', url: 'https://coursera.org', difficulty: 'Beginner', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'Towards Data Science Publication', author: 'Medium authors', url: 'https://towardsdatascience.com', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'Kaggle Forums & Competitions', author: 'Kaggle Team', url: 'https://kaggle.com', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Google Data Analytics Professional Certificate', provider: 'Google', difficulty: 'Beginner', duration: '6 months', recognition: 'High', url: 'https://coursera.org' },
      { name: 'Microsoft Certified: Power BI Data Analyst Associate', provider: 'Microsoft', difficulty: 'Intermediate', duration: '2 months', recognition: 'Global', url: 'https://learn.microsoft.com' }
    ],
    interviewQuestions: [
      {
        category: 'SQL Databases',
        questionsCount: 15,
        difficulty: 'Easy',
        questions: [
          { q: 'What is the difference between WHERE and HAVING clauses in SQL?', a: 'WHERE filters records before any aggregation (GROUP BY) takes place. HAVING filters aggregated records after the GROUP BY operation has run.' },
          { q: 'Explain the difference between UNION and UNION ALL.', a: 'UNION merges distinct rows from two query outputs (removes duplicates). UNION ALL merges all rows from both outputs, retaining duplicates, making it faster.' }
        ]
      },
      {
        category: 'Python & Statistics',
        questionsCount: 10,
        difficulty: 'Medium',
        questions: [
          { q: 'What is a p-value and how is it used in hypothesis testing?', a: 'A p-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true. A p-value below a threshold (typically 0.05) indicates that the result is statistically significant and the null hypothesis can be rejected.' },
          { q: 'How do you handle missing values in a Pandas DataFrame?', a: 'You can handle missing values using: 1. `dropna()` to drop rows/columns. 2. `fillna()` to replace missing values with a default value, mean, median, or mode. 3. `interpolate()` to interpolate values.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'Link to Tableau Public dashboards in contact details',
        'State database size metrics you worked with (e.g. "Queried database of 1M+ rows")',
        'State findings outcomes (e.g. "Identified checkout bottleneck, boosting sales by 12%")'
      ],
      atsTips: [
        'Include keywords like SQL, Python, Pandas, Tableau, PowerBI, Excel, A/B Testing, Statistics, and Data Analysis',
        'Keep formatting simple and single-column'
      ]
    },
    portfolioGuide: {
      sections: ['Tableau Dashboard Showcase Link', 'SQL Query Optimization examples', 'Jupyter Statistical Notebooks'],
      checklists: [
        'Ensure Tableau dashboard links load on mobile screens',
        'Add brief explanations highlighting business findings'
      ]
    },
    companiesDetails: [
      { name: 'McKinsey', logo: 'MK', status: 'Selective', avgSalary: '$95k', openRoles: 5, careersUrl: 'https://careers.mckinsey.com' },
      { name: 'Google', logo: 'G', status: 'Active', avgSalary: '$110k', openRoles: 10, careersUrl: 'https://careers.google.com' },
      { name: 'Amazon', logo: 'A', status: 'Active', avgSalary: '$105k', openRoles: 14, careersUrl: 'https://amazon.jobs' }
    ],
    jobRoles: [
      'Data Analyst',
      'Business Intelligence Analyst',
      'SQL Developer',
      'Reporting Specialist',
      'Analytics Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$55,000' },
        { level: '2-5 Years (Mid)', salary: '$85,000' },
        { level: '5+ Years (Senior)', salary: '$120,000' }
      ],
      country: [
        { name: 'United States', salary: '$85,000' },
        { name: 'United Kingdom', salary: '£48,000' },
        { name: 'Germany', salary: '€58,000' },
        { name: 'India', salary: '₹800,000' }
      ],
      trend: [
        { year: '2022', salary: 74000 },
        { year: '2023', salary: 78000 },
        { year: '2024', salary: 82000 },
        { year: '2025', salary: 86000 }
      ],
      highestPaying: [
        { company: 'Meta', salary: '$115,000' },
        { company: 'Google', salary: '$112,000' },
        { company: 'Netflix', salary: '$118,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Excel data cleaning', 'SQL basics SELECT', 'WHERE filters'], projects: ['Recipe Catalog SQL queries', 'Student records sheet cleaning'], milestones: ['Filter and retrieve records from database tables'] },
      { month: 'Month 2', skills: ['SQL Joins operations', 'GROUP BY aggregates', 'Subqueries'], projects: ['Sales records database dashboard query'], milestones: ['Construct aggregated queries across tables'] },
      { month: 'Month 3', skills: ['Tableau KPI setup', 'Charts layouts', 'Dashboard publishing'], projects: ['Covid-19 Interactive Map Portal'], milestones: ['Publish clean interactive charts on Tableau Public'] },
      { month: 'Month 4', skills: ['Python Syntax basics', 'Pandas DataFrames operations'], projects: ['Jupyter Notebook CSV cleaner script'], milestones: ['Clean null rows and format columns using Pandas scripts'] },
      { month: 'Month 5', skills: ['Matplotlib visual plots', 'Descriptive Statistics metrics'], projects: ['Exploratory data analysis report with graphs'], milestones: ['Create custom charts showing correlations'] },
      { month: 'Month 6', skills: ['A/B Testing parameters', 'Jupyter report compile', 'Portfolio build'], projects: ['Website conversion A/B test analysis', 'Portfolio Site'], milestones: ['Run t-test validations and build complete analyst portfolios'] }
    ],
    faqs: [
      { q: 'Is Python mandatory for data analysis?', a: 'Excel and SQL are enough for entry-level reporting roles, but learning Python is essential to automate cleaning steps and run statistical tests at scale.' },
      { q: 'Do I need math certifications?', a: 'No, having a strong understanding of mean, standard deviation, and basic hypothesis testing is sufficient for most analyst roles.' }
    ]
  },
  {
    id: 10,
    name: 'DevOps Engineer',
    icon: 'GitBranch',
    progress: 45,
    averageSalary: '$100k – $155k',
    learningDuration: '8 – 14 months',
    difficulty: 'Medium',
    demand: 'High',
    description: 'Bridge development and system operations. Automate CI/CD pipelines, package containers in Docker, and deploy Kubernetes clusters.',
    hiringCompanies: ['HashiCorp', 'AWS', 'Google', 'Microsoft'],
    overview: {
      roleDescription: 'A DevOps Engineer bridges the gap between software development and system operations. They build automated delivery pipelines (CI/CD), package applications in lightweight virtual containers, manage server infrastructure, and configure monitoring tools to ensure rapid, reliable software releases.',
      whatRoleDoes: [
        'Automate build, test, and release flows using CI/CD pipelines (GitHub Actions, Jenkins)',
        'Virtualize applications runtime environments using Docker and scale them on Kubernetes clusters',
        'Manage and provision infrastructure programmatically using Terraform',
        'Configure systems performance monitors and alert systems (Prometheus, Grafana)'
      ],
      futureScope: 'The growth of cloud architectures and platform engineering has made DevOps engineers critical for shipping software fast and maintaining system reliability.',
      industries: ['Enterprise Software SaaS', 'Financial High Availability Portals', 'Tech Giants & Cloud providers', 'E-commerce Services'],
      pros: [
        'Highly valued role with competitive salary packages and stable career progression',
        'Automating infrastructure is rewarding and reduces manual server setup operations',
        'High demand across startups and big tech alike'
      ],
      cons: [
        'Steep learning curve – requires understanding development, networking, cloud, and monitoring tools',
        'On-call rotations – resolving system outages can occur at irregular hours',
        'Requires continuous adjustment to changing tooling standards'
      ],
      responsibilities: [
        'Designing CI/CD pipeline configuration files',
        'Configuring Kubernetes deployment files and monitoring cluster scaling logs',
        'Deploying Terraform IaC configuration files safely',
        'Setting up Prometheus alert endpoints to detect CPU threshold breaches'
      ],
      education: 'A computer science degree is highly helpful, though self-taught developers with strong portfolios showing automated container pipelines on GCP/AWS and key certifications (CKA) are regularly hired.'
    },
    skills: [
      {
        name: 'Linux & Scripting',
        icon: 'GitBranch',
        difficulty: 'Beginner',
        importance: 'Critical',
        learningTime: '6 weeks',
        progress: 80,
        topics: ['Linux System Administration', 'SSH Keys Setup', 'Bash/Shell Scripting', 'Python Automations', 'Network Port Routing']
      },
      {
        name: 'Docker & Kubernetes',
        icon: 'Layers',
        difficulty: 'Advanced',
        importance: 'Critical',
        learningTime: '8 weeks',
        progress: 50,
        topics: ['Dockerfiles & Image Building', 'Multi-stage Container Builds', 'Kubernetes Pods & Services', 'Kubectl Commands', 'K8s Cluster Deployments']
      },
      {
        name: 'CI/CD & Git',
        icon: 'Code',
        difficulty: 'Intermediate',
        importance: 'Critical',
        learningTime: '5 weeks',
        progress: 70,
        topics: ['Git Merging & Branching', 'GitHub Actions Workflows', 'Jenkins Pipelines', 'Secrets Management', 'Docker Hub Registry Integration']
      },
      {
        name: 'Terraform & AWS',
        icon: 'Cloud',
        difficulty: 'Intermediate',
        importance: 'High',
        learningTime: '6 weeks',
        progress: 45,
        topics: ['Terraform Declarations', 'State Backend (S3)', 'VPC Private Networks', 'IAM Policies Mappings']
      }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Linux Core & Automations',
        duration: '5 weeks',
        skills: ['Bash Scripts', 'SSH Connections', 'Cron Automations'],
        miniProjects: ['Log File Compresser & Archiver', 'Automated Server Setup CLI'],
        completionBadge: 'Linux System Administrator'
      },
      {
        phase: 'Phase 2',
        title: 'Git Versioning & CI/CD Pipelines',
        duration: '6 weeks',
        skills: ['GitHub Actions Syntax', 'Pipeline Secrets', 'Maven/Node Builds'],
        miniProjects: ['Automated Node Test & Deploy Pipeline', 'Secrets Vault setup'],
        completionBadge: 'CI/CD Specialist'
      },
      {
        phase: 'Phase 3',
        title: 'Docker & Kubernetes Containers',
        duration: '8 weeks',
        skills: ['Docker Images Multi-stage', 'Kubernetes Pods configs', 'Kubectl deployments'],
        miniProjects: ['Containerized API Hosted on Docker Compose', 'Scalable K8s Web Deployment'],
        completionBadge: 'Certified Kubernetes Builder'
      },
      {
        phase: 'Phase 4',
        title: 'IaC & Cloud Infrastructure',
        duration: '6 weeks',
        skills: ['Terraform resource maps', 'AWS VPC configurations', 'Terraform Remote State'],
        miniProjects: ['Deploy custom AWS VPC via Terraform', 'DevOps Infrastructure Portfolio'],
        completionBadge: 'Professional DevOps Engineer'
      }
    ],
    progressStats: {
      streak: 10,
      weeklyGoal: '10 / 12 hours completed',
      xp: 2200,
      badges: ['Pipeline Orchestrator', 'Docker Specialist']
    },
    projects: {
      beginner: [
        {
          title: 'VPC Provisioning Script',
          difficulty: 'Beginner',
          skillsUsed: ['Bash Scripting', 'AWS CLI', 'Linux'],
          estimatedTime: '8 hours',
          preview: 'indigo',
          demoUrl: 'https://example.com/vpc-script',
          githubUrl: 'https://github.com/example/vpc-script',
          outcomes: ['Configure public AWS subnets using command flags', 'Establish gateway routing policies']
        }
      ],
      intermediate: [
        {
          title: 'GitHub Actions Node.js CI/CD Pipeline',
          difficulty: 'Intermediate',
          skillsUsed: ['GitHub Actions', 'Docker', 'Docker Hub', 'Jest'],
          estimatedTime: '15 hours',
          preview: 'blue',
          demoUrl: 'https://example.com/cicd-node',
          githubUrl: 'https://github.com/example/cicd-node',
          outcomes: ['Configure automated build and test pipeline on commit', 'Generate Docker image and push to Docker Hub registry']
        }
      ],
      advanced: [
        {
          title: 'Scalable Kubernetes E-Commerce Cluster',
          difficulty: 'Advanced',
          skillsUsed: ['Kubernetes', 'Terraform', 'AWS EKS', 'Helm', 'Prometheus'],
          estimatedTime: '45 hours',
          preview: 'purple',
          demoUrl: 'https://example.com/k8s-cluster',
          githubUrl: 'https://github.com/example/k8s-cluster',
          outcomes: ['Provision AWS EKS cluster using Terraform', 'Deploy multi-pod application database using Helm charts', 'Monitor cluster usage via Prometheus metrics']
        }
      ]
    },
    resources: {
      youtube: [
        { title: 'DevOps Beginner Course Full Roadmap', author: 'KodeKloud', url: 'https://youtube.com', difficulty: 'Beginner', thumbnail: 'youtube' }
      ],
      documentation: [
        { title: 'Kubernetes Documentation', author: 'K8s Team', url: 'https://kubernetes.io/docs', difficulty: 'Critical', thumbnail: 'docs' }
      ],
      books: [
        { title: 'The Phoenix Project', author: 'Gene Kim', url: 'https://amazon.com', difficulty: 'Beginner', thumbnail: 'book' }
      ],
      courses: [
        { title: 'Docker and Kubernetes: The Complete Guide', author: 'Stephen Grider', url: 'https://udemy.com', difficulty: 'Intermediate', thumbnail: 'course' }
      ],
      blogs: [
        { title: 'DevOps.com Articles', author: 'Tech writers', url: 'https://devops.com', difficulty: 'Intermediate', thumbnail: 'blog' }
      ],
      communities: [
        { title: 'CNCF Slack Workspace', author: 'CNCF Team', url: 'https://slack.cncf.io', difficulty: 'All levels', thumbnail: 'community' }
      ]
    },
    certifications: [
      { name: 'Certified Kubernetes Administrator (CKA)', provider: 'Cloud Native Computing Foundation', difficulty: 'Advanced', duration: '3 months', recognition: 'High', url: 'https://cncf.io' },
      { name: 'AWS Certified DevOps Engineer – Professional', provider: 'Amazon Web Services', difficulty: 'Advanced', duration: '3 months', recognition: 'Global', url: 'https://aws.amazon.com' }
    ],
    interviewQuestions: [
      {
        category: 'Containers & Orchestration',
        questionsCount: 15,
        difficulty: 'Medium',
        questions: [
          { q: 'What is the difference between a Docker image and a Docker container?', a: 'A Docker image is a read-only blueprint template containing application files, dependencies, and environment configurations. A Docker container is a runnable isolated instance of an image running as a process on the host OS.' },
          { q: 'Explain the difference between a Kubernetes Pod and a Kubernetes Deployment.', a: 'A Pod is the smallest deployable unit in Kubernetes, hosting one or more closely coupled containers. A Deployment manages a set of identical Pods, handling replication scales, rollout updates, and failover recovery automatically.' }
        ]
      },
      {
        category: 'IaC & CI/CD Pipelines',
        questionsCount: 12,
        difficulty: 'Hard',
        questions: [
          { q: 'Explain the concept of Infrastructure as Code (IaC) and its benefits.', a: 'IaC is the practice of managing and provisioning server infrastructures programmatically via configuration files (e.g. Terraform) instead of manual console settings. It ensures environments are reproducible, version-controlled, and changes can be tested in review pipelines.' },
          { q: 'What is a rolling update strategy in Kubernetes?', a: 'A rolling update replaces old Pod instances with new Pod instances gradually one by one, ensuring some active Pods are always running, preventing application downtime during releases.' }
        ]
      }
    ],
    resumeGuide: {
      checklist: [
        'List 2-3 container orchestration configuration projects with GitHub configs',
        'State cloud provider experience and certifications clearly',
        'Highlight server uptime statistics (e.g. "Maintained 99.9% application uptime")'
      ],
      atsTips: [
        'Include keywords like DevOps, Linux, Docker, Kubernetes, CKA, Terraform, CI/CD, GitHub Actions, AWS, and Prometheus',
        'Use simple formatting and heading structures'
      ]
    },
    portfolioGuide: {
      sections: ['Deployment Architecture Diagrams', 'CI/CD Pipeline Configurations', 'Terraform Provisioning Modules'],
      checklists: [
        'Ensure configuration files have credentials replaced with environment variables',
        'Include visual flowcharts showing code builds to deployment paths'
      ]
    },
    companiesDetails: [
      { name: 'HashiCorp', logo: 'H', status: 'Highly Active', avgSalary: '$135k', openRoles: 5, careersUrl: 'https://hashicorp.com/careers' },
      { name: 'Amazon', logo: 'A', status: 'Active', avgSalary: '$140k', openRoles: 18, careersUrl: 'https://amazon.jobs' },
      { name: 'Google', logo: 'G', status: 'Active', avgSalary: '$145k', openRoles: 10, careersUrl: 'https://careers.google.com' }
    ],
    jobRoles: [
      'DevOps Engineer',
      'Site Reliability Engineer (SRE)',
      'Systems Automation Engineer',
      'Build and Release Specialist',
      'Platform Engineer'
    ],
    salaryInsights: {
      experience: [
        { level: '0-2 Years (Junior)', salary: '$78,000' },
        { level: '2-5 Years (Mid)', salary: '$110,000' },
        { level: '5+ Years (Senior)', salary: '$160,000' }
      ],
      country: [
        { name: 'United States', salary: '$125,000' },
        { name: 'United Kingdom', salary: '£72,000' },
        { name: 'Germany', salary: '€82,000' },
        { name: 'India', salary: '₹1,500,000' }
      ],
      trend: [
        { year: '2022', salary: 102000 },
        { year: '2023', salary: 110000 },
        { year: '2024', salary: 118000 },
        { year: '2025', salary: 126000 }
      ],
      highestPaying: [
        { company: 'Netflix', salary: '$175,000' },
        { company: 'Stripe', salary: '$165,000' },
        { company: 'AWS', salary: '$155,000' }
      ]
    },
    timeline: [
      { month: 'Month 1', skills: ['Linux navigation', 'Bash scripting automations', 'Network SSH configs'], projects: ['Log archiver CLI utility', 'Automated system setup script'], milestones: ['Run bash scripts automating Linux configurations'] },
      { month: 'Month 2', skills: ['Git branching operations', 'GitHub Actions syntax', 'Build actions config'], projects: ['Automated Node test pipeline setup'], milestones: ['Trigger automated testing flows on code commits'] },
      { month: 'Month 3', skills: ['Docker containers runtime', 'Multi-stage Dockerfile configurations', 'Docker compose orchestration'], projects: ['Virtualize application backend and DB server compose configuration'], milestones: ['Deploy localized virtual applications runtime stacks'] },
      { month: 'Month 4', skills: ['Terraform resource maps', 'AWS VPC configurations', 'State variables management'], projects: ['Deploy custom VPC via Terraform configuration'], milestones: ['Build cloud server networks programmatically via IaC'] },
      { month: 'Month 5', skills: ['Kubernetes pods structure', 'Kubectl deployment maps', 'Helm package configurations'], projects: ['Scalable Kubernetes service deployment'], milestones: ['Deploy multi-node container architectures on clusters'] },
      { month: 'Month 6', skills: ['Prometheus monitoring settings', 'Grafana metric boards config', 'Portfolio build'], projects: ['Cluster performance monitoring dashboard setup', 'Portfolio Site'], milestones: ['Configure real-time monitoring and compile DevOps portfolios'] }
    ],
    faqs: [
      { q: 'What programming language should I learn for DevOps?', a: 'Python or Go are the industry standards. Python is great for general scripting and automation, while Go is used heavily in cloud-native tools like Docker and Kubernetes.' },
      { q: 'Is AWS Certified Cloud Practitioner enough to get a DevOps role?', a: 'No, that is a foundational cert. For DevOps roles, professional certifications like AWS Certified DevOps Engineer or CKA (Certified Kubernetes Administrator) are much more valuable.' }
    ]
  }
];
