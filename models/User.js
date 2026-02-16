const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  profilePhoto: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['investor', 'startup_owner'],
    required: [true, 'Role is required']
  },
  
  // Investor specific fields
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
  
  // Startup Owner specific fields
  startupName: {
    type: String,
    default: ''
  },
  projectCategory: {
    type: String,
    default: ''
  },
  projectStage: {
    type: String,
    enum: ['', 'idea', 'prototype', 'mvp', 'launched'],
    default: ''
  },
  teamSize: {
    type: Number,
    default: 0
  },
  websiteLink: {
    type: String,
    default: ''
  },
  startupDescription: {
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

module.exports = mongoose.model('User', userSchema);
