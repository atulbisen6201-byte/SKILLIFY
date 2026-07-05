import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';

const userPublicSelect = {
  id: true,
  fullName: true,
  username: true,
  email: true,
  role: true,
  profileImage: true,
  authProvider: true,
  emailVerified: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userPublicSelect,
  });
  if (!user) throw AppError.notFound('User not found');
  return user;
}

export async function deleteAccount(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
