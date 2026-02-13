const piPayoutService = require("../../services/piPayoutService");

exports.sendReward = async (req, res) => {

  try {

    const { user_uid, amount, memo } = req.body;

    const payout = await piPayoutService.sendPayment({
      userUid: user_uid,
      amount,
      memo
    });

    res.json({
      success: true,
      payout
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

};
