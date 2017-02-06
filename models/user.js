const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    // Generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        // Hash our password using the salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            // Override password with its hash
            user.password = hash;
            next(); // Proceed
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;