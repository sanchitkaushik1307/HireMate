import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Protected dashboard overview endpoint
router.get('/overview', requireAuth, getDashboardOverview);

export default router;
