import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    title: { type: String, required: [true, 'title is required'] },
    description: String,

    // Assigned members
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // if the task is open or not
    isOpenTask: { type: Boolean, default: false },

    status: { 
        type: String, 
        enum: ["pending", "in-progress", "completed", "on-hold"], 
        default: "pending" 
    },

    priority: { 
        type: String, 
        enum: ["low", "medium", "high", "urgent"], 
        default: "medium" 
    },

    startDate: Date,
    dueDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "teamOnner" },
    attachments: [String],

    comments: [{
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
