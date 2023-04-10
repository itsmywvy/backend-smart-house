const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  lightning: {
    type: Number,
    required: true,
  },
  devices: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('Room', roomSchema);
