import { prisma } from '../prisma/client.js';

export class StatsRepository {
  async getStatsForUser(userId: string) {
    return prisma.dashboardStats.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async getCareerMatches(userId: string) {
    return prisma.careerMatch.findMany({
      where: { userId },
      orderBy: { match: 'desc' },
    });
  }

  async clearCareerMatches(userId: string) {
    return prisma.careerMatch.deleteMany({
      where: { userId },
    });
  }

  async createCareerMatch(
    userId: string,
    data: { title: string; company?: string; match: number; salary?: string }
  ) {
    return prisma.careerMatch.create({
      data: {
        userId,
        title: data.title,
        company: data.company || null,
        match: data.match,
        salary: data.salary || null,
      },
    });
  }

  async recordStats(userId: string, data: { applications: number; views: number; matches: number }) {
    return prisma.dashboardStats.create({
      data: {
        userId,
        applications: data.applications,
        views: data.views,
        matches: data.matches,
      },
    });
  }
}

export const statsRepository = new StatsRepository();
