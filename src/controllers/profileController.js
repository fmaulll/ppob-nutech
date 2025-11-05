// src/controllers/profileController.js
import { query } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// setup file upload
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      const err = new Error('Format Image tidak sesuai');
      err.statusCode = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

export async function getProfile(req, res, next) {
  try {
    const { email } = req.user;
    const result = await query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });

    res.status(200).json({ status: 0, message: 'Sukses', data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { email } = req.user;
    const { first_name, last_name } = req.body;

    await query('UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3', [
      first_name,
      last_name,
      email,
    ]);

    const result = await query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1', [email]);
    res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadProfileImage(req, res, next) {
  try {
    const { email } = req.user;
    const fileUrl = `${process.env.URL}/uploads/${req.file.filename}`;

    await query('UPDATE users SET profile_image = $1 WHERE email = $2', [fileUrl, email]);
    const result = await query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1', [email]);

    res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}
