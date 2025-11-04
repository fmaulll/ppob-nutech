// src/routes/profileRoute.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, uploadProfileImage, upload } from '../controllers/profileController.js';

const router = express.Router();
router.get('/', authenticateToken, getProfile);
router.put('/update', authenticateToken, updateProfile);
router.put('/image', authenticateToken, upload.single('file'), uploadProfileImage);

export default router;
