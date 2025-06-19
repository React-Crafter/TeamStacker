const mongoose = require('mongoose');

// create a invite Token Schema
const memberInviteSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'token is require'],
        unique: [true, 'token is must be unique']
    },
    teamId: {
        type: mongoose.Types.ObjectId,
        ref: 'Team',
        required: [true, 'team Id is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'
    }
});

// create model
const InviteToken = new mongoose.model('InviteToken', memberInviteSchema);

// export the model
module.exports = InviteToken;