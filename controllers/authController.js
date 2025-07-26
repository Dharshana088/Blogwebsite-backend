import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt?.sign(
    {
      id: user?._id,
      username: user?.username,
      email: user?.email,
    },
    process?.env?.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req?.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res?.status(400)?.json({ 
        success: false,
        message: "All fields are required(username,email,password)" 
      });
    }

    const existingUser = await User?.findOne({
      $or: [{ email: email?.trim()?.toLowerCase() }, { username }]
    });

    if (existingUser) {
      const message = existingUser?.email === email?.toLowerCase() 
        ? "Email already registered" 
        : "Username not available";
      return res?.status(400)?.json({ success: false, message });
    }

    const newUser = await User?.create({
      username: username?.trim(),
      email: email?.trim()?.toLowerCase(),
      password
    });

    return res?.status(201)?.json({
      success: true,
      token: generateToken(newUser), 
      user: {
        _id: newUser?._id,
        username: newUser?.username,
        email: newUser?.email
      }
    });

  } catch (error) {
    console?.error("Registration error:", error);
    return res?.status(500)?.json({
      success: false,
      message: "Registration failed",
      error: error?.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req?.body;

    if (!email?.trim() || !password) {
      return res?.status(400)?.json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const user = await User?.findOne({ 
      email: email?.trim()?.toLowerCase() 
    })?.select("+password");

    let isMatch = false;
    if (user?.matchPassword) {
      isMatch = await user?.matchPassword(password);
    }

    if (!user || !isMatch) {
      return res?.status(401)?.json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    return res?.status(200)?.json({
      success: true,
      token: generateToken(user), 
      user: {
        _id: user?._id,
        username: user?.username,
        email: user?.email
      }
    });

  } catch (error) {
    console?.error("Login error:", error);
    return res?.status(500)?.json({
      success: false,
      message: "Login failed",
      error: error?.message
    });
  }
};
