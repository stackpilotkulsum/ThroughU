const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  city:          { type: String, required: true },
  state:         { type: String },
  address:       { type: String },
  phone:         { type: String },
  email:         { type: String },
  type:          { type: String, enum: ['government', 'private', 'clinic'], default: 'private' },
  isOpen24x7:    { type: Boolean, default: false },
  hasBloodBank:  { type: Boolean, default: false },
  hasOT:         { type: Boolean, default: false },
  rating:        { type: Number, default: 4.0 },
  location: {
    lat:     { type: Number, required: true },
    lng:     { type: Number, required: true },
    address: { type: String }
  },
  bloodStock: {
    'A+':  { type: Number, default: 0 },
    'A-':  { type: Number, default: 0 },
    'B+':  { type: Number, default: 0 },
    'B-':  { type: Number, default: 0 },
    'O+':  { type: Number, default: 0 },
    'O-':  { type: Number, default: 0 },
    'AB+': { type: Number, default: 0 },
    'AB-': { type: Number, default: 0 }
  },
  specialties: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
