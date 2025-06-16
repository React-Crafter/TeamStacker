const mongoose = require('mongoose');

// ApplicantOrMember schema definition
const applicantOrMemberSchema = new mongoose.Schema({
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
        default: '',
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description must not exceed 500 characters'],
        trim: true
    },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: function (skills) {
            return (
                Array.isArray(skills) &&
                skills.length <= 10 &&
                skills.every(skill => typeof skill === 'string' && skill.trim().length > 0)
            );
            },
            message: 'You can only add up to 10 valid, non-empty skills'
        }
    },
    contactLinks: {
        linkedin: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/, 'Please provide a valid LinkedIn profile URL']
        },
        instagram: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid Instagram profile URL']
        },
        facebook: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid Facebook profile URL']
        },
        github: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid GitHub profile URL']
        },
        x: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid X (formerly Twitter) profile URL']
        },
    },
    protfolio: {
        type: String,
        trim: true,
        match: [/^https?:\/\/[^\s]+$/, 'Please provide a valid portfolio URL']
    },
    country: {
        type: String,
        enum: [
            'United States',
            'United Kingdom',
            'Canada',
            'Australia',
            'Germany',
            'France',
            'India',
            'Bangladesh',
            'Pakistan',
            'Philippines',
            'United Arab Emirates',
            'Netherlands',
            'Spain',
            'Italy',
            'Brazil',
            'Mexico',
            'South Africa',
            'Singapore',
            'Malaysia',
            'Indonesia',
            'Turkey',
            'Russia',
            'Ukraine',
            'Poland',
            'Vietnam',
            'Nepal',
            'Sri Lanka',
            'Kenya',
            'Nigeria',
            'Other'
        ],
        required: true
    },
    role: {
        type: String,
        enum: ["Applicant", "Member"],
        default: "Applicant",
        required: true
    },
    memberOf: {
        type: mongoose.Types.ObjectId,
        ref: 'Team',
        default: null // Initially, the member may not belong to any team
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create the ApplicantOrMember model
const ApplicantOrMember = mongoose.model('ApplicantOrMember', applicantOrMemberSchema);

// Export the ApplicantOrMember model
module.exports = ApplicantOrMember;