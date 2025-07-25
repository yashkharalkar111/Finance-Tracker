const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  income: {
    type: Number,
    default: 0
  },
  expenses: {
    type: Number,
    default: 0
  },
  totalBalance: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);
