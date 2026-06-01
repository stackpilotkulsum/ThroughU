const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = id =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'throughu_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

const respond = (res, code, user, token, message) =>
  res.status(code).json({
    success: true, message, token,
    user: {
      id: user._id, name: user.name, email: user.email,
      bloodGroup: user.bloodGroup, city: user.city,
      role: user.role, isDonor: user.isDonor,
      isOrganPledged: user.isOrganPledged, phone: user.phone
    }
  });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, state, age, gender, bloodGroup } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, city, state, age, gender, bloodGroup });
    respond(res, 201, user, sign(user._id), 'Registration successful! Welcome to ThroughU.');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials or you normally log in with Google' });
    respond(res, 200, user, sign(user._id), 'Login successful');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    
    let user = await User.findOne({ email });
    
    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture,
      });
    }
    respond(res, 200, user, sign(user._id), 'Google Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Google Authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) =>
  res.json({ success: true, user: req.user })
);

// PUT /api/auth/update-password
router.put('/update-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
