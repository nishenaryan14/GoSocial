const express = require("express");
const session = require("express-session");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

// Session middleware configuration
router.use(
  session({
    secret: "your-secret-key", // Change this to a random secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

// Register Route
router.post("/register", async (req, res) => {
  try {
    // generate new password (encrypted one)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
    });

    // save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    // Set user session
    req.session.user = user;

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    // Redirect or send a success response
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
