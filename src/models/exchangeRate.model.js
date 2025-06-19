const mongoose = require('mongoose');

const exchangeRateSchema = mongoose.Schema(
  {
    fromCurrency: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Currency',
      required: true,
    },
    toCurrency: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Currency',
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index để tối ưu query
exchangeRateSchema.index({ fromCurrency: 1, toCurrency: 1, timestamp: -1 });
exchangeRateSchema.index({ source: 1, timestamp: -1 });

/**
 * @typedef ExchangeRate
 */
module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);
