const mongoose = require('mongoose');

const savedCampaignSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure an investor can't save the same campaign twice
savedCampaignSchema.index({ investorId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('SavedCampaign', savedCampaignSchema);
