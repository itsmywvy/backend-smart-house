const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_JWT_CODE = 'psmR2HuOihHKfqZymo1m';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const data = await User.find();
    console.log(data);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/users/signup', async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, error: 'Send needed params' });
      return;
    }

    const checkDuplicate = await User.findOne({ email: req.body.email });

    if (checkDuplicate) {
      res.json({ success: false, error: 'User with this email has already been created' });
    } else {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      }).then((user) => {
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_JWT_CODE);
        res.json({ success: true, token, message: 'User was created successfully' });
      });
    }
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

router.post('/users/login', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, error: 'Send needed params' });
      return;
    }

    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        res.json({ success: false, error: 'User does not exist' });
      } else {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.json({ success: false, error: 'Wrong password' });
        } else {
          const token = jwt.sign({ id: user._id }, SECRET_JWT_CODE);
          res.json({ succes: true, token, user });
        }
      }
    });
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

module.exports = router;
