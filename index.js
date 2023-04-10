const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const members = require('./routes/members');
const rooms = require('./routes/rooms');
const users = require('./routes/users');
const billingChart = require('./routes/billingChart');

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '50mb' })); // allows us to accept the data in JSON format.
app.use('/api', members);
app.use('/api', rooms);
app.use('/api', users);
// app.use('/api', billingChart);

app.listen(3001, () => {
  console.log(`Server started on port ${3001}`);
});

require('dotenv').config();

const dev_db_url =
  'mongodb+srv://your_user_name:your_password@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority';

const mongoString = process.env.DATABASE_URL || dev_db_url;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
