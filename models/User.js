const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  members_ids: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
