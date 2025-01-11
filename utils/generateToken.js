const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import the crypto module

// Function to generate a random secret key
const generateRandomSecret = () => {
    return crypto.randomBytes(32).toString('hex'); // Generates a 32-byte random secret key
};

// Function to generate JWT with a dynamic secret
const generateToken = (id) => {
    const secret = generateRandomSecret(); // Generate a new random secret
    const token = jwt.sign({ id }, secret, { expiresIn: '30d' });
    
    // Ideally, save the generated secret in a secure database for later validation
    // For example: saveSecretInDatabase(id, secret);
    
    return { token, secret }; // Return both the token and the secret (for storage)
};

// Example of how you would store the token and secret
// This is where you would save the secret in your database
const saveSecretInDatabase = (userId, secret) => {
    // Your database logic here to store the secret securely
};

module.exports = generateToken;
