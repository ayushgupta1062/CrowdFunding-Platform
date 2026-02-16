const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.get('/', campaignController.getAllCampaigns);
router.get('/category/:category', campaignController.getCampaignsByCategory);
router.get('/:id', campaignController.getCampaign);
router.post('/create', campaignController.createCampaign);

module.exports = router;
