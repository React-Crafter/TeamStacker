const express = require('express');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userRoute = require("./routes/user");
const teamRoute = require("./routes/team");

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
mongoose.connect(dotenv.MONGODB_URI || "mongodb://localhost:27017/taskmanager")
.then(() => {
    console.log("Connected to MongoDB");
}) .catch(err => {
    console.error("MongoDB connection error:", err);
});


// Routes
app.use("/user", userRoute);
app.use("/team", teamRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});