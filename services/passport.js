const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

// Create local strategy
// To handle login
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) =>  {
    
    User.findOne({ email }, (err, foundUser) => {
        if (err) return done(err, false);
        if (!foundUser) return done(null, false);

        // Compare passwords 
        foundUser.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (!isMatch) return done(null, false);

            return done(null, foundUser);
        })
    })
})

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists in our database
    User.findById(payload.sub, (err, foundUser) => {
        if (err) return done(err, false);

        if (foundUser) done(null, foundUser); // If it does, call 'done' with that user
        else done(null, false); // else, call done without a user
    })
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);