async createWallet(userId) {

  return db.query(`
    INSERT INTO wallets (user_id, status)
    VALUES ($1,'active')
  `, [userId]);

}
