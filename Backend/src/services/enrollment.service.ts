import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';

const enrollmentInclude = {
  course: {
    include: {
      skill: { select: { id: true, title: true } },
    },
  },
} as const;

export async function enrollUser(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw AppError.notFound('Course not found');

  try {
    return await prisma.enrollment.create({
      data: { userId, courseId },
      include: enrollmentInclude,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw AppError.conflict('Already enrolled in this course');
    }
    throw e;
  }
}

export async function listEnrollmentsForUser(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: enrollmentInclude,
  });
}
