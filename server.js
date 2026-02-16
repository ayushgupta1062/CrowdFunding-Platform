require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const investorRoutes = require('./routes/investorRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/chat', chatRoutes);

// View routes
app.get('/', (req, res) => res.redirect('/register'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/verify-otp', (req, res) => res.render('verify-otp'));
app.get('/forgot-password', (req, res) => res.render('forgot-password'));
app.get('/verify-reset-otp', (req, res) => res.render('verify-reset-otp'));
app.get('/reset-password', (req, res) => res.render('reset-password'));
app.get('/investor/dashboard', (req, res) => res.render('investor-dashboard'));
app.get('/investor/explore', (req, res) => res.render('investor-explore'));
app.get('/investor/saved', (req, res) => res.render('investor-saved'));
app.get('/investor/profile', (req, res) => res.render('investor-profile'));
app.get('/investor/messages', (req, res) => res.render('investor-messages'));
app.get('/owner/dashboard', (req, res) => res.render('owner-dashboard'));
app.get('/owner/campaigns', (req, res) => res.render('owner-campaigns'));
app.get('/owner/create-campaign', (req, res) => res.render('owner-create-campaign'));
app.get('/owner/analytics', (req, res) => res.render('owner-analytics'));
app.get('/owner/profile', (req, res) => res.render('owner-profile'));
app.get('/owner/messages', (req, res) => res.render('owner-messages'));
app.get('/registration-success', (req, res) => res.render('registration-success'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Socket.io connection handling
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const { conversationId, senderId, senderType, message } = data;

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

      // Emit to all clients in the conversation
      io.to(conversationId).emit('new-message', newMessage);
    } catch (error) {
      console.error('Socket send message error:', error);
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user-typing', data);
  });

  socket.on('stop-typing', (data) => {
    socket.to(data.conversationId).emit('user-stop-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
