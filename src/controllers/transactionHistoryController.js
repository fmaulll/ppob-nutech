// src/controllers/transactionHistoryController.js
import { query } from '../config/db.js';

export async function getHistory(req, res, next) {
  try {
    const { email } = req.user;
    const { limit, offset } = req.query;
    const user = await query('SELECT id FROM users WHERE email = $1', [email]);
    const userId = user.rows[0].id;

    let q = 'SELECT invoice_number, transaction_type, description, amount as total_amount, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC';
    const params = [userId];
    if (limit) {
      q += ' LIMIT $2';
      params.push(limit);
    }
    if (offset) {
      q += limit ? ' OFFSET $3' : ' OFFSET $2';
      params.push(offset);
    }

    const result = await query(q, params);
    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: Number(offset) || 0,
        limit: Number(limit) || result.rows.length,
        records: result.rows,
      },
    });
  } catch (err) {
    next(err);
  }
}
