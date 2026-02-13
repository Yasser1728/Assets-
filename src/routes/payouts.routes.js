const express = require("express");
const router = express.Router();

const controller = require("../controllers/payouts.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const idempotency = require("../middleware/idempotency.middleware");

router.post(
  "/send",
  adminAuth,
  idempotency,
  controller.sendPayout
);

module.exports = router;
