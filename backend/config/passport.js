const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    // If user has an _id (from DB), use it. Otherwise use the googleId (from virtual user)
    done(null, user._id || user.googleId || user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // If it's a MongoDB ID
        if (mongoose.Types.ObjectId.isValid(id)) {
            const user = await User.findById(id);
            if (user) return done(null, user);
        }

        // Otherwise, it might be a virtual user id (googleId)
        // Since we don't have a persistent store for virtual users, 
        // this will only work for the current session if the user object is cached.
        // For simplicity in resilient mode, we return a mock user if DB is down.
        if (mongoose.connection.readyState !== 1) {
            return done(null, {
                id: id,
                name: 'Guest User',
                email: 'guest@fitfocus.ai',
                role: 'customer'
            });
        }

        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // If DB is not connected, use a virtual user immediately
            if (mongoose.connection.readyState !== 1) {
                console.log('Using virtual Google user (DB disconnected)');
                return done(null, {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photoUrl: profile.photos[0].value,
                    role: 'customer'
                });
            }

            // Check if user exists in DB
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            let existingEmailUser = await User.findOne({ email: profile.emails[0].value });
            if (existingEmailUser) {
                existingEmailUser.googleId = profile.id;
                if (!existingEmailUser.photoUrl) existingEmailUser.photoUrl = profile.photos[0].value;
                await existingEmailUser.save();
                return done(null, existingEmailUser);
            }

            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                photoUrl: profile.photos[0].value,
                role: 'customer'
            });

            await newUser.save();
            done(null, newUser);

        } catch (err) {
            console.error('Passport Google Strategy Error:', err);
            // Fallback to virtual user even on error
            done(null, {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                photoUrl: profile.photos[0].value,
                role: 'customer'
            });
        }
    }
));
