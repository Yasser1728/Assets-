const db = require('../database/connection');

exports.getBalance = async (accountId) => {

  const result = await db.query(`
    SELECT 
      COALESCE(SUM(credit),0) - COALESCE(SUM(debit),0) AS balance
    FROM ledger_entries
    WHERE account_id = $1
  `, [accountId]);

  return result.rows[0].balance;
};
