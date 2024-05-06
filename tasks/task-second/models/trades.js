/**
 * @typedef {Object} Trade
 * @property {number} id - The unique identifier for the trade. (auto-incrementing)
 * @property {'buy' | 'sell'} type - The type of trade (buy or sell).
 * @property {number} userId - The foreign key referencing the user who made the trade.
 * @property {string} symbol - The stock symbol for the traded security.
 * @property {number} shares - The number of shares traded.
 * @property {number} price - The price per share at the time of the trade.
 * @property {Date} timestamp - The timestamp of the trade.
 */

const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

/**
 * @type {import('sequelize').Model<Trade>} TradeModel
 * @property {number} id - See {@link Trade.id}
 * @property {'buy' | 'sell'} type - See {@link Trade.type}
 * @property {number} userId - See {@link Trade.userId}
 * @property {string} symbol - See {@link Trade.symbol}
 * @property {number} shares - See {@link Trade.shares}
 * @property {number} price - See {@link Trade.price}
 * @property {Date} timestamp - See {@link Trade.timestamp}
 */
const Trades = sequelize.define('Trades', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  type: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false,
  },
  user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  symbol: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
  },
  timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
},{
  timestamps: false
});

module.exports = Trades;
