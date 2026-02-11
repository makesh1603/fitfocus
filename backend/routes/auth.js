const express = require('express');
const passport = require('passport');
const router = express.Router();

// Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google auth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('http://localhost:3000/'); // Redirect to frontend home
    }
);

// Get current user
router.get('/current_user', (req, res) => {
    res.json(req.user || null);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:3000/');
    });
});

module.exports = router;
