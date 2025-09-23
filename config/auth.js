const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/user.js');

// Local Strategy (existing)
passport.use(new LocalStrategy(User.authenticate()));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let existingUser = await User.findOne({ 
                $or: [
                    { googleId: profile.id },
                    { email: profile.emails[0].value }
                ]
            });

            if (existingUser) {
                // Update Google ID if not set
                if (!existingUser.googleId) {
                    existingUser.googleId = profile.id;
                    await existingUser.save();
                }
                return done(null, existingUser);
            }

            // Create new user
            const newUser = new User({
                googleId: profile.id,
                username: profile.emails[0].value.split('@')[0] + '_' + Date.now(),
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0].value
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }));
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let existingUser = await User.findOne({ 
                $or: [
                    { githubId: profile.id },
                    { email: profile.emails && profile.emails[0] ? profile.emails[0].value : null }
                ]
            });

            if (existingUser) {
                // Update GitHub ID if not set
                if (!existingUser.githubId) {
                    existingUser.githubId = profile.id;
                    await existingUser.save();
                }
                return done(null, existingUser);
            }

            // Create new user
            const newUser = new User({
                githubId: profile.id,
                username: profile.username + '_' + Date.now(),
                email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                name: profile.displayName || profile.username,
                avatar: profile.photos[0].value
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }));
}

// Instagram OAuth Strategy
if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
    passport.use(new InstagramStrategy({
        clientID: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/instagram/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let existingUser = await User.findOne({ 
                instagramId: profile.id 
            });

            if (existingUser) {
                return done(null, existingUser);
            }

            // Create new user
            const newUser = new User({
                instagramId: profile.id,
                username: profile.username + '_' + Date.now(),
                name: profile.displayName,
                avatar: profile.photos[0].value
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, null);
        }
    }));
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;