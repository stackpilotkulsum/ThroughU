const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donationType:  { type: String, enum: ['blood', 'organ', 'both'], required: true },
  bloodGroup:    { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
  organsPledged: {
    type: [String],
    enum: ['Heart','Lungs','Liver','Kidneys','Corneas','Bone','Skin','Pancreas'],
    default: []
  },
  isAvailable:   { type: Boolean, default: true },
  lastDonated:   { type: Date },
  totalDonations:{ type: Number, default: 0 },
  city:          { type: String, required: true },
  state:         { type: String },
  address:       { type: String },
  location: {
    lat:     { type: Number },
    lng:     { type: Number },
    address: { type: String }
  },
  medicalNotes:  { type: String, default: '' },
  status:        { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
