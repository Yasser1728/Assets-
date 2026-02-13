const db = require('../database/connection');

module.exports = async function(req, res, next) {
  try {
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotency_key;
    if (!idempotencyKey) return res.status(400).json({ error: 'Idempotency key required' });

    const existing = await db.query(`
      SELECT * FROM idempotency_keys 
      WHERE idempotency_key=$1
    `, [idempotencyKey]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Duplicate request', 
        previousResult: existing.rows[0].result || null 
      });
    }

    // تسجيل المفتاح قبل المتابعة
    await db.query(`
      INSERT INTO idempotency_keys (idempotency_key, created_at)
      VALUES ($1,NOW())
    `, [idempotencyKey]);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
