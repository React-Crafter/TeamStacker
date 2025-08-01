const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const checkLogin = require("../middlewares/checkLogin"); // Assuming you have a middleware to check login
const mongoose = require("mongoose");

// Create a new task
router.post("/create", checkLogin, async (req, res) => {
    try {
        if (req.role !== "teamMember" && req.role == "teamOwner") {
            const {teamId, title, description, assignedTo, isOpenTask, status, priority, startDate, dueDate, attachments} = req.body;

            // Check if creator is onner of the team
            const teamOwner = await mongoose.model("TeamOwners").findOne({ ownerOf: teamId, _id: req.userId });
            if (!teamOwner) {
                return res.status(403).json({ message: "Forbidden: You are not the owner of this team" });
            }

            // Create a new task
            const newTask = new Task({
                teamId,
                title,
                description,
                assignedTo: assignedTo || [],
                isOpenTask: isOpenTask || false,
                status,
                priority,
                startDate,
                dueDate,
                createdBy: req.userId, // Assuming req.userId is set by authentication middleware
                attachments
            });
            // Save the new task to the database
            await newTask.save();
            return res.status(201).json({
                message: "Task created successfully",
                task: newTask
            });
        } else {
            return res.status(403).json({ message: "Forbidden: Only team owners can create tasks", role: req.role });
        }
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all tasks for a team
router.get("/:teamId", checkLogin, async (req, res) => {
    try {
        const { teamId } = req.params;

        // Check if the user is part of the team
        const teamMember = await mongoose.model("ApplicantOrMember").findOne({ memberOf: teamId, _id: req.userId });
        if (!teamMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this team" });
        }

        // Fetch tasks for the team
        const tasks = await Task.find({ teamId }).populate("assignedTo", "name email").populate("createdBy", "name email");
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});