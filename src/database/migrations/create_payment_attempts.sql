CREATE TABLE payment_attempts (
  attempt_id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES payment_orders(order_id),
  payment_method VARCHAR(30),
  status VARCHAR(20),
  initiated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  idempotency_key VARCHAR(64),
  status_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP,
  client_signature VARCHAR(255)
);
