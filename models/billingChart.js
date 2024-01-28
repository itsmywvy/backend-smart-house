const mongoose = require('mongoose');

const billingChartSchema = new mongoose.Schema({
  label: {
    type: String,
  },
  data: {
    type: Array,
  },
});

module.exports = mongoose.model('Billing-Chart', billingChartSchema);
