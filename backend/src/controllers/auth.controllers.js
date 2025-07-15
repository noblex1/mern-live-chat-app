import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

export const signUp = async (req, res) => {
  const { username, email, password, avatar } = req.body;
  try {
    // Validate data
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Encrypt the password using bycryptjs
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
        return res.status(404).json({
            message: "Password hashing failed"
        })
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      avatar
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
       message: "Internal server error",
        error: error.message
    });
  }
};