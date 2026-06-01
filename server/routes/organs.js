const express      = require('express');
const router       = express.Router();
const OrganRequest = require('../models/OrganRequest');
const { protect }  = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { organ, city, urgency, page = 1, limit = 15 } = req.query;
    const filter = { status: { $in: ['waiting', 'matched'] } };
    if (organ)   filter.organ = organ;
    if (city)    filter.city = new RegExp(city, 'i');
    if (urgency) filter.urgency = urgency;
    const total    = await OrganRequest.countDocuments(filter);
    const requests = await OrganRequest.find(filter)
      .populate('requester', 'name phone email')
      .skip((page - 1) * Number(limit)).limit(Number(limit))
      .sort({ urgency: 1, createdAt: -1 });
    res.json({ success: true, total, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const request = await OrganRequest.create({ ...req.body, requester: req.user._id });
    res.status(201).json({ success: true, message: 'Organ request submitted!', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const r = await OrganRequest.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json({ success: true, request: r });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
