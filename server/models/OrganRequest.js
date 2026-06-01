const mongoose = require('mongoose');

const organRequestSchema = new mongoose.Schema({
  requester:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organ:        { type: String, enum: ['Heart','Lungs','Liver','Kidneys','Corneas','Bone','Skin','Pancreas'], required: true },
  bloodGroup:   { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
  hospital:     { type: String, required: true },
  city:         { type: String, required: true },
  state:        { type: String },
  patientName:  { type: String, required: true },
  patientAge:   { type: Number },
  urgency:      { type: String, enum: ['critical', 'urgent', 'normal'], default: 'urgent' },
  medicalNotes: { type: String },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String },
  status:       { type: String, enum: ['waiting', 'matched', 'transplanted', 'cancelled'], default: 'waiting' },
  matchedDonor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('OrganRequest', organRequestSchema);
