// src/routes/balanceRoute.js
import express from 'express';
import { getBalance } from '../controllers/balanceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/', authenticateToken, getBalance);

export default router;
