const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/', authenticate, async (req, res) => {
    const { title, description, deadline, status, priority } = req.body;

    try {
        // Check if status and priority are valid
        const validStatuses = ['in progress', 'completed'];
        const validPriorities = ['low', 'medium', 'high'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }

        const task = await Task.create({
            user: req.user.id, // Use authenticated user ID
            title,
            description,
            deadline,
            status,
            priority,  // Include priority field
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

// Get a specific task by ID
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
    const { title, description, deadline, status, priority } = req.body;
    const { id } = req.params;

    try {
        // Ensure ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Validate status and priority
        const validStatuses = ['in progress', 'completed'];
        const validPriorities = ['low', 'medium', 'high'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update task fields only if they're provided
        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.status = status || task.status;
        task.priority = priority || task.priority;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        await Task.findByIdAndDelete(id);
        res.status(204).send(); // Successfully deleted, no content to return
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
