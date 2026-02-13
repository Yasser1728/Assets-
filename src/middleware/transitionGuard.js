const paymentStateService = require('../services/paymentState.service');
const db = require('../database/connection');

module.exports = async function(req, res, next) {
  try {
    const { attemptId } = req.params;
    const targetState = req.targetState || req.body.targetState;

    if (!targetState) return res.status(400).json({ error: 'Target state missing' });

    // جلب الحالة الحالية من قاعدة البيانات
    const result = await db.query(`
      SELECT status FROM payment_attempts WHERE attempt_id=$1
    `, [attemptId]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Attempt not found' });

    const currentState = result.rows[0].status;
    const isValid = await paymentStateService.validateTransition(currentState, targetState);

    if (!isValid) return res.status(400).json({ error: `Invalid state transition: ${currentState} → ${targetState}` });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
