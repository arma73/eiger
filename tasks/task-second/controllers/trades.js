/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */
const Joi = require('joi');
const Trades = require('../models/trades');


/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The middleware next function
 */
const validateTradeData = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid('buy', 'sell').required(),
    user_id: Joi.number().required(),
    symbol: Joi.string().required(),
    shares: Joi.number().min(1).max(100).required(),
    price: Joi.number().precision(2).required(),
    timestamp: Joi.number().required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.details[0].message });
  }

  next();
};

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const createTrade = async (req, res) => {
  try {
    const createdTrade = await Trades.create(req.body);
    return res.status(201).json(createdTrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const getTrades = async (req, res) => {
  try {
    const { type, user_id } = req.query;
    const where = {};
    if (type) where.type = type;
    if (user_id) where.user_id = user_id;

    const trades = await Trades.findAll({
      order: [[Trades.sequelize.col('id'), 'ASC']],
      where,
    });
    res.status(200).json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const getTradeById = async (req, res) => {
  try {
    const trade = await Trades.findByPk(req.params.id);
    if (!trade) return res.status(404).end('ID not found');
    res.status(200).json(trade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { validateTradeData, createTrade, getTrades, getTradeById };
