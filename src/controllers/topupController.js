// src/controllers/topupController.js
import { getClient } from '../config/db.js';

export async function topUp(req, res, next) {
  const { email } = req.user;
  const { top_up_amount } = req.body;
  const amount = Number(top_up_amount);

  if (isNaN(amount) || amount <= 0)
    return res.status(400).json({
      status: 102,
      message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      data: null,
    });

  const client = await getClient();
  try {
    await client.query('BEGIN');

    await client.query('UPDATE users SET balance = balance + $1 WHERE email = $2', [amount, email]);
    await client.query(
      `INSERT INTO transactions (user_id, transaction_type, amount, description, invoice_number)
       SELECT id, 'TOPUP', $1, 'Top Up balance', 'INV'||EXTRACT(EPOCH FROM NOW()) FROM users WHERE email = $2`,
      [amount, email]
    );

    const newBalance = await client.query('SELECT balance FROM users WHERE email = $1', [email]);

    await client.query('COMMIT');
    res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: { balance: Number(newBalance.rows[0].balance) },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}
