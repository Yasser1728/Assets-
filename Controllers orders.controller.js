const db = require('../database/connection');
const paymentState = require('../services/paymentState.service');

exports.createOrder = async (req, res) => {
  const { userId, storeId, amount, currency } = req.body;

  const order = await db.query(`
    INSERT INTO payment_orders (user_id, store_id, amount, currency, status)
    VALUES ($1,$2,$3,$4,'created') RETURNING *
  `, [userId, storeId, amount, currency]);

  await paymentState.logTransition({
    orderId: order.rows[0].order_id,
    fromState: null,
    toState: 'created',
    reason: 'Order created'
  });

  res.json(order.rows[0]);
};
