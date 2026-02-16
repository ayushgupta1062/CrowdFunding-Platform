const mongoose = require('mongoose');
require('dotenv').config();

const Campaign = require('../models/Campaign');
const StartupOwner = require('../models/StartupOwner');

const sampleCampaigns = [
  {
    projectName: "AI-Powered Learning Platform",
    tagline: "Revolutionizing education with personalized AI tutoring",
    description: "An innovative platform that uses artificial intelligence to provide personalized learning experiences for students of all ages.",
    fundingGoal: 50000,
    currentFunding: 32500,
    category: "Technology",
    projectStage: "mvp"
  },
  {
    projectName: "EcoFriendly Packaging Solutions",
    tagline: "Sustainable packaging for a greener tomorrow",
    description: "Biodegradable packaging materials that help businesses reduce their environmental footprint.",
    fundingGoal: 75000,
    currentFunding: 45000,
    category: "Other",
    projectStage: "prototype"
  },
  {
    projectName: "HealthTrack Wearable",
    tagline: "Your personal health companion on your wrist",
    description: "Advanced wearable technology that monitors vital signs and provides real-time health insights.",
    fundingGoal: 100000,
    currentFunding: 68000,
    category: "Healthcare",
    projectStage: "launched"
  },
  {
    projectName: "FinanceFlow App",
    tagline: "Smart budgeting made simple",
    description: "A mobile app that helps individuals and small businesses manage their finances with AI-powered insights.",
    fundingGoal: 40000,
    currentFunding: 15000,
    category: "Finance",
    projectStage: "mvp"
  },
  {
    projectName: "EduKids Online",
    tagline: "Interactive learning for young minds",
    description: "Engaging educational content and games designed to make learning fun for children aged 5-12.",
    fundingGoal: 60000,
    currentFunding: 42000,
    category: "Education",
    projectStage: "launched"
  },
  {
    projectName: "ShopLocal Marketplace",
    tagline: "Connect with local businesses in your community",
    description: "An e-commerce platform that promotes local businesses and sustainable shopping practices.",
    fundingGoal: 80000,
    currentFunding: 25000,
    category: "E-commerce",
    projectStage: "prototype"
  }
];

async function seedCampaigns() {
  try {
    await mongoose.connect(process.env.DATABASELINK);
    console.log('Connected to database');

    // Find a startup owner to associate campaigns with
    let owner = await StartupOwner.findOne();
    
    if (!owner) {
      console.log('No startup owner found. Creating a sample owner...');
      owner = await StartupOwner.create({
        fullName: "John Doe",
        email: "owner@example.com",
        password: "password123",
        phone: "1234567890",
        startupName: "Innovation Labs",
        projectCategory: "Technology",
        projectStage: "mvp",
        teamSize: 5,
        startupDescription: "Building the future of technology",
        isVerified: true
      });
    }

    // Clear existing campaigns
    await Campaign.deleteMany({});
    console.log('Cleared existing campaigns');

    // Create sample campaigns
    const campaigns = sampleCampaigns.map(campaign => ({
      ...campaign,
      ownerId: owner._id,
      startupName: owner.startupName,
      ownerName: owner.fullName,
      teamSize: owner.teamSize || 5,
      websiteLink: owner.websiteLink || '',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
    }));

    await Campaign.insertMany(campaigns);
    console.log(`Created ${campaigns.length} sample campaigns`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding campaigns:', error);
    process.exit(1);
  }
}

seedCampaigns();
