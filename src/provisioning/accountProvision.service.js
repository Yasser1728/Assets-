const db = require('../database/connection');
const accountTypes = require('./accountProvision.types');

class AccountProvisionService {

  async provisionUserAccounts(walletId) {

    const values = accountTypes
      .map(type => `(${walletId}, '${type}')`)
      .join(',');

    await db.query(`
      INSERT INTO ledger_accounts (wallet_id, account_type)
      VALUES ${values}
    `);

  }

}

module.exports = new AccountProvisionService();
