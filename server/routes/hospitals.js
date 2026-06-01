const express  = require('express');
const router   = express.Router();
const Hospital = require('../models/Hospital');

router.get('/', async (req, res) => {
  try {
    const { city, type, hasBloodBank, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (city)         filter.city = new RegExp(city, 'i');
    if (type)         filter.type = type;
    if (hasBloodBank) filter.hasBloodBank = true;
    const total     = await Hospital.countDocuments(filter);
    const hospitals = await Hospital.find(filter)
      .skip((page - 1) * Number(limit)).limit(Number(limit))
      .sort('-rating');
    res.json({ success: true, total, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/map', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ 'location.lat': { $exists: true } })
      .select('name city type isOpen24x7 hasBloodBank rating location phone bloodStock');
    res.json({ success: true, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
