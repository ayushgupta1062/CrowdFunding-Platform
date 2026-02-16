const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/conversation', chatController.getOrCreateConversation);
router.get('/conversations/:userId/:userType', chatController.getConversations);
router.get('/messages/:conversationId', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.post('/mark-read', chatController.markAsRead);

module.exports = router;
