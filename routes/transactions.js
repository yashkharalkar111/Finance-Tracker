const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { ensureAuthenticated } = require('../middleware/auth');

// POST: Add a new transaction
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { label, amount, type, icon } = req.body;

  try {
    const newTransaction = new Transaction({
      user: req.user._id,
      label,
      amount,
      type,
      icon
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Fetch all transactions of logged-in user
router.get('/all', ensureAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
