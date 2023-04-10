const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  homeStatus: {
    type: Boolean,
    required: true,
  },
  homeLocation: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Data', dataSchema);
