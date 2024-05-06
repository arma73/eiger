const express = require('express');
const { validateTradeData, createTrade, getTrades, getTradeById } = require('../controllers/trades');
const router = express.Router();

router.post("/", validateTradeData, createTrade);

router.all('/:id', (req, res, next) => {
  if (req.method !== 'GET') return res.status(405).end();
  next();
});

router.get('/:id', getTradeById);

router.get('/', getTrades);

module.exports = router;
