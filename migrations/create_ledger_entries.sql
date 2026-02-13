CREATE TABLE ledger_entries (
    entry_id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES ledger_transactions(transaction_id),
    account_id INTEGER REFERENCES ledger_accounts(account_id),
    debit DECIMAL(18,6) DEFAULT 0,
    credit DECIMAL(18,6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
