const jwt = require('jsonwebtoken');
require('dotenv').config();
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
    }

    function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' } 
    );
}

module.exports = {
    authenticateToken,
    generateToken
};