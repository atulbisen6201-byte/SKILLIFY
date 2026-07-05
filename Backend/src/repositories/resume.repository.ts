import { prisma } from '../prisma/client.js';

export class ResumeRepository {
  async findById(id: string, userId: string) {
    return prisma.resume.findFirst({
      where: { id, userId },
      include: {
        education: true,
        experience: true,
        projects: true,
      },
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      include: {
        education: true,
        experience: true,
        projects: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    return prisma.resume.create({
      data: {
        userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location || null,
        linkedin: data.linkedin || null,
        website: data.website || null,
        summary: data.summary || null,
        skills: typeof data.skills === 'string' ? data.skills : JSON.stringify(data.skills),
        certifications: typeof data.certifications === 'string' ? data.certifications : JSON.stringify(data.certifications || []),
        score: data.score || 0,
        education: {
          create: (data.education || []).map((e: any) => ({
            school: e.school,
            degree: e.degree,
            field: e.field || null,
            startDate: e.startDate || null,
            endDate: e.endDate || null,
            gpa: e.gpa || null,
          })),
        },
        experience: {
          create: (data.experience || []).map((e: any) => ({
            company: e.company,
            position: e.position,
            location: e.location || null,
            startDate: e.startDate || null,
            endDate: e.endDate || null,
            current: e.current || false,
            description: e.description || null,
          })),
        },
        projects: {
          create: (data.projects || []).map((p: any) => ({
            name: p.name,
            description: p.description || null,
            technologies: p.technologies || null,
            link: p.link || null,
          })),
        },
      },
      include: {
        education: true,
        experience: true,
        projects: true,
      },
    });
  }

  async update(id: string, _userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // Clear existing nested entities
      await tx.education.deleteMany({ where: { resumeId: id } });
      await tx.experience.deleteMany({ where: { resumeId: id } });
      await tx.project.deleteMany({ where: { resumeId: id } });

      return tx.resume.update({
        where: { id },
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          location: data.location || null,
          linkedin: data.linkedin || null,
          website: data.website || null,
          summary: data.summary || null,
          skills: typeof data.skills === 'string' ? data.skills : JSON.stringify(data.skills),
          certifications: typeof data.certifications === 'string' ? data.certifications : JSON.stringify(data.certifications || []),
          score: data.score || 0,
          education: {
            create: (data.education || []).map((e: any) => ({
              school: e.school,
              degree: e.degree,
              field: e.field || null,
              startDate: e.startDate || null,
              endDate: e.endDate || null,
              gpa: e.gpa || null,
            })),
          },
          experience: {
            create: (data.experience || []).map((e: any) => ({
              company: e.company,
              position: e.position,
              location: e.location || null,
              startDate: e.startDate || null,
              endDate: e.endDate || null,
              current: e.current || false,
              description: e.description || null,
            })),
          },
          projects: {
            create: (data.projects || []).map((p: any) => ({
              name: p.name,
              description: p.description || null,
              technologies: p.technologies || null,
              link: p.link || null,
            })),
          },
        },
        include: {
          education: true,
          experience: true,
          projects: true,
        },
      });
    });
  }

  async delete(id: string, userId: string) {
    return prisma.resume.deleteMany({
      where: { id, userId },
    });
  }
}

export const resumeRepository = new ResumeRepository();
