const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user and hash password
        const user = new User(name, email, password);
        await user.hashPassword();

        // Insert user into database
        const result = await collection.insertOne({
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: new Date()
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { email, password } = req.body;

        // Find user by email
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Update profile route
router.put('/update', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { name } = req.body;

        // Update user name
        const result = await collection.updateOne(
            { email: decoded.email },
            { $set: { name: name, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate new token with updated name
        const newToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, name: name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Profile updated successfully',
            token: newToken,
            name: name
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;