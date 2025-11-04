// src/controllers/balanceController.js
import { query } from '../config/db.js';

export async function getBalance(req, res, next) {
  try {
    const { email } = req.user;
    const result = await query('SELECT balance FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });

    res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: { balance: Number(user.balance) },
    });
  } catch (err) {
    next(err);
  }
}
