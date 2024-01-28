const express = require('express');
const events = require('events');
// const Room = require('../models/room');
const { protect } = require('../middleware/authMiddleware');

const emmiter = new events.EventEmitter();

const router = express.Router();

router.get('/connect', async (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });
  emitter.on('newMessage', (message) => {
    res.write(`data: ${JSON.stringify(message)} \n\n`);
  });
});

router.post('/new-messages', async (req, res) => {
  const message = req.body;
  emmiter.emit('newMessage', message);
  res.status(200);
});

module.exports = router;
