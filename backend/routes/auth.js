const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register - Everyone is now a student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "An account with this email already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user with the role hardcoded as 'student'
        const user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'student' 
        });
        await user.save();
        
        res.status(201).json({ message: "Student account registered successfully" });
    } catch (err) { 
        res.status(500).json({ error: "Server error during registration" }); 
    }
});

// Login - Simplified for students only
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // Generate Token (no role needed in payload)
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });

        // Send response
        res.json({ 
            token, 
            userId: user._id, 
            name: user.name 
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;