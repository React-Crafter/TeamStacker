const express = require('express');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userRoute = require("./routes/user");
const teamRoute = require("./routes/team");
const taskRoute = require("./routes/task");
const jobRoute = require('./routes/jobs');

// Configation
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// default error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

app.use(errorHandler);

// database connection (mocked for this example)
mongoose.connect("mongodb://localhost:27017/")
.then(() => {
    console.log("Connected to MongoDB...");
}) .catch(err => {
    console.error("MongoDB connection error:", err);
});


// Routes
app.use("/user", userRoute);
app.use("/team", teamRoute);
app.use("/task", taskRoute);
app.use("/job", jobRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});