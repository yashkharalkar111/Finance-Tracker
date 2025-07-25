const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    income: 0,
    expenses: 0,
    totalBalance: 0
  });

  await newUser.save();

  res.json({ msg: 'User registered' });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    req.logIn(user, err => {
      if (err) throw err;
      res.json({
        msg: 'Logged in',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          income: user.income,
          expenses: user.expenses,
          totalBalance: user.totalBalance
        }
      });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).json({ msg: 'Logged out successfully' });
    });
  });
});

// 🔒 Protected Route (Authorization Required)
router.get('/user', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
