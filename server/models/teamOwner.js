const mongoose = require('mongoose');

// Define the TeamOwner schema
const teamOwnerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        minlength: [3, 'Full name must be at least 3 characters long'],
        maxlength: [50, 'Full name must not exceed 50 characters'],
        trim: true
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username must not exceed 30 characters'],
        unique: [true, 'Username must be unique'],
        trim: true
    },
    profilePicture: {
        type: String,
        trim: true
    },
    ownerOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null // Initially, the owner may not own any team
    },
    role: {
        type: String,
        enum: ['teamOwner'],
        default: 'teamOwner',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the TeamOwner model
const TeamOwner = mongoose.model('TeamOwner', teamOwnerSchema);

// Export the TeamOwner model
module.exports = TeamOwner;