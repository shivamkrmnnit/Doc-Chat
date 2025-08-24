import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

import {
  upload as uploadDoc,
  list,
  getOne,
  remove,
  download
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/upload', authenticate, upload.array('documents', 10), uploadDoc);
router.get('/', authenticate, list);
router.get('/:id', authenticate, getOne);
router.delete('/:id', authenticate, remove);
router.get('/:id/download', authenticate, download);

export default router;
