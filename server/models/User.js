const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, minlength: 6, select: false }, // Optional for OAuth
  phone:       { type: String }, // Optional for OAuth
  age:         { type: Number },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup:  { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
  city:        { type: String }, // Optional for OAuth
  state:       { type: String, default: '' },
  role:        { type: String, enum: ['user','admin'], default: 'user' },
  isDonor:     { type: Boolean, default: false },
  isOrganPledged: { type: Boolean, default: false },
  avatar:      { type: String, default: '' },
  googleId:    { type: String, sparse: true, unique: true }, // For Google OAuth
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
