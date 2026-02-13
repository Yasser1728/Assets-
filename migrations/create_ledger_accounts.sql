CREATE TABLE ledger_accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PI',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
