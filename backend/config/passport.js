const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
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
            // Check if user exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // If not, create new user
            // Note: We might want to check email too, to link accounts if they signed up with email first (if we had email auth)
            // For now, simple google auth.
            let existingEmailUser = await User.findOne({ email: profile.emails[0].value });
            if (existingEmailUser) {
                // Link google ID to existing email user
                existingEmailUser.googleId = profile.id;
                if (!existingEmailUser.photoUrl) existingEmailUser.photoUrl = profile.photos[0].value;
                await existingEmailUser.save();
                return done(null, existingEmailUser);
            }

            // Create new
            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                photoUrl: profile.photos[0].value,
                role: 'customer' // Default role
            });

            await newUser.save();
            done(null, newUser);

        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }
));
