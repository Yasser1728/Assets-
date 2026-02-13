const router = require('express').Router();
const controller = require('../transfers/transfer.controller');

router.post('/transfer', controller.createTransfer);

module.exports = router;
