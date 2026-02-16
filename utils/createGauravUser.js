const mongoose = require('mongoose');
require('dotenv').config();

const StartupOwner = require('../models/StartupOwner');
const Campaign = require('../models/Campaign');

async function createGauravUser() {
  try {
    await mongoose.connect(process.env.DATABASELINK);
    console.log('Connected to database');

    // Check if Gaurav already exists
    let gaurav = await StartupOwner.findOne({ email: 'mishrapriyanshu369@gmail.com' });
    
    if (gaurav) {
      console.log('Gaurav user already exists');
    } else {
      // Create Gaurav as a startup owner
      gaurav = await StartupOwner.create({
        fullName: "Gaurav Mishra",
        email: "mishrapriyanshu369@gmail.com",
        password: "12345678",
        phone: "+91 9876543210",
        startupName: "TechVenture Labs",
        projectCategory: "Technology",
        projectStage: "mvp",
        teamSize: 8,
        websiteLink: "https://techventure.com",
        startupDescription: "Building innovative tech solutions for modern businesses",
        isVerified: true
      });
      console.log('Created Gaurav user successfully');
    }

    // Create campaigns for Gaurav
    const gauravCampaigns = [
      {
        ownerId: gaurav._id,
        projectName: "SmartHome AI Assistant",
        startupName: gaurav.startupName,
        ownerName: gaurav.fullName,
        category: "Technology",
        tagline: "Voice-controlled home automation with advanced AI",
        description: "A revolutionary smart home system that learns your preferences and automates your entire home. Features include voice control, energy optimization, security monitoring, and seamless integration with all your devices.",
        fundingGoal: 120000,
        currentFunding: 78000,
        projectStage: "mvp",
        teamSize: 8,
        websiteLink: "https://techventure.com/smarthome",
        status: "active",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        ownerId: gaurav._id,
        projectName: "CryptoWallet Pro",
        startupName: gaurav.startupName,
        ownerName: gaurav.fullName,
        category: "Finance",
        tagline: "Secure cryptocurrency wallet with multi-chain support",
        description: "The most secure and user-friendly cryptocurrency wallet supporting Bitcoin, Ethereum, and 50+ other cryptocurrencies. Features hardware wallet integration, DeFi access, and institutional-grade security.",
        fundingGoal: 200000,
        currentFunding: 145000,
        projectStage: "launched",
        teamSize: 8,
        websiteLink: "https://techventure.com/cryptowallet",
        status: "active",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        ownerId: gaurav._id,
        projectName: "EduLearn Platform",
        startupName: gaurav.startupName,
        ownerName: gaurav.fullName,
        category: "Education",
        tagline: "Interactive coding bootcamp for aspiring developers",
        description: "An online learning platform offering comprehensive coding bootcamps with live mentorship, real-world projects, and job placement assistance. Learn web development, mobile apps, and cloud computing.",
        fundingGoal: 85000,
        currentFunding: 52000,
        projectStage: "mvp",
        teamSize: 8,
        websiteLink: "https://techventure.com/edulearn",
        status: "active",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ];

    // Delete existing campaigns by Gaurav
    await Campaign.deleteMany({ ownerId: gaurav._id });
    console.log('Cleared existing Gaurav campaigns');

    // Insert new campaigns
    await Campaign.insertMany(gauravCampaigns);
    console.log(`Created ${gauravCampaigns.length} campaigns for Gaurav`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating Gaurav user:', error);
    process.exit(1);
  }
}

createGauravUser();
