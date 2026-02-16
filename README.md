# Crowd Funding Platform

A comprehensive crowdfunding platform built with Node.js, Express, MongoDB, and Socket.io that connects startup owners with potential investors.

## Features

### For Startup Owners
- **User Registration & Authentication** with email verification
- **Dashboard** with campaign analytics and statistics
- **Campaign Management** - Create, edit, and manage crowdfunding campaigns
- **Real-time Chat** with interested investors
- **Profile Management** with social links and bio
- **Analytics** to track campaign performance

### For Investors
- **Browse Campaigns** with advanced search and filtering
- **Save Campaigns** for later review
- **Real-time Chat** with startup owners
- **Profile Management** with investment preferences
- **Dashboard** to track saved campaigns and activities

### Technical Features
- **Real-time Messaging** using Socket.io
- **Email Verification** with OTP system
- **Password Reset** functionality
- **Base64 Image Storage** for deployment compatibility
- **Responsive Design** with Bootstrap
- **JWT Authentication**
- **MongoDB Database** with Mongoose ODM

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templates, Bootstrap 5, JavaScript
- **Real-time**: Socket.io
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **File Handling**: Base64 encoding (no file system dependency)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Priyanshu4941/Crowd_Funding_Platform_.git
cd Crowd_Funding_Platform_
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=3000
```

4. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── controllers/          # Route controllers
├── models/              # MongoDB models
├── routes/              # Express routes
├── views/               # EJS templates
├── utils/               # Utility functions
├── config/              # Database configuration
├── public/              # Static files
└── server.js            # Main application file
```

## Key Models

- **User**: Base user authentication
- **StartupOwner**: Startup owner profiles and details
- **Investor**: Investor profiles and preferences
- **Campaign**: Crowdfunding campaigns
- **Conversation**: Chat conversations
- **Message**: Chat messages
- **SavedCampaign**: Investor saved campaigns

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns/create` - Create new campaign
- `GET /api/campaigns/:id` - Get single campaign

### Chat
- `GET /api/chat/conversations/:userId` - Get user conversations
- `POST /api/chat/send` - Send message

## Deployment

This application is designed to be deployment-friendly:

- **No file system dependencies** - Images stored as Base64 in MongoDB
- **Environment variables** for configuration
- **MongoDB Atlas** compatible
- **Heroku/Render** ready

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any questions or support, please contact the development team.