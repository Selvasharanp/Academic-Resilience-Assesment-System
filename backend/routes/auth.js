const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register - Everyone is now a student
router.post('/register', async (req, res) => {
    try {
        console.log("Incoming body:", req.body);

        const { name, email, password } = req.body;

        console.log("Extracted email:", email);

        const existingUser = await User.findOne({ email });
        console.log("Existing user found:", existingUser);

        if (existingUser)
            return res.status(400).json({ message: "An account with this email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'student'
        });

        await user.save();

        res.status(201).json({ message: "Student account registered successfully" });
    } catch (err) {
        console.log("Error:", err);
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