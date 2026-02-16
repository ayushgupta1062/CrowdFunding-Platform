const Investor = require('../models/Investor');
const StartupOwner = require('../models/StartupOwner');
const { generateOTP, getOTPExpiry } = require('../utils/otpGenerator');
const { sendOTPEmail, sendResetPasswordOTP } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Register user and send OTP
exports.register = async (req, res) => {
  try {
    const { 
      fullName, email, password, phone, role,
      investmentBudget, preferredCategories, investorBio,
      startupName, projectCategory, projectStage, teamSize, websiteLink, startupDescription
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    let user;
    let Model = role === 'investor' ? Investor : StartupOwner;

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create or update user based on role
    if (role === 'investor') {
      const userData = {
        fullName,
        email,
        password,
        phone,
        investmentBudget: investmentBudget || '',
        preferredCategories: preferredCategories || [],
        investorBio: investorBio || '',
        otp,
        otpExpiry
      };

      if (existingUser) {
        Object.assign(existingUser, userData);
        user = await existingUser.save();
      } else {
        user = await Investor.create(userData);
      }
    } else if (role === 'startup_owner') {
      if (!startupName || !projectCategory || !projectStage || !teamSize || !startupDescription) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required startup fields'
        });
      }

      const userData = {
        fullName,
        email,
        password,
        phone,
        startupName,
        projectCategory,
        projectStage,
        teamSize: parseInt(teamSize),
        websiteLink: websiteLink || '',
        startupDescription,
        otp,
        otpExpiry
      };

      if (existingUser) {
        Object.assign(existingUser, userData);
        user = await existingUser.save();
      } else {
        user = await StartupOwner.create(userData);
      }
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, fullName, role);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email successfully',
      userId: user._id,
      role: role
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp, role } = req.body;
    
    console.log('Verify OTP Request:', { userId, otp, role });

    if (!userId || !otp || !role) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID, OTP and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', { email: user.email, isVerified: user.isVerified, storedOtp: user.otp });

    if (user.isVerified) {
      console.log('User already verified');
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      console.log('OTP expired:', { otpExpiry: user.otpExpiry, now: new Date() });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      console.log('Invalid OTP:', { expected: user.otp, received: otp });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    console.log('User verified successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: role
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, otp, user.fullName, role);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this role'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    const emailResult = await sendResetPasswordOTP(email, otp, user.fullName);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      userId: user._id,
      role: role
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
};

// Verify reset password OTP
exports.verifyResetOTP = async (req, res) => {
  try {
    const { userId, otp, role } = req.body;

    if (!userId || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID, OTP and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (new Date() > user.resetPasswordOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID, new password and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};


// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID, password and role'
      });
    }

    const Model = role === 'investor' ? Investor : StartupOwner;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};
