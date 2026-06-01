const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requester:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup:   { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  units:        { type: Number, required: true, min: 1 },
  hospital:     { type: String, required: true },
  city:         { type: String, required: true },
  state:        { type: String },
  urgency:      { type: String, enum: ['critical', 'urgent', 'normal'], default: 'urgent' },
  patientName:  { type: String },
  reason:       { type: String },
  contactPhone: { type: String, required: true },
  status:       { type: String, enum: ['open', 'fulfilled', 'cancelled', 'expired'], default: 'open' },
  fulfilledBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
