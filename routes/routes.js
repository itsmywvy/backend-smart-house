const express = require('express');
const Model = require('../models/model');

const router = express.Router();

router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/getOne/:id', async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/post', async (req, res) => {
  const data = new Model({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    homeStatus: req.body.homeStatus,
    homeLocation: req.body.homeLocation,
    avatar: req.body.avatar,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    const updatedData = req.body; // данные с клиента для изменения
    const options = { new: true }; //  возвращать ли обновленные данные в тело или нет.

    const result = await Model.findByIdAndUpdate(req.params.id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    res.send('Deleted');
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
