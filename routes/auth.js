const express = require('express');
const router = express.Router();
const passport = require('../config/auth.js');

// Google Authentication Routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/AI-diary/login?error=google_auth_failed' }),
    (req, res) => {
        req.flash('success', 'Welcome! You have successfully logged in with Google.');
        res.redirect('/AI-diary');
    }
);

// GitHub Authentication Routes
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/AI-diary/login?error=github_auth_failed' }),
    (req, res) => {
        req.flash('success', 'Welcome! You have successfully logged in with GitHub.');
        res.redirect('/AI-diary');
    }
);

// Instagram Authentication Routes
router.get('/instagram',
    passport.authenticate('instagram')
);

router.get('/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/AI-diary/login?error=instagram_auth_failed' }),
    (req, res) => {
        req.flash('success', 'Welcome! You have successfully logged in with Instagram.');
        res.redirect('/AI-diary');
    }
);

// Logout route (if needed)
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/');
    });
});

module.exports = router;