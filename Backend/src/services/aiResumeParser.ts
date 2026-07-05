import { z } from 'zod';
import { createRequire } from 'module';
import * as mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse;
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Education Schema matching the requested schema
const EducationSchema = z.object({
  degree: z.string().default(''),
  institution: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  grade: z.string().default(''),
  description: z.string().default(''),
});

// Experience Schema matching the requested schema
const ExperienceSchema = z.object({
  company: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  employmentType: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  currentlyWorking: z.boolean().default(false),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
});

// Project Schema matching the requested schema
const ProjectSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  github: z.string().default(''),
  liveUrl: z.string().default(''),
});

// Certification Schema matching the requested schema
const CertificationSchema = z.object({
  name: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  credentialId: z.string().default(''),
});

// Overall Parsed Resume schema matching the requested schema
export const ParsedResumeSchema = z.object({
  fullName: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().default(''),
  linkedin: z.string().default(''),
  github: z.string().default(''),
  portfolio: z.string().default(''),
  summary: z.string().default(''),
  skills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(z.string()).default([]),
  awards: z.array(z.string()).default([]),
  internships: z.array(ExperienceSchema).default([]),
  volunteerExperience: z.array(ExperienceSchema).default([]),
  publications: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;

/**
 * Extracts binary ASCII strings from legacy Word doc files.
 */
function extractTextFromDoc(buffer: Buffer): string {
  let text = '';
  let inString = false;
  let currentString = '';

  for (let i = 0; i < buffer.length; i++) {
    const charCode = buffer[i];
    // ASCII Printable, Tab, Newline, Carriage Return
    if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
      currentString += String.fromCharCode(charCode);
      inString = true;
    } else {
      if (inString) {
        if (currentString.trim().length > 4) {
          text += currentString + ' ';
        }
        currentString = '';
        inString = false;
      }
    }
  }
  if (inString && currentString.trim().length > 4) {
    text += currentString;
  }
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Clean and normalize extracted text before processing
 */
function cleanExtractedText(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // remove control chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts text from a document file buffer based on the file extension
 */
export async function extractTextFromBuffer(buffer: Buffer, ext: string): Promise<string> {
  const normalizedExt = ext.toLowerCase().replace(/^\./, '');
  let extractedText = '';

  try {
    if (normalizedExt === 'pdf') {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      extractedText = textResult.text || '';
    } else if (normalizedExt === 'docx') {
      const data = await mammoth.extractRawText({ buffer });
      extractedText = data.value || '';
    } else if (normalizedExt === 'doc') {
      extractedText = extractTextFromDoc(buffer);
    } else {
      // Treat other files (e.g. .txt, .json) as utf-8 strings
      extractedText = buffer.toString('utf8');
    }
  } catch (err: any) {
    throw AppError.badRequest(`Failed to read document file: ${err.message || 'File may be corrupted or protected.'}`);
  }

  const cleanedText = cleanExtractedText(extractedText);
  
  if (cleanedText.length < 50) {
    throw AppError.badRequest(
      'The document appears to contain no extractable text. Scanned or image-only PDFs/documents are not supported.'
    );
  }

  return cleanedText;
}

/**
 * Cleans the raw Gemini response, removing markdown code fences and repairing minor JSON errors
 */
function cleanAndRepairJson(rawResponse: string): string {
  let cleaned = rawResponse.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // Basic cleanup of trailing commas or invalid quotes
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // Attempt minor repair
    cleaned = cleaned
      .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // double quote keys
      .replace(/:\s*[']((?:[^'\\]|\\.)*)[']/g, ':"$1"'); // replace single quotes on string values
    
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }
    return cleaned;
  }
}

/**
 * Call Gemini API with the given resume text and request structured JSON output
 */
async function callGemini(text: string): Promise<string> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw AppError.internal('Gemini API key is not configured on the server.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const promptText = `You are an expert AI resume parser. Parse the following resume text and output the extracted details in the exact JSON format requested. Never invent or hallucinate information. If a field cannot be determined from the text, return "" for string fields or [] for array fields.

JSON Schema:
{
  "fullName": "",
  "headline": "",
  "email": "",
  "phone": "",
  "location": "",
  "website": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "summary": "",
  "skills": [],
  "softSkills": [],
  "languages": [],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "grade": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "employmentType": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": false,
      "description": "",
      "technologies": []
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "github": "",
      "liveUrl": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "credentialId": ""
    }
  ],
  "achievements": [],
  "awards": [],
  "internships": [
    {
      "company": "",
      "position": "",
      "location": "",
      "employmentType": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": false,
      "description": "",
      "technologies": []
    }
  ],
  "volunteerExperience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "employmentType": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": false,
      "description": "",
      "technologies": []
    }
  ],
  "publications": [],
  "references": []
}

Resume Text:
${text}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
  }

  const result = (await response.json()) as any;
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API response does not contain content candidates.');
  }

  return rawText;
}

/**
 * Normalizes lists and fields (phone numbers, empty arrays, trimming, removing duplicates)
 */
