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
    process.env.FRONTEND_URL, // Production (frontend deployed URL from .env variable)
];

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request if the origin is valid
        } else {
            callback(new Error('Not allowed by CORS')); // Block requests from invalid origins
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS globally
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/tasks', authenticate, taskRoutes); // Task routes (protected)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
