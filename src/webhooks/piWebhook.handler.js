const payoutModel = require("../models/payoutTransaction.model");

exports.piWebhook = async (req, res) => {

  const payment = req.body;

  if (payment.status === "completed") {

    await payoutModel.updateStatus(
      payment.metadata.internal_id,
      "completed",
      payment.identifier
    );
  }

  res.sendStatus(200);
};
