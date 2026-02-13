const express = require('express');
const passport = require('passport');
const router = express.Router();

// Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google auth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/'); // Redirect to frontend home
    }
);

// Get current user
router.get('/current_user', (req, res) => {
    res.json(req.user || null);
});

// Helper to determine role and name from email
const getInfoFromEmail = (email) => {
    const namePart = email.split('@')[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    if (email === 'admin@fitfocus.ai') return { role: 'admin', name };
    if (email.startsWith('host') || email.startsWith('trainer')) return { role: 'host', name };
    return { role: 'customer', name };
};

// Simple login for alternative roles
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const User = require('../models/User');
        let user = await User.findOne({ email });

        if (!user) {
            const { role, name } = getInfoFromEmail(email);
            user = new User({
                email,
                name,
                role,
                photoUrl: `https://ui-avatars.com/api/?name=${name}&background=0f172a&color=fff`
            });
            await user.save();
        }

        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login failed' });
            res.json(user);
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
