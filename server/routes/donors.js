const express = require('express');
const router  = express.Router();
const Donor   = require('../models/Donor');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/donors?bloodGroup=&city=&organ=&donationType=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, organ, donationType, page = 1, limit = 20 } = req.query;
    const filter = { status: 'active', isAvailable: true };
    if (bloodGroup)   filter.bloodGroup = bloodGroup;
    if (city)         filter.city = new RegExp(city, 'i');
    if (organ)        filter.organsPledged = organ;
    if (donationType) filter.donationType = donationType;

    const total  = await Donor.countDocuments(filter);
    const donors = await Donor.find(filter)
      .populate('user', 'name city phone bloodGroup location')
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .sort('-createdAt');
    res.json({ success: true, total, page: Number(page), donors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/donors/map — all donors with lat/lng for map
router.get('/map', async (req, res) => {
  try {
    const donors = await Donor.find({ status: 'active', 'location.lat': { $exists: true } })
      .populate('user', 'name city bloodGroup phone')
      .select('bloodGroup donationType location organsPledged city user');
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/donors/me
router.get('/me', protect, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id })
      .populate('user', 'name email phone city bloodGroup');
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/donors
router.post('/', protect, async (req, res) => {
  try {
    if (await Donor.findOne({ user: req.user._id }))
      return res.status(400).json({ success: false, message: 'Already registered as donor' });
    const donor = await Donor.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      isDonor: true,
      isOrganPledged: req.body.donationType !== 'blood',
      location: req.body.location
    });
    res.status(201).json({ success: true, message: '🎉 Registered as donor!', donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/donors/me
router.put('/me', protect, async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { user: req.user._id }, req.body, { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated', donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/donors/:id
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user', 'name city bloodGroup phone');
    if (!donor) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
