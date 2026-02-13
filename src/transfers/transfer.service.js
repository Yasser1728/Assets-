const ledgerService = require('../ledger/ledger.service');
const blockchainService = require('../blockchain/blockchain.service');

class TransferService {

  async createTransfer(data, user) {

    const { receiverWallet, blockchainAddress, amount, type } = data;

    if (type === 'internal') {
      return this.internalTransfer(user.walletId, receiverWallet, amount);
    }

    if (type === 'external') {
      return this.externalTransfer(user.walletId, blockchainAddress, amount);
    }

    throw new Error('Invalid transfer type');
  }

  async internalTransfer(senderWallet, receiverWallet, amount) {

    await ledgerService.debit(senderWallet, amount);
    await ledgerService.credit(receiverWallet, amount);

    return { status: 'completed' };
  }

  async externalTransfer(senderWallet, blockchainAddress, amount) {

    await ledgerService.lockFunds(senderWallet, amount);

    const tx = await blockchainService.broadcast({
      address: blockchainAddress,
      amount
    });

    return {
      status: 'broadcasted',
      txHash: tx.hash
    };
  }
}

module.exports = new TransferService();
