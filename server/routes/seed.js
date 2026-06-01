const express      = require('express');
const router       = express.Router();
const Hospital     = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const User         = require('../models/User');
const Donor        = require('../models/Donor');

router.post('/', async (req, res) => {
  try {
    // Seed hospitals with real Indian city coordinates
    await Hospital.deleteMany({});
    await Hospital.insertMany([
      {
        name: 'Lilavati Hospital & Research Centre', city: 'Mumbai', state: 'Maharashtra',
        address: 'A-791, Bandra Reclamation, Bandra West', phone: '022-26751000',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.8,
        location: { lat: 19.0596, lng: 72.8295, address: 'Bandra West, Mumbai' },
        bloodStock: { 'A+': 12, 'B+': 8, 'O+': 20, 'AB+': 4, 'O-': 2 },
        specialties: ['Cardiology', 'Organ Transplant', 'Nephrology']
      },
      {
        name: 'AIIMS New Delhi', city: 'Delhi', state: 'Delhi',
        address: 'Ansari Nagar, New Delhi', phone: '011-26588500',
        type: 'government', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.9,
        location: { lat: 28.5672, lng: 77.2100, address: 'Ansari Nagar, New Delhi' },
        bloodStock: { 'A+': 25, 'B-': 5, 'O-': 3, 'AB-': 2, 'B+': 18 },
        specialties: ['All Specialties', 'Organ Transplant']
      },
      {
        name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', state: 'Maharashtra',
        address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows', phone: '022-30999999',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.7,
        location: { lat: 19.1136, lng: 72.8340, address: 'Andheri West, Mumbai' },
        bloodStock: { 'A-': 6, 'B+': 14, 'O+': 22, 'AB+': 5 },
        specialties: ['Cardiac Surgery', 'Neurology', 'Transplant']
      },
      {
        name: 'Apollo Hospital', city: 'Chennai', state: 'Tamil Nadu',
        address: '21, Greams Lane, Off Greams Road', phone: '044-28290200',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.8,
        location: { lat: 13.0604, lng: 80.2496, address: 'Greams Road, Chennai' },
        bloodStock: { 'A+': 15, 'B+': 10, 'O-': 4, 'AB-': 1, 'O+': 18 },
        specialties: ['Cardiology', 'Oncology', 'Organ Transplant']
      },
      {
        name: 'Fortis Memorial Research Institute', city: 'Gurugram', state: 'Haryana',
        address: 'Sector 44, Opposite HUDA City Centre', phone: '0124-4921021',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.7,
        location: { lat: 28.4519, lng: 77.0311, address: 'Sector 44, Gurugram' },
        bloodStock: { 'A+': 8, 'B+': 12, 'O+': 16, 'AB+': 3, 'A-': 4 },
        specialties: ['Bone Marrow Transplant', 'Cardiac', 'Neuro']
      },
      {
        name: 'Manipal Hospital', city: 'Bangalore', state: 'Karnataka',
        address: '98, HAL Airport Road, Kodihalli', phone: '080-25024444',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.6,
        location: { lat: 12.9592, lng: 77.6469, address: 'HAL Airport Road, Bengaluru' },
        bloodStock: { 'O+': 20, 'B+': 9, 'A+': 11, 'AB-': 2 },
        specialties: ['Transplant', 'Haematology', 'Oncology']
      },
      {
        name: 'KEM Hospital', city: 'Mumbai', state: 'Maharashtra',
        address: 'Acharya Donde Marg, Parel', phone: '022-24107000',
        type: 'government', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.3,
        location: { lat: 18.9974, lng: 72.8414, address: 'Parel, Mumbai' },
        bloodStock: { 'A+': 30, 'B+': 20, 'O+': 35, 'O-': 5, 'AB+': 8 },
        specialties: ['General Medicine', 'Surgery', 'Transplant']
      },
      {
        name: 'PGIMER', city: 'Chandigarh', state: 'Punjab',
        address: 'Sector 12, Chandigarh', phone: '0172-2746018',
        type: 'government', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.8,
        location: { lat: 30.7656, lng: 76.7787, address: 'Sector 12, Chandigarh' },
        bloodStock: { 'A+': 18, 'B-': 4, 'O+': 22, 'AB+': 6 },
        specialties: ['All Specialties', 'Research']
      },
      {
        name: 'Swaroop Rani Nehru Hospital', city: 'Prayagraj', state: 'Uttar Pradesh',
        address: 'Mahatma Gandhi Marg, Civil Lines', phone: '0532-2256789',
        type: 'government', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.5,
        location: { lat: 25.4484, lng: 81.8333, address: 'Civil Lines, Prayagraj' },
        bloodStock: { 'A+': 15, 'B+': 18, 'O+': 25, 'O-': 4, 'AB+': 7 },
        specialties: ['General Medicine', 'Surgery']
      },
      {
        name: 'United Medicity', city: 'Prayagraj', state: 'Uttar Pradesh',
        address: 'Rawatpur, Prayagraj', phone: '0532-2456789',
        type: 'private', isOpen24x7: true, hasBloodBank: true, hasOT: true, rating: 4.6,
        location: { lat: 25.4162, lng: 81.7699, address: 'Rawatpur, Prayagraj' },
        bloodStock: { 'A+': 12, 'B+': 10, 'O+': 20, 'O-': 2, 'AB+': 5 },
        specialties: ['Cardiology', 'Neurology', 'Orthopedics']
      }
    ]);

    // Seed sample blood requests
    await BloodRequest.deleteMany({});
    const sampleUser = await User.findOne() || await User.create({
      name: 'System Admin', email: 'admin@throughu.in',
      password: 'Admin@123', phone: '9999999999', city: 'Mumbai',
      bloodGroup: 'O+', role: 'admin'
    });

    await BloodRequest.insertMany([
      { requester: sampleUser._id, bloodGroup: 'O-', units: 2, hospital: 'Lilavati Hospital', city: 'Mumbai', state: 'Maharashtra', urgency: 'critical', patientName: 'Ravi Sharma', reason: 'Accident - emergency surgery', contactPhone: '9876543210', location: { lat: 19.0596, lng: 72.8295 } },
      { requester: sampleUser._id, bloodGroup: 'B+', units: 3, hospital: 'AIIMS Delhi', city: 'Delhi', state: 'Delhi', urgency: 'urgent', patientName: 'Priya Singh', reason: 'Cardiac surgery', contactPhone: '9876501234', location: { lat: 28.5672, lng: 77.2100 } },
      { requester: sampleUser._id, bloodGroup: 'AB-', units: 1, hospital: 'Apollo Hospital', city: 'Chennai', state: 'Tamil Nadu', urgency: 'critical', patientName: 'Kumar Raj', reason: 'Rare blood group needed for transplant', contactPhone: '9876512340', location: { lat: 13.0604, lng: 80.2496 } },
      { requester: sampleUser._id, bloodGroup: 'A+', units: 4, hospital: 'Manipal Hospital', city: 'Bangalore', state: 'Karnataka', urgency: 'normal', patientName: 'Anita Patel', reason: 'Scheduled surgery', contactPhone: '9876523456', location: { lat: 12.9592, lng: 77.6469 } },
      { requester: sampleUser._id, bloodGroup: 'O+', units: 2, hospital: 'Fortis FMRI', city: 'Gurugram', state: 'Haryana', urgency: 'urgent', patientName: 'Mohit Gupta', reason: 'Dengue - platelet drop', contactPhone: '9876534567', location: { lat: 28.4519, lng: 77.0311 } },
    ]);

    res.json({
      success: true,
      message: '✅ Database seeded with hospitals and blood requests!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
