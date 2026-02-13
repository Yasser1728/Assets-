const piService = require('../services/piMock.service');
const paymentState = require('../services/paymentState.service');
const db = require('../database/connection');

exports.broadcast = async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await db.query(`SELECT * FROM payment_attempts WHERE attempt_id=$1`, [attemptId]);

  const tx = await piService.broadcast({ amount: attempt.rows[0].amount, wallet: attempt.rows[0].user_id });

  await db.query(`
    INSERT INTO blockchain_transactions (attempt_id, pi_tx_hash, network, status, broadcasted_at)
    VALUES ($1,$2,'mainnet','broadcasted',NOW())
  `, [attemptId, tx.fake_tx_hash]);

  await paymentState.updateState(attempt.rows[0], 'broadcasted', 'Transaction broadcasted to Pi Network');
  res.json({ txHash: tx.fake_tx_hash });
};
