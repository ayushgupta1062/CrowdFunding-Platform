const Investor = require('../models/Investor');
const SavedCampaign = require('../models/SavedCampaign');
const Campaign = require('../models/Campaign');

// Get investor profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const investor = await Investor.findById(userId).select('-password -otp -otpExpiry');
    
    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    res.status(200).json({
      success: true,
      investor
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update investor profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow updating sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.otp;
    delete updates.otpExpiry;
    delete updates.isVerified;

    const investor = await Investor.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      investor
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Save campaign
exports.saveCampaign = async (req, res) => {
  try {
    const { investorId, campaignId } = req.body;

    const savedCampaign = await SavedCampaign.create({
      investorId,
      campaignId
    });

    res.status(201).json({
      success: true,
      message: 'Campaign saved successfully',
      savedCampaign
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Campaign already saved'
      });
    }
    console.error('Save campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save campaign'
    });
  }
};

// Unsave campaign
exports.unsaveCampaign = async (req, res) => {
  try {
    const { investorId, campaignId } = req.body;

    await SavedCampaign.deleteOne({ investorId, campaignId });

    res.status(200).json({
      success: true,
      message: 'Campaign removed from saved'
    });
  } catch (error) {
    console.error('Unsave campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave campaign'
    });
  }
};

// Get saved campaigns
exports.getSavedCampaigns = async (req, res) => {
  try {
    const { investorId } = req.params;

    const savedCampaigns = await SavedCampaign.find({ investorId })
      .populate('campaignId')
      .sort({ savedAt: -1 });

    const campaigns = savedCampaigns
      .filter(sc => sc.campaignId)
      .map(sc => sc.campaignId);

    res.status(200).json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Get saved campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved campaigns'
    });
  }
};

// Check if campaign is saved
exports.checkSaved = async (req, res) => {
  try {
    const { investorId, campaignId } = req.params;

    const saved = await SavedCampaign.findOne({ investorId, campaignId });

    res.status(200).json({
      success: true,
      isSaved: !!saved
    });
  } catch (error) {
    console.error('Check saved error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check saved status'
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const investor = await Investor.findById(userId);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    investor.password = newPassword;
    await investor.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
};

// Upload profile photo (Base64)
exports.uploadPhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    // Validate Base64 format
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format'
      });
    }

    const investor = await Investor.findByIdAndUpdate(
      userId,
      { profilePhoto: imageData },
      { new: true }
    ).select('-password -otp -otpExpiry');

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      investor
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo'
    });
  }
};
