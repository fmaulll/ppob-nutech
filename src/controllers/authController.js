// src/controllers/authController.js
import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import { generateToken } from '../utils/tokenUtil.js';

const SALT_ROUNDS = 10;

function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req, res, next) {
  const { email, first_name, last_name, password } = req.body;
  try {
    if (!emailValid(email))
      return res.status(400).json({ status: 102, message: 'Paramter email tidak sesuai format', data: null });
    if (!password || password.length < 8)
      return res.status(400).json({ status: 102, message: 'Password minimal 8 karakter', data: null });

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ status: 102, message: 'Email sudah terdaftar', data: null });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await query(
      'INSERT INTO users (email, first_name, last_name, password, balance) VALUES ($1, $2, $3, $4, 0)',
      [email, first_name, last_name, hashed]
    );

    res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!emailValid(email))
      return res.status(400).json({ status: 102, message: 'Paramter email tidak sesuai format', data: null });
    if (!password || password.length < 8)
      return res.status(400).json({ status: 102, message: 'Password minimal 8 karakter', data: null });

    const result = await query('SELECT id, email, password FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });

    const token = generateToken({ email: user.email }, { expiresIn: '12h' });
    res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: { token },
    });
  } catch (err) {
    next(err);
  }
}
