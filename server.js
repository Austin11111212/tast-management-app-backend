const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const authenticate = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Define allowed origins for CORS (local and production URLs)
const allowedOrigins = [
    'http://localhost:3000', // Local development (React app)
    process.env.FRONTEND_URL, // Production (Vercel app URL from environment variable)
];

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            // Allow the request if it's from an allowed origin
            callback(null, true);
        } else {
            // Reject the request if it's from an origin not allowed
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS configuration globally
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', authenticate, taskRoutes); // Task routes protected by authentication

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
