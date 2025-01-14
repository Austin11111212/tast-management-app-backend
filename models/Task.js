// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    status: {
      type: String,
      enum: ["completed", "in progress"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium", // Set default if needed
    },
  });
  

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
