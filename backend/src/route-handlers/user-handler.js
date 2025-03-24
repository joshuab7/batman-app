const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');
const userController = {
async register(req, res) {
    try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = await User.create({ username, email, password });
        const token = generateToken(newUser);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });
        } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration' });
        }
},
async login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        await User.updateLastLogin(user.id);
        const token = generateToken(user);
        const preferences = await User.getPreferences(user.id);
        res.json({
            message: 'Login successful',
            user: {
            id: user.id,
            username: user.username,
            email: user.email,
            date_joined: user.date_joined,
            last_login: user.last_login
            },
            preferences,
            token
        });
        } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error during login' });
        }
},
async getProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = await User.getPreferences(userId);
        res.json({
            user,
            preferences
        });
        } catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ message: 'Server error getting profile' });
        }
},
async updateTheme(req, res) {
        try {
        const userId = req.user.id;
        const { theme } = req.body;
        if (!theme) {
            return res.status(400).json({ message: 'Please provide a theme' });
        }
        const updatedPreferences = await User.updateTheme(userId, theme);
        res.json({
            message: 'Theme updated successfully',
            preferences: updatedPreferences
        });
        } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ message: 'Server error updating theme' });
        }
    }
};

module.exports = userController;