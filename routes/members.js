const express = require('express');
const Member = require('../models/member');
const Upload = require('../models/Upload');

const router = express.Router();

const multer = require('multer');
//setting options for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/members', async (req, res) => {
  try {
    const data = await Member.find();
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/members/:id', async (req, res) => {
  try {
    const data = await Member.findById(req.params.id);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/members', async (req, res) => {
  try {
    const data = new Member({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: req.body.avatar,
    });

    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.patch('/members/:id', async (req, res) => {
  try {
    const updatedData = req.body; // данные с клиента для изменения
    const options = { new: true }; //  возвращать ли обновленные данные в тело или нет.

    const result = await Member.findByIdAndUpdate(req.params.id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete('/members/:id', async (req, res) => {
  try {
    const result = await Member.findByIdAndDelete(req.params.id);
    res.send('Deleted');
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
