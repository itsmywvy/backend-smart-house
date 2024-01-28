const express = require('express');

const BillingChart = require('../models/billingChart');

const router = express.Router();

router.get('/billingChart', async (req, res) => {
  try {
    const data = await BillingChart.find();
    console.log(data);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
