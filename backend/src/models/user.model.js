// Import mongoose
import mongoose from 'mongoose';

// Define the structure for user data
const userSchema = new mongoose.Schema({
  username: {
    type: String,        // Must be text
    required: true,      // Must be provided
    unique: true,        // No two users can have same username
    trim: true,          // Removes extra spaces
    minlength: 3,        // At least 3 characters
    maxlength: 20        // At most 20 characters
  },
  email: {
    type: String,
    required: true,
    unique: true,        // No two users can have same email
    lowercase: true      // Converts to lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6         // At least 6 characters
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=User'
  },
  isOnline: {
    type: Boolean,       // true or false
    default: false       // New users start offline
  },
  city: {
    type: String,
    default: 'Unknown'   // Default value if not provided
  },
  relationshipStatus: {
    type: String,
    // enum: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed'],
    // default: 'Single'    // Default value if not provided
  },
  bio: {
    type: String,        // Bio can be text
    default: ''          // Default is empty string
  },
  location: {
    type: String,         // Location can be a string
    default: 'Unknown'    // Default value if not provided
  },
  dateOfBirth: {
    type: Date,          // Date of birth can be a date
    default: null        // Default is null if not provided
  },
}, {
  timestamps: true       // Automatically adds createdAt and updatedAt
});

// Create and export the User model
const userModel = mongoose.model('User', userSchema);
export default userModel;