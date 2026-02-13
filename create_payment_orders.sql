CREATE TABLE payment_orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  store_id INTEGER REFERENCES stores(store_id),
  amount DECIMAL(18,6),
  currency VARCHAR(10),
  status VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  idempotency_key VARCHAR(64)
);
