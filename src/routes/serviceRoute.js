// src/routes/serviceRoute.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getServices } from '../controllers/serviceController.js';

const router = express.Router();
router.get('/', authenticateToken, getServices);
export default router;
