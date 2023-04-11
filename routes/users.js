const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

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

router.post('/user/signup', async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, error: 'Send needed params' });
      return;
    }

    const checkDuplicate = await User.findOne({ email: req.body.email });

    if (checkDuplicate) {
      res
        .status(409)
        .json({ success: false, error: 'User with this email has already been created' });
    } else {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      }).then((user) => {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          `${process.env.SECRET_JWT_CODE}`,
        );
        res.json({ success: true, token, message: 'User was created successfully' });
      });
    }
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.json({ success: false, error: 'Send needed params' });
      return;
    }

    User.findOne({ email: email }).then((user) => {
      if (!user) {
        res.json({ success: false, error: 'User does not exist' });
      } else {
        if (!bcrypt.compareSync(password, user.password)) {
          res.json({ success: false, error: 'Wrong password' });
        } else {
          const token = jwt.sign({ id: user._id }, `${process.env.SECRET_JWT_CODE}`);
          res.json({ succes: true, token, user });
        }
      }
    });
  } catch (error) {
    res.json({ success: false, error: error });
  }
});

router.get('/user/profile', async (req, res) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // extract token from authHeader string
      token = authHeader.split(' ')[1];

      // verified token returns user id
      const decoded = jwt.verify(token, process.env.SECRET_JWT_CODE);

      // find user's obj in db and assign to req.user
      req.user = await User.findById(decoded.id).select('-password');

      const user = await User.findById(req.user._id);

      if (user) {
        res.json({
          id: user._id,
          firstName: user.firstName,
          lastName: user.firstName,
          email: user.email,
        });
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token found');
  }
});

module.exports = router;
