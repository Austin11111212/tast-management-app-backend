const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    status: { type: String, enum: ['pending', 'incomplete', 'completed'], default: 'pending' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
