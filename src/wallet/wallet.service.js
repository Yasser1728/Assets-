const db = require('../database/connection');
const accountProvision = require('../provisioning/accountProvision.service');

class WalletService {

  async createWalletForUser(userId) {

    // إنشاء Wallet
    const result = await db.query(`
      INSERT INTO wallets (user_id)
      VALUES ($1)
      RETURNING wallet_id
    `, [userId]);

    const walletId = result.rows[0].wallet_id;

    // إنشاء جميع Ledger Accounts المرتبطة بالWallet
    await accountProvision.provisionUserAccounts(walletId);

    return walletId;
  }

}

module.exports = new WalletService();
