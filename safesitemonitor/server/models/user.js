const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // for user id on external accounts

const Schema = mongoose.Schema;

// Define Account Schema
const accountSchema = new Schema({
    service: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    _id: true,
    timestamps: true
});

// Define User Schema
const userSchema = new Schema({
    id: {
        type: String,
        default: uuidv4, // Automatically generate a unique ID
        unique: true,    // Ensure this ID is unique
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    accounts: [accountSchema], // Keeping accounts structure as is
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;





