const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['in progress', 'completed'], // Ensure valid status values
        default: 'in progress',
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'], // Ensure valid priority values
        default: 'medium',
        required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
