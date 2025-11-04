// src/controllers/serviceController.js
import { query } from '../config/db.js';

export async function getServices(req, res, next) {
  try {
    const result = await query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services'
    );
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}
