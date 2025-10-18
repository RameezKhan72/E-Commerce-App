const jwt = require('jsonwebtoken');

const JWT_SECRET = 'e-commerce-super-secret-key-that-is-long';

module.exports = function(req, res, next) {
    // Get token from the Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Expecting "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the user payload (which contains the id) to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

