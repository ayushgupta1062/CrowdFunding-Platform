const Campaign = require('../models/Campaign');
const StartupOwner = require('../models/StartupOwner');

// Get all campaigns with search and filters
exports.getAllCampaigns = async (req, res) => {
  try {
    const { search, category, minFunding, maxFunding, stage } = req.query;
    
    let query = { status: 'active' };
    
    // Search by title or owner name
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { startupName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by funding goal
    if (minFunding || maxFunding) {
      query.fundingGoal = {};
      if (minFunding) query.fundingGoal.$gte = parseInt(minFunding);
      if (maxFunding) query.fundingGoal.$lte = parseInt(maxFunding);
    }
    
    // Filter by project stage
    if (stage) {
      query.projectStage = stage;
    }
    
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns'
    });
  }
};

// Get campaigns by category
exports.getCampaignsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const campaigns = await Campaign.find({ 
      category, 
      status: 'active' 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Get campaigns by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns'
    });
  }
};

// Get single campaign
exports.getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.status(200).json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign'
    });
  }
};

// Create campaign (for startup owners)
exports.createCampaign = async (req, res) => {
  try {
    const {
      ownerId,
      projectName,
      tagline,
      description,
      fundingGoal,
      category,
      deadline,
      imageData
    } = req.body;

    if (!ownerId || !projectName || !tagline || !description || !fundingGoal || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const owner = await StartupOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Startup owner not found'
      });
    }

    // Validate Base64 image if provided
    if (imageData && !imageData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format'
      });
    }

    const campaign = await Campaign.create({
      ownerId,
      projectName,
      startupName: owner.startupName,
      ownerName: owner.fullName,
      category,
      tagline,
      description,
      fundingGoal,
      projectStage: owner.projectStage,
      teamSize: owner.teamSize,
      websiteLink: owner.websiteLink,
      imageUrl: imageData || '',
      deadline: deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days default
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign'
    });
  }
};
