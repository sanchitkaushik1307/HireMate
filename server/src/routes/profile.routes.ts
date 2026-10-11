import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import {
  getProfile,
  updateProfile,
  resumeUploadMiddleware,
  uploadResume,
  deleteResume,
  downloadResume,
} from '../controllers/profile.controller';

const router = Router();

// Protected profile management
router.get('/', requireAuth, getProfile);
router.put('/', requireAuth, updateProfile);

// Protected resume management
router.post('/resume', requireAuth, resumeUploadMiddleware, uploadResume);
router.delete('/resume', requireAuth, deleteResume);
router.get('/resume/download', requireAuth, downloadResume);

export default router;
