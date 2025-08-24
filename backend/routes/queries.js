import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/authMiddleware.js';

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  stats
} from '../controllers/queryController.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('documentId').optional().isString().withMessage('Document ID must be a string')
  ],
  create
);

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getOne);

router.put(
  '/:id',
  authenticate,
  [
    body('answer').optional().trim().notEmpty().withMessage('Answer cannot be empty')
  ],
  update
);

router.delete('/:id', authenticate, remove);
router.get('/stats/overview', authenticate, stats);

export default router;
