const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Investor = require('../models/Investor');
const StartupOwner = require('../models/StartupOwner');
const Campaign = require('../models/Campaign');

// Get or create conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { investorId, ownerId, campaignId } = req.body;

    let conversation = await Conversation.findOne({
      investorId,
      ownerId,
      campaignId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        investorId,
        ownerId,
        campaignId
      });
    }

    // Populate details
    const investor = await Investor.findById(investorId).select('fullName profilePhoto');
    const owner = await StartupOwner.findById(ownerId).select('fullName profilePhoto startupName');
    const campaign = await Campaign.findById(campaignId).select('projectName');

    res.status(200).json({
      success: true,
      conversation: {
        ...conversation.toObject(),
        investor,
        owner,
        campaign
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation'
    });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    const query = userType === 'investor' 
      ? { investorId: userId }
      : { ownerId: userId };

    const conversations = await Conversation.find(query)
      .sort({ lastMessageTime: -1 });

    // Populate details
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const investor = await Investor.findById(conv.investorId).select('fullName profilePhoto email');
        const owner = await StartupOwner.findById(conv.ownerId).select('fullName profilePhoto startupName email');
        const campaign = await Campaign.findById(conv.campaignId).select('projectName category');

        return {
          ...conv.toObject(),
          investor,
          owner,
          campaign
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: populatedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderType, message } = req.body;

    const newMessage = await Message.create({
      conversationId,
      senderId,
      senderType,
      message
    });

    // Update conversation
    const conversation = await Conversation.findById(conversationId);
    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();
    
    if (senderType === 'investor') {
      conversation.unreadCountOwner += 1;
    } else {
      conversation.unreadCountInvestor += 1;
    }
    
    await conversation.save();

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId, userType } = req.body;

    await Message.updateMany(
      { 
        conversationId,
        senderType: userType === 'investor' ? 'owner' : 'investor',
        isRead: false
      },
      { isRead: true }
    );

    // Reset unread count
    const conversation = await Conversation.findById(conversationId);
    if (userType === 'investor') {
      conversation.unreadCountInvestor = 0;
    } else {
      conversation.unreadCountOwner = 0;
    }
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};
