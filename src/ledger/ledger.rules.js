module.exports = {

  validateDoubleEntry(entries) {

    const totalDebit = entries.reduce((sum, e) => sum + Number(e.debit), 0);
    const totalCredit = entries.reduce((sum, e) => sum + Number(e.credit), 0);

    if (totalDebit !== totalCredit) {
      throw new Error('Ledger is not balanced');
    }
  }

};
