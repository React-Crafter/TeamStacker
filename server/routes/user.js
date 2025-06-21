const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const TeamOwner = require('../models/teamOwner'); // Assuming you have a TeamOwner model defined
const ApplicantOrMember = require('../models/ApplicantOrMember');

// application routes
// signup
router.post('/signup', async (req, res) => {
    try {
        const { useFor } = req.body;

        // Validate useFor
        if (!useFor || (useFor !== 'To create and manage my own team' && useFor !== 'To apply to jobs from other teams')) {
            return res.status(400).json({ error: 'Invalid useFor value' });
        }

        // create a Team Owner account
        if (useFor === 'To create and manage my own team') {
            const { fullName, userName, email, password } = req.body;

            // Validate required fields
            if (!fullName || !userName || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if email or username already exists
            const chekedEmail = await ApplicantOrMember.findOne({ email});
            const chekedUserName = await ApplicantOrMember.findOne({ userName });

            if (chekedEmail && chekedEmail.email === email) {
                return res.status(400).json({ error: 'Email already exists' });
            } else if (chekedUserName) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // create a new user
            if (fullName && userName && email && password && !chekedEmail && !chekedUserName) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new TeamOwner instance
                const newTeamOwner = new TeamOwner({
                    fullName,
                    userName,
                    email,
                    password: hashedPassword
                });
                // Save the new user to the database
                await newTeamOwner.save();

                if (newTeamOwner) {
                    return res.status(201).json({
                        message: 'Team Owner account created successfully',
                        newTeamOwner
                    });
                }
            }
        }

        // create a Applicant account
        if (useFor === 'To apply to jobs from other teams') {
            const {
                fullName,
                userName,
                email,
                password,
                profilePicture,
                country,
                role = 'Applicant', // Default status is 'Applicant'
                memberOf = null, // Default memberOf is null
                skills,
                contactLinks,
                protfolio,
            } = req.body;

            // Validate required fields
            if (!fullName || !userName || !email || !password || !country) {
                return res.status(400).json({ error: 'fullName, userName, email, password and country is required' });
            }

            // Check if email or username already exists
            const chekedEmail = await TeamOwner.findOne({ email})
            const chekedUserName = await TeamOwner.findOne({ userName });

            if (chekedEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            } else if (chekedUserName) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // create a nnew Applicant 
            if ( fullName && userName && email && password && country && !chekedEmail && !chekedUserName ) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new ApplicantOrMember instance
                const newApplicantOrMember = new ApplicantOrMember({
                    fullName,
                    userName,
                    email,
                    password: hashedPassword,
                    profilePicture,
                    country,
                    role,
                    memberOf,
                    skills,
                    contactLinks,
                    protfolio
                });

                // Save the new user to the database
                await newApplicantOrMember.save();

                if (newApplicantOrMember) {
                    return res.status(201).json({
                        message: 'Applicant account created successfully',
                        newApplicantOrMember
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error in signup route:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if the user exists in TeamOwner
        const teamOwner = await TeamOwner.find({ email });

        if (teamOwner.length > 0) {
            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, teamOwner[0].password);
            if (isMatch) {
                // Generate a JWT token
                const token = jwt.sign({userId: teamOwner[0]._id, role: 'teamOwner'}, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Return the token
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                });
            }
        }

        // Check if the user exists in ApplicantOrMember
        const applicantOrMember = await ApplicantOrMember.find({ email });

        if (applicantOrMember.length > 0) {
            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, applicantOrMember[0].password);
            if (isMatch) {
                // Generate a JWT token
                const token = jwt.sign({userId: applicantOrMember[0]._id, role: 'ApplicantOrMember'}, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Return the token
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                });
            }
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// export the router
module.exports = router;