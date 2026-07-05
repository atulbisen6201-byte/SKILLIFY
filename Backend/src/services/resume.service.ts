import { resumeRepository } from '../repositories/resume.repository.js';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../prisma/client.js';

async function updateUserResumeData(userId: string, resume: any, rawParsedData: any) {
  let completion = 20; // Base score for having a resume
  if (resume.fullName) completion += 10;
  if (resume.email) completion += 10;
  if (resume.phone) completion += 10;
  if (resume.location) completion += 5;
  if (resume.summary) completion += 10;
  
  const skillsCount = typeof resume.skills === 'string'
    ? (resume.skills.startsWith('[') ? JSON.parse(resume.skills).length : resume.skills.split(',').filter(Boolean).length)
    : (Array.isArray(resume.skills) ? resume.skills.length : 0);
  if (skillsCount > 0) completion += 15;
  
  if (resume.education && resume.education.length > 0) completion += 10;
  if (resume.experience && resume.experience.length > 0) completion += 10;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });
  
  if (user?.profile?.bio) completion += 5;
  if (user?.profile?.linkedin) completion += 5;

  await prisma.user.update({
    where: { id: userId },
    data: {
      resumeParsedData: JSON.stringify(rawParsedData),
      profileCompletion: Math.min(completion, 100),
    }
  });
}

function calculateResumeScore(data: any): number {
  let score = 0;

  if (data.fullName) score += 10;
  if (data.email) score += 10;
  if (data.phone) score += 10;
  if (data.location) score += 5;
  if (data.linkedin) score += 5;
  if (data.website) score += 5;
  if (data.summary) score += 10;

  // Skills
  const skillsCount = Array.isArray(data.skills)
    ? data.skills.length
    : typeof data.skills === 'string'
    ? data.skills.split(',').filter(Boolean).length
    : 0;
  score += Math.min(skillsCount * 3, 15);

  // Education
  const eduCount = Array.isArray(data.education) ? data.education.length : 0;
  score += Math.min(eduCount * 10, 20);

  // Experience
  const expCount = Array.isArray(data.experience) ? data.experience.length : 0;
  score += Math.min(expCount * 10, 20);

  // Projects
  const projCount = Array.isArray(data.projects) ? data.projects.length : 0;
  score += Math.min(projCount * 10, 20);

  return Math.min(score, 100);
}

export async function createResume(userId: string, data: any) {
  const score = calculateResumeScore(data);
  const existingResumes = await resumeRepository.findManyByUserId(userId);
  
  let result;
  if (existingResumes.length > 0) {
    const latest = existingResumes[0];
    
    // Check if the data is functionally identical to avoid duplicates
    const isIdentical = latest.fullName === data.fullName &&
                        latest.email === data.email &&
                        latest.phone === data.phone &&
                        latest.summary === data.summary &&
                        latest.skills === (typeof data.skills === 'string' ? data.skills : JSON.stringify(data.skills));
    
    if (isIdentical) {
      result = await resumeRepository.update(latest.id, userId, { ...data, score });
    } else {
      result = await resumeRepository.create(userId, { ...data, score });
      
      // Enforce a maximum of 5 history records
      if (existingResumes.length >= 5) {
        const toDelete = existingResumes.slice(4);
        for (const r of toDelete) {
          await resumeRepository.delete(r.id, userId);
        }
      }
    }
  } else {
    result = await resumeRepository.create(userId, { ...data, score });
  }

  // Update parsed details and completion in user table
  await updateUserResumeData(userId, result, data);

  return formatResume(result);
}

export async function listResumesForUser(userId: string) {
  const list = await resumeRepository.findManyByUserId(userId);
  return list.map(formatResume);
}

export async function getResumeById(id: string, userId: string) {
  const resume = await resumeRepository.findById(id, userId);
  if (!resume) throw AppError.notFound('Resume not found');
  return formatResume(resume);
}

export async function updateResume(id: string, userId: string, data: any) {
  const resume = await resumeRepository.findById(id, userId);
  if (!resume) throw AppError.notFound('Resume not found');

  const score = calculateResumeScore(data);
  const result = await resumeRepository.update(id, userId, { ...data, score });
  return formatResume(result);
}

export async function deleteResume(id: string, userId: string) {
  const resume = await resumeRepository.findById(id, userId);
  if (!resume) throw AppError.notFound('Resume not found');

  await resumeRepository.delete(id, userId);
  return { success: true };
}

function formatResume(r: any) {
  return {
    ...r,
    skills: typeof r.skills === 'string' && r.skills.startsWith('[') ? JSON.parse(r.skills) : r.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
    certifications: typeof r.certifications === 'string' && r.certifications.startsWith('[') ? JSON.parse(r.certifications) : r.certifications,
  };
}
