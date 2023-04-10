const express = require('express');
const multer = require('multer');

const Member = require('../models/member');
const Upload = require('../models/Upload');
const BillingChart = require('../models/billingChart');

const router = express.Router();

//setting options for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/billingChart', async (req, res) => {
  try {
    const data = await BillingChart.find();
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/billingChart/:id', async (req, res) => {
  try {
    const data = await BillingChart.findById(req.params.id);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
