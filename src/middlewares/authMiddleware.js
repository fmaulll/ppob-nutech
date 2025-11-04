// src/middlewares/authMiddleware.js
import { verifyToken } from '../utils/tokenUtil.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Authorization header format must be: Bearer <token>' });
  }

  const token = parts[1];
  try {
    const payload = verifyToken(token);
    // payload will contain whatever we signed (id, email)
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
