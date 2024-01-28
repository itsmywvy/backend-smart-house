const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware.js');

const fs = require('fs');

const uuid = require('uuid');

require('dotenv').config();

const router = express.Router();

// Get users

router.route('/users').post(protect, async (req, res) => {
  try {
    const data = await User.find().where('_id').in(req.body).exec();
    const dataWithoutPassword = data.map((item) => {
      delete item.password;
      return {
        id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        avatar: item.avatar,
      };
    });
    res.json(dataWithoutPassword);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get one user

router.route('/users/:id').get(protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.firstName,
      email: user.email,
    });
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Find user
router.route('/user').get(protect, async (req, res) => {
  let searchValue = req.query.search;

  try {
    let searchedUsers = await User.find({
      $expr: {
        $regexMatch: {
          input: { $concat: ['$firstName', ' ', '$lastName'] },
          regex: searchValue,
          options: 'i',
        },
      },
    });
    let usersWithoutPassword = searchedUsers.map((user) => {
      return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      };
    });
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.log(error);
  }
});

// Add member
router.route('/user/members').put(protect, async (req, res) => {
  try {
    const newMember = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { members_ids: req.body.memberId } },
      // function (error, success) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log(success);
      //   }
      // },
    );
    res.status(200).json({ success: true, newMember });
  } catch (error) {
    console.log(error);
  }
});

// Register user

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
        members_ids: [],
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

// Login user

router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.json({ success: false, error: 'Send needed params' });
      return;
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: false, error: 'User does not exist' });
    } else {
      if (await !bcrypt.compareSync(password, user.password)) {
        res.json({ success: false, error: 'Wrong password' });
      } else {
        // Create sign with secret key
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_JWT_CODE, {
          expiresIn: '2h',
        });
        res.json({ success: true, token, user });
      }
    }
  } catch (error) {
    res.status(422).json({ success: false, error });
  }
});

// Get user profile
router.route('/user/profile').get(protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // const members = user.members_ids.map((id) => User.findById(id));
    const members = await User.find({ _id: user.members_ids });
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      members_ids: user.members_ids,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(404).json({ success: false, error });
    throw new Error('User not found');
  }
});

// Upload avatar
router.route('/user/avatar').put(protect, async (req, res) => {
  try {
    const previousAvatarName = req.user.avatar;
    console.log(previousAvatarName);

    const avatarName = uuid.v4() + '.jpg';

    const file = req.files.file;
    file.mv(process.env.STATIC_PATH + '\\' + avatarName);

    const user = await User.findOneAndUpdate({ _id: req.user.id }, { avatar: avatarName });

    fs.unlink(process.env.STATIC_PATH + '\\' + previousAvatarName, function () {
      res.json({ message: 'Avatar was uploaded successfully', user });
    });
  } catch (error) {
    res.status(404).json({ success: false, error });
  }
});

module.exports = router;
