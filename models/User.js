const mongoose = require("mongoose");

// Mongoose Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String
    },

    role: {
        type: String,
        enum: ['admin', 'student', 'professor', 'HOD'],
        default: 'student'
    },

    // Correct department reference
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("uaauser", userSchema);
