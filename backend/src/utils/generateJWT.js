import jwt from 'jsonwebtoken';

const generateJWT = (userId, res) => {
  // Create JWT token
  const token = jwt.sign(
    { userId },                    // Payload (user ID)
    process.env.JWT_SECRET,        // Secret key
    { expiresIn: '24h' }          // Token expires in 24 hours
  );
  
  // Set token as HTTP-only cookie
  res.cookie('jwt', token, {
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours in milliseconds
    httpOnly: true,               // Prevents XSS attacks
    sameSite: 'strict',           // Prevents CSRF attacks
    secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
  });
  
  return token;
};

export default generateJWT;