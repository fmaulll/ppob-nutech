// src/utils/tokenUtil.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function generateToken(payload, opts = { expiresIn: '1d' }) {
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
