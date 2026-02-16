const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.get('/profile/:userId', ownerController.getProfile);
router.put('/profile/:userId', ownerController.updateProfile);
router.post('/upload-photo/:userId', ownerController.uploadPhoto);
router.put('/password/:userId', ownerController.updatePassword);
router.get('/campaigns/:ownerId', ownerController.getOwnerCampaigns);
router.get('/stats/:ownerId', ownerController.getDashboardStats);
router.delete('/campaign/:campaignId', ownerController.deleteCampaign);
router.put('/campaign/:campaignId', ownerController.updateCampaign);

module.exports = router;
