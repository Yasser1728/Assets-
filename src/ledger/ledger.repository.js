const db = require('../database/connection');

class LedgerRepository {

  async createTransaction(type, referenceId) {
    return db.query(
      `INSERT INTO ledger_transactions 
       (transaction_type, reference_id, status) 
       VALUES ($1,$2,'pending') RETURNING *`,
      [type, referenceId]
    );
  }

  async insertEntries(entries) {

    for (const e of entries) {
      await db.query(
        `INSERT INTO ledger_entries 
         (transaction_id, account_id, debit, credit)
         VALUES ($1,$2,$3,$4)`,
        [e.transactionId, e.accountId, e.debit, e.credit]
      );
    }
  }

}

module.exports = new LedgerRepository();
