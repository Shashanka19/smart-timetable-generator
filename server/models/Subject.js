const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["THEORY", "LAB"],
            required: true
        },

        hoursPerWeek: {
            type: Number,
            required: true,
            min: 1
        },

        requiresLab: {
            type: Boolean,
            default: false
        },

        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);