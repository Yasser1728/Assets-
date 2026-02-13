const express = require('express');
const orders = require('./controllers/orders.controller');
const attempts = require('./controllers/attempts.controller');
const transactions = require('./controllers/transactions.controller');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const idempotency = require('./middleware/idempotency');
const transitionGuard = require('./middleware/transitionGuard');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

// Routes
app.use('/api/orders', apiKeyAuth, orders);
app.use('/api/orders/:orderId/attempts', apiKeyAuth, idempotency, attempts);
app.use('/api/attempts/:attemptId/server-approve', transitionGuard, attempts.serverApprove);
app.use('/api/attempts/:attemptId/broadcast', transitionGuard, transactions.broadcast);

module.exports = app;
