module.exports = {
  broadcast: async ({ amount, wallet }) => {
    return { fake_payment_id: Math.floor(Math.random()*100000), fake_tx_hash: 'pi_'+Math.random().toString(36).substring(7) };
  }
};
