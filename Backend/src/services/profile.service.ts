import { userRepository } from '../repositories/user.repository.js';
import { prisma } from '../prisma/client.js';

export async function getProfile(userId: string) {
  let profile = await userRepository.findProfileByUserId(userId);
  if (!profile) {
    // Auto-create a default profile if one doesn't exist yet
    profile = await userRepository.upsertProfile(userId, {
      bio: '',
      skills: '',
    });
  }
  return profile;
}

export async function updateProfile(
  userId: string,
  data: {
    bio?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    skills?: string | string[];
  }
) {
  const skillsStr = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills;
  const profile = await userRepository.upsertProfile(userId, {
    ...data,
    skills: skillsStr,
  });

  // Recalculate profile completion
  const resume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { education: true, experience: true }
  });

  let completion = 20; // Base score
  if (resume) {
    const res = resume as any;
    if (res.fullName) completion += 10;
    if (res.email) completion += 10;
    if (res.phone) completion += 10;
    if (res.location) completion += 5;
    if (res.summary) completion += 10;
    
    const skillsCount = typeof res.skills === 'string'
      ? (res.skills.startsWith('[') ? JSON.parse(res.skills).length : res.skills.split(',').filter(Boolean).length)
      : (Array.isArray(res.skills) ? res.skills.length : 0);
    if (skillsCount > 0) completion += 15;
    if (res.education && res.education.length > 0) completion += 10;
    if (res.experience && res.experience.length > 0) completion += 10;
  }

  // Profile additions
  if (profile.bio) completion += 5;
  if (profile.linkedin) completion += 5;

  await prisma.user.update({
    where: { id: userId },
    data: {
      profileCompletion: Math.min(completion, 100),
    }
  });

  return profile;
}
