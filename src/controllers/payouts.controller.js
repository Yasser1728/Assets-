const payoutService = require("../services/piPayout.service");
const payoutModel = require("../models/payoutTransaction.model");

exports.sendPayout = async (req, res) => {

  try {

    const { user_uid, amount, memo } = req.body;

    const payout = await payoutModel.createPayout({
      user_uid,
      amount,
      memo
    });

    const piPayment = await payoutService.sendPayment({
      userUid: user_uid,
      amount,
      memo
    });

    await payoutModel.updateStatus(
      payout.rows[0].id,
      "submitted",
      piPayment.identifier
    );

    res.json({
      success: true,
      payment: piPayment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};
