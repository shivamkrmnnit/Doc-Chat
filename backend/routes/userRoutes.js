import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { profile, postHistory, getHistory, deleteHistory } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticate, profile);
router.post('/history', authenticate, postHistory);
router.get('/history/:userId', authenticate, getHistory);
router.delete('/history/:id', authenticate, deleteHistory);

export default router;
