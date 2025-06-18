import express from 'express';
import { generateLesson } from '../controllers/lessonsController.js';

const router = express.Router();

router.post('/generate-lesson', generateLesson);

export default router;
