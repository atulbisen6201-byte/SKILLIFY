import { prisma } from '../prisma/client.js';
import { statsRepository } from '../repositories/stats.repository.js';
import { resumeRepository } from '../repositories/resume.repository.js';

interface CareerConfig {
  title: string;
  company: string;
  skills: string[];
  salary: string;
}

const CAREERS: CareerConfig[] = [
  {
    title: 'Product Manager',
    company: 'Tech Giants',
    skills: ['Product Strategy', 'Agile', 'UX Design', 'Roadmapping', 'Product Design', 'Project Management', 'Leadership', 'TypeScript'],
    salary: '$120K - $180K',
  },
  {
    title: 'Full Stack Developer',
    company: 'SaaS Platforms',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git', 'PostgreSQL', 'SQL', 'REST API', 'Docker'],
    salary: '$100K - $150K',
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Scale',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Python', 'Bash', 'Linux', 'Go', 'Prometheus'],
    salary: '$110K - $170K',
  },
  {
    title: 'Data Analyst',
    company: 'Analytics Co',
    skills: ['Python', 'SQL', 'PostgreSQL', 'Excel', 'Tableau', 'Statistics', 'Data Analysis'],
    salary: '$80K - $120K',
  },
  {
    title: 'UX Designer',
    company: 'Design Studios',
    skills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'Product Design', 'React'],
    salary: '$90K - $140K',
  },
];

export async function matchCareers(userId: string) {
  // 1. Get user profile skills
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const profileSkills = profile?.skills ? profile.skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [];

  // 2. Get user resume skills
  const resumes = await resumeRepository.findManyByUserId(userId);
  const resumeSkills = resumes.flatMap((r) => {
    try {
      let parsed: string[] = [];
      if (r.skills.startsWith('[')) {
        parsed = JSON.parse(r.skills) as string[];
      } else {
        parsed = r.skills.split(',').map((s: string) => s.trim());
      }
      return parsed.map((s) => s.toLowerCase());
    } catch {
      return [];
    }
  });

  const userSkills = new Set([...profileSkills, ...resumeSkills]);

  // 3. Clear previous matches
  await statsRepository.clearCareerMatches(userId);

  // 4. Calculate matching percentage
  const matches = CAREERS.map((career) => {
    const requiredSkills = career.skills.map((s) => s.toLowerCase());
    const matched = requiredSkills.filter((s) => userSkills.has(s));
    
    // Calculate percentage
    const matchPercentage = requiredSkills.length > 0 
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 0;

    // Minimum match of 30% for realism
    const finalMatch = Math.max(matchPercentage, 30);

    return {
      title: career.title,
      company: career.company,
      match: finalMatch,
      salary: career.salary,
    };
  });

  // 5. Store in database
  for (const m of matches) {
    await statsRepository.createCareerMatch(userId, m);
  }

  return matches;
}
