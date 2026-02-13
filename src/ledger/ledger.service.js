class LedgerService {

  async debit(walletId, amount) {
    console.log('Debit', walletId, amount);
  }

  async credit(walletId, amount) {
    console.log('Credit', walletId, amount);
  }

  async lockFunds(walletId, amount) {
    console.log('Lock Funds', walletId, amount);
  }

}

module.exports = new LedgerService();
