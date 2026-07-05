import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs/promises';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as resumeService from '../services/resume.service.js';
import { prisma } from '../prisma/client.js';

import { parseResume } from '../services/aiResumeParser.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.createResume(req.userId!, req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: { resume } });
});

export const upload = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'FileName and FileData (base64) are required' });
    return;
  }

  // Extract extension and validate
  const ext = path.extname(fileName).toLowerCase().substring(1);
  if (!['pdf', 'doc', 'docx'].includes(ext)) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Unsupported file type. Allowed: PDF, DOC, DOCX' });
    return;
  }

  // Decode base64 to buffer
  const buffer = Buffer.from(fileData, 'base64');

  // Validate size (10 MB maximum)
  if (buffer.length > 10 * 1024 * 1024) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'File size exceeds the 10MB limit.' });
    return;
  }
  if (buffer.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'File is empty.' });
    return;
  }

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  // Generate a unique filename to prevent collisions
  const uniqueFileName = `${req.userId}-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(uploadsDir, uniqueFileName);

  // Write file to disk
  await fs.writeFile(filePath, buffer);

  // Create local file URL (e.g. /uploads/uniqueFileName)
  const fileUrl = `/uploads/${uniqueFileName}`;

  // 1. Run AI Resume Parser on the buffer
  const parsedResume = await parseResume(buffer, ext);

  // 2. Map the parsed resume to the database-compatible structure
  const dbFormattedData = {
    fullName: parsedResume.fullName || 'User Name',
    email: parsedResume.email || '',
    phone: parsedResume.phone || '',
    location: parsedResume.location || null,
    linkedin: parsedResume.linkedin || null,
    website: parsedResume.website || parsedResume.portfolio || null,
    summary: parsedResume.summary || null,
    skills: parsedResume.skills,
    certifications: (parsedResume.certifications || []).map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      link: c.credentialId || '',
    })),
    education: (parsedResume.education || []).map((e) => ({
      school: e.institution,
      degree: e.degree,
      field: e.degree, // Fallback to degree since standard schema education doesn't separate field
      startDate: e.startDate,
      endDate: e.endDate,
      gpa: e.grade,
    })),
    experience: (parsedResume.experience || []).map((e) => ({
      company: e.company,
      position: e.position,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.currentlyWorking || false,
      description: e.description,
    })),
    projects: (parsedResume.projects || []).map((p) => ({
      name: p.title,
      description: p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || '',
      link: p.liveUrl || p.github || '',
    })),
  };

  // 3. Create or update the resume and save details in the database
  const resumeResult = await resumeService.createResume(req.userId!, dbFormattedData);

  // 4. Force update the user's resumeUrl and the raw parsed JSON
  await prisma.user.update({
    where: { id: req.userId! },
    data: {
      resumeUrl: fileUrl,
      resumeParsedData: JSON.stringify(parsedResume),
    },
  });

  // 5. Query the updated user to get profile completion percentage
  const updatedUser = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { profileCompletion: true },
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Resume parsed and uploaded successfully',
    data: {
      resumeUrl: fileUrl,
      parsedResume: parsedResume,
      profileCompletion: updatedUser?.profileCompletion || 0,
      resumeScore: resumeResult.score || 0,
    },
  });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const resumes = await resumeService.listResumesForUser(req.userId!);
  res.json({ success: true, data: { resumes } });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.getResumeById(req.params.id!, req.userId!);
  res.json({ success: true, data: { resume } });
});

export const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const result = await resumeService.deleteResume(req.params.id!, req.userId!);
  res.json({ success: true, data: result });
});
