// src/routes/transactionRoute.js
import express from 'express';
import { makeTransaction } from '../controllers/transactionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', authenticateToken, makeTransaction);

export default router;
