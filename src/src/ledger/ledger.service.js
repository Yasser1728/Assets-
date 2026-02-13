const repository = require('./ledger.repository');
const rules = require('./ledger.rules');
const transactionRules = require('./ledger.transactionRules');

class LedgerService {

  async executeTransaction({ type, referenceId, params }) {

    // بناء القيود حسب نوع العملية
    const entries = transactionRules[type](params);

    // تحقق من توازن القيود
    rules.validateDoubleEntry(entries);

    // إنشاء سجل المعاملة
    const tx = await repository.createTransaction(type, referenceId);

    // ربط entries بالمعاملة
    const prepared = entries.map(e => ({
      ...e,
      transactionId: tx.transaction_id
    }));

    await repository.insertEntries(prepared);

    return tx;
  }

}

module.exports = new LedgerService();
