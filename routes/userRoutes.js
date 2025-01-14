const express = require('express');
const bcrypt = require('bcryptjs'); // To hash passwords and compare them
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Utility to generate token
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user with hashed password
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // Return user data along with a JWT token
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

        // Compare the plain text password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return user data along with a JWT token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
