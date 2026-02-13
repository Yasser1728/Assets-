const db = require("../database"); // عدل حسب ORM أو Query Builder

async function createPayout(data) {
  return db.query(
    `INSERT INTO payout_transactions 
    (user_uid, amount, memo, status)
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [data.user_uid, data.amount, data.memo, "initiated"]
  );
}

async function updateStatus(id, status, piPaymentId) {
  return db.query(
    `UPDATE payout_transactions 
     SET status=$1, pi_payment_id=$2 
     WHERE id=$3`,
    [status, piPaymentId, id]
  );
}

module.exports = {
  createPayout,
  updateStatus
};
