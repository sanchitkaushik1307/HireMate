import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getProfileByUserId,
  upsertProfile,
  saveResumeFile,
  deleteResumeFile,
  getResumeFilePath,
  UPLOAD_DIR,
} from '../services/profile.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Temp upload storage before magic byte verification
const tempStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const tempDir = path.join(UPLOAD_DIR, 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `upload-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

export const resumeUploadMiddleware = multer({
  storage: tempStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const allowedExts = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX documents are accepted for resume upload.'));
    }
  },
}).single('resume');

/** GET /api/profile */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = await getProfileByUserId(user.id, user);
    res.json(data);
  } catch (error) {
    console.error('[ProfileController] Error getting profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
}

/** PUT /api/profile */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await upsertProfile(user.id, req.body, user);
    res.json(result);
  } catch (error) {
    console.error('[ProfileController] Error updating profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
}

/** POST /api/profile/resume */
export async function uploadResume(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No resume file provided' });
      return;
    }

    const resumeRecord = await saveResumeFile(user.id, {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    // Fetch updated completion score
    const updatedData = await getProfileByUserId(user.id, user);

    res.json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resumeRecord.id,
        fileName: resumeRecord.fileName,
        fileSize: resumeRecord.fileSize,
        mimeType: resumeRecord.mimeType,
        createdAt: resumeRecord.createdAt,
      },
      completion: updatedData.completion,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to process resume file';
    console.error('[ProfileController] Resume upload failed:', msg);
    res.status(400).json({ error: msg });
  }
}

/** DELETE /api/profile/resume */
export async function deleteResume(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const success = await deleteResumeFile(user.id);
    if (!success) {
      res.status(404).json({ error: 'No resume found to delete' });
      return;
    }

    const updatedData = await getProfileByUserId(user.id, user);

    res.json({
      message: 'Resume removed successfully',
      completion: updatedData.completion,
    });
  } catch (error) {
    console.error('[ProfileController] Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
}

/** GET /api/profile/resume/download */
export async function downloadResume(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const resumeInfo = await getResumeFilePath(user.id);
    if (!resumeInfo) {
      res.status(404).json({ error: 'Resume file not found' });
      return;
    }

    res.setHeader('Content-Type', resumeInfo.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(resumeInfo.fileName)}"`
    );
    res.sendFile(resumeInfo.filePath);
  } catch (error) {
    console.error('[ProfileController] Error sending resume file:', error);
    res.status(500).json({ error: 'Failed to access resume file' });
  }
}
