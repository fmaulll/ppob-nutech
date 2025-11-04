// src/routes/topupRoute.js
import express from 'express';
import { topUp } from '../controllers/topupController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', authenticateToken, topUp);

export default router;
