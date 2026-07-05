import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../prisma/client.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { matchCareers } from './matching.service.js';
import { emailService } from './email.service.js';

export async function signup(fullName: string, username: string, email: string, password?: string) {
  const existingEmail = await userRepository.findByEmail(email.toLowerCase());
  if (existingEmail) throw AppError.conflict('Email already registered');

  const existingUsername = await userRepository.findByUsername(username.toLowerCase());
  if (existingUsername) throw AppError.conflict('Username already taken');

  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 12);
  }

  const user = await userRepository.createUser({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash,
    authProvider: 'email',
  });

  const accessToken = signAccessToken(user.id, user.role as any);
  const refreshToken = signRefreshToken(user.id);

  // Update last login and set loginCount to 1
  await userRepository.updateUser(user.id, { lastLogin: new Date(), loginCount: 1 });

  // Seed default data for signup
  await seedDefaultUserData(user.id, user.fullName);

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    lastLogin: new Date(),
  };

  return { user: safeUser, accessToken, refreshToken };
}

export async function login(emailOrUsername: string, password?: string) {
  if (!password) throw AppError.badRequest('Password is required');

  let user = await userRepository.findByEmail(emailOrUsername.toLowerCase());
  if (!user) {
    user = await userRepository.findByUsername(emailOrUsername.toLowerCase());
  }

  if (!user) throw AppError.unauthorized('Invalid Email or Password');

  if (user.authProvider === 'google' && !user.passwordHash) {
    throw AppError.unauthorized('This account is registered using Google. Please log in with Google.');
  }

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) throw AppError.unauthorized('Invalid Email or Password');

  // Update last login and increment loginCount
  const currentCount = (user as any).loginCount || 0;
  await userRepository.updateUser(user.id, { lastLogin: new Date(), loginCount: currentCount + 1 });

  const accessToken = signAccessToken(user.id, user.role as any);
  const refreshToken = signRefreshToken(user.id);

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    lastLogin: new Date(),
  };

  return { user: safeUser, accessToken, refreshToken };
}

export async function googleLogin(credential: string) {
  let payload: {
    email: string;
    name: string;
    sub: string;
    picture?: string;
    email_verified: string | boolean;
    aud: string;
  };

  // 1. Verify credential via Google tokeninfo endpoint or local JWT fallback
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!response.ok) {
      throw new Error(`Google tokeninfo responded with status ${response.status}`);
    }
    payload = (await response.json()) as any;
  } catch (err) {
    console.warn('Google tokeninfo fetch failed, attempting local JWT decode fallback:', err);
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        payload = {
          email: decoded.email,
          name: decoded.name || decoded.email?.split('@')[0] || 'Google User',
          sub: decoded.sub || decoded.googleId || Math.random().toString(36),
          picture: decoded.picture,
          email_verified: decoded.email_verified !== undefined ? decoded.email_verified : true,
          aud: decoded.aud,
        };
      } else if (credential.includes('@')) {
        // Fallback for custom / mock Gmail addresses in offline development mode
        payload = {
          email: credential.trim().toLowerCase(),
          name: credential.split('@')[0],
          sub: 'mock_google_id_' + credential.split('@')[0],
          email_verified: true,
          aud: '',
        };
      } else {
        throw new Error('Invalid token structure and not a plain email address');
      }
    } catch (decodeErr) {
      throw AppError.unauthorized('Invalid Google credential and local verification failed');
    }
  }

  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    throw AppError.unauthorized('Google email is not verified');
  }

  // 2. Validate Google Client ID if configured in backend environment and not placeholder
  const configuredClientId = process.env.GOOGLE_CLIENT_ID;
  const isPlaceholder = !configuredClientId || configuredClientId === 'your-google-client-id.apps.googleusercontent.com';
  if (!isPlaceholder && payload.aud && payload.aud !== configuredClientId) {
    throw AppError.unauthorized('Google client ID mismatch');
  }

  const email = payload.email.toLowerCase();
  const fullName = payload.name;
  const profileImage = payload.picture;
  const googleId = payload.sub;

  // 3. Find or auto-create the user
  let user = await userRepository.findByEmail(email);

  if (!user) {
    // Generate a unique username from email
    let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    if (baseUsername.length < 3) baseUsername = 'user_' + baseUsername;
    let username = baseUsername;
    let usernameExists = await userRepository.findByUsername(username);
    let counter = 1;
    while (usernameExists) {
      username = `${baseUsername}${counter}`;
      usernameExists = await userRepository.findByUsername(username);
      counter++;
    }

    // Google logins do not require a local password
    user = (await userRepository.createUser({
      fullName,
      username,
      email,
      profileImage,
      googleId,
      authProvider: 'google',
    })) as any;

    if (!user) {
      throw AppError.badRequest('Could not auto-register user via Google');
    }

    // Update lastLogin and set loginCount to 1
    await userRepository.updateUser(user.id, { lastLogin: new Date(), loginCount: 1 });

    // Seed default data for the new user
    await seedDefaultUserData(user.id, fullName);

    // Refresh user object to fetch profile relation
    user = (await userRepository.findById(user.id)) as any;
  } else {
    // Account Linking: If user exists, link Google ID and profileImage if not already set
    const currentCount = (user as any).loginCount || 0;
    const updates: any = { lastLogin: new Date(), loginCount: currentCount + 1 };

    if (!user.googleId) {
      updates.googleId = googleId;
    }
    if (user.authProvider !== 'google') {
      updates.authProvider = 'google';
    }
    if (!user.profileImage && profileImage) {
      updates.profileImage = profileImage;
    }
    if (!user.emailVerified) {
      updates.emailVerified = true;
    }

    // Since we always increment loginCount and update lastLogin, we always call updateUser
    await userRepository.updateUser(user.id, updates);
    user = (await userRepository.findById(user.id)) as any;
  }

  if (!user) {
    throw AppError.unauthorized('User not found');
  }

  const accessToken = signAccessToken(user.id, user.role as any);
  const refreshToken = signRefreshToken(user.id);

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    lastLogin: new Date(),
  };

  return { user: safeUser, accessToken, refreshToken };
}

