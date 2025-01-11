const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a task
router.post('/', protect, async (req, res) => {
    const { title, description, deadline, status } = req.body;
    try {
        const task = await Task.create({ 
            user: req.user.id, 
            title, 
            description, 
            deadline, 
            status 
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks for the authenticated user
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update task status or other details
router.put('/:id', protect, async (req, res) => {
    const { title, description, deadline, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update the task with new details
        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.status = status || task.status;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Use findByIdAndDelete instead of remove (recommended)
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send(); // Successfully deleted the task, no content to return
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
