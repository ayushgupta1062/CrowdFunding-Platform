const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorController');

router.get('/profile/:userId', investorController.getProfile);
router.put('/profile/:userId', investorController.updateProfile);
router.post('/upload-photo/:userId', investorController.uploadPhoto);
router.post('/save-campaign', investorController.saveCampaign);
router.post('/unsave-campaign', investorController.unsaveCampaign);
router.get('/saved-campaigns/:investorId', investorController.getSavedCampaigns);
router.get('/check-saved/:investorId/:campaignId', investorController.checkSaved);
router.put('/password/:userId', investorController.updatePassword);

module.exports = router;
