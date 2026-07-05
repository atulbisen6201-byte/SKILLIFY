import { prisma } from '../prisma/client.js';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
  }

  async createUser(data: {
    fullName: string;
    username: string;
    email: string;
    passwordHash?: string | null;
    profileImage?: string | null;
    googleId?: string | null;
    authProvider?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          passwordHash: data.passwordHash || null,
          profileImage: data.profileImage || null,
          googleId: data.googleId || null,
          authProvider: data.authProvider || 'email',
          role: 'USER',
          emailVerified: data.authProvider === 'google',
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          bio: '',
          skills: '',
        },
      });

      return { ...user, profile };
    });
  }

  async updateUser(
    id: string,
    data: {
      fullName?: string;
      profileImage?: string | null;
      passwordHash?: string | null;
      googleId?: string | null;
      authProvider?: string;
      lastLogin?: Date | null;
      emailVerified?: boolean;
      resetPasswordToken?: string | null;
      resetPasswordExpires?: Date | null;
      resumeUrl?: string | null;
      resumeParsedData?: string | null;
      loginCount?: number;
      profileCompletion?: number;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findProfileByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async upsertProfile(
    userId: string,
    data: {
      bio?: string;
      location?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
      skills?: string;
    }
  ) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

export const userRepository = new UserRepository();
