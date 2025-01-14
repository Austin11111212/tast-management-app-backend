const express = require('express');
const Task = require('../models/Task');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/', authenticate, async (req, res) => {
    const { title, description, deadline, status } = req.body;

    try {
        const task = await Task.create({
            user: req.user.id, // Use authenticated user ID
            title,
            description,
            deadline,
            status,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks for authenticated user
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Filter by user ID
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
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

        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send(); // Successfully deleted, no content to return
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
