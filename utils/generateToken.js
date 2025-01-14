const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
        expiresIn: '30d', // Token will expire in 30 days
    });
};

module.exports = generateToken;
