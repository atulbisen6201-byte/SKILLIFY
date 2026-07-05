import { prisma } from '../prisma/client.js';
import { statsRepository } from '../repositories/stats.repository.js';
import { resumeRepository } from '../repositories/resume.repository.js';
import { goalRepository } from '../repositories/goal.repository.js';

export async function getDashboardStats(userId: string) {
  // 1. Resume Score (highest score among user's resumes)
  const resumes = await resumeRepository.findManyByUserId(userId);
  const highestResumeScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.score)) : 0;

  // 2. Completed Courses (Enrollments)
  const enrollmentsCount = await prisma.enrollment.count({
    where: { userId },
  });
  const hoursLearned = enrollmentsCount * 12; // 12 hours per course

  // 3. Goals completed
  const goals = await goalRepository.findManyByUserId(userId);
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  // 4. Skills Matched (Count of unique skills in user resumes + profile)
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const profileSkills = profile?.skills ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
  
  const resumeSkills = resumes.flatMap((r) => {
    try {
      if (r.skills.startsWith('[')) {
        return JSON.parse(r.skills) as string[];
      }
      return r.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    } catch {
      return [];
    }
  });

  const uniqueSkills = new Set([...profileSkills, ...resumeSkills]);
  const skillsMatched = uniqueSkills.size;

  // 5. Career Score (dynamically computed)
  // Base 60, +5 per skill (up to 20), +5 per completed goal (up to 10), +10 if they have a resume
  const hasResumeBonus = resumes.length > 0 ? 10 : 0;
  const skillsBonus = Math.min(skillsMatched * 2, 20);
  const goalsBonus = Math.min(completedGoalsCount * 5, 10);
  const careerScore = Math.min(60 + skillsBonus + goalsBonus + hasResumeBonus, 100);

  // 6. Analytics data (formatting database logs)
  const statsHistory = await statsRepository.getStatsForUser(userId);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const formattedAnalytics = statsHistory.map((s) => {
    const weekday = days[new Date(s.date).getDay()];
    return {
      name: weekday,
      applications: s.applications,
      views: s.views,
      matches: s.matches,
    };
  });

  // Fallback to defaults if history is empty
  const analyticsData = formattedAnalytics.length > 0 ? formattedAnalytics : [
    { name: 'Mon', applications: 0, views: 0, matches: 0 },
    { name: 'Tue', applications: 0, views: 0, matches: 0 },
    { name: 'Wed', applications: 0, views: 0, matches: 0 },
    { name: 'Thu', applications: 0, views: 0, matches: 0 },
    { name: 'Fri', applications: 0, views: 0, matches: 0 },
    { name: 'Sat', applications: 0, views: 0, matches: 0 },
    { name: 'Sun', applications: 0, views: 0, matches: 0 },
  ];

  // 7. Top Career Matches
  const careerMatches = await statsRepository.getCareerMatches(userId);

  return {
    careerScore: `${careerScore}/100`,
    resumeScore: `${highestResumeScore}/100`,
    skillsMatched: String(skillsMatched),
    hoursLearned: `${hoursLearned}h`,
    analyticsData,
    careerMatches: careerMatches.map((cm) => ({
      title: cm.title,
      company: cm.company || 'Unknown',
      match: cm.match,
      salary: cm.salary || 'N/A',
    })),
  };
}

export async function addStatsEntry(userId: string, data: { applications: number; views: number; matches: number }) {
  return statsRepository.recordStats(userId, data);
}
