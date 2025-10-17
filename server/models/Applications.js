const mongoose = require('mongoose');

// create a schema
const applicationSchema= mongoose.Schema({
    applicator: {
        type: mongoose.Schema.ObjectId,
        ref: 'ApplocantOrMember',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required: true
    },
    title: {
        type: String,
        required: [true, 'title is required'],
        minlength: [10, 'title is must be 10 characters long'],
        maxlength: [50, 'title must not exceed 50 characters'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        minlength: [30, 'description is must be 30 characters long'],
        maxlength: [500, 'description must not exceed 500 characters'],
    },
    attachments: [String]
});

// create a model
const ApplicationModel = mongoose.model('Application', applicationSchema);

// exports
module.exports = ApplicationModel;