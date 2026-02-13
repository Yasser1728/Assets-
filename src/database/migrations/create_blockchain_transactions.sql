CREATE TABLE blockchain_transactions (
  tx_id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES payment_attempts(attempt_id),
  pi_tx_hash VARCHAR(100),
  network VARCHAR(20),
  broadcasted_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  confirmations INTEGER DEFAULT 0,
  required_confirmations INTEGER DEFAULT 1,
  status VARCHAR(20),
  gas_fee DECIMAL(18,6)
);
