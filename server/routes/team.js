const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const TeamOwner = require('../models/teamOwner');
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

// export the router
module.exports = router;