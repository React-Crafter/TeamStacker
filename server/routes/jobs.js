const express = require('express');
const router = express.Router();
const jobs = require('../models/jobs');
const checkLogin = require('../middlewares/checkLogin'); // Assuming you have a middleware to check login
const mongoose = require('mongoose');

// Post a new job posting
router.post('/post-job', checkLogin, async (req, res) => {
    
})
