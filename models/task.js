const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define Task Schema
const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model (assuming you have a User model)
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed', 'canceled'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `updated_at` before each save
taskSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;