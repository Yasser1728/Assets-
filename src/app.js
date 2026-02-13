const express = require("express");
const payoutsRoutes = require("./routes/payouts.routes");
const webhookHandler = require("./webhooks/piWebhook.handler");

const app = express();

app.use(express.json());

app.use("/api/payouts", payoutsRoutes);
app.post("/api/webhooks/pi", webhookHandler.piWebhook);

module.exports = app;
