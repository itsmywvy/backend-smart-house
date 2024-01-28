const express = require('express');

const BillingHistory = require('../models/billingHistory');

const router = express.Router();

router.get('/billingHistory', async (req, res) => {
  try {
    const data = await BillingHistory.find();
    console.log(data);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.patch('/billingHistory', async (req, res) => {
  try {
    console.log(req);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
