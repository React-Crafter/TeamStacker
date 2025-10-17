const express = require('express');
const router = express.Router();
const jobs = require('../models/jobs');
const checkLogin = require('../middlewares/checkLogin'); // Assuming you have a middleware to check login
const mongoose = require('mongoose');
const Jobs = require('../models/jobs');
const TeamOwner = require('../models/teamOwner')

// Post a new job posting
router.post('/post-job', checkLogin, async (req, res) => {
    try {
        if (req.role == 'teamOwner') {
            const {title, desciption, skills} = req.body;

            // Check if creator is onner of the team
            const teamOwner = await TeamOwner.findOne({ _id: req.userId });
            if (!teamOwner) {
                return res.status(403).json({ message: "Forbidden: You are not the owner of this team" });
            }

            // post a new job
            const newJob = new Jobs({
                title,
                desciption,
                skills,
                teamId: teamOwner.ownerOf
            })
            // save the job
            await newJob.save()
            return res.status(201).json({
                message: "job posted successfully",
                task: newJob
            });
        }
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// update a job
router.put('/:jobId', checkLogin, async (req, res) => {
    try {
        if (req.role == "teamOwner") {
            const {jobId} = req.params.jobId;
            const updates = req.body
            
            // Check if the user is the creator of the task or a team owner
            const job = await jobs.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: "job is not found" });
            }
            const teamOwner = await TeamOwner.findOne({ ownerOf: job.teamId, _id: req.userId });
            if (!teamOwner) {
                return res.status(403).json({ message: "Forbidden: You are not authorized to update this job" });
            }

            // Update the task
            Object.assign(job, updates);
            await jobs.save();
            return res.status(200).json({
                message: "job updated successfully",
                job
            });
        } else {
            return res.status(403).json({
                message: "Forbidden: Only team owners can update tasks",
                role: req.role
            });
        }
    } catch (error) {
        console.error("Error updateing job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// exports
module.exports = router;
