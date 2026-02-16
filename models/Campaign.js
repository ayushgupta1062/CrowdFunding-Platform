const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupOwner',
    required: true
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  startupName: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technology', 'Education', 'Healthcare', 'Finance', 'E-commerce', 'Other'],
    required: true
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: 0
  },
  currentFunding: {
    type: Number,
    default: 0,
    min: 0
  },
  projectStage: {
    type: String,
    enum: ['idea', 'prototype', 'mvp', 'launched'],
    required: true
  },
  teamSize: {
    type: Number,
    required: true
  },
  websiteLink: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  }
});

module.exports = mongoose.model('Campaign', campaignSchema);
