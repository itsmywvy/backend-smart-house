const express = require('express');
const Room = require('../models/room');

const router = express.Router();

router.get('/rooms', async (req, res) => {
  try {
    const data = await Room.find();
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