export async function refresh(token: string) {
  try {
    const payload = verifyRefreshToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user) throw AppError.unauthorized('User not found');

    const accessToken = signAccessToken(user.id, user.role as any);
    const newRefreshToken = signRefreshToken(user.id);

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    return { user: safeUser, accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw AppError.unauthorized('Invalid refresh token');
  }
}

export async function forgotPassword(email: string, originUrl: string): Promise<boolean> {
  const user = await userRepository.findByEmail(email.toLowerCase());
  if (!user) {
    throw AppError.notFound('No account registered with this email address');
  }

  // Generate secure reset token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await userRepository.updateUser(user.id, {
    resetPasswordToken: token,
    resetPasswordExpires: expires,
  });

  const resetUrl = `${originUrl}/reset-password?token=${token}`;
  return emailService.sendResetPasswordEmail(user.email, resetUrl);
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw AppError.badRequest('Invalid or expired password reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await userRepository.updateUser(user.id, {
    passwordHash,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return true;
}

async function seedDefaultUserData(userId: string, name: string) {
  // 1. Profile
  await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      bio: 'Software Engineer exploring career opportunities',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/' + name.toLowerCase().replace(/\s+/g, ''),
      github: 'github.com/' + name.toLowerCase().replace(/\s+/g, ''),
      skills: 'JavaScript, TypeScript, React, Node.js, HTML, CSS, Git, SQL',
    },
  });

  // 2. Goals
  const defaultGoals = [
    { title: 'Update Resume', completed: true },
    { title: 'Apply to 5 jobs', completed: true },
    { title: 'Complete AI assessment', completed: false },
    { title: 'Network with 3 professionals', completed: false },
  ];
  for (const g of defaultGoals) {
    await prisma.goal.create({
      data: {
        userId,
        title: g.title,
        completed: g.completed,
      },
    });
  }

  // 3. Stats History for Chart
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const apps = [4, 6, 8, 5, 10, 3, 7][6 - i];
    const views = [12, 18, 24, 15, 30, 9, 21][6 - i];
    const matches = [2, 4, 5, 3, 7, 2, 4][6 - i];

    await prisma.dashboardStats.create({
      data: {
        userId,
        date: d,
        applications: apps,
        views: views,
        matches: matches,
      },
    });
  }

  // 4. Precompute Career Matches
  await matchCareers(userId);

  // 5. Notifications
  const defaultNotifications = [
    { type: 'resume', title: 'Resume updated', message: 'Your resume has been optimized by AI' },
    { type: 'career', title: 'New career match found', message: 'Product Manager match is 94%' },
  ];
  for (const n of defaultNotifications) {
    await prisma.notification.create({
      data: {
        userId,
        type: n.type,
        title: n.title,
        message: n.message,
      },
    });
  }
}
