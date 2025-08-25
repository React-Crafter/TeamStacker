const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const checkLogin = require("../middlewares/checkLogin"); // Assuming you have a middleware to check login
const mongoose = require("mongoose");
const teamOnner = require("../models/teamOwner");

// Create a new task
router.post("/create", checkLogin, async (req, res) => {
    try {
        if (req.role !== "teamMember" && req.role == "teamOwner") {
            const {teamId, title, description, assignedTo, isOpenTask, status, priority, startDate, dueDate, attachments} = req.body;

            // Check if creator is onner of the team
            const teamOwner = await teamOnner.findOne({ ownerOf: teamId, _id: req.userId });
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
        const teamMember = await teamOnner.findOne({ memberOf: teamId, _id: req.userId });
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

// Update a task
router.put("/:taskId", checkLogin, async (req, res) => {
    try {
        if (req.role !== "teamMember" && req.role == "teamOwner") {
            const { taskId } = req.params;
            const updates = req.body;

            // Check if the user is the creator of the task or a team owner
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            const teamOwner = await teamOnner.findOne({ ownerOf: task.teamId, _id: req.userId });
            if (task.createdBy.toString() !== req.userId && !teamOwner) {
                return res.status(403).json({ message: "Forbidden: You are not authorized to update this task" });
            }

            // Update the task
            Object.assign(task, updates);
            await task.save();
            return res.status(200).json({
                message: "Task updated successfully",
                task
            });
        } else {
            return res.status(403).json({
                message: "Forbidden: Only team owners can update tasks",
                role: req.role
            });
        }
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Delete a task
router.delete("/:taskId", checkLogin, async (req, res) => {
    try {
        if (req.role !== "teamMember" && req.role == "teamOwner") {
            const { taskId } = req.params;

            // Check if the user is the creator of the task or a team owner
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            const teamOwner = await teamOnner.findOne({ ownerOf: task.teamId, _id: req.userId });
            if (task.createdBy.toString() !== req.userId && !teamOwner) {
                return res.status(403).json({ message: "Forbidden: You are not authorized to delete this task" });
            }

            // Delete the task
            await Task.findByIdAndDelete(taskId);
            return res.status(200).json({ message: "Task deleted successfully" });
        } else {
            return res.status(403).json({ message: "Forbidden: Only team owners can delete tasks", role: req.role });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// export the router
module.exports = router;