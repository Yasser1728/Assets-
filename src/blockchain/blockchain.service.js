class BlockchainService {

  async broadcast({ address, amount }) {

    return {
      hash: 'mock_tx_' + Date.now()
    };
  }

}

module.exports = new BlockchainService();
