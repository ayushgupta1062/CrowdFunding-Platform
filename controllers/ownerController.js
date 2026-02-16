const StartupOwner = require('../models/StartupOwner');
const Campaign = require('../models/Campaign');

// Get owner profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const owner = await StartupOwner.findById(userId).select('-password -otp -otpExpiry');
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Startup owner not found'
      });
    }

    res.status(200).json({
      success: true,
      owner
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update owner profile
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

    const owner = await StartupOwner.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Startup owner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      owner
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
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

    const owner = await StartupOwner.findByIdAndUpdate(
      userId,
      { profilePhoto: imageData },
      { new: true }
    ).select('-password -otp -otpExpiry');

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Startup owner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      owner
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo'
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const owner = await StartupOwner.findById(userId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Startup owner not found'
      });
    }

    if (owner.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    owner.password = newPassword;
    await owner.save();

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

// Get owner campaigns
exports.getOwnerCampaigns = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const campaigns = await Campaign.find({ ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Get owner campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns'
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const campaigns = await Campaign.find({ ownerId });
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalFunding = campaigns.reduce((sum, c) => sum + c.currentFunding, 0);
    
    // For now, backers is a placeholder - you can add a Backers model later
    const totalBackers = 0;

    res.status(200).json({
      success: true,
      stats: {
        activeCampaigns,
        totalFunding,
        totalBackers,
        totalCampaigns: campaigns.length
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

// Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { ownerId } = req.body;

    const campaign = await Campaign.findOne({ _id: campaignId, ownerId });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or unauthorized'
      });
    }

    await Campaign.findByIdAndDelete(campaignId);

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign'
    });
  }
};

// Update campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;

    // Don't allow updating ownerId
    delete updates.ownerId;

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      updates,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign'
    });
  }
};
