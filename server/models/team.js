const mongoose = require('mongoose');

// crwate team schema
const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: [true, 'team oe company name is required'],
        unique: [true, 'this team name is alredy used'],
        minlength: [3, 'team name must be at least 3 characters long'],
        maxlength: [50, 'team name must not exceed 50 characters'],
        trim: true
    },
    companyEmail: {
        type: String,
        unique: [true, 'this company email is alredy used'],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    industry: {
        type: String,
        required: [true, 'industry is required'],
        enum: {
            values: ["Information Technology (IT)", "Marketing & Advertising", "Software Development", "Education", "Finance & Accounting", "E-commerce", "Non-profit / NGO", "Media & Entertainment", "Freelancing / Consulting", "Others"],
            message: 'Industry must be one of the predefined values'
        },
        trim: true
    },
    country: {
        type: String,
        required: [true, 'country is required'],
        enum: {
            values: [
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
            message: 'Country must be one of the predefined values'
        },
        trim: true
    },
    logo: {
        type: String,
        required: [true, 'company logo is required'],
        trim: true
    },
    teamOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamOwner',
        required: [true, 'team owner is required']
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicantOrMember',
        default: []
    }],
    connectionLinks: {
        github: {
            type: String,
            trim: true,
            match: [/^https?:\/\/github\.com\/[a-zA-Z0-9_-]+$/, 'Please provide a valid GitHub URL']
        },
        linkedin: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/, 'Please provide a valid LinkedIn URL']
        },
        website: {
            type: String,
            trim: true,
            match: [/^https?:\/\/[^\s]+$/, 'Please provide a valid website URL']
        },
        facebook: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid Facebook URL']
        },
        instagram: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid Instagram URL']
        },
        twitter: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9._-]+$/, 'Please provide a valid X (formerly Twitter) URL']
        }
    },
    description: {
        type: String,
        required: [true, 'team description is required'],
        minlength: [10, 'team description must be at least 10 characters long'],
        maxlength: [500, 'team description must not exceed 500 characters'],
        trim: true
    },
    plan: {
        type: String,
        required: [true, 'plan is required'],
        enum: {
            values: ['Free', 'stater', 'pro', 'agency'],
            message: 'Plan must be one of the predefined values'
        },
        default: 'Free'
    }
}, {timestamps: true});

// Create the Team model
const Team = mongoose.model('Team', teamSchema);

// Export the Team model
module.exports = Team;