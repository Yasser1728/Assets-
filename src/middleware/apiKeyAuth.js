const db = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = async function(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: 'API Key required' });

    // جلب hash من قاعدة البيانات
    const result = await db.query(`SELECT * FROM api_keys WHERE active=true`);
    const validKey = result.rows.find(r => bcrypt.compareSync(apiKey, r.api_key_hash));

    if (!validKey) return res.status(403).json({ error: 'Invalid API Key' });

    // إدراج بيانات التاجر في req
    req.merchant = { storeId: validKey.merchant_id, apiKeyId: validKey.api_key_id };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
