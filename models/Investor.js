const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  investmentBudget: {
    type: String,
    default: ''
  },
  preferredCategories: [{
    type: String
  }],
  investorBio: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  resetPasswordOtp: {
    type: String
  },
  resetPasswordOtpExpiry: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investor', investorSchema);
