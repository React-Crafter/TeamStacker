const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const TeamOwner = require('../models/teamOwner');

// Create a new team
router.post('/create', async (req, res) => {
    try {
        const {
            teamName,
            teamOwner,
            teamMembers,
            companyEmail,
            industry,
            connectionLinks,
            description,
            country,
            logo,
            plan 
        } = req.body;

        // Validate required fields
        if (!teamName || !teamOwner || !industry || !description || !country || !logo || !plan) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the team owner exists
        const owner = await TeamOwner.findById(teamOwner);
        if (!owner) {
            return res.status(404).json({ message: 'Team owner not found' });
        }
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// export the router
module.exports = router;