const mongoose = require('mongoose');

// create job schema
const jobsSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true
    },
    applications: {
        type: mongoose.Schema.Types.ObjectId, ref: "Applications"
    },
    title: {
        type: String,
        required: [true, 'title is required'],
        minlength: [10, 'title is must be 10 characters long'],
        maxlength: [50, 'title must not exceed 50 characters'],
    },
    description: {
        type: String,
        required: true,
        minlength: [20, 'title is must be 20 characters long'],
        maxlength: [500, 'title must not exceed 500 characters']
    },
    skills: {
        type: [String],
        required: [true, 'skill is required'],
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
    }
}, {timestamps: true});

// create the Job model
const JobModel = mongoose.model('Job', jobsSchema);

// exports
module.exports = JobModel;