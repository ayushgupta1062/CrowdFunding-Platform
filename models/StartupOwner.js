const mongoose = require('mongoose');

const startupOwnerSchema = new mongoose.Schema({
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
  startupName: {
    type: String,
    required: [true, 'Startup name is required']
  },
  projectCategory: {
    type: String,
    required: [true, 'Project category is required']
  },
  projectStage: {
    type: String,
    enum: ['idea', 'prototype', 'mvp', 'launched'],
    required: [true, 'Project stage is required']
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: 1
  },
  websiteLink: {
    type: String,
    default: ''
  },
  startupDescription: {
    type: String,
    required: [true, 'Startup description is required']
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  linkedIn: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  bio: {
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

module.exports = mongoose.model('StartupOwner', startupOwnerSchema);
