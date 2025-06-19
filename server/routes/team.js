const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const TeamOwner = require('../models/teamOwner');
const crypto = require('crypto');
const InviteToken = require('../models/InviteToken')
const checkLogin = require('../middlewares/checkLogin')// Assuming you have a middleware to check login

// Create a new team
router.post('/create', checkLogin, async (req, res) => {
    try {
        if (req.role == 'teamOwner') {
            const { teamName, description, logo, companyEmail, industry, country, connectionLinks, plan } = req.body;

            // Validate required fields
            if (!teamName || !description) {
                return res.status(400).json({ message: 'Team name and description are required' });
            }

            // Check if the team already exists
            const existingTeam = await Team.findOne({ teamName });
            if (existingTeam) {
                return res.status(400).json({ message: 'Team with this name already exists' });
            }

            // Create a new team
            const newTeam = new Team({
                teamName,
                description,
                logo,
                teamOwner: req.userId, // Assuming req.userId is set by authentication middleware
                companyEmail,
                industry,
                country,
                connectionLinks,
                plan
            });

            // Save the new team to the database
            await newTeam.save();

            // Update the TeamOwner's ownerOf field
            await TeamOwner.findByIdAndUpdate(req.userId, { ownerOf: newTeam._id });

            return res.status(201).json({
                message: 'Team created successfully',
                team: newTeam
            });
        } else {
            return res.status(403).json({ message: 'Forbidden: Only team owners can create teams', role: req.role });
        }
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// create a team member invite link
router.post('/generate-invite/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;

        // validation
        const chekTeamId = await Team.findOne({ _id: teamId });

        if (!chekTeamId) {
            return res.status(401).json({
                message: "invalid team Id"
            });
        }

        // cteate invite token
        const token = crypto.randomBytes(20).toString('hex');
        const FRONTEND_URL = process.env.FRONTEND_URL
        const invite = new InviteToken({token, teamId});
        await invite.save();

        if (invite) {
            return res.status(201).json({
                message: 'invite link created sucessfully',
                inviteLink: `${FRONTEND_URL}/join-team/${token}`
            });
        } else {
            return res.status(500).json({
                message: 'invite Token is not created sucessfully!'
            })
        }
    } catch (error) {
        console.error('Error createing member invite link:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// export the router
module.exports = router;