const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the token and decoded data for debugging
        console.log('Token:', token);
        console.log('Decoded:', decoded);

        // Attach the user ID to the request object for further use
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = authenticate;
