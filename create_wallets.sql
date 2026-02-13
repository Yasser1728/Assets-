CREATE TABLE wallets (
  wallet_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  pi_wallet_address VARCHAR(255),
  balance DECIMAL(18,6) DEFAULT 0,
  last_synced TIMESTAMP
);
