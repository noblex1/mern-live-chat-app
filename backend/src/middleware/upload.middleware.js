import multer from 'multer';
import cloudinary from '../lib/cloudinary.js';

// Use memory storage instead
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Modified upload middleware
export const uploadImage = upload.single('image');

// Add a middleware to upload to Cloudinary
export const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  
  try {
    cloudinary.uploader.upload_stream(
      {
        folder: 'chat-images',
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: 'Upload failed' });
        }
        req.file.cloudinaryUrl = result.secure_url;
        next();
      }
    ).end(req.file.buffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + error.message
    });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  next(error);
};

export default upload; 