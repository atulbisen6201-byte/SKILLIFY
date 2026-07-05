import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';

const courseInclude = {
  skill: { select: { id: true, title: true, description: true } },
} as const;

export async function listCourses() {
  return prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: courseInclude,
  });
}

export async function getCourseById(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: courseInclude,
  });
  if (!course) throw AppError.notFound('Course not found');
  return course;
}

export async function createCourse(title: string, description: string | undefined, skillId: string) {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw AppError.badRequest('Skill not found');

  return prisma.course.create({
    data: { title, description, skillId },
    include: courseInclude,
  });
}
