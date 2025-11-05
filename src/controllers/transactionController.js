// src/controllers/transactionController.js
import { getClient, query } from '../config/db.js';

export async function makeTransaction(req, res, next) {
  const { email } = req.user;
  const { service_code } = req.body;

  if (!service_code)
    return res.status(400).json({ status: 102, message: 'Service atau Layanan tidak ditemukan', data: null });

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const svc = await client.query('SELECT * FROM services WHERE service_code = $1', [service_code]);
    if (svc.rows.length === 0)
      return res.status(400).json({ status: 102, message: 'Service atau Layanan tidak ditemukan', data: null });

    const { service_name, service_tariff } = svc.rows[0];

    const userRes = await client.query('SELECT id, balance FROM users WHERE email = $1 FOR UPDATE', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
    if (Number(user.balance) < Number(service_tariff))
      return res.status(400).json({ status: 102, message: 'Saldo tidak mencukupi', data: null });

    const newBalance = Number(user.balance) - Number(service_tariff);
    const invoice_number = `INV${Date.now()}`;

    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, user.id]);
    await client.query(
      `INSERT INTO transactions (user_id, description, transaction_type, amount, invoice_number, created_on)
       VALUES ($1, $2, 'PAYMENT', $3, $4, NOW())`,
      [user.id, service_name, service_tariff, invoice_number]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number,
        service_code,
        service_name,
        transaction_type: 'PAYMENT',
        total_amount: Number(service_tariff),
        created_on: new Date().toISOString(),
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}
