// src/routes/transactionHistoryRoute.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getHistory } from '../controllers/transactionHistoryController.js';

const router = express.Router();
router.get('/history', authenticateToken, getHistory);
export default router;
