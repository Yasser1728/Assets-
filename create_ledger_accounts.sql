CREATE TABLE ledger_accounts (
  ledger_id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(wallet_id),
  account_type VARCHAR(20), -- MAIN, ESCROW, FEES, REWARDS
  balance DECIMAL(18,6) DEFAULT 0
);