function normalizeParsedResume(data: ParsedResume): ParsedResume {
  const uniqueSkills = Array.from(new Set(data.skills.map((s) => s.trim()).filter(Boolean)));
  const uniqueSoftSkills = Array.from(new Set(data.softSkills.map((s) => s.trim()).filter(Boolean)));
  const uniqueLanguages = Array.from(new Set(data.languages.map((l) => l.trim()).filter(Boolean)));
  const uniqueAchievements = Array.from(new Set(data.achievements.map((a) => a.trim()).filter(Boolean)));
  const uniqueAwards = Array.from(new Set(data.awards.map((a) => a.trim()).filter(Boolean)));
  const uniquePublications = Array.from(new Set(data.publications.map((p) => p.trim()).filter(Boolean)));
  const uniqueReferences = Array.from(new Set(data.references.map((r) => r.trim()).filter(Boolean)));

  const cleanUrl = (url: string) => {
    let u = url.trim();
    if (u && !u.startsWith('http://') && !u.startsWith('https://')) {
      // Don't auto prefix if it is empty or invalid
      if (u.includes('.') || u.includes('/')) {
        u = 'https://' + u;
      }
    }
    return u;
  };

  const cleanPhone = (phone: string) => {
    return phone.trim().replace(/\s+/g, ' ');
  };

  return {
    fullName: data.fullName.trim(),
    headline: data.headline.trim(),
    email: data.email.trim().toLowerCase(),
    phone: cleanPhone(data.phone),
    location: data.location.trim(),
    website: cleanUrl(data.website),
    linkedin: cleanUrl(data.linkedin),
    github: cleanUrl(data.github),
    portfolio: cleanUrl(data.portfolio),
    summary: data.summary.trim(),
    skills: uniqueSkills,
    softSkills: uniqueSoftSkills,
    languages: uniqueLanguages,
    education: data.education.map((e) => ({
      degree: e.degree.trim(),
      institution: e.institution.trim(),
      location: e.location.trim(),
      startDate: e.startDate.trim(),
      endDate: e.endDate.trim(),
      grade: e.grade.trim(),
      description: e.description.trim(),
    })),
    experience: data.experience.map((e) => ({
      company: e.company.trim(),
      position: e.position.trim(),
      location: e.location.trim(),
      employmentType: e.employmentType.trim(),
      startDate: e.startDate.trim(),
      endDate: e.endDate.trim(),
      currentlyWorking: e.currentlyWorking,
      description: e.description.trim(),
      technologies: Array.isArray(e.technologies)
        ? Array.from(new Set(e.technologies.map((t) => t.trim()).filter(Boolean)))
        : [],
    })),
    projects: data.projects.map((p) => ({
      title: p.title.trim(),
      description: p.description.trim(),
      technologies: Array.isArray(p.technologies)
        ? Array.from(new Set(p.technologies.map((t) => t.trim()).filter(Boolean)))
        : [],
      github: cleanUrl(p.github),
      liveUrl: cleanUrl(p.liveUrl),
    })),
    certifications: data.certifications.map((c) => ({
      name: c.name.trim(),
      issuer: c.issuer.trim(),
      date: c.date.trim(),
      credentialId: c.credentialId.trim(),
    })),
    achievements: uniqueAchievements,
    awards: uniqueAwards,
    internships: data.internships.map((e) => ({
      company: e.company.trim(),
      position: e.position.trim(),
      location: e.location.trim(),
      employmentType: e.employmentType.trim(),
      startDate: e.startDate.trim(),
      endDate: e.endDate.trim(),
      currentlyWorking: e.currentlyWorking,
      description: e.description.trim(),
      technologies: Array.isArray(e.technologies)
        ? Array.from(new Set(e.technologies.map((t) => t.trim()).filter(Boolean)))
        : [],
    })),
    volunteerExperience: data.volunteerExperience.map((e) => ({
      company: e.company.trim(),
      position: e.position.trim(),
      location: e.location.trim(),
      employmentType: e.employmentType.trim(),
      startDate: e.startDate.trim(),
      endDate: e.endDate.trim(),
      currentlyWorking: e.currentlyWorking,
      description: e.description.trim(),
      technologies: Array.isArray(e.technologies)
        ? Array.from(new Set(e.technologies.map((t) => t.trim()).filter(Boolean)))
        : [],
    })),
    publications: uniquePublications,
    references: uniqueReferences,
  };
}

/**
 * Main parser method that coordinates text extraction, Gemini calls, repair heuristics, validation, and normalization.
 */
export async function parseResume(buffer: Buffer, ext: string): Promise<ParsedResume> {
  const extractedText = await extractTextFromBuffer(buffer, ext);

  let rawGeminiResponse = '';
  let parseAttempts = 0;
  const maxAttempts = 2; // initial attempt + 1 retry

  while (parseAttempts < maxAttempts) {
    try {
      rawGeminiResponse = await callGemini(extractedText);
      const repairedJson = cleanAndRepairJson(rawGeminiResponse);
      const parsedObj = JSON.parse(repairedJson);
      
      const validated = ParsedResumeSchema.parse(parsedObj);
      return normalizeParsedResume(validated);
    } catch (err: any) {
      parseAttempts++;
      console.warn(`⚠️ Resume parsing attempt ${parseAttempts} failed: ${err.message || err}`);
      if (parseAttempts >= maxAttempts) {
        throw AppError.badRequest(
          `AI parsing failed after multiple attempts. Reason: ${err.message || 'Malformed AI response structure.'}`
        );
      }
    }
  }

  throw AppError.badRequest('Failed to parse the resume.');
}
