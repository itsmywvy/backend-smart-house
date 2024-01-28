const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
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

      next();
    } catch (error) {
      // console.log(error);
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  }

  // if (!token) {
  //   res.status(401);
  //   throw new Error('Not authorized, no token found');
  // }
});

module.exports = { protect };
