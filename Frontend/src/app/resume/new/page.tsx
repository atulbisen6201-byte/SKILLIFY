'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  FolderKanban,
  Award,
  ChevronRight,
  ChevronLeft,
  Download,
  Save,
  Wand2,
  Eye,
  FileText,
  Plus,
  Trash2,
  Upload,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'
import { ResumeOptimizer } from '@/components/resume-optimizer'
import { getAccessToken } from '@/lib/auth-client'
import { skillifyPostJson, skillifyGetJson } from '@/lib/skillify-api'

// Helper for legacy binary Word .doc files (extracts ascii strings)
function extractTextFromDoc(arrayBuffer: ArrayBuffer): string {
  const view = new DataView(arrayBuffer)
  let text = ''
  let inString = false
  let currentString = ''
  
  for (let i = 0; i < view.byteLength; i++) {
    const charCode = view.getUint8(i)
    if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
      currentString += String.fromCharCode(charCode)
      inString = true
    } else {
      if (inString) {
        if (currentString.trim().length > 4) {
          text += currentString + ' '
        }
        currentString = ''
        inString = false
      }
    }
  }
  if (inString && currentString.trim().length > 4) {
    text += currentString
  }
  return text.replace(/\s+/g, ' ').trim()
}

// PDF.js text extraction with Scanned PDF OCR Fallback
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []
  let hasText = false

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
    if (pageText.trim().length > 10) {
      hasText = true
    }
  }

  const extracted = pages.join('\n')
  
  // If the extracted text is too short, trigger OCR fallback for scanned PDF
  if (!hasText || extracted.trim().length < 50) {
    console.log('⚠️ Normal PDF text extraction returned minimal content. Triggering OCR Fallback for scanned PDF...')
    return await extractTextViaOcr(arrayBuffer)
  }

  return extracted
}

// Scanned PDF OCR fallback using Tesseract.js
async function extractTextViaOcr(arrayBuffer: ArrayBuffer): Promise<string> {
  console.log('⏳ Loading Tesseract.js for OCR fallback...')
  
  if (typeof window !== 'undefined' && !(window as any).Tesseract) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Tesseract.js CDN'))
      document.head.appendChild(script)
    })
  }

  const Tesseract = (window as any).Tesseract
  if (!Tesseract) throw new Error('OCR Engine (Tesseract) not available')

  const pdfjsLib = await import('pdfjs-dist')
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let ocrText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    console.log(`⏳ Running OCR on Page ${i}/${pdf.numPages}...`)
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1.5 })
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise
      const dataUrl = canvas.toDataURL('image/png')
      
      const result = await Tesseract.recognize(dataUrl, 'eng')
      ocrText += result.data.text + '\n'
    }
  }

  console.log('✅ OCR Text Extraction Complete!')
  return ocrText
}

