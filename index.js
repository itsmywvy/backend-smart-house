const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const members = require('./routes/members');
const rooms = require('./routes/rooms');
const users = require('./routes/users');
const billingChart = require('./routes/billingChart');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // allows us to accept the data in JSON format.
app.use('/api', members);
app.use('/api', rooms);
app.use('/api', users);
// app.use('/api', billingChart);

app.listen(3001, () => {
  console.log(`Server started on port ${3001}`);
});

require('dotenv').config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
