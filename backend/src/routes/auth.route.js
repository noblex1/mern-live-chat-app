// Import required packages
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateJWT from '../utils/generateJWT.js';
import auth from '../middleware/auth.middleware.js'
import { checkAuth, signIn, SignOut, signUp, changePassword, deleteAccount, updateSettings, getUsers } from '../controllers/auth.controllers.js';
import cloudinary from '../lib/cloudinary.js';



// Create router
const router = express.Router();

// Get user details by ID - GET /api/auth/user/:userId
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID, excluding password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
        city: user.city,
        relationshipStatus: user.relationshipStatus,
        bio: user.bio,
        location: user.location,
        dateOfBirth: user.dateOfBirth
      }
    });
    
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user details',
      error: error.message
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    // Get user data from request body
    const { username, email, password } = req.body;
    
    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }
    
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Hash (encrypt) the password for security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user object
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword
    });
    
    // Save user to database
    const savedUser = await newUser.save();
    
    // Generate JWT token and set cookie
    const token = generateJWT(savedUser._id, res);
    
    // Send success response (don't send password back)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token: token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar,
        isOnline: savedUser.isOnline
      }
    });
    
  } catch (error) {
    // Handle any errors
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login route - POST /api/auth/login
router.post('/login', signIn);

// Logout route - POST /api/auth/logout
router.post('/logout', auth, SignOut);

// Check authentication route - GET /api/auth/check
router.get('/check', auth, checkAuth);



// Get current user route - GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        isOnline: req.user.isOnline,
        createdAt: req.user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user information',
      error: error.message
    });
  }
});

// Get users that have had conversations with the current user
router.get('/users', auth, async (req, res) => {
  try {
    // Import message model
    const Message = (await import('../models/message.model.js')).default;
    
    // Find all unique user IDs that have had conversations with the current user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: null,
          userIds: {
            $addToSet: {
              $cond: [
                { $eq: ['$senderId', req.user._id] },
                '$receiverId',
                '$senderId'
              ]
            }
          }
        }
      }
    ]);

    // Extract user IDs from conversations
    const conversationUserIds = conversations.length > 0 ? conversations[0].userIds : [];
    
    // Get users that have had conversations with the current user
    const users = await User.find({ 
      _id: { $in: conversationUserIds }
    }).select('_id username avatar isOnline');
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching conversation users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

// Get all users (for chat)
router.get('/users/all', auth, getUsers);

// Search all users (for new conversations)
router.get('/users/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    let searchQuery = { _id: { $ne: req.user._id } };
    
    if (query) {
      searchQuery.username = { $regex: query, $options: 'i' };
    }
    
    const users = await User.find(searchQuery).select('_id username avatar isOnline');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, message: 'Failed to search users', error: error.message });
  }
});

// Update profile route - PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    // Get update data from request
    const { username, email, avatar, city, relationshipStatus, bio, location, dateOfBirth } = req.body;


    // Prepare update object (only include provided fields)
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (city) updateData.city = city;
    if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    if (avatar) {

     const imageUploadRes = await cloudinary.uploader.upload(avatar)

     const avatarUrl = imageUploadRes.secure_url
      updateData.avatar = avatarUrl;
    }



   

    // Check if username or email is being changed to one that already exists
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },  // Not the current user
          { $or: [
            username ? { username: username } : {},
            email ? { email: email } : {}
          ].filter(obj => Object.keys(obj).length > 0) }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already taken by another user'
        });
      }
    }
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true,           // Return updated document
        runValidators: true  // Run schema validations
      }
    ).select('-password');  // Don't return password
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isOnline: updatedUser.isOnline,
        city: updatedUser.city,
        relationshipStatus: updatedUser.relationshipStatus,
        bio: updatedUser.bio,
        location: updatedUser.location,
        dateOfBirth: updatedUser.dateOfBirth
      }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: error.message
    });
  }
});

// Change password route - PUT /api/auth/change-password
router.put('/change-password', auth, changePassword);

// Delete account route - DELETE /api/auth/delete-account
router.delete('/delete-account', auth, deleteAccount);

// Update settings route - PUT /api/auth/settings
router.put('/settings', auth, updateSettings);

// Export the router
export default router;