const accountTypes = require('./ledger.accountTypes');

module.exports = {

  // Payment from user to merchant
  PAYMENT: ({ senderWallet, receiverWallet, amount, fee = 0 }) => {
    return [
      // خصم الرصيد الأساسي للمستخدم
      {
        walletId: senderWallet,
        accountType: accountTypes.MAIN,
        debit: amount + fee,
        credit: 0
      },
      // إضافة المبلغ للمتجر
      {
        walletId: receiverWallet,
        accountType: accountTypes.MAIN,
        debit: 0,
        credit: amount
      },
      // إضافة الرسوم لحساب FEES
      ...(fee > 0 ? [{
        walletId: receiverWallet,
        accountType: accountTypes.FEES,
        debit: 0,
        credit: fee
      }] : [])
    ];
  },

  // Escrow lock (تحويل من MAIN إلى ESCROW)
  ESCROW_LOCK: ({ walletId, amount }) => [
    {
      walletId,
      accountType: accountTypes.MAIN,
      debit: amount,
      credit: 0
    },
    {
      walletId,
      accountType: accountTypes.ESCROW,
      debit: 0,
      credit: amount
    }
  ],

  // Escrow release (ESCROW → MAIN)
  ESCROW_RELEASE: ({ walletId, amount }) => [
    {
      walletId,
      accountType: accountTypes.ESCROW,
      debit: amount,
      credit: 0
    },
    {
      walletId,
      accountType: accountTypes.MAIN,
      debit: 0,
      credit: amount
    }
  ],

  // Reward allocation
  REWARD: ({ walletId, amount }) => [
    {
      walletId,
      accountType: accountTypes.REWARDS,
      debit: 0,
      credit: amount
    }
  ]

};
