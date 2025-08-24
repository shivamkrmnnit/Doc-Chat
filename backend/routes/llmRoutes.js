import express  from "express";
import {queryLLM} from '../controllers/llmControllers.js'
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/query', authenticate, queryLLM);

export default router;
