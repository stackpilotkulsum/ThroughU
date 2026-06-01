const express      = require('express');
const router       = express.Router();
const BloodRequest = require('../models/BloodRequest');
const { protect }  = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, urgency, status = 'open', page = 1, limit = 15 } = req.query;
    const filter = { status };
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city)       filter.city = new RegExp(city, 'i');
    if (urgency)    filter.urgency = urgency;
    const total    = await BloodRequest.countDocuments(filter);
    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name phone')
      .skip((page - 1) * Number(limit)).limit(Number(limit))
      .sort({ urgency: 1, createdAt: -1 });
    res.json({ success: true, total, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/map', async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'open', 'location.lat': { $exists: true } })
      .populate('requester', 'name phone')
      .select('bloodGroup urgency hospital city location units status');
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const groups  = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
    const stats   = await Promise.all(groups.map(async g => ({
      group: g,
      open: await BloodRequest.countDocuments({ bloodGroup: g, status: 'open' })
    })));
    const total   = await BloodRequest.countDocuments({ status: 'open' });
    const critical= await BloodRequest.countDocuments({ status: 'open', urgency: 'critical' });
    res.json({ success: true, stats, total, critical });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const request = await BloodRequest.create({ ...req.body, requester: req.user._id });
    res.status(201).json({ success: true, message: 'Blood request posted!', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id/fulfill', protect, async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id, { status: 'fulfilled', fulfilledBy: req.user._id }, { new: true }
    );
    res.json({ success: true, message: '✅ Marked as fulfilled', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const r = await BloodRequest.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Not found' });
    if (r.requester.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await r.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
