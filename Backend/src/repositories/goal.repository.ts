import { prisma } from '../prisma/client.js';

export class GoalRepository {
  async findManyByUserId(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, title: string) {
    return prisma.goal.create({
      data: {
        userId,
        title,
        completed: false,
      },
    });
  }

  async update(id: string, userId: string, data: { title?: string; completed?: boolean }) {
    return prisma.goal.updateMany({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.goal.deleteMany({
      where: { id, userId },
    });
  }
}

export const goalRepository = new GoalRepository();
