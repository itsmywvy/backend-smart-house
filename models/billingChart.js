const mongoose = require('mongoose');

const billingChartSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  month: {
    type: String,
  },
  dueData: {
    type: String,
  },
  amountDue: {
    type: Number,
  },
  status: {
    type: Boolean,
  },
});

module.exports = mongoose.model('BillingChart', billingChartSchema);
