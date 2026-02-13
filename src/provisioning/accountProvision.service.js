const db = require('../database/connection');
const accountTypes = require('./accountProvision.types');
const rules = require('./accountProvision.rules');

class AccountProvisionService {

  async provisionUserAccounts(userId) {

    rules.validateProvision(accountTypes);

    for (const type of accountTypes) {

      await db.query(`
        INSERT INTO ledger_accounts (user_id, account_type)
        VALUES ($1,$2)
      `, [userId, type]);

    }

  }

}

module.exports = new AccountProvisionService();
