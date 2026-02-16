const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupOwner',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  unreadCountInvestor: {
    type: Number,
    default: 0
  },
  unreadCountOwner: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique conversation per investor-owner-campaign
conversationSchema.index({ investorId: 1, ownerId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
