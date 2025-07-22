// Import required packages
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Authentication middleware function
const auth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.jwt || req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    
    // Check if user still exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists'
      });
    }
    
    // Add user to request object so routes can access it
    req.user = user;
    
    // Continue to the next middleware/route
    next();
    
  } catch (error) {
    // Token is invalid
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Export the middleware
export default auth;