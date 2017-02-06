const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
         sub: user.id, // sub: subject (Who sent the token)
         iat: timestamp // iat: Issued at (When was the token sent)
    }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and password authenticated
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {

    const { email, password } = req.body;

    if (!email || !password) 
        return res.status(422).send({ error: 'Email and password are required' });

    // See if a user with the given email exists
    User.findOne({ email }, (err,  existingUser) => {
        if(err) return next(err);

        // If a user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        } else {
            // If a user with email does NOT exist, create and save user
            const user = new User({
                email, password
            });

            user.save((err) => {
                if (err) return next(err);

                // Respond to request indicating the user was created
                res.json({ token: tokenForUser(user) });
            })
        }  
    })   
}