const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    // Email verification fields
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    // Social Auth IDs
    googleId: {
        type: String,
        sparse: true
    },
    githubId: {
        type: String,
        sparse: true
    },
    instagramId: {
        type: String,
        sparse: true
    },
    // Account creation method
    authMethod: {
        type: String,
        enum: ['local', 'google', 'github', 'instagram'],
        default: 'local'
    },
    // Account creation date
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);