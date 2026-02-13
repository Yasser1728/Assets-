const db = require('../database/connection');
const paymentState = require('../services/paymentState.service');
const ledgerService = require('../services/ledger.service');

exports.createAttempt = async (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod, idempotencyKey } = req.body;

  const attempt = await db.query(`
    INSERT INTO payment_attempts (order_id, payment_method, status, idempotency_key)
    VALUES ($1,$2,'pending',$3) RETURNING *
  `, [orderId, paymentMethod, idempotencyKey]);

  await paymentState.logTransition({
    attemptId: attempt.rows[0].attempt_id,
    fromState: null,
    toState: 'pending',
    reason: 'Attempt created'
  });

  res.json(attempt.rows[0]);
};

exports.serverApprove = async (req, res) => {
  const { attemptId } = req.params;

  const attempt = await db.query(`SELECT * FROM payment_attempts WHERE attempt_id=$1`, [attemptId]);
  if (!attempt.rows[0]) return res.status(404).send('Attempt not found');

  await ledgerService.executeTransaction({
    type: 'ESCROW_LOCK',
    referenceId: attemptId,
    params: { walletId: attempt.rows[0].user_id, amount: attempt.rows[0].amount }
  });

  await paymentState.updateState(attempt.rows[0], 'server_approved', 'Funds locked in Escrow');
  res.json({ status: 'server_approved' });
};
