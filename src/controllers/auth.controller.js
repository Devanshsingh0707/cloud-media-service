const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";// later move to .env

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Registered successfully. Please login.",
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // ❌ User not registered
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ❌ Wrong password
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    // ✅ Login success
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