// Clean and repair AI JSON response
function cleanAndRepairJson(rawResponse: string): any {
  let cleaned = rawResponse.trim()
  cleaned = cleaned.replace(/^```json\s*/i, '')
  cleaned = cleaned.replace(/^```\s*/i, '')
  cleaned = cleaned.replace(/\s*```$/i, '')
  cleaned = cleaned.trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    console.warn('⚠️ Standard JSON parsing failed. Attempting JSON repair heuristics...', e)
  }

  try {
    let repaired = cleaned
      .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // ensure keys are double quoted
      .replace(/:\s*[']((?:[^'\\]|\\.)*)[']/g, ':"$1"') // replace single quotes on values with double quotes
    
    const firstBrace = repaired.indexOf('{')
    const lastBrace = repaired.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1) {
      repaired = repaired.substring(firstBrace, lastBrace + 1)
    }

    return JSON.parse(repaired)
  } catch (repairErr) {
    console.error('❌ JSON repair failed completely:', repairErr)
    throw new Error('AI response is not valid JSON and could not be repaired.')
  }
}

// Normalize key mismatches recursively
function normalizeKeys(data: any): any {
  if (!data || typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(item => normalizeKeys(item))
  }

  const result: any = {}
  
  const keyMap: Record<string, string> = {
    'name': 'fullName',
    'full_name': 'fullName',
    'fullname': 'fullName',
    'mobile': 'phone',
    'contact': 'phone',
    'phone_number': 'phone',
    'mail': 'email',
    'email_address': 'email',
    'city': 'location',
    'address': 'location',
    'linkedin_url': 'linkedin',
    'web': 'website',
    'portfolio': 'website',
    'summary_statement': 'summary',
    'professional_summary': 'summary',
    'about_me': 'summary',
    'personal': 'personalInfo',
    'personal_info': 'personalInfo',
    'personalInfo': 'personalInfo',
    'skillsList': 'skills',
    'skills_list': 'skills',
    'workExperience': 'experience',
    'work_experience': 'experience',
    'jobs': 'experience',
    'employment': 'experience',
    'academic_background': 'education',
    'schools': 'education',
    'certifications_list': 'certifications',
    'credentials': 'certifications',
    'language': 'languages',
  }

  for (const key of Object.keys(data)) {
    const normalizedKey = keyMap[key] || keyMap[key.toLowerCase()] || key
    let value = data[key]

    if (value && typeof value === 'object') {
      value = normalizeKeys(value)
    }

    result[normalizedKey] = value
  }

  return result
}

// Enforce required JSON schema format and prevent crashes
function enforceSchema(data: any): any {
  const normalized = normalizeKeys(data) || {}
  
  const personalInfoSrc = normalized.personalInfo || normalized.personal || {}
  
  const personalInfo = {
    fullName: String(personalInfoSrc.fullName || personalInfoSrc.name || '').trim(),
    email: String(personalInfoSrc.email || personalInfoSrc.mail || '').trim(),
    phone: String(personalInfoSrc.phone || personalInfoSrc.mobile || personalInfoSrc.contact || '').trim(),
    alternatePhone: String(personalInfoSrc.alternatePhone || personalInfoSrc.altPhone || '').trim(),
    address: String(personalInfoSrc.address || '').trim(),
    city: String(personalInfoSrc.city || '').trim(),
    state: String(personalInfoSrc.state || '').trim(),
    country: String(personalInfoSrc.country || '').trim(),
    linkedin: String(personalInfoSrc.linkedin || '').trim(),
    github: String(personalInfoSrc.github || '').trim(),
    portfolio: String(personalInfoSrc.portfolio || '').trim(),
    website: String(personalInfoSrc.website || '').trim(),
    summary: String(personalInfoSrc.summary || '').trim(),
  }

  const careerSrc = normalized.career || {}
  const career = {
    currentPosition: String(careerSrc.currentPosition || '').trim(),
    currentCompany: String(careerSrc.currentCompany || '').trim(),
    totalExperience: String(careerSrc.totalExperience || '').trim(),
    previousCompanies: Array.isArray(careerSrc.previousCompanies)
      ? careerSrc.previousCompanies.map((c: any) => String(c).trim()).filter(Boolean)
      : [],
    jobHistory: Array.isArray(careerSrc.jobHistory)
      ? careerSrc.jobHistory.map((j: any) => String(j).trim()).filter(Boolean)
      : [],
  }

  const education = Array.isArray(normalized.education)
    ? normalized.education.map((edu: any) => ({
        id: edu.id || Math.random().toString(),
        school: String(edu.school || edu.institution || edu.college || edu.university || '').trim(),
        degree: String(edu.degree || '').trim(),
        field: String(edu.field || edu.major || '').trim(),
        startDate: String(edu.startDate || edu.startYear || edu.start || '').trim(),
        endDate: String(edu.endDate || edu.endYear || edu.end || '').trim(),
        gpa: String(edu.gpa || edu.cgpa || '').trim(),
        cgpa: String(edu.cgpa || edu.gpa || '').trim(),
        percentage: String(edu.percentage || '').trim(),
        passingYear: String(edu.passingYear || edu.endDate || edu.endYear || '').trim(),
      }))
    : []

  const experience = Array.isArray(normalized.experience)
    ? normalized.experience.map((exp: any) => ({
        id: exp.id || Math.random().toString(),
        company: String(exp.company || exp.organization || '').trim(),
        position: String(exp.position || exp.role || '').trim(),
        location: String(exp.location || '').trim(),
        startDate: String(exp.startDate || exp.start || '').trim(),
        endDate: String(exp.endDate || exp.end || '').trim(),
        current: Boolean(exp.current || String(exp.endDate).toLowerCase().includes('present')),
        description: String(exp.description || exp.bullets || '').trim(),
      }))
    : []

  const skills = Array.isArray(normalized.skills)
    ? Array.from(new Set(normalized.skills.map((s: any) => String(s).trim()).filter(Boolean)))
    : typeof normalized.skills === 'string'
    ? Array.from(new Set(normalized.skills.split(',').map((s: any) => String(s).trim()).filter(Boolean)))
    : []

  const projects = Array.isArray(normalized.projects)
    ? normalized.projects.map((proj: any) => ({
        id: proj.id || Math.random().toString(),
        name: String(proj.name || proj.title || '').trim(),
        description: String(proj.description || '').trim(),
        technologies: String(proj.technologies || proj.tech || '').trim(),
        link: String(proj.link || proj.url || '').trim(),
        duration: String(proj.duration || '').trim(),
      }))
    : []

  const certifications = Array.isArray(normalized.certifications)
    ? normalized.certifications.map((cert: any) => ({
        id: cert.id || Math.random().toString(),
        name: String(cert.name || cert.title || '').trim(),
        issuer: String(cert.issuer || cert.organization || '').trim(),
        date: String(cert.date || cert.year || '').trim(),
        link: String(cert.link || cert.url || '').trim(),
      }))
    : []

  const languages = Array.isArray(normalized.languages)
    ? Array.from(new Set(normalized.languages.map((l: any) => String(typeof l === 'string' ? l : l.name || '').trim()).filter(Boolean)))
    : []

  const achievements = Array.isArray(normalized.achievements)
    ? Array.from(new Set(normalized.achievements.map((a: any) => String(a).trim()).filter(Boolean)))
    : []

  const internships = Array.isArray(normalized.internships)
    ? normalized.internships.map((intern: any) => ({
        id: intern.id || Math.random().toString(),
        company: String(intern.company || '').trim(),
        position: String(intern.position || '').trim(),
        startDate: String(intern.startDate || '').trim(),
        endDate: String(intern.endDate || '').trim(),
        description: String(intern.description || '').trim(),
      }))
    : []

  return {
    personalInfo,
    career,
    education,
    experience,
    skills,
    projects,
    certifications,
    languages,
    achievements,
    internships,
  }
}

// Remote Gemini AI Extraction API call
async function extractWithGemini(resumeText: string, apiKey: string): Promise<string> {
const url =
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`  
  const promptText = `You are an expert resume parser. Parse the following resume text and output the extracted details in the exact JSON format requested. Do not include markdown code block styling or any conversational text. Respond ONLY with the raw JSON string.

Schema:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": ""
  },
  "education": [
    {
      "school": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": "",
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "link": ""
    }
  ],
  "languages": []
}

Resume Text:
${resumeText}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
     generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 4096
}
    })
  })

 if (!response.ok) {
  const errorText = await response.text();
  console.error("Gemini API Error:", errorText);

  throw new Error(
    `Gemini API Error ${response.status}: ${errorText}`
  );
}

  const result = await response.json()
  return result.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Local Mock AI Parser Fallback
function parseResumeWithMockAI(text: string): string {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  let fullName = ''
  let email = ''
  let phone = ''
  let location = ''
  let linkedin = ''
  let website = ''
  let summary = ''

  // Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  for (const line of lines) {
    const match = line.match(emailRegex)
    if (match) {
      email = match[0]
      break
    }
  }

  // Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/
  for (const line of lines) {
    const match = line.match(phoneRegex)
    if (match && match[0].replace(/\D/g, '').length >= 7) {
      phone = match[0]
      break
    }
  }

  // LinkedIn
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i
  for (const line of lines) {
    const match = line.match(linkedinRegex)
    if (match) {
      linkedin = match[0]
      break
    }
  }

  // Website
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|dev|org|net|me|io|info|in)(?:\/[a-zA-Z0-9_-]*)*\b/i
  for (const line of lines) {
    const match = line.match(websiteRegex)
    if (match && !match[0].toLowerCase().includes('linkedin.com') && !match[0].includes('@')) {
      website = match[0]
      break
    }
  }

  // Location
  const locationRegex = /\b[A-Z][a-zA-Z\s\.]+,\s*(?:[A-Z]{2}|[A-Z][a-z]+)\b/
  for (const line of lines) {
    if (line.includes('@') || line.includes('http') || line.match(/summary|skills|experience|education|projects/i)) {
      continue
    }
    const match = line.match(locationRegex)
    if (match) {
      location = match[0]
      break
    }
  }

  // Name
  const headerKeywords = ['summary', 'education', 'experience', 'skills', 'projects', 'certifications', 'curriculum', 'vitae', 'resume', 'contact', 'profile', 'technical', 'languages']
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (line.length > 3 && line.length < 40 && !line.includes('@') && !line.includes('http') && !line.match(/\d/) && !headerKeywords.some(kw => lower.includes(kw))) {
      if (line.match(/^[A-Za-z\s\.\'-]+$/)) {
        fullName = line
        break
      }
    }
  }
  if (!fullName && lines.length > 0) {
    const fallbackLine = lines.find(l => l.length < 40 && !headerKeywords.some(kw => l.toLowerCase().includes(kw)))
    if (fallbackLine) fullName = fallbackLine.substring(0, 30)
  }

  // Summary
  let summaryStarted = false
  const summaryLines: string[] = []
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes('summary') || lower.includes('objective') || lower.includes('about me')) {
      summaryStarted = true
      continue
    }
    if (summaryStarted) {
      if (headerKeywords.some(kw => lower.includes(kw) && kw !== 'summary')) {
        break
      }
      summaryLines.push(line)
    }
  }
  summary = summaryLines.join(' ')
  if (!summary) {
    const summaryMatch = text.match(/(?:summary|objective|about\s+me)[:\s]*([\s\S]*?)(?=\n\s*(?:education|experience|skills|projects|certifications|languages|$))/i)
    if (summaryMatch) summary = summaryMatch[1].trim()
  }

  // Skills
  const knownSkills = [
    'JavaScript','TypeScript','React','React.js','Next.js','Angular','Vue.js','Svelte','Node.js',
    'Express','Express.js','NestJS','Django','Flask','FastAPI','Spring Boot','Ruby on Rails',
    'Python','Java','C','C++','C#','Go','Golang','Rust','Kotlin','Swift','PHP','Perl','Scala',
    'R','MATLAB','Dart','Flutter','React Native','Electron',
    'HTML','HTML5','CSS','CSS3','SASS','SCSS','Tailwind CSS','Bootstrap','Material UI','Chakra UI',
    'SQL','MySQL','PostgreSQL','SQLite','Oracle','SQL Server','MariaDB',
    'MongoDB','Redis','Cassandra','DynamoDB','Firebase','Firestore','Supabase',
    'GraphQL','REST','REST API','gRPC','WebSocket','OAuth','JWT',
    'AWS','Azure','GCP','Google Cloud','Heroku','Vercel','Netlify','DigitalOcean',
    'Docker','Kubernetes','Terraform','Ansible','Jenkins','GitHub Actions','CircleCI','GitLab CI',
    'CI/CD','DevOps','Nginx','Apache','Linux','Bash','Shell Scripting','PowerShell',
    'Git','GitHub','GitLab','Bitbucket','SVN',
    'Machine Learning','Deep Learning','TensorFlow','PyTorch','Keras','Scikit-learn','OpenCV',
    'NLP','Natural Language Processing','Computer Vision','Data Science','Data Analysis',
    'Pandas','NumPy','Matplotlib','Jupyter','Tableau','Power BI','Excel',
    'Figma','Adobe XD','Sketch','Photoshop','Illustrator','UI/UX','UX Design','UI Design',
    'Agile','Scrum','Jira','Confluence','Trello','Notion',
    'Microservices','Serverless','Lambda','API Gateway',
    'Blockchain','Solidity','Web3','Ethereum',
    'Unity','Unreal Engine','Three.js','WebGL',
    'Selenium','Cypress','Jest','Mocha','Chai','Playwright','Testing','Unit Testing',
    'RabbitMQ','Kafka','ElasticSearch','Kibana','Grafana','Prometheus',
    'Prisma','Sequelize','TypeORM','Mongoose','Drizzle',
    'Webpack','Vite','Babel','ESLint','Prettier',
    'Android','iOS','Xcode','Android Studio',
    'OpenAI','LLM','ChatGPT','Generative AI','Prompt Engineering','LangChain',
    'Hadoop','Spark','Hive','Airflow','ETL','Data Engineering','Data Pipeline',
    'SAP','Salesforce','ServiceNow','Workday',
    'AutoCAD','CATIA','SolidWorks','ANSYS',
    'Communication','Leadership','Problem Solving','Teamwork','Critical Thinking',
    'Project Management','Time Management','Presentation',
  ]
  const skills: string[] = []
  const textLower = text.toLowerCase()
  for (const skill of knownSkills) {
    const skillLower = skill.toLowerCase()
    if (skillLower.length <= 3) {
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      if (regex.test(textLower)) skills.push(skill)
    } else {
      if (textLower.includes(skillLower)) skills.push(skill)
    }
  }

  const education: any[] = []
  const experience: any[] = []
  const projects: any[] = []
  const certifications: any[] = []
  const languages: string[] = []

  let currentSection = ''
  for (const line of lines) {
    const lower = line.toLowerCase()

    if (lower.includes('education') || lower.includes('academic background') || lower.includes('qualification')) {
      currentSection = 'education'
      continue
    } else if (lower.includes('experience') || lower.includes('employment') || lower.includes('work history')) {
      currentSection = 'experience'
      continue
    } else if (lower.includes('project') || lower.includes('personal project')) {
      currentSection = 'projects'
      continue
    } else if (lower.includes('certification') || lower.includes('credential') || lower.includes('achievement')) {
      currentSection = 'certifications'
      continue
    } else if (lower.includes('language')) {
      currentSection = 'languages'
      continue
    } else if (headerKeywords.some(kw => lower.includes(kw))) {
      currentSection = ''
      continue
    }

    if (currentSection === 'education') {
      const parts = line.split(/[|,-]/).map(p => p.trim())
      education.push({
        id: Math.random().toString(),
        school: parts[0] || line,
        degree: parts[1] || 'Degree',
        field: parts[2] || 'Field',
        startDate: parts[parts.length - 2] || '2020',
        endDate: parts[parts.length - 1] || '2024',
        gpa: '3.8'
      })
    } else if (currentSection === 'experience') {
      const parts = line.split(/[|,-]/).map(p => p.trim())
      experience.push({
        id: Math.random().toString(),
        company: parts[0] || line,
        position: parts[1] || 'Role',
        location: parts[2] || 'Remote',
        startDate: parts[parts.length - 2] || '2022',
        endDate: parts[parts.length - 1] || 'Present',
        current: line.toLowerCase().includes('present'),
        description: line
      })
    } else if (currentSection === 'projects') {
      const parts = line.split(/[|,-]/).map(p => p.trim())
      projects.push({
        id: Math.random().toString(),
        name: (parts[0] || line).substring(0, 40),
        description: parts[1] || line,
        technologies: parts[2] || 'Tech Stack',
        link: ''
      })
    } else if (currentSection === 'certifications') {
      const parts = line.split(/[|,-]/).map(p => p.trim())
      certifications.push({
        id: Math.random().toString(),
        name: parts[0] || line,
        issuer: parts[1] || 'Issuer',
        date: parts[2] || '2023',
        link: ''
      })
    } else if (currentSection === 'languages') {
      const rawLangs = line.split(/[,;|•\n\t]+/).map(l => l.trim()).filter(Boolean)
      languages.push(...rawLangs)
    }
  }

  if (languages.length === 0) {
    const defaultLangs = ['English', 'Spanish', 'French', 'Hindi', 'German', 'Chinese', 'Japanese']
    for (const dl of defaultLangs) {
      if (textLower.includes(dl.toLowerCase())) {
        languages.push(dl)
      }
    }
  }
  if (languages.length === 0) {
    languages.push('English')
  }

  const jsonObj = {
    personalInfo: {
      fullName,
      email,
      phone,
      location,
      linkedin,
      website,
      summary
    },
    education,
    experience,
    skills,
    projects,
    certifications,
    languages
  }

  return JSON.stringify(jsonObj, null, 2)
}

const steps = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'certifications', label: 'Certifications', icon: Award },
]

const templates = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  { id: 'ats', name: 'ATS Friendly', description: 'Optimized for ATS' },
]

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    summary: string
    alternatePhone?: string
    address?: string
    city?: string
    state?: string
    country?: string
    github?: string
    portfolio?: string
  }
  career?: {
    currentPosition: string
    currentCompany: string
    totalExperience: string
    previousCompanies: string[]
    jobHistory: string[]
  }
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
    cgpa?: string
    percentage?: string
    passingYear?: string
  }>
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  skills: string[]
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
    duration?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    link: string
  }>
  languages: string[]
  achievements?: string[]
  internships?: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
}

const SAMPLE_RESUME_TEXT = `Alex Rivera
alex.rivera@email.com
+1 (555) 987-6543
New York, NY
linkedin.com/in/alexrivera
alexrivera.dev

Professional Summary:
Dynamic Full-Stack Developer with 6+ years of experience building scalable SaaS platforms and high-performance user interfaces.

Skills:
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, SQL, Figma

Experience:
Senior Software Engineer - DevStream Co - Jan 2021 - Present
- Architected a real-time analytics engine utilizing React and Node.js.
- Led a team of 4 software developers to deploy 12 microservices.

Software Engineer - Tech Solutions Ltd - Jun 2018 - Dec 2020
- Built and shipped React web applications with 99.9% uptime.

Education:
Stanford University - Bachelor of Science - Computer Science - 2014 - 2018

Projects:
E-commerce Platform - Full-stack application with inventory management - React, Express, Stripe
Task Management API - Collaborative board system - Node.js, PostgreSQL

Certifications:
AWS Certified Solutions Architect - Amazon Web Services - 2023
React Native Professional - Frontend Academy - 2022

Languages:
English, Spanish
`

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [showOptimizer, setShowOptimizer] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parseStep, setParseStep] = useState<string>('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key')
      if (savedKey) {
        (window as any).GEMINI_API_KEY = savedKey
      }
    }

    const token = getAccessToken()
    if (!token) return
    async function fetchSavedResume() {
      try {
        const res = await skillifyGetJson<{ resumes: any[] }>('/api/resumes', { token })
        if (res?.resumes && res.resumes.length > 0) {
          const latest = res.resumes[0]
          setResumeData({
            personalInfo: {
              fullName: latest.fullName || '',
              email: latest.email || '',
              phone: latest.phone || '',
              location: latest.location || '',
              linkedin: latest.linkedin || '',
              website: latest.website || '',
              summary: latest.summary || '',
            },
            skills: Array.isArray(latest.skills) ? latest.skills : [],
            education: Array.isArray(latest.education) ? latest.education : [],
            experience: Array.isArray(latest.experience) ? latest.experience : [],
            projects: Array.isArray(latest.projects) ? latest.projects : [],
            certifications: Array.isArray(latest.certifications) ? latest.certifications : [],
            languages: [],
          })
        }
      } catch (err) {
        console.error('Failed to fetch existing resume:', err)
      }
    }
    fetchSavedResume()
  }, [])

  const handleSaveResume = async () => {
    const token = getAccessToken()
    if (!token) {
      alert('Please log in to save your resume.')
      return
    }

    try {
      setIsSaving(true)
      setSaveSuccess(false)
      const payload = {
        fullName: resumeData.personalInfo.fullName,
        email: resumeData.personalInfo.email,
        phone: resumeData.personalInfo.phone,
        location: resumeData.personalInfo.location,
        linkedin: resumeData.personalInfo.linkedin,
        website: resumeData.personalInfo.website,
        summary: resumeData.personalInfo.summary,
        skills: resumeData.skills,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        certifications: resumeData.certifications,
      }
      await skillifyPostJson('/api/resumes', payload, { token })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save resume:', err)
      alert(err instanceof Error ? err.message : 'Failed to save resume.')
    } finally {
      setIsSaving(false)
    }
  }

  const downloadSampleResume = () => {
    const element = document.createElement('a')
    const file = new Blob([SAMPLE_RESUME_TEXT], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'sample_resume.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    const fileName = file.name.toLowerCase()
    const extension = fileName.split('.').pop()

    if (!['txt', 'json', 'pdf', 'docx', 'doc'].includes(extension || '')) {
      setUploadError('Unsupported file type. Please upload a .txt, .json, .pdf, .doc, or .docx file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.')
      return
    }
    if (file.size === 0) {
      setUploadError('File is empty or corrupted.')
      return
    }

    setIsParsing(true)
    
    try {
      setParseStep('Reading file...')
      const base64Data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => {
          const raw = r.result as string
          const base64 = raw.split(',')[1] // remove the data:*/*;base64, prefix
          resolve(base64)
        }
        r.onerror = () => reject(new Error('Failed to read file as data URL'))
        r.readAsDataURL(file)
      })

      const token = getAccessToken()
      if (!token) {
        throw new Error('Please log in to upload and parse your resume.')
      }

      setParseStep('Uploading document to AI parser pipeline...')
      const response = await skillifyPostJson<{
        resumeUrl: string
        parsedResume: any
        profileCompletion: number
        resumeScore: number
      }>('/api/resumes/upload', {
        fileName: file.name,
        fileData: base64Data,
      }, { token })

      console.log('✅ File uploaded and parsed by server:', response.resumeUrl)

      setParseStep('Autofilling details...')
      await new Promise((resolve) => setTimeout(resolve, 300))

      const parsed = response.parsedResume;

      // Define setFormData helper mapping backend JSON to frontend state fields
      const setFormData = (data: any) => {
        setResumeData({
          personalInfo: {
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            linkedin: data.linkedin || "",
            website: data.website || "",
            summary: data.summary || "",
            alternatePhone: data.alternatePhone || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            github: data.github || "",
            portfolio: data.portfolio || data.website || "",
            headline: data.headline || "",
          },
          career: data.career || {
            currentPosition: data.headline || "",
            currentCompany: "",
            totalExperience: "",
            previousCompanies: [],
            jobHistory: []
          },
          education: (data.education || []).map((edu: any) => ({
            id: edu.id || Math.random().toString(),
            school: edu.institution || "",
            degree: edu.degree || "",
            field: edu.degree || "", // Fallback
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            gpa: edu.grade || "",
          })),
          experience: (data.experience || []).map((exp: any) => ({
            id: exp.id || Math.random().toString(),
            company: exp.company || "",
            position: exp.position || "",
            location: exp.location || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            current: exp.currentlyWorking || false,
            description: exp.description || "",
          })),
          skills: data.skills || [],
          projects: (data.projects || []).map((proj: any) => ({
            id: proj.id || Math.random().toString(),
            name: proj.title || "",
            description: proj.description || "",
            technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || "",
            link: proj.liveUrl || proj.github || "",
          })),
          certifications: (data.certifications || []).map((cert: any) => ({
            id: cert.id || Math.random().toString(),
            name: cert.name || "",
            issuer: cert.issuer || "",
            date: cert.date || "",
            link: cert.credentialId || "",
          })),
          languages: data.languages || [],
          achievements: data.achievements || [],
          internships: (data.internships || []).map((intern: any) => ({
            id: intern.id || Math.random().toString(),
            company: intern.company || "",
            position: intern.position || "",
            startDate: intern.startDate || "",
            endDate: intern.endDate || "",
            description: intern.description || "",
          })),
          // Store extra fields parsed from the resume
          softSkills: data.softSkills || [],
          awards: data.awards || [],
          volunteerExperience: (data.volunteerExperience || []).map((vol: any) => ({
            id: vol.id || Math.random().toString(),
            company: vol.company || "",
            position: vol.position || "",
            startDate: vol.startDate || "",
            endDate: vol.endDate || "",
            description: vol.description || "",
          })),
          publications: data.publications || [],
          references: data.references || [],
        } as any)
      }

      setFormData(parsed);
      console.log('✅ Form updated and populated successfully');
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to parse and save file. Please verify content structure.')
      console.error('❌ Resume parse pipeline error:', err)
    } finally {
      setIsParsing(false)
      setParseStep('')
    }
  }

  const updatePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      ],
    }))
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    }))
  }

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now().toString(), name: '', description: '', technologies: '', link: '' },
      ],
    }))
  }

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now().toString(), name: '', issuer: '', date: '', link: '' },
      ],
    }))
  }

  const addSkill = () => {
    if (newSkill && !resumeData.skills.includes(newSkill)) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Location</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">LinkedIn</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => updatePersonal('linkedin', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Website</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.website}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Professional Summary</label>
              <textarea
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        )
      case 'education':
        return (
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Education {index + 1}</h3>
                  {resumeData.education.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setResumeData((prev) => ({
                          ...prev,
                          education: prev.education.filter((e) => e.id !== edu.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="School Name"
                    value={edu.school}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, school: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, degree: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, field: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, gpa: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Start Year"
                    value={edu.startDate}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, startDate: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="End Year"
                    value={edu.endDate}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, endDate: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addEducation} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>
        )
      case 'experience':
        return (
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Experience {index + 1}</h3>
                  {resumeData.experience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setResumeData((prev) => ({
                          ...prev,
                          experience: prev.experience.filter((e) => e.id !== exp.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item) =>
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item) =>
                          item.id === exp.id ? { ...item, position: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item) =>
                          item.id === exp.id ? { ...item, location: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item) =>
                            item.id === exp.id ? { ...item, startDate: e.target.value } : item
                          ),
                        }))
                      }
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <input
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item) =>
                            item.id === exp.id ? { ...item, endDate: e.target.value } : item
                          ),
                        }))
                      }
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item) =>
                        item.id === exp.id ? { ...item, description: e.target.value } : item
                      ),
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addExperience} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>
        )
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <Button onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )
      case 'projects':
        return (
          <div className="space-y-4">
            {resumeData.projects.map((proj, index) => (
              <div key={proj.id} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Project {index + 1}</h3>
                  {resumeData.projects.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setResumeData((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((p) => p.id !== proj.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: prev.projects.map((item) =>
                          item.id === proj.id ? { ...item, name: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Technologies"
                    value={proj.technologies}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: prev.projects.map((item) =>
                          item.id === proj.id ? { ...item, technologies: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      projects: prev.projects.map((item) =>
                        item.id === proj.id ? { ...item, description: e.target.value } : item
                      ),
                    }))
                  }
                  rows={2}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <input
                  placeholder="Link (optional)"
                  value={proj.link}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      projects: prev.projects.map((item) =>
                        item.id === proj.id ? { ...item, link: e.target.value } : item
                      ),
                    }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
            <Button variant="outline" onClick={addProject} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        )
      case 'certifications':
        return (
          <div className="space-y-4">
            {resumeData.certifications.map((cert, index) => (
              <div key={cert.id} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Certification {index + 1}</h3>
                  {resumeData.certifications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setResumeData((prev) => ({
                          ...prev,
                          certifications: prev.certifications.filter((c) => c.id !== cert.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === cert.id ? { ...item, name: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === cert.id ? { ...item, issuer: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Date"
                    value={cert.date}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === cert.id ? { ...item, date: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Credential URL (optional)"
                    value={cert.link}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        certifications: prev.certifications.map((item) =>
                          item.id === cert.id ? { ...item, link: e.target.value } : item
                        ),
                      }))
                    }
                    className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addCertification} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold lg:text-3xl">Resume Builder</h1>
                <p className="text-muted-foreground">Create a professional resume in minutes</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleSaveResume} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="gap-2" onClick={() => setShowOptimizer(true)}>
                  <Wand2 className="h-4 w-4" />
                  AI Optimize
                </Button>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Form Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Resume Upload / Autofill Dropper */}
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-sm">Autofill with AI Resume Parser</h2>
                        <p className="text-xs text-muted-foreground leading-normal">
                          Upload your existing resume to fill form fields automatically.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSampleResume}
                      className="text-xs shrink-0"
                    >
                      Download Sample TXT
                    </Button>
                  </div>

                  <div className="mt-4">
                    {isParsing ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-3 text-sm font-medium text-primary">{parseStep}</p>
                        <p className="text-xs text-muted-foreground mt-1">Please wait while our parsing engine reads your details...</p>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-secondary/20">
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Click to upload or drag & drop</span>
                        <span className="text-xs text-muted-foreground mt-1">Supports PDF, TXT, or JSON formats</span>
                        <input
                          type="file"
                          accept=".txt,.json,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    {uploadError && (
                      <p className="mt-2 text-xs text-destructive text-center font-medium">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Template Selector */}
                <div className="rounded-2xl border border-border bg-card p-4">
                  <h2 className="mb-3 text-sm font-medium">Choose Template</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <FileText className={`mb-2 h-5 w-5 ${selectedTemplate === template.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-4 flex overflow-x-auto">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-sm transition-colors ${
                          currentStep === index
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{step.label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Preview Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Live Preview</h2>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Full Screen
                  </Button>
                </div>
                <div className="aspect-[8.5/11] overflow-hidden rounded-lg border border-border bg-white p-6 text-black shadow-lg">
                  {/* Resume Preview */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className={`${selectedTemplate === 'modern' ? 'border-b-2 border-blue-600 pb-4' : selectedTemplate === 'minimal' ? 'pb-4' : 'bg-gray-100 -mx-6 -mt-6 px-6 py-4'}`}>
                      <h1 className={`text-xl font-bold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                        {resumeData.personalInfo.fullName || 'Your Name'}
                      </h1>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span>{resumeData.personalInfo.email}</span>
                        <span>•</span>
                        <span>{resumeData.personalInfo.phone}</span>
                        <span>•</span>
                        <span>{resumeData.personalInfo.location}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                      <div>
                        <h2 className={`text-sm font-semibold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                          Summary
                        </h2>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                          {resumeData.personalInfo.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div>
                        <h2 className={`text-sm font-semibold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                          Experience
                        </h2>
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="mt-2">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-medium">{exp.position}</span>
                              <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-500">{exp.company}, {exp.location}</p>
                            <p className="mt-1 text-xs text-gray-600">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className={`text-sm font-semibold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                          Education
                        </h2>
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="mt-2">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-medium">{edu.degree} in {edu.field}</span>
                              <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-500">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div>
                        <h2 className={`text-sm font-semibold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                          Skills
                        </h2>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {resumeData.skills.map((skill) => (
                            <span
                              key={skill}
                              className={`rounded px-2 py-0.5 text-xs ${
                                selectedTemplate === 'modern'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {resumeData.languages && resumeData.languages.length > 0 && (
                      <div>
                        <h2 className={`text-sm font-semibold ${selectedTemplate === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>
                          Languages
                        </h2>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {resumeData.languages.map((lang) => (
                            <span
                              key={lang}
                              className={`rounded px-2 py-0.5 text-xs ${
                                selectedTemplate === 'modern'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
      <ResumeOptimizer isOpen={showOptimizer} onClose={() => setShowOptimizer(false)} />
    </div>
  )
}
