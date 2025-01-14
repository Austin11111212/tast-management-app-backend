const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
