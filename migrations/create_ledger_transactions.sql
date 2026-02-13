CREATE TABLE ledger_transactions (
    transaction_id SERIAL PRIMARY KEY,
    reference_id VARCHAR(100),
    transaction_type VARCHAR(30),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
