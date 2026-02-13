const transferService = require('./transfer.service');

exports.createTransfer = async (req, res) => {
  try {
    const result = await transferService.createTransfer(req.body, req.user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
