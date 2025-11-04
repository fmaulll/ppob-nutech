// src/controllers/bannerController.js
import { query } from '../config/db.js';

export async function getBanners(req, res, next) {
  try {
    const result = await query('SELECT banner_name, banner_image, description FROM banners');
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}
