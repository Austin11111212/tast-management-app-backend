const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const User = require('../models/User'); // User model
const generateToken = require('../utils/generateToken'); // JWT generation utility
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user with the hashed password
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Save hashed password
        });

        // Respond with user data and JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Generate JWT token
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Respond with user data and JWT
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Generate JWT token
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
