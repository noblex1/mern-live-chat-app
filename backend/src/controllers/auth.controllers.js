import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import generateJWT from '../utils/generateJWT.js';

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

//sign in code

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // 2️⃣ Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Set user online status to true
    user.isOnline = true;
    await user.save();

    // 5️⃣ Generate token
    const token = generateJWT(user._id, res);

    // 6️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};
