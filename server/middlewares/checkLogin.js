const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
const checkLogin = async (req, res, next) => {
    const {authorization} = req.headers;
    try {
        const token = authorization && authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId || !decoded.role) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        };

        if (decoded && decoded.userId && decoded.role) {
            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        }
    } catch (error) {
        console.error('Error in checkLogin middleware:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Export the middleware
module.exports = checkLogin;